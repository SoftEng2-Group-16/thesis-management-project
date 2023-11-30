const passport = require('passport');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

const login = async (req, res, next) => {
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
      const userInfo = {
        id: req.user.id,
        role: req.user.role,
        name: req.user.name,
        surname: req.user.surname,
        degree_code: req.user.role ==='student' ? req.user.degree_code : ""
      }
      return res.status(201).json(userInfo);
    });
  })(req, res, next);
};

const getCurrentSession = (req, res) => {
  if (req.isAuthenticated()) {
    const userInfo = {
      id: req.user.id,
      role: req.user.role,
      name: req.user.name,
      surname: req.user.surname,
      degree_code: req.user.role ==='student' ? req.user.degree_code : ""
    }
    res.status(200).json(userInfo);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

const logout = (req, res) => {
  req.logout(() => {
    res.sendStatus(204);
  });
};

module.exports = {
  isLoggedIn,
  login,
  getCurrentSession,
  logout,
};


  
