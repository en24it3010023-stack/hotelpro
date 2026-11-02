const express = require('express');
const router = express.Router();
const {
  getCategoryDetails,
  updateCategory,
  updateRoomStatus,
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/categories/:id', getCategoryDetails);
router.put('/categories/:id', protect, authorize('manager', 'admin'), updateCategory);
router.put('/:id/status', protect, authorize('staff', 'manager', 'admin'), updateRoomStatus);

module.exports = router;
