const express = require('express');
const { getRoadmap, saveRoadmap, roadmapSaveSchema } = require('../controllers/career.controller');
const { validateBody } = require('../middleware/validator');

const router = express.Router();

router.get('/roadmap/:studentId', getRoadmap);
router.post('/roadmap', validateBody(roadmapSaveSchema), saveRoadmap);

module.exports = router;
