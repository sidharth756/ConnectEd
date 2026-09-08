const express = require('express');
const {
  getAlumni,
  getAlumniById,
  createAlumni,
  alumniCreateSchema,
  alumniQuerySchema,
} = require('../controllers/alumni.controller');
const { validateBody, validateQuery } = require('../middleware/validator');

const router = express.Router();

router.get('/', validateQuery(alumniQuerySchema), getAlumni);
router.get('/:id', getAlumniById);
router.post('/', validateBody(alumniCreateSchema), createAlumni);

module.exports = router;
