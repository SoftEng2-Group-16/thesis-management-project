
const express = require('express');
const router = express.Router();
const passport = require('passport');


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

// POST /api/sessions
router.post('/api/sessions', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
          return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
    
          // req.user contains the authenticated user, we send all the user info back
          return res.status(201).json(req.user);
        });
      })(req, res, next);
});

// GET /api/sessions/current
router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
      }
      else
        res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/sessions/current
router.delete('/api/sessions/current', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.sendStatus(204);
      });
});

module.exports = router;



  
