const express = require('express');
const router = express.Router();
const { submitEvaluation, getBenchmarks, createSession } = require('../controllers/evaluationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitEvaluation);
router.get('/benchmarks', protect, getBenchmarks);
router.post('/sessions', protect, createSession);

module.exports = router;
