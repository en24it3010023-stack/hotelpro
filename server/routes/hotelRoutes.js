const express = require('express');
const router = express.Router();
const {
  getHotels,
  getFeaturedHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const {
  getCategoriesByHotel,
  createCategory,
  getRoomsByHotel,
  createRoom,
} = require('../controllers/roomController');
const { getHotelReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getHotels);
router.get('/featured', getFeaturedHotels);
router.get('/:id', getHotelById);
router.get('/:hotelId/categories', getCategoriesByHotel);
router.get('/:hotelId/reviews', getHotelReviews);

// Protected routes (Manager, Admin)
router.post('/', protect, authorize('manager', 'admin'), createHotel);
router.put('/:id', protect, authorize('manager', 'admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

// Sub-resources for hotel
router.post('/:hotelId/categories', protect, authorize('manager', 'admin'), createCategory);
router.get('/:hotelId/rooms', protect, authorize('staff', 'manager', 'admin'), getRoomsByHotel);
router.post('/:hotelId/rooms', protect, authorize('manager', 'admin'), createRoom);

module.exports = router;
