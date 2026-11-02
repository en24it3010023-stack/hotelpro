const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

// @desc    Submit stay-verified review
// @route   POST /api/reviews
// @access  Private (Guest)
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, subRatings, title, comment } = req.body;

    const booking = await Booking.findById(bookingId).populate('roomCategory');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Must be the guest of this booking
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the guest who completed this reservation can submit a review.',
      });
    }

    // Check stay verification: Must not be cancelled
    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled bookings are not eligible for stay reviews.',
      });
    }

    // Prevent duplicate reviews for the same stay
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this stay.',
      });
    }

    const review = await Review.create({
      hotel: booking.hotel,
      booking: booking._id,
      user: req.user.id,
      rating: Number(rating),
      subRatings: subRatings || {
        cleanliness: rating,
        service: rating,
        comfort: rating,
        location: rating,
        value: rating,
      },
      title,
      comment,
      roomCategoryName: booking.roomCategory?.name || '',
      verifiedStay: true,
      status: 'published',
    });

    // Recalculate hotel ratings
    const stats = await Review.aggregate([
      { $match: { hotel: booking.hotel, status: 'published' } },
      {
        $group: {
          _id: '$hotel',
          avgRating: { $avg: '$rating' },
          cleanliness: { $avg: '$subRatings.cleanliness' },
          service: { $avg: '$subRatings.service' },
          comfort: { $avg: '$subRatings.comfort' },
          location: { $avg: '$subRatings.location' },
          value: { $avg: '$subRatings.value' },
          total: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Hotel.findByIdAndUpdate(booking.hotel, {
        ratingSummary: {
          averageRating: Math.round(stats[0].avgRating * 10) / 10,
          totalReviews: stats[0].total,
          cleanliness: Math.round(stats[0].cleanliness * 10) / 10,
          service: Math.round(stats[0].service * 10) / 10,
          comfort: Math.round(stats[0].comfort * 10) / 10,
          location: Math.round(stats[0].location * 10) / 10,
          value: Math.round(stats[0].value * 10) / 10,
        },
      });
    }

    res.status(201).json({
      success: true,
      review,
      message: 'Thank you! Your verified stay review has been published.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get published reviews for a hotel
// @route   GET /api/hotels/:hotelId/reviews
// @access  Public
exports.getHotelReviews = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments({ hotel: hotelId, status: 'published' });
    const reviews = await Review.find({ hotel: hotelId, status: 'published' })
      .populate('user', 'name avatar')
      .populate('managerResponse.respondedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin moderate review (approve or reject)
// @route   PUT /api/reviews/:id/moderate
// @access  Private (Admin)
exports.moderateReview = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.status(200).json({
      success: true,
      review,
      message: `Review status changed to ${status}.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Hotel manager reply to review
// @route   POST /api/reviews/:id/reply
// @access  Private (Manager, Admin)
exports.replyToReview = async (req, res, next) => {
  try {
    const { responseText } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.managerResponse = {
      responseText,
      respondedAt: new Date(),
      respondedBy: req.user.id,
    };

    await review.save();

    res.status(200).json({
      success: true,
      review,
      message: 'Manager response added successfully.',
    });
  } catch (error) {
    next(error);
  }
};
