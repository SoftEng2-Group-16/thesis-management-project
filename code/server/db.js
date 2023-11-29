'use strict'
const sqlite = require('sqlite3');

const db = new sqlite.Database('./db_TM_dirty.db', (err) => {
    if (err) throw err;
});
module.exports = db; //export in in node convections