'use strict';

const express = require('express');
const dayjs = require('dayjs');
const http = require('http');
//import router
const router =require('./routes/router.js');

// init express
const app = new express();
const port = 3001;

const morgan = require('morgan');
const cors = require('cors');
const dao = require('./daoUsers.js');

const { check, validationResult, } = require('express-validator'); // validation middleware

// TODO Passport-related imports + new idp import module

const passport = require('passport');

// passport strategies

const LocalStrategy = require('passport-local'); // well, not anymore my friend

const auth0Strategy = require('passport-auth0'); //auth0 has his dedicated strategy

const session = require('express-session');

//const { auth } = require('express-openid-connect'); //used by auth0 strategy?

passport.use(new auth0Strategy({
  domain: 'group16-thesis-management-system.eu.auth0.com',
  clientID: '7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  clientSecret: 'H_2SVIDuHNHOpDpblKvUthc9sDSx3wr5FonBnNU_m7QtB6WaAPx-ac_QbrZAQmaT',
  callbackURL: 'http://localhost:3001/login/callback',
  scope: 'openid profile',
  credentials: true
},
  function (accessToken, refreshToken, extraParams, profile, done) {
      return done(null, profile);
  }
));



// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

//!Later the strategy will be changed to SAML2

// todo here the new strategy, after the auth tho we can keep our dao to fetch data :) i hope

/* passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function verify(username, password, cb) {
  try {
    const userDAO = await dao.getUser(username, password);
    
    if (!userDAO || !userDAO.id) {
      return cb(null, false, 'Incorrect username or password.');
    }
    
    let fetch;
    let user;
    
    if (userDAO.role === "teacher") {
      fetch = await dao.getProfessorById(userDAO.id);
      user = {id:fetch.id, surname: fetch.surname, name: fetch.name,role: userDAO.role, email: fetch.email, group_code: fetch.group_code, department_code: fetch.department_code}

    } else if (userDAO.role === "student") {
      fetch = await dao.getStudentById(userDAO.id);
      user = {id:fetch.id, surname: fetch.surname, name: fetch.name,role: userDAO.role, email: fetch.email, gender: fetch.gender, nationality: fetch.nationality, degree_code: fetch.degree_code, enrollment_year: fetch.enrollment_year }

    }
    
    if (!user) {
      return cb(null, false, 'Error, authentication succeeded but data fetch failed.');
    }
    
    return cb(null, user);
  } catch (error) {
    return cb(error, false, 'An error occurred during authentication.');
  }
}));
 */


passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user all the data found in the select user in the db, needs to be cleaned up
  console.log(user)
  return cb(null, user);
  //! i do not now what happens now, how do i store session data? we should not call here a dao function, maybe in serialize?
  //! this function it's called every fucking time the api receives a call dealing with passport middleware
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
    _expires: 60000
}
}));

app.use(passport.authenticate('session'));



/*** Utility Functions ***/
// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

// auth routes, temp?
app.get('/login', (req, res, next) => {
  !req.isAuthenticated() ?
    passport.authenticate('auth0', function (err, user, info) {
      if (err) return next(err);
      if (!user) return res.redirect('/login');

      // No need for req.logIn here

      return res.redirect('/');
    })(req, res, next)
    : res.status(401).json({ message: 'Forbidden' });
});


app.get('/login/callback', (req, res, next) => {
  !req.isAuthenticated() ?
    passport.authenticate('auth0', async function (err, user, info) {
      if (err) return next(err);
      if (!user) return res.redirect('/login');

      // Get the email
      const userEmail = user.displayName;

      // Check if email contains "studenti.polito"
      const isStudent = userEmail.includes("studenti.polito");

      try {
        let userData;

        // If email is for a student, fetch data from the student table
        if (isStudent) {
          const studentData = await dao.getStudentByEmail(userEmail);

          if (!studentData || !studentData.id) {
            return res.status(401).json({ message: 'Error fetching student data from the database.' });
          }

          userData = {
            id: studentData.id,
            surname: studentData.surname,
            name: studentData.name,
            role: 'student', // need to set it here since we do not pass trough auth table
            email: studentData.email,
            gender: studentData.gender,
            nationality: studentData.nationality,
            degree_code: studentData.degree_code,
            enrollment_year: studentData.enrollment_year
          };
        } else {
          // If email is not for a student, fetch data from the teacher table
          const teacherData = await dao.getProfessorByEmail(userEmail);

          if (!teacherData || !teacherData.id) {
            return res.status(401).json({ message: 'Error fetching teacher data from the database.' });
          }

          userData = {
            id: teacherData.id,
            surname: teacherData.surname,
            name: teacherData.name,
            role: 'teacher', 
            email: teacherData.email,
            group_code: teacherData.group_code,
            department_code: teacherData.department_code
          };
        }

        if (!userData) {
          return res.status(401).json({ message: 'Error, authentication succeeded but data fetch failed.' });
        }

        // Log in the user and store the additional user data in the session
        req.logIn(userData, async function (err) {
          if (err) { return next(err); }

          const redirectURL = "http://localhost:5173";
          return res.redirect(redirectURL);
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next) :
    res.status(401).json({ message: 'Unauthorized' });
});


app.get('/logout', (req, res) => {
  req.isAuthenticated() ?
      req.logOut(res, function (err) {
          if (err) { return next(err); }

          const redirectURL = "http://localhost:5173/";
          return res.redirect(redirectURL);
      })
      : res.status(401).json({ message: 'Unauthorized' });
    }
);

/* ROUTERS */
app.use('/api', router);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// activate the server
// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });

module.exports = { app, server };