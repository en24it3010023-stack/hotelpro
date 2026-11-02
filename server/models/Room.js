const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel is required for room assignment'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: [true, 'Room category is required'],
      index: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    floor: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance', 'blocked'],
      default: 'available',
    },
    housekeepingStatus: {
      type: String,
      enum: ['clean', 'dirty', 'in_progress', 'inspected'],
      default: 'clean',
    },
    keyCardCode: {
      type: String,
      default: function () {
        return 'KEY-' + Math.floor(100000 + Math.random() * 900000);
      },
    },
    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

RoomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
