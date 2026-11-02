const Hotel = require('../models/Hotel');
const RoomCategory = require('../models/RoomCategory');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const AdminLog = require('../models/AdminLog');

// @desc    Get all hotels with rich search, filters, sorting & pagination
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const {
      search,
      city,
      country,
      minPrice,
      maxPrice,
      starRating,
      amenities,
      checkIn,
      checkOut,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'active' };

    // Search keyword
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { 'address.city': { $regex: search.trim(), $options: 'i' } },
        { 'address.country': { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (city) {
      query['address.city'] = { $regex: city.trim(), $options: 'i' };
    }

    if (country) {
      query['address.country'] = { $regex: country.trim(), $options: 'i' };
    }

    if (starRating) {
      query.starRating = { $gte: Number(starRating) };
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArr = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesArr.map((a) => a.trim()) };
    }

    // Sorting
    let sortOptions = { featured: -1, 'ratingSummary.averageRating': -1 };
    if (sort === 'price_asc') sortOptions = { startingPrice: 1 };
    else if (sort === 'price_desc') sortOptions = { startingPrice: -1 };
    else if (sort === 'rating_desc') sortOptions = { 'ratingSummary.averageRating': -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: hotels.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
exports.getFeaturedHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ status: 'active', featured: true })
      .limit(6)
      .sort({ 'ratingSummary.averageRating': -1 });

    res.status(200).json({
      success: true,
      hotels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID or Slug
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res, next) => {
  try {
    let hotel;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      hotel = await Hotel.findById(req.params.id).populate('manager', 'name email phone avatar');
    } else {
      hotel = await Hotel.findOne({ slug: req.params.id }).populate('manager', 'name email phone avatar');
    }

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel property not found.',
      });
    }

    // Attach Room Categories
    const roomCategories = await RoomCategory.find({ hotel: hotel._id, isActive: true });

    res.status(200).json({
      success: true,
      hotel,
      roomCategories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Manager, Admin)
exports.createHotel = async (req, res, next) => {
  try {
    // If manager, set manager as current user
    if (req.user.role === 'manager' && !req.body.manager) {
      req.body.manager = req.user.id;
    }

    // Generate slug from name
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    }

    const hotel = await Hotel.create(req.body);

    await AdminLog.create({
      actor: req.user.id,
      action: 'HOTEL_CREATED',
      resourceType: 'Hotel',
      resourceId: hotel._id.toString(),
      details: { name: hotel.name, city: hotel.address?.city },
    });

    res.status(201).json({
      success: true,
      hotel,
      message: 'Hotel property registered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel details
// @route   PUT /api/hotels/:id
// @access  Private (Manager, Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    // Check manager authorization
    if (req.user.role === 'manager' && hotel.manager && hotel.manager.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit hotels you do not manage.',
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      hotel,
      message: 'Hotel updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Admin)
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hotel property removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
