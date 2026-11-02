const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'demo'],
      default: 'demo',
    },
    gatewayOrderId: {
      type: String,
      default: '',
    },
    gatewayPaymentId: {
      type: String,
      default: '',
    },
    gatewaySignature: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed', 'refunded'],
      default: 'initiated',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'demo'],
      default: 'demo',
    },
    cardLast4: {
      type: String,
      default: '4242',
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    refundDetails: {
      refundId: String,
      amount: Number,
      status: String,
      reason: String,
      refundedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
