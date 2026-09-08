const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const studentRoutes = require('./students.routes');
const alumniRoutes = require('./alumni.routes');
const mentorRoutes = require('./mentors.routes');
const jobRoutes = require('./jobs.routes');
const careerRoutes = require('./career.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/alumni', alumniRoutes);
router.use('/mentors', mentorRoutes);
router.use('/jobs', jobRoutes);
router.use('/career', careerRoutes);

module.exports = router;
