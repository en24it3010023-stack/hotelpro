const Booking = require('../models/Booking');
const Room = require('../models/Room');
const CheckInOut = require('../models/CheckInOut');
const StaffAssignment = require('../models/StaffAssignment');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');

// @desc    Get Front Desk Dashboard summary (today's arrivals, departures, occupied rooms)
// @route   GET /api/staff/desk-summary
// @access  Private (Staff, Manager, Admin)
exports.getDeskSummary = async (req, res, next) => {
  try {
    const hotelId = req.query.hotelId || req.user.assignedHotel;

    const queryHotel = hotelId ? { hotel: hotelId } : {};

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's arrivals (Confirmed bookings with checkInDate <= todayEnd and not checked in yet)
    const arrivals = await Booking.find({
      ...queryHotel,
      bookingStatus: 'Confirmed',
      checkInDate: { $lte: todayEnd },
    })
      .populate('guest', 'name email phone avatar')
      .populate('roomCategory', 'name basePrice')
      .populate('assignedRoom', 'roomNumber');

    // Today's departures (Checked In bookings with checkOutDate <= todayEnd)
    const departures = await Booking.find({
      ...queryHotel,
      bookingStatus: 'Checked In',
      checkOutDate: { $lte: todayEnd },
    })
      .populate('guest', 'name email phone avatar')
      .populate('roomCategory', 'name')
      .populate('assignedRoom', 'roomNumber');

    // Room stats
    const totalRooms = await Room.countDocuments(queryHotel);
    const occupiedRooms = await Room.countDocuments({ ...queryHotel, status: 'occupied' });
    const dirtyRooms = await Room.countDocuments({ ...queryHotel, housekeepingStatus: 'dirty' });
    const inMaintenance = await Room.countDocuments({ ...queryHotel, status: 'maintenance' });

    res.status(200).json({
      success: true,
      stats: {
        totalRooms,
        occupiedRooms,
        dirtyRooms,
        inMaintenance,
        todayArrivalsCount: arrivals.length,
        todayDeparturesCount: departures.length,
      },
      arrivals,
      departures,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process Guest Check-In
// @route   POST /api/staff/check-in
// @access  Private (Staff, Manager, Admin)
exports.processCheckIn = async (req, res, next) => {
  try {
    const { bookingId, roomId, keyCardIssued, notes } = req.body;

    const booking = await Booking.findById(bookingId).populate('roomCategory');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.bookingStatus === 'Checked In') {
      return res.status(400).json({ success: false, message: 'Guest is already checked in.' });
    }

    // Find suitable room if not explicitly provided
    let room;
    if (roomId) {
      room = await Room.findById(roomId);
    } else {
      room = await Room.findOne({
        hotel: booking.hotel,
        category: booking.roomCategory._id,
        status: { $in: ['available', 'reserved'] },
      });
    }

    if (!room) {
      return res.status(400).json({
        success: false,
        message: 'No available room found in this category. Please allocate a clean room manually.',
      });
    }

    const keyCard = keyCardIssued || room.keyCardCode || `KEY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update Room
    room.status = 'occupied';
    room.currentBooking = booking._id;
    room.housekeepingStatus = 'clean';
    await room.save();

    // Update Booking
    booking.bookingStatus = 'Checked In';
    booking.assignedRoom = room._id;
    await booking.save();

    // Create Check-In record
    const checkInRecord = await CheckInOut.create({
      booking: booking._id,
      hotel: booking.hotel,
      guest: booking.guest,
      room: room._id,
      type: 'check_in',
      processedBy: req.user.id,
      keyCardIssued: keyCard,
      notes: notes || '',
    });

    await AdminLog.create({
      actor: req.user.id,
      action: 'GUEST_CHECKED_IN',
      resourceType: 'Booking',
      resourceId: booking._id.toString(),
      details: { roomNumber: room.roomNumber, guest: booking.guestDetails.fullName },
    });

    res.status(200).json({
      success: true,
      booking,
      room,
      checkInRecord,
      message: `Guest successfully checked in to Room ${room.roomNumber}! Keycard ${keyCard} active.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process Guest Check-Out
// @route   POST /api/staff/check-out
// @access  Private (Staff, Manager, Admin)
exports.processCheckOut = async (req, res, next) => {
  try {
    const { bookingId, damagesReported, settlementStatus = 'settled', notes } = req.body;

    const booking = await Booking.findById(bookingId).populate('assignedRoom');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const roomId = booking.assignedRoom?._id;

    if (roomId) {
      // Mark room dirty for housekeeping turnaround
      await Room.findByIdAndUpdate(roomId, {
        status: 'available',
        housekeepingStatus: 'dirty',
        currentBooking: null,
      });

      // Auto-create a Housekeeping task for cleaning
      await StaffAssignment.create({
        hotel: booking.hotel,
        staff: req.user.id,
        taskType: 'housekeeping',
        title: `Clean Room ${booking.assignedRoom.roomNumber} after checkout`,
        description: 'Complete linen change, sanitize surfaces, restock toiletries and minibar.',
        targetRoom: roomId,
        status: 'assigned',
        priority: 'high',
        assignedBy: req.user.id,
      });
    }

    booking.bookingStatus = 'Checked Out';
    await booking.save();

    const checkOutRecord = await CheckInOut.create({
      booking: booking._id,
      hotel: booking.hotel,
      guest: booking.guest,
      room: roomId,
      type: 'check_out',
      processedBy: req.user.id,
      damagesReported: damagesReported || 'None',
      settlementStatus,
      notes: notes || '',
    });

    await AdminLog.create({
      actor: req.user.id,
      action: 'GUEST_CHECKED_OUT',
      resourceType: 'Booking',
      resourceId: booking._id.toString(),
      details: { bookingRef: booking.bookingReference },
    });

    res.status(200).json({
      success: true,
      booking,
      checkOutRecord,
      message: 'Check-out completed. Room marked as dirty and queued for housekeeping.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Housekeeping & Maintenance Tasks
// @route   GET /api/staff/tasks
// @access  Private (Staff, Manager, Admin)
exports.getStaffTasks = async (req, res, next) => {
  try {
    const hotelId = req.query.hotelId || req.user.assignedHotel;
    const query = hotelId ? { hotel: hotelId } : {};

    const tasks = await StaffAssignment.find(query)
      .populate('staff', 'name email role')
      .populate('targetRoom', 'roomNumber floor housekeepingStatus')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/staff/tasks/:id
// @access  Private (Staff, Manager, Admin)
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await StaffAssignment.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
      // If task was housekeeping on a room, mark room clean
      if (task.targetRoom && task.taskType === 'housekeeping') {
        await Room.findByIdAndUpdate(task.targetRoom, { housekeepingStatus: 'clean' });
      }
    }
    await task.save();

    res.status(200).json({
      success: true,
      task,
      message: `Task updated to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};
