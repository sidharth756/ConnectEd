const express = require('express');
const { getJobs, getJobById, createJob, jobCreateSchema } = require('../controllers/jobs.controller');
const { validateBody } = require('../middleware/validator');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', validateBody(jobCreateSchema), createJob);

module.exports = router;
