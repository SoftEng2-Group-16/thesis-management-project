"use strict";

//const insertNewProposal = require("../routes/controller/professor");
const dao = require("../dao.js");
const professorApi = require("../routes/controller/professor.js")

// Mock delle implementazioni specifiche per professorAPI
beforeEach(() => {
    jest.clearAllMocks();
});





/*
describe("Professor tests", () => {
    test("should insert a new proposal", async () => {
        const req = {
            body: {
                title: "Sample Title",
                supervisor: "123, John Doe",
                cosupervisors: ["Maria Rossi, 268553, DAD"],
                keywords: "Sample, Keywords",
                type: "Sample Type",
                groups: [""],
                description: "Sample Description",
                requirements: "Sample Requirements",
                notes: "Sample Notes",
                expiration: "01-01-2024", // Assuming date format is dd-mm-yyyy
                level: "master",
                cds: ["LM adha"],
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };



        jest.spyOn(dao, "getGroupForTeacherById").mockImplementation(async (id) => "ED");
        jest.spyOn(dao, "saveNewProposal").mockResolvedValue(27);


        await professorApi.insertNewProposal(req, res);


        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 27 });
    });
});
*/


describe("Professor tests", () => {
    test("should get degree info", async () => {
        const req = {
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.getDegrees = jest.fn(() => new Promise((resolve) => resolve(['LM-2 ita'])))

        await professorApi.getDegreesInfo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(['LM-2 ita']);
    });


    test("should get cosupervisors", async () => {
        const req = {
            body: {}
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        dao.getProfessors = jest.fn(() => new Promise((resolve) => resolve([{name:"maria",surname:"rossi",id:"213",department_code:"Dauin"}])))
        dao.getExternals =jest.fn(() => new Promise((resolve) => resolve([{name:"maria",surname:"rossi",company:"ED"}])))
        
        await professorApi.getPossibleCosupervisors(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({"externals": ["maria rossi, ED"], "internals": ["maria rossi, 213, Dauin"]});
    });

    test("should insert a new proposal", async () => {
        const req = {
            body: {
                title: "Sample Title",
                supervisor: "123, John Doe",
                cosupervisors: ["Maria Rossi, 268553, DAD"],
                keywords: "Sample, Keywords",
                type: "Sample Type",
                groups: [""],
                description: "Sample Description",
                requirements: "Sample Requirements",
                notes: "Sample Notes",
                expiration: "01-01-2024", // Assuming date format is dd-mm-yyyy
                level: "master",
                cds: ["LM adha"],
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        dao.getGroupForTeacherById = jest.fn((id) => new Promise((resolve) => resolve(["ED"])))
        dao.saveNewProposal =jest.fn(() => new Promise((resolve) => resolve("8")))
        
        await professorApi.insertNewProposal(req, res);


        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith("8");
    });
});



