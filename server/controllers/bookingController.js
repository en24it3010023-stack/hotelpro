const Booking = require('../models/Booking');
const RoomCategory = require('../models/RoomCategory');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Notification = require('../models/Notification');
const { validateDateRange } = require('../utils/dateUtils');
const { calculateBookingPrices } = require('../utils/priceCalculator');
const { sendBookingConfirmation, sendCancellationNotice } = require('../services/emailService');
const { calculateRefundAmount } = require('../services/paymentService');
const { generateInvoiceForBooking } = require('../services/invoiceService');

// @desc    Check room category availability for dates
// @route   POST /api/bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { hotelId, categoryId, checkIn, checkOut, roomsCount = 1 } = req.body;

    const dateVal = validateDateRange(checkIn, checkOut);
    if (!dateVal.valid) {
      return res.status(400).json({ success: false, message: dateVal.message });
    }

    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Overlapping active reservations
    const overlappingBookings = await Booking.find({
      roomCategory: categoryId,
      bookingStatus: { $in: ['Confirmed', 'Checked In'] },
      $or: [
        { checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } },
      ],
    });

    const bookedCount = overlappingBookings.reduce((sum, b) => sum + (b.guestCount?.rooms || 1), 0);
    const availableCount = Math.max(0, (category.totalRoomsCount || 5) - bookedCount);
    const isAvailable = availableCount >= Number(roomsCount);

    const priceDetails = calculateBookingPrices({
      basePrice: category.basePrice,
      nights: dateVal.nights,
      rooms: Number(roomsCount),
      promoCode: req.body.promoCode || '',
    });

    res.status(200).json({
      success: true,
      available: isAvailable,
      availableRoomsCount: availableCount,
      nights: dateVal.nights,
      pricing: priceDetails,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new booking (safely prevents double booking)
// @route   POST /api/bookings
// @access  Private (Guest, Admin)
exports.createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      categoryId,
      checkInDate,
      checkOutDate,
      guestCount,
      guestDetails,
      promoCode,
      paymentMethod = 'demo',
    } = req.body;

    // Validate dates
    const dateVal = validateDateRange(checkInDate, checkOutDate);
    if (!dateVal.valid) {
      return res.status(400).json({ success: false, message: dateVal.message });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const category = await RoomCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    const roomsRequested = guestCount?.rooms || 1;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    // Concurrency / double-booking check: count overlapping active bookings
    const overlappingCount = await Booking.aggregate([
      {
        $match: {
          roomCategory: category._id,
          bookingStatus: { $in: ['Confirmed', 'Checked In'] },
          $or: [
            { checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalBooked: { $sum: '$guestCount.rooms' },
        },
      },
    ]);

    const alreadyBooked = overlappingCount.length > 0 ? overlappingCount[0].totalBooked : 0;
    const totalInventory = category.totalRoomsCount || 5;

    if (totalInventory - alreadyBooked < roomsRequested) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this room category has just been fully reserved for the requested dates. Please choose another room type or adjust dates.',
      });
    }

    // Calculate official backend pricing (never trust raw total from client)
    const pricing = calculateBookingPrices({
      basePrice: category.basePrice,
      nights: dateVal.nights,
      rooms: roomsRequested,
      promoCode,
    });

    const bookingReference = `HP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const booking = await Booking.create({
      bookingReference,
      guest: req.user.id,
      hotel: hotelId,
      roomCategory: categoryId,
      checkInDate: startDate,
      checkOutDate: endDate,
      totalNights: dateVal.nights,
      guestCount: {
        adults: guestCount?.adults || 2,
        children: guestCount?.children || 0,
        rooms: roomsRequested,
      },
      guestDetails: {
        fullName: guestDetails?.fullName || req.user.name,
        email: guestDetails?.email || req.user.email,
        phone: guestDetails?.phone || req.user.phone || '',
        specialRequests: guestDetails?.specialRequests || '',
        estimatedArrivalTime: guestDetails?.estimatedArrivalTime || '15:00',
      },
      pricing,
      paymentStatus: 'paid', // Marked as paid once reserved or simulated
      bookingStatus: 'Confirmed',
    });

    // Generate Invoice
    await generateInvoiceForBooking(booking, hotel, req.user);

    // Send confirmation email
    sendBookingConfirmation(booking, req.user, hotel).catch((e) => console.warn(e));

    // Send in-app notification
    await Notification.create({
      user: req.user.id,
      title: 'Booking Confirmed!',
      message: `Your reservation at ${hotel.name} (${bookingReference}) has been confirmed.`,
      type: 'booking',
      link: `/dashboard/guest/bookings/${booking._id}`,
    });

    res.status(201).json({
      success: true,
      booking,
      message: 'Reservation created and confirmed successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of current logged-in guest
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('hotel', 'name address starRating images')
      .populate('roomCategory', 'name bedType roomSizeSqFt images')
      .populate('assignedRoom', 'roomNumber floor housekeepingStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name address contact starRating policies images startingPrice currency')
      .populate('roomCategory', 'name bedType roomSizeSqFt images amenities features')
      .populate('assignedRoom', 'roomNumber floor housekeepingStatus')
      .populate('guest', 'name email phone avatar');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Reservation not found.' });
    }

    // Role check: Only the guest who booked or staff/manager/admin
    const isOwner = booking.guest._id.toString() === req.user.id;
    const isStaffOrAdmin = ['staff', 'manager', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('hotel');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const isOwner = booking.guest.toString() === req.user.id;
    const isStaffOrAdmin = ['staff', 'manager', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation.' });
    }

    if (['Cancelled', 'Checked Out'].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled because its status is ${booking.bookingStatus}.`,
      });
    }

    const refundAmount = calculateRefundAmount(booking, booking.hotel);

    booking.bookingStatus = 'Cancelled';
    booking.cancellationReason = req.body.reason || 'Guest requested cancellation';
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    if (refundAmount > 0) {
      booking.paymentStatus = 'refunded';
    }

    // If a physical room was assigned, release it
    if (booking.assignedRoom) {
      await Room.findByIdAndUpdate(booking.assignedRoom, {
        status: 'available',
        currentBooking: null,
      });
    }

    await booking.save();

    // Notify guest
    sendCancellationNotice(booking, req.user, booking.hotel).catch((e) => console.warn(e));

    await Notification.create({
      user: booking.guest,
      title: 'Booking Cancelled',
      message: `Your booking (${booking.bookingReference}) has been cancelled. Refund amount: $${refundAmount}.`,
      type: 'booking',
      link: `/dashboard/guest/bookings`,
    });

    res.status(200).json({
      success: true,
      booking,
      message: `Reservation cancelled successfully. Eligible refund: $${refundAmount}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (staff/manager/admin)
// @route   GET /api/bookings
// @access  Private (Staff, Manager, Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { hotelId, status, search, page = 1, limit = 15 } = req.query;

    const query = {};

    // If staff or manager, restrict to their assigned hotel if set
    if (['staff', 'manager'].includes(req.user.role) && req.user.assignedHotel) {
      query.hotel = req.user.assignedHotel;
    } else if (hotelId) {
      query.hotel = hotelId;
    }

    if (status) {
      query.bookingStatus = status;
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search.trim(), $options: 'i' } },
        { 'guestDetails.fullName': { $regex: search.trim(), $options: 'i' } },
        { 'guestDetails.email': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('hotel', 'name address')
      .populate('roomCategory', 'name basePrice')
      .populate('assignedRoom', 'roomNumber housekeepingStatus')
      .populate('guest', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
