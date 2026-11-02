const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Guarantees one review per stay
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    subRatings: {
      cleanliness: { type: Number, default: 5, min: 1, max: 5 },
      service: { type: Number, default: 5, min: 1, max: 5 },
      comfort: { type: Number, default: 5, min: 1, max: 5 },
      location: { type: Number, default: 5, min: 1, max: 5 },
      value: { type: Number, default: 5, min: 1, max: 5 },
    },
    title: {
      type: String,
      required: [true, 'Please provide a review title'],
      trim: true,
      maxlength: 120,
    },
    comment: {
      type: String,
      required: [true, 'Please write your feedback or stay experience'],
      maxlength: 1500,
    },
    roomCategoryName: {
      type: String,
      default: '',
    },
    verifiedStay: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['published', 'pending', 'rejected'],
      default: 'published',
      index: true,
    },
    managerResponse: {
      responseText: { type: String, default: '' },
      respondedAt: { type: Date, default: null },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
