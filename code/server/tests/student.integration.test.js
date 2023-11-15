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

describe('Get thesis proposals', () => {
    test("Should successfully return thesis proposals", async () => {
        const res = [
            {
                "id": 1,
                "title": "AI-Driven Healthcare Solutions",
                "supervisor": "268553",
                "cosupervisors": [
                    "23456,78901"
                ],
                "keywords": "Artificial Intelligence, Healthcare, Machine Learning",
                "type": "Company Thesis",
                "groups": [
                    "AI Research Group, Medical Research Group"
                ],
                "description": "Develop AI-powered healthcare solutions for diagnosing diseases.",
                "requirements": "Machine Learning, Medical Science, Data Analysis",
                "notes": "This project focuses on leveraging AI for healthcare advancements.",
                "expiration": "20-11-24",
                "level": "bachelor",
                "cds": [
                    "LT-2"
                ]
            }
        ];

        const response = await request(app)
            .get('/api/proposals/LT-2');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(res);
    })
   
    test("Should return error if there is not any thesis proposal for degreeCode", async () => {  
        const res = {error: `No thesis proposals found for study course LM-32`}

        const response = await request(app)
            .get('/api/proposals/LM-32');

        expect(response.status).toBe(404);
        expect(response.body).toEqual(res);
    });
});