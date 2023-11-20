// server.test.js
process.env.NODE_ENV = 'test';

const request = require('supertest');
const sqlite3 = require('sqlite3');

const dao = require("../dao.js")
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

describe('professor Integration Tests', () => {
    // test('should insert new proposal', async () => {

    // const user = {
    //   email: 'luigi.bianchi@polito.it',
    //   password: "268554"
    // };

    // const loginResponse = await request(app).post('/api/sessions/').send(user);

    // if(loginResponse.status == 201) { //user logged in
    //     const response = await request(app)
    //         .post('/api/newproposal')
    //         .send({
    //             title: "test title2",
    //             supervisor: "268556",
    //             cosupervisors: ["Maria Rossi, 268553, DAD", "Marco Rossi, REPLY", "Stefano Mariani, 268565, DAT"],
    //             keywords: "test1, test2",
    //             type: "Abroad Thesis",
    //             groups: [],
    //             description: "test description",
    //             requirements: "test requirements",
    //             notes: "test notes",
    //             expiration: "31/12/2023",
    //             level: "Bachelor",
    //             cds: ["LM-1", "LM-2"]
    //         });
    //     console.log(response);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual(8);
    // } else {
    //     console.log("Logged in failed");
    // }
    // });

    test('should insert new proposal', async () => {
        const response = await request(app)
            .get('/api/degrees')


        expect(response.status).toBe(200);


    });

    test('should return degrees when found', async () => {
        const response = await request(app).get('/api/degrees');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            ["LM-1  Computer Engineering",
                "LM-2  Electrical Engineering",
                "LM-3  Mechanical Engineering",
                "LM-4  Civil Engineering",
                "LT-1  Aerospace Engineering",
                "LT-2  Biomedical Engineering",
                "LT-3  Electrical Engineering",
                "LT-4  Telecommunications Engineering",
                "LT-5  Materials Engineering",
                "LT-6  Nuclear Engineering",
                "LM-5  ICT for Smart Societies",
                "LM-6  Energy Engineering",
            ]);
    });


    test('should return 500 on database error', async () => {
        // Mock your DAO to throw an error
        jest.spyOn(dao, 'getDegrees').mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/degrees');

        expect(response.status).toBe(500);
        expect(response.body).toEqual('Database error');
    });


    test('should return cosupervisors', async () => {
        const response = await request(app).get('/api/cosupervisors');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            internals: [
                "Maria Rossi, 268553, DAD",
                "Luigi Bianchi, 268554, DAUIN",
                "Giovanna Ferrari, 268555, DAT",
                "Antonio Russo, 268556, DANERG",
                "Sofia Romano, 268557, DISAT",
                "Andrea Gallo, 268558, DAUIN",
                "Lorenzo Esposito, 268559, DAT",
                "Silvia Martini, 268560, DANERG",
                "Claudia Fabbri, 268561, DISMA",
                "Marco Mancini, 268562, DISAT",
                "Giulia De Luca, 268563, DAD",
                "Alessio Barone, 268564, DAUIN",
                "Stefano Mariani, 268565, DAT",
                "Carlo Vitale, 268566, DANERG",
                "Carmela Greco, 268567, DISAT",
                "Roberto Santoro, 268568, DAUIN",
                "Sara Pagano, 268569, DAT",
                "Davide Colombo, 268570, DANERG",
                "Simone Gatti, 268571, DISMA",
                "Anna Ferri, 268572, DISAT",
            ],
            externals: [
                "Marco Rossi, REPLY",
                "Giulia Bianchi, OPENAI",
                "Alessio Ferrari, OCTOPUSENERGY",
                "Elena Ricci, STMICROELECTRONICS",
                "Luca Conti, THALES",
            ],
        });
    });



});
