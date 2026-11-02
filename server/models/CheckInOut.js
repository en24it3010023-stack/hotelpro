const mongoose = require('mongoose');

const CheckInOutSchema = new mongoose.Schema(
  {
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
      index: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    type: {
      type: String,
      enum: ['check_in', 'check_out'],
      required: true,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    keyCardIssued: {
      type: String,
      default: '',
    },
    idVerified: {
      type: Boolean,
      default: true,
    },
    damagesReported: {
      type: String,
      default: 'None',
    },
    settlementStatus: {
      type: String,
      enum: ['settled', 'pending_charge', 'waived'],
      default: 'settled',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CheckInOut', CheckInOutSchema);
