const express = require('express');
const router = express.Router();
const { generateViva } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-viva', protect, generateViva);

module.exports = router;
