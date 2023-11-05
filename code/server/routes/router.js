const express = require('express');
const auth = require('./auth/auth.js');

const router = express.Router();

// POST /api/sessions
router.post('/sessions', auth.login);

// GET /api/sessions/current
router.get('/sessions/current', auth.getCurrentSession);

// DELETE /api/sessions/current
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);

module.exports = router;