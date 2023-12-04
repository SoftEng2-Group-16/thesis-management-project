// "use strict";

// //const jwt = require('jsonwebtoken');
// const dao = require('../dao.js');
// const { getThesisProposals } = require('../routes/controller/general');

// /**
//  * Defines code to be executed before each test case is launched
//  */
// beforeEach(() => {
//     jest.clearAllMocks()
// });

// describe("Student Get thesis proposals", () => {
//     test("Should successfully return thesis proposals", async () => {
//         const mockReq = {
//             user: { // need only this two field in this test case
//                 role: "student",
//                 degree_code: "LM-1"
//             }
//         };
//         const mockRes = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };
        
//         const proposals = [
//             {
//               "id": 3,
//               "title": "Blockchain Technology and Cryptocurrencies",
//               "supervisor": "268558",
//               "cosupervisors": [
//                 "45678,90123"
//               ],
//               "keywords": "Blockchain, Cryptocurrency, Security",
//               "type": "Company Thesis",
//               "groups": [
//                 "Blockchain Research Group, Security Research Group"
//               ],
//               "description": "Explore the potential of blockchain technology and cryptocurrencies.",
//               "requirements": "Blockchain Development, Security, Financial Technology",
//               "notes": "This project focuses on the security and applications of blockchain and cryptocurrencies.",
//               "expiration": "31-12-23",
//               "level": "master",
//               "cds": [
//                 "LM-1"
//               ]
//             }
//         ];

//         jest.spyOn(dao, 'getThesisProposals').mockResolvedValue(proposals);

//         await getThesisProposals(mockReq, mockRes);

//         expect(mockRes.status).toHaveBeenCalledWith(200);
//         expect(mockRes.json).toHaveBeenCalledWith(proposals);
//     });

//     test("Should return error if there is not any thesis proposal for degreeCode", async () => {
//         const mockReq = {
//             user: { // need only this two field in this test case
//                 role: "student",
//                 degree_code: "LM-25"
//             }
//         };
//         const mockRes = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };
        
//         const response = {error: `No thesis proposals found for study course LM-25`}

//         jest.spyOn(dao, 'getThesisProposals').mockResolvedValue(response);

//         await getThesisProposals(mockReq, mockRes);

//         expect(mockRes.status).toHaveBeenCalledWith(404);
//         expect(mockRes.json).toHaveBeenCalledWith(response);
//     });

//     test("Should return error if the db failed", async () => {
//         const mockReq = {
//             user: { // need only this two field in this test case
//                 role: "student",
//                 degree_code: "LM-25"
//             }
//         };
//         const mockRes = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

//         const response = "DB failed for some reason";
//         jest.spyOn(dao, 'getThesisProposals').mockRejectedValue(new Error('DB failed for some reason'));

//         await getThesisProposals(mockReq, mockRes);

//         expect(mockRes.status).toHaveBeenCalledWith(500);
//         expect(mockRes.json).toHaveBeenCalledWith(response);
//     });
// });