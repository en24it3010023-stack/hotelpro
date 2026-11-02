const ServiceRequest = require('../models/ServiceRequest');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @desc    Submit guest service request
// @route   POST /api/service-requests
// @access  Private (Guest)
exports.createServiceRequest = async (req, res, next) => {
  try {
    const { bookingId, serviceType, title, description, priority = 'medium' } = req.body;

    const booking = await Booking.findById(bookingId).populate('assignedRoom');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Active booking not found.' });
    }

    const roomNumber = booking.assignedRoom?.roomNumber || 'TBD';

    const request = await ServiceRequest.create({
      booking: booking._id,
      hotel: booking.hotel,
      guest: req.user.id,
      roomNumber,
      serviceType,
      title,
      description,
      priority,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      request,
      message: 'Service request dispatched to hotel staff.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service requests (filtered by user or hotel)
// @route   GET /api/service-requests
// @access  Private
exports.getServiceRequests = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'guest') {
      query.guest = req.user.id;
    } else if (['staff', 'manager'].includes(req.user.role) && req.user.assignedHotel) {
      query.hotel = req.user.assignedHotel;
    } else if (req.query.hotelId) {
      query.hotel = req.query.hotelId;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const requests = await ServiceRequest.find(query)
      .populate('guest', 'name email phone avatar')
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service request status (staff/manager)
// @route   PUT /api/service-requests/:id
// @access  Private (Staff, Manager, Admin)
exports.updateServiceRequest = async (req, res, next) => {
  try {
    const { status, staffNotes } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    request.status = status || request.status;
    if (staffNotes !== undefined) request.staffNotes = staffNotes;
    if (!request.assignedStaff) request.assignedStaff = req.user.id;
    if (status === 'completed') request.completedAt = new Date();

    await request.save();

    // Notify guest
    await Notification.create({
      user: request.guest,
      title: 'Service Request Update',
      message: `Your request "${request.title}" is now ${request.status}.`,
      type: 'service',
      link: '/dashboard/guest/services',
    });

    res.status(200).json({
      success: true,
      request,
      message: `Service request marked as ${request.status}.`,
    });
  } catch (error) {
    next(error);
  }
};
