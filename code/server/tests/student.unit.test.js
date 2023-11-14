"use strict";

//const jwt = require('jsonwebtoken');
const dao = require('../dao.js');
const { insertNewApplication } = require('../routes/controller/student.js');

/**
 * Defines code to be executed before each test case is launched
 * In this case the mock implementation of `User.find()` is cleared, allowing the definition of a new mock implementation.
 * Not doing this `mockClear()` means that test cases may use a mock implementation intended for other test cases.
 */
beforeEach(() => {
    jest.clearAllMocks()
});

describe("Insert new thesis Application", () => {
    test("Should successfully insert new application", async () => {
        const mockReq = {
            body: {"studentId": "200001", "proposalId": "45"},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
        const changes = 1;
        jest.spyOn(dao, 'addApplicationForThesis').mockResolvedValue(changes);

        await insertNewApplication(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(changes);
    });

    test("Should return error if student already applied", async () => {
        const mockReq = {
            body: {"studentId": "200001", "proposalId": "45"},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const response = "Application already submitted, wait for professor response";
        jest.spyOn(dao, 'addApplicationForThesis').mockRejectedValue(new Error('{ message: "SQLITE_CONSTRAINT" }'));

        await insertNewApplication(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(response);
    });

    test("Should return error if db failed", async () => {
        const mockReq = {
            body: {"studentId": "200001", "proposalId": "45"},
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const response = "DB failed for some reason";
        jest.spyOn(dao, 'addApplicationForThesis').mockRejectedValue(new Error('DB failed for some reason'));

        await insertNewApplication(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(response);
    });
});