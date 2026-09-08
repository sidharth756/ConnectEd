const express = require('express');
const {
  register,
  login,
  getMe,
  registerSchema,
  loginSchema,
} = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticateToken, getMe);

module.exports = router;
