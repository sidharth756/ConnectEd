const express = require('express');
const {
  getMentors,
  requestMentorship,
  getMentorshipRequests,
  mentorshipRequestSchema,
} = require('../controllers/mentors.controller');
const { validateBody } = require('../middleware/validator');

const router = express.Router();

router.get('/', getMentors);
router.get('/requests', getMentorshipRequests);
router.post('/request', validateBody(mentorshipRequestSchema), requestMentorship);

module.exports = router;
