// server.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const sqlite3 = require('sqlite3');

const { app, server } = require('../index');

beforeAll(async () => {
  // Set up an in-memory SQLite database for testing
  const testDb = ':memory:';
  const db = new sqlite3.Database(testDb, async (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
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

    expect(response.status).toBe(201) // why success code is 201 instead of 200 ?
  });

  // Add more integration tests for your server
});
