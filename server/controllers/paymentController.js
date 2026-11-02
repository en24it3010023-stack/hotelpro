const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const RefundRequest = require('../models/RefundRequest');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const { createOrder, verifyPayment } = require('../services/paymentService');

// @desc    Initiate payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, currency = 'USD' } = req.body;

    const booking = await Booking.findById(bookingId).populate('hotel', 'name');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.guest.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const orderData = await createOrder({
      amount: booking.pricing.totalAmount,
      currency,
      receipt: `rcpt_${booking.bookingReference}`,
      notes: {
        bookingId: booking._id.toString(),
        bookingReference: booking.bookingReference,
        userId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      order: orderData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment signature / token
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPaymentResult = async (req, res, next) => {
  try {
    const {
      bookingId,
      gateway = 'demo',
      orderId,
      paymentId,
      signature,
      method = 'demo',
    } = req.body;

    const booking = await Booking.findById(bookingId).populate('hotel');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const isValid = await verifyPayment({
      gateway,
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Untrusted or invalid signature.',
      });
    }

    const transactionId = paymentId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      transactionId,
      booking: booking._id,
      user: req.user.id,
      gateway,
      gatewayOrderId: orderId || '',
      gatewayPaymentId: paymentId || '',
      gatewaySignature: signature || '',
      amount: booking.pricing.totalAmount,
      currency: booking.pricing.currency || 'USD',
      status: 'completed',
      paymentMethod: method,
    });

    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'Confirmed';
    booking.payment = payment._id;
    await booking.save();

    await Notification.create({
      user: req.user.id,
      title: 'Payment Successful',
      message: `Your payment of $${booking.pricing.totalAmount.toFixed(2)} for ${booking.bookingReference} was processed successfully.`,
      type: 'payment',
      link: `/dashboard/guest/bookings/${booking._id}`,
    });

    res.status(200).json({
      success: true,
      payment,
      message: 'Payment verified and reservation confirmed!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user or all payment transactions
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'guest') {
      query.user = req.user.id;
    }

    const payments = await Payment.find(query)
      .populate('booking', 'bookingReference checkInDate checkOutDate hotel')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a refund
// @route   POST /api/payments/refund-request
// @access  Private
exports.requestRefund = async (req, res, next) => {
  try {
    const { bookingId, reason, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const refund = await RefundRequest.create({
      booking: booking._id,
      payment: booking.payment,
      user: req.user.id,
      amountRequested: amount || booking.pricing.totalAmount,
      reason,
      status: 'pending',
    });

    booking.bookingStatus = 'Refund Pending';
    await booking.save();

    res.status(201).json({
      success: true,
      refund,
      message: 'Refund request submitted for administrative review.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin approve or reject refund
// @route   PUT /api/payments/refunds/:id
// @access  Private (Admin)
exports.processRefundAction = async (req, res, next) => {
  try {
    const { status, amountApproved, adminNotes } = req.body;

    const refund = await RefundRequest.findById(req.params.id).populate('booking');
    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund request not found.' });
    }

    refund.status = status;
    refund.amountApproved = amountApproved || refund.amountRequested;
    refund.adminNotes = adminNotes || '';
    refund.reviewedBy = req.user.id;
    refund.processedAt = new Date();
    await refund.save();

    if (refund.booking) {
      const booking = await Booking.findById(refund.booking._id);
      if (booking) {
        if (status === 'approved' || status === 'processed') {
          booking.paymentStatus = 'refunded';
          booking.refundAmount = refund.amountApproved;
          booking.bookingStatus = 'Cancelled';
        }
        await booking.save();
      }
    }

    await AdminLog.create({
      actor: req.user.id,
      action: 'REFUND_' + status.toUpperCase(),
      resourceType: 'RefundRequest',
      resourceId: refund._id.toString(),
      details: { amount: refund.amountApproved, status },
    });

    res.status(200).json({
      success: true,
      refund,
      message: `Refund request marked as ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};
