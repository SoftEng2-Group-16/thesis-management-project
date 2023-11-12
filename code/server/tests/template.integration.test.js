// server.test.js
const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const { app, server } = require('../index');

beforeAll(async () => {
  // Set up an in-memory SQLite database for testing
  const dbPath = ':memory:';
  const dbData = fs.readFileSync('./db_TM.sql', 'utf8');
  const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
      }else{
        //console.log('Connected to the in-memory SQlite database.')
        await new Promise((resolve, reject) => {
          db.exec(dbData, (err) => {
            if (err) reject(err);
            else resolve();
          });
        })
      }
  });
global.__TEST_DB__ = db; // Make the database accessible globally
});


afterAll(async () => {
await new Promise((resolve, reject) => {
  global.__TEST_DB__.close((err) => {
    if (err) reject(err);
    else{  
      resolve();
      server.close();
    }
  });
});

});

describe('Integration Tests', () => {
  test('Not logged in user', async () => {
    const response = await request(app).get('/api/sessions/current');
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Not authenticated");
  });

  test('login: login with success', async () => {
    const user = {
      email: 'mario.rossi@studenti.polito.it',
      password: "200001"
    };
    
    //The API request must be awaited as well
    const response = await request(app)
      .post("/api/sessions") 
      .send({ email: user.email, password: user.password })

      console.log(response.body);
    expect(response.status).toBe(201) // why success code is 201 instead of 200 ?
  });

  // Add more integration tests for your server
});
