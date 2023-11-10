const request = require('supertest');
import { app } from '../index';
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');

let db;

beforeAll(async () => {
  // Create an in-memory SQLite database
  // db = await open({
  //   filename: ':memory:',
  //   driver: sqlite3.Database,
  // });

  // // Read database file and execute SQL to copy data to the in-memory database
  // const dbPath = './cleanDB/db_TM.db';

  // const existingDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  //   if (err) {
  //     console.error('Error opening the existing database:', err);
  //   } else {
  //     // Use the built-in `.backup` method to copy the database to the in-memory database
  //     existingDb.backup(db, async (err) => {
  //       if (err) {
  //         console.error('Error copying the database:', err);
  //       } else {
  //         // Additional setup if needed
  //         existingDb.close(); // Close the existing database connection
  //       }
  //     });
  //   }
  // });
});

afterAll(async () => {
  // Close and clean up the in-memory database
 // await db.close();
});

describe('Test fn', () => {
    test("home ", async () => {
        //The API request must be awaited as well
        const response = await request(app).get("/api/sessions/current") 

        expect(response.status).toBe(200)
    });

  // Add more test cases for your server here
});
