const express = require('express');
const router = express.Router();
const {
  createReview,
  moderateReview,
  replyToReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, createReview);
router.put('/:id/moderate', protect, authorize('admin'), moderateReview);
router.post('/:id/reply', protect, authorize('manager', 'admin'), replyToReview);

module.exports = router;
