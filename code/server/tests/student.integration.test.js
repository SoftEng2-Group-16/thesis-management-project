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
            else {
                resolve();
                server.close();
            }
        });
    });
});

describe('Insert new thesis application', () => {
    test("Should successfully insert new application", async () => {
        const response = await request(app)
            .post('/api/newapplication')
            .send({studentId: "200001", proposalId: "45"});
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(1);
    })
   
    test("Should return error if student already applied", async () => {
        // Make a first submission to let fail the next
        await request(app)
        .post('/api/newapplication')
        .send({studentId: "200001", proposalId: "45"});

        const res = "Application already submitted, wait for professor response";

        const response = await request(app)
            .post('/api/newapplication')
            .send({studentId: "200001", proposalId: "45"});


        expect(response.status).toBe(500);
        expect(response.body).toEqual(res);
    });
});