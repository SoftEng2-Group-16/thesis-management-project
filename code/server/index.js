'use strict';
// main express related import
const express = require('express');
const dayjs = require('dayjs');
const http = require('http');
const router = require('./routes/router.js');
const session = require('express-session');

//cron-related import to perform automatic archive of expired proposals
const cron = require('node-cron');

// init express
const app = new express();
const port = 3001;

// middlewares
const morgan = require('morgan');
const cors = require('cors');
const dao = require('./daoUsers.js');
const multer = require('multer');

const { check, validationResult, } = require('express-validator'); // validation middleware


// TODO Passport-related imports + new idp import module

// auth imports
const passport = require('passport');
const LocalStrategy = require('passport-local'); // well, not anymore my friend
const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs'); // to read the pem file
const path = require('path');

// utility imports middleware and setup
const certPath = path.join(__dirname, './group16-thesis-management-system.pem');
const cert = fs.readFileSync(certPath, 'utf-8'); // read the certificate
const bodyParser = require("body-parser"); //needed to read the token from saml



//-------------------------------AUTH0 stuff for SAML2--------------------------------//

passport.use(new SamlStrategy({
  entryPoint: 'https://group16-thesis-management-system.eu.auth0.com/samlp/7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  path: '/login/callback',
  issuer: 'passport-saml',
  cert: cert,
  acceptedClockSkewMs: -1 // avoid syncerror Error: SAML assertion not yet valid
}, function (profile, done) {
  return done(null, {//take from the Saml token the parameters so that will be available in req.user ffs
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

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
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


app.get('/login', (req, res, next) => {
  passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true })(req, res, next)
});

app.post(
  '/login/callback',
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
  async function (req, res, next) {
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

/**Multer stuff */
// Increase payload size limit (adjust the limit as needed)
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));


/**
 * Cron utility functions, to launch the API calls needed to automatically archive a proposal (cannot 
 * use named functions as we do in the router, have to create http request 'manually')
 * Don't know why, moving them in a separate file breaks them.
 * 
 * Note on the logic: in servers, cron jobs are used to automatically perform some operations. If we didn't 
 * have the virtual clock functionality, we would simply configure a cron job to automatically move expired proposals
 * every day soon after midnight; however, since we implemented the VC by saving the selected date in the DB in order
 * to mantain its consistency, it wouldn't make sense to have it set up like that, because the date doesn't change at 00:00.
 * 
 * For testing purposes, we will set up a shorter interval for the cron job (change the string in the cron.schedule line) to
 * show it effectively works.
 */
  

const cronGetDate = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/initialdate',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data.replace(/"/g, ''));
      });

      res.on('error', (error) => {
        reject(error);
      })
    });

    req.end();
  });
}

const cronArchiveExpired = (initialDate) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/clockchanged',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const reqBody = JSON.stringify({
      selectedTimestamp: initialDate,
    });

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.write(reqBody);
    req.end();
  });
}



/* ROUTERS */
app.use('/api', router);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  // cron job setup
  cron.schedule('15 0 0 * * *', async () => { //executes every day, few seconds after midnight
    console.log('Cron job starting...');
    const initialDate = await cronGetDate().catch(e => console.error("Cron job couldn't get date"));
    const numberExpired = await cronArchiveExpired(initialDate).catch(e => console.error("Cron couldn't archive expired proposals"));
    console.log(`Cron job finished, moved ${numberExpired} proposals...`);
  });
});


module.exports = { app, server };