const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getUsers,
  updateUserRole,
  getAuditLogs,
  getRefundRequests,
  getInvoice,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/logs', getAuditLogs);
router.get('/refunds', getRefundRequests);
router.get('/invoices/:id', getInvoice);

module.exports = router;
