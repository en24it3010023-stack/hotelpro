const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
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
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    guestDetails: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
    },
    stayPeriod: {
      checkIn: Date,
      checkOut: Date,
      nights: Number,
    },
    roomCategoryName: String,
    lineItems: [
      {
        description: String,
        quantity: { type: Number, default: 1 },
        unitPrice: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    taxAmount: Number,
    serviceFee: Number,
    discountAmount: { type: Number, default: 0 },
    totalAmount: Number,
    currency: { type: String, default: 'USD' },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
