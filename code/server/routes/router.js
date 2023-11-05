const express = require('express');
const auth = require('./auth/auth.js');

const router = express.Router();

// POST /api/sessions
router.post('/api/sessions', auth.login);

// GET /api/sessions/current
router.get('/current', auth.getCurrentSession);

// DELETE /api/sessions/current
router.delete('/api/sessions/current', auth.isLoggedIn, auth.logout);

module.exports = router;