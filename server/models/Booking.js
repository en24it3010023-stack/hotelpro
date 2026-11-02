const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest user is required'],
      index: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel is required'],
      index: true,
    },
    roomCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: [true, 'Room category is required'],
      index: true,
    },
    assignedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      index: true,
    },
    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },
    guestCount: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      rooms: { type: Number, default: 1, min: 1 },
    },
    guestDetails: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      specialRequests: { type: String, default: '' },
      estimatedArrivalTime: { type: String, default: '15:00' },
    },
    pricing: {
      basePrice: { type: Number, required: true },
      nights: { type: Number, required: true },
      roomTotal: { type: Number, required: true },
      taxAmount: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      promoCode: { type: String, default: '' },
      totalAmount: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'partially_refunded', 'failed'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'Refund Pending'],
      default: 'Confirmed',
      index: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

BookingSchema.index({ hotel: 1, checkInDate: 1, checkOutDate: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
