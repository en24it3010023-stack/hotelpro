const RoomCategory = require('../models/RoomCategory');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// @desc    Get room categories for a hotel with dynamic availability for dates
// @route   GET /api/hotels/:hotelId/categories
// @access  Public
exports.getCategoriesByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, adults, children } = req.query;

    const categories = await RoomCategory.find({ hotel: hotelId, isActive: true });

    let availabilityMap = {};

    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      // Find all overlapping active bookings for this hotel
      const overlappingBookings = await Booking.find({
        hotel: hotelId,
        bookingStatus: { $in: ['Confirmed', 'Checked In'] },
        $or: [
          { checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } },
        ],
      });

      // Count booked units per category
      overlappingBookings.forEach((b) => {
        const catId = b.roomCategory.toString();
        availabilityMap[catId] = (availabilityMap[catId] || 0) + (b.guestCount?.rooms || 1);
      });
    }

    const categoriesWithAvailability = categories.map((cat) => {
      const bookedCount = availabilityMap[cat._id.toString()] || 0;
      const totalInventory = cat.totalRoomsCount || 5;
      const availableCount = Math.max(0, totalInventory - bookedCount);

      return {
        ...cat.toObject(),
        bookedCount,
        availableRoomsCount: availableCount,
        isAvailableForDates: availableCount > 0,
      };
    });

    res.status(200).json({
      success: true,
      count: categoriesWithAvailability.length,
      categories: categoriesWithAvailability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room category
// @route   GET /api/rooms/categories/:id
// @access  Public
exports.getCategoryDetails = async (req, res, next) => {
  try {
    const category = await RoomCategory.findById(req.params.id).populate('hotel', 'name address starRating currency policies');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create room category
// @route   POST /api/hotels/:hotelId/categories
// @access  Private (Manager, Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const category = await RoomCategory.create({
      ...req.body,
      hotel: hotelId,
    });

    // Update hotel starting price if this category is cheaper
    const hotel = await Hotel.findById(hotelId);
    if (hotel && (!hotel.startingPrice || category.basePrice < hotel.startingPrice)) {
      hotel.startingPrice = category.basePrice;
      await hotel.save();
    }

    res.status(201).json({
      success: true,
      category,
      message: 'Room category created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room category
// @route   PUT /api/rooms/categories/:id
// @access  Private (Manager, Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await RoomCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Room category not found.' });
    }

    res.status(200).json({
      success: true,
      category,
      message: 'Room category updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get individual physical rooms for a hotel
// @route   GET /api/hotels/:hotelId/rooms
// @access  Private (Staff, Manager, Admin)
exports.getRoomsByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { status, housekeepingStatus, floor } = req.query;

    const filter = { hotel: hotelId };
    if (status) filter.status = status;
    if (housekeepingStatus) filter.housekeepingStatus = housekeepingStatus;
    if (floor) filter.floor = Number(floor);

    const rooms = await Room.find(filter)
      .populate('category', 'name basePrice bedType')
      .populate({
        path: 'currentBooking',
        select: 'bookingReference guestDetails checkInDate checkOutDate guest',
        populate: { path: 'guest', select: 'name email phone' },
      })
      .sort({ roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room status & housekeeping status
// @route   PUT /api/rooms/:id/status
// @access  Private (Staff, Manager, Admin)
exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { status, housekeepingStatus, notes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (housekeepingStatus) update.housekeepingStatus = housekeepingStatus;
    if (notes !== undefined) update.notes = notes;

    const room = await Room.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('category', 'name');

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.status(200).json({
      success: true,
      room,
      message: `Room ${room.roomNumber} status updated to ${status || ''} / ${housekeepingStatus || ''}`.trim(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create individual physical room
// @route   POST /api/hotels/:hotelId/rooms
// @access  Private (Manager, Admin)
exports.createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const room = await Room.create({
      ...req.body,
      hotel: hotelId,
    });

    res.status(201).json({
      success: true,
      room,
      message: `Room ${room.roomNumber} created successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
