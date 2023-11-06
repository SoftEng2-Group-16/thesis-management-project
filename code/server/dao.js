const crypto = require('crypto');
const db = require('./db');
const { check } = require('express-validator');


//const { Service, Counter, Ticket } = require("./model");

//all the code here needs to be modified according to the new db

/**
 * Query the database and check whether the username exists and the password
 * hashes to the correct value.
 * If so, return an object with full user information.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} a Promise that resolves to the full information about the current user, if the password matches
 * @throws the Promise rejects if any errors are encountered
 */

// USER SECTION

//! the dao methods for users needs to be tweaked according to the new specs

exports.getUser = (email, password) => 
{
  console.log(email,password) 
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM auth WHERE email = ?';

    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          reject('Invalid email or password');
        } else {
          const pass = password;
          const salt = row.salt;
          const hashedPassword = crypto.scryptSync(pass, salt, 64).toString('hex');

          if (hashedPassword === row.password) {
            resolve(row);
          } else {
            reject('Invalid email or password');
          }
        }
      }
    });
  });
}

// FOR SINGLE FETCH

/* exports.getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
} */

// FOR SINGLE FETCH

/* exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT username FROM users';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
 */


