'use strict';

const express = require('express');
const dayjs = require('dayjs');
const http = require('http');
//import router
const router = require('./routes/router.js');

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

//const auth0Strategy = require('passport-auth0'); //auth0 has his dedicated strategy

const SamlStrategy = require('passport-saml').Strategy;

const fs = require('fs'); // to read the pem file

const path = require('path');


const session = require('express-session');


const certPath = path.join(__dirname, './group16-thesis-management-system.pem');
const cert = fs.readFileSync(certPath, 'utf-8'); // read the certificate
const bodyParser = require("body-parser"); //needed to read the token from saml


passport.use(new SamlStrategy({
  entryPoint: 'https://group16-thesis-management-system.eu.auth0.com/samlp/7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  path: '/login/callback', //motherfucker
  issuer: 'passport-saml',
  cert: cert,
  acceptedClockSkewMs: 30000 // avoid syncerror Error: SAML assertion not yet valid
}, function (profile, done) {


  return done(null, //take from the Saml token the parameters so that will be available in req.user ffs
    {
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    });
}));

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));


// todo here the new strategy, after the auth tho we can keep our dao to fetch data :) i hope


passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user all the data found in the select user in the db, needs to be cleaned up
  console.log(user)
  return cb(null, user);
  //! i do not now what happens now, how do i store session data? we should not call here a dao function, maybe in serialize?
  //! solved, moved in the callback login
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,
    _expires: 600000
  }
}));

app.use(passport.authenticate('session'));

// auth routes, temp?

// todo move these again in the router


app.get('/login', (req, res, next) => {
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true })(req, res, next) 
});

app.post('/login/callback',

  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
  async function (req, res, next) {

    //! the req does not contain req.user and it's full of crap that does not fit the console.... i need a txtlog
   
    /* const logStream = fs.createWriteStream('request_log.txt', { flags: 'a' });
      logStream.write('Request Object:\n' + JSON.stringify(req, null, 2) + '\n\n');
      logStream.end(); */

    //! solved in the setup strategy

    // I need a new way to find the user in db, regexp?

    // Get the email
    const userEmail = req.user.email;

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
          role: 'student',
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

        const redirectURL = "http://localhost:5173/thesis";
        return res.redirect(redirectURL);
      });
    } catch (error) {
      return next(error);
    }
  }
);

app.get('/logout', (req, res) => {
  req.isAuthenticated() ?
    req.logOut(function (err) {
      if (err) { return next(err); }

      const redirectURL = "http://localhost:5173/thesis";
      return res.redirect(redirectURL);
    }) :
    res.status(401).json({ message: 'Unauthorized' });
});

/*** Utility Functions ***/
// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};


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