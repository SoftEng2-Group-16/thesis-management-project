'use strict';

const express = require('express');
const dayjs = require('dayjs');

// init express
const app = new express();
const port = 3001;

const morgan = require('morgan');
const cors = require('cors');
const dao = require('./dao');

const { check, validationResult, } = require('express-validator'); // validation middleware

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

// Passport: set up local strategy
// Later the strategy will be changed to SAML2

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const userDAO = await dao.getUser(username, password);
    const user = { id: userDAO.id, username: userDAO.username, counterId: userDAO.counter }
    console.log(user)
    if (!user)
      return cb(null, false, 'Incorrect username or password.');

    return cb(null, user);
  } catch {
    return cb(null, false, 'Incorrect username or password.');
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


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

