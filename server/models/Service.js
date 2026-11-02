const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['room_service', 'housekeeping', 'maintenance', 'amenities', 'concierge', 'laundry', 'transport'],
      default: 'room_service',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: 'Bell',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
