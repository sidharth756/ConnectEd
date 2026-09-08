const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  studentCreateSchema,
  studentQuerySchema,
} = require('../controllers/students.controller');
const { validateBody, validateQuery } = require('../middleware/validator');

const router = express.Router();

router.get('/', validateQuery(studentQuerySchema), getStudents);
router.get('/:id', getStudentById);
router.post('/', validateBody(studentCreateSchema), createStudent);

module.exports = router;
