const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hotel name'],
      trim: true,
      maxlength: [150, 'Hotel name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: 'A Sanctuary of Elegance, Luxury and Supreme Comfort',
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed hotel description'],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, default: '' },
      country: { type: String, required: true, index: true },
      zipCode: { type: String, default: '' },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
      },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    startingPrice: {
      type: Number,
      required: true,
      default: 150,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'pending_approval', 'suspended'],
      default: 'active',
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    policies: {
      checkInTime: { type: String, default: '15:00' },
      checkOutTime: { type: String, default: '11:00' },
      cancellationDays: { type: Number, default: 2 },
      cancellationRefundPercent: { type: Number, default: 100 },
      petPolicy: { type: String, default: 'Pets welcome upon advance notice.' },
      smokingPolicy: { type: String, default: 'Non-smoking property throughout.' },
    },
    ratingSummary: {
      averageRating: { type: Number, default: 4.8 },
      totalReviews: { type: Number, default: 0 },
      cleanliness: { type: Number, default: 4.9 },
      service: { type: Number, default: 4.9 },
      comfort: { type: Number, default: 4.8 },
      location: { type: Number, default: 4.8 },
      value: { type: Number, default: 4.7 },
    },
  },
  { timestamps: true }
);

HotelSchema.index({ name: 'text', 'address.city': 'text', 'address.country': 'text', description: 'text' });

module.exports = mongoose.model('Hotel', HotelSchema);
