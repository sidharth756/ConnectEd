import express from 'express';
import { analyzeCareerIntelligence } from '../controllers/careerIntelligence.controller.js';

const router = express.Router();

// POST /api/career-intelligence/analyze
router.post('/analyze', analyzeCareerIntelligence);

export default router;
