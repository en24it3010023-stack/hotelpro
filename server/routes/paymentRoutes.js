const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPaymentResult,
  getPayments,
  requestRefund,
  processRefundAction,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPaymentResult);
router.get('/', protect, getPayments);
router.post('/refund-request', protect, requestRefund);
router.put('/refunds/:id', protect, authorize('admin'), processRefundAction);

module.exports = router;
