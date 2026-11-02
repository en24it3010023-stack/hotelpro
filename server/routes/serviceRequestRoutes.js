const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getServiceRequests,
  updateServiceRequest,
} = require('../controllers/serviceRequestController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', createServiceRequest);
router.get('/', getServiceRequests);
router.put('/:id', authorize('staff', 'manager', 'admin'), updateServiceRequest);

module.exports = router;
