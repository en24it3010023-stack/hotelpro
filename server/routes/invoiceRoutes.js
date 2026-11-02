const express = require('express');
const router = express.Router();
const { getInvoice } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getInvoice);

module.exports = router;
