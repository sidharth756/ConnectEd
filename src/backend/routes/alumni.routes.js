import express from 'express';
import {
  getAlumni,
  getAlumniById,
  createAlumni,
  alumniCreateSchema,
  alumniQuerySchema,
} from '../controllers/alumni.controller.js';
import { validateBody, validateQuery } from '../middleware/validator.js';

const router = express.Router();

router.get('/', validateQuery(alumniQuerySchema), getAlumni);
router.get('/:id', getAlumniById);
router.post('/', validateBody(alumniCreateSchema), createAlumni);

export default router;
