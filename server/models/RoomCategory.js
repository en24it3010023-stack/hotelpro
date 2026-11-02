const mongoose = require('mongoose');

const RoomCategorySchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Please associate room category with a hotel'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please specify category name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide category description'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Please provide base price per night'],
      min: [1, 'Price must be greater than 0'],
    },
    weekendPrice: {
      type: Number,
      default: function () {
        return Math.round(this.basePrice * 1.15);
      },
    },
    maxGuests: {
      adults: { type: Number, default: 2, min: 1 },
      children: { type: Number, default: 1, min: 0 },
    },
    bedType: {
      type: String,
      default: '1 King Bed',
    },
    roomSizeSqFt: {
      type: Number,
      default: 450,
    },
    view: {
      type: String,
      default: 'Panoramic Scenic View',
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    totalRoomsCount: {
      type: Number,
      default: 5,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoomCategory', RoomCategorySchema);
