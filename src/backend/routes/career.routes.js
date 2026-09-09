import express from 'express';
import { getRoadmap, saveRoadmap, generateAIRoadmap, refreshMarketRoadmap, getTaskResources, roadmapSaveSchema } from '../controllers/career.controller.js';
import { analyzeCareerIntelligence } from '../controllers/careerIntelligence.controller.js';
import { validateBody } from '../middleware/validator.js';

const router = express.Router();

router.get('/roadmap/resources', getTaskResources);
router.post('/roadmap/resources', getTaskResources);
router.post('/roadmap/refresh-market', refreshMarketRoadmap);
router.get('/roadmap/:studentId', getRoadmap);
router.post('/roadmap/generate', generateAIRoadmap);
router.post('/roadmap', validateBody(roadmapSaveSchema), saveRoadmap);
router.post('/intelligence', analyzeCareerIntelligence);
router.post('/intelligence/analyze', analyzeCareerIntelligence);

export default router;



