const express = require('express');
const router = express.Router();
const { createProject, getProjects, getMyProject, getProjectById } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProject);
router.get('/', protect, getProjects); // Mentor can see all
router.get('/me', protect, getMyProject);
router.get('/:id', protect, getProjectById);

module.exports = router;
