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
const LocalStrategy = require('passport-local'); // well, not anymore my friend

const Auth0Strategy = require('passport-auth0'); //auth0 has his dedicated strategy, very convenient

const session = require('express-session');

const { auth } = require('express-openid-connect');


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
const config = {  // figure out where this goes
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: '7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  issuerBaseURL: 'https://group16-thesis-management-system.eu.auth0.com'
};

// todo here the new strategy, after the auth tho we can keep our dao to fetch data :) i hope

passport.use(new LocalStrategy({
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


passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user all the data found in the select user in the db, needs to be cleaned up
  console.log(user)
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));



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