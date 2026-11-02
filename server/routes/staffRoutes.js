const express = require('express');
const router = express.Router();
const {
  getDeskSummary,
  processCheckIn,
  processCheckOut,
  getStaffTasks,
  updateTaskStatus,
} = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('staff', 'manager', 'admin'));

router.get('/desk-summary', getDeskSummary);
router.post('/check-in', processCheckIn);
router.post('/check-out', processCheckOut);
router.get('/tasks', getStaffTasks);
router.put('/tasks/:id', updateTaskStatus);

module.exports = router;
