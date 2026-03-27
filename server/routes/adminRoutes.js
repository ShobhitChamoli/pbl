const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllProjects,
    assignMentor,
    createUser,
    getCourses,
    createCourse,
    getVivaSessions,
    createVivaSession,
    resetSystem,
    createEvaluationPeriod,
    sendReminder,
    extendDeadline,
    getEvaluationPeriod
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to ensure admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access only' });
    }
};

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/projects', protect, adminOnly, getAllProjects);
router.post('/assign', protect, adminOnly, assignMentor);
router.post('/users', protect, adminOnly, createUser);

// Course Routes
router.get('/courses', protect, adminOnly, getCourses);
router.post('/courses', protect, adminOnly, createCourse);

// Viva Session Routes
router.get('/viva-sessions', protect, adminOnly, getVivaSessions);
router.post('/viva-sessions', protect, adminOnly, createVivaSession);

// System Reset
router.post('/reset', protect, adminOnly, resetSystem);

// Action Buttons
router.post('/evaluation-period', protect, adminOnly, createEvaluationPeriod);
router.get('/evaluation-period', protect, adminOnly, getEvaluationPeriod);
router.post('/send-reminder', protect, adminOnly, sendReminder);
router.post('/extend-deadline', protect, adminOnly, extendDeadline);

module.exports = router;
