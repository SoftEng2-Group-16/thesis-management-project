'use strict'
const sqlite = require('sqlite3');
const fs = require('fs');

//Choose the correct line (depending on which db you intend to use)
//const dbType = process.env.NODE_ENV === 'test' ? ':memory:' : './cleanDB/db_TM.db';
const dbType = process.env.NODE_ENV === 'test' ? ':memory:' : './db_TM_dirty.db';

console.log(dbType);
const db = new sqlite.Database(dbType, async (err) => {
    if (err){ 
        throw err; 
    }
    if(process.env.NODE_ENV === 'test'){
        //console.log('Connected to the in-memory SQlite database.')
        const dbData = fs.readFileSync('./db_TM.sql', 'utf8');
        await new Promise((resolve, reject) => {
          db.exec(dbData, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
    }
});

module.exports = db; //export in in node convections