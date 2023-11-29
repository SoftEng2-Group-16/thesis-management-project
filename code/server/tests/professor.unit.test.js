"use strict";

const dao = require("../dao.js");
const professorApi = require("../routes/controller/professor.js")


jest.mock('../dao'); // Mock the dao module

describe("Professor tests", () => {
    // Mock delle implementazioni specifiche per professorAPI
    beforeEach(() => {
        jest.clearAllMocks();
    });
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

    test("should insert a new proposal", async () => {
        const req = {
            body: {
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        dao.getAllApplicationsByProf = jest.fn((id) => new Promise((resolve) => resolve(["ED"])))
        
        await professorApi.getAllApplicationsByProf(req, res);


        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith("8");
    });

});

describe("Professor sees list of applications", () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
          user: {
            id: '268553'
          }
        };
    
        mockResponse = {
          status: jest.fn(() => mockResponse),
          json: jest.fn()
        };
      });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    let applications = [
        {
            "studentId": 200001,
            "thesisId": 3,
            "timestamp": "08/11/2023 16:42:50",
            "status": "pending",
            "teacherId": 268553,
        }
    ];

    let studentInfo = {
        "id": 200001,
        "surname": "Rossi",
        "name": "Mario",
        "gender": "M",
        "nationality": "Italian",
        "email": "mario.rossi@studenti.polito.it",
        "degreeCode": "LM-1",
        "enrollmentYear": "2010"
    };

    let thesisInfo = {
        "id": 3,
        "title": "Blockchain Technology and Cryptocurrencies",
        "supervisor": "268555, Ferrari Giovanna",
        "cosupervisors": [
            "Maria Rossi, 268553, DAD",
            "Luigi Bianchi, 268554, DAUIN"
        ],
        "keywords": [
            "Blockchain",
            " Cryptocurrency",
            " Security"
        ],
        "type": "Company Thesis",
        "groups": [
            "AI",
            "SO",
            "SE"
        ],
        "description": "Explore the potential of blockchain technology and cryptocurrencies.",
        "requirements": "Blockchain Development, Security, Financial Technology",
        "notes": "This project focuses on the security and applications of blockchain and cryptocurrencies.",
        "expiration": "31/12/2023",
        "level": "master",
        "cds": [
            "LM-1",
            "LM-2",
            "LM-3"
        ]
    }

    test("should retrieve the list of applications successfully", async () => {
        dao.getAllApplicationsByProf.mockResolvedValue(applications);
        dao.getStudentById.mockResolvedValue(studentInfo);
        dao.getThesisProposalById.mockResolvedValue(thesisInfo);
        
        let res = {enhancedApplications: [{...applications[0], studentInfo, thesisInfo}]};
        
        await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(res);
    });

    test("should return error if no applications found for the teacher", async () => {
        let noAppls = { error: 'No Applications found for professor ' + mockRequest.user.id }
        dao.getAllApplicationsByProf.mockResolvedValue(noAppls);
        
        await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(noAppls);
    });

    test("should handle other errors", async () => {
        let error = new Error('Some other error');
        dao.getAllApplicationsByProf.mockRejectedValue(error);

        await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(error.message);
    });
})

describe("Professor accepts or rejects application", () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockRequest = {
          user: {
            id: '268554'
          },
          params: {
            thesisid: '27'
          },
          body: {
            decision: 'accepted', studentId: '200006'
          }
        };
    
        mockResponse = {
          status: jest.fn(() => mockResponse),
          json: jest.fn()
        };
      });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should successfully accept an application", async () => {
        let res = { id: mockRequest.params.thesisId, status: 'accepted'};

        dao.acceptApplication.mockResolvedValue(res);
        dao.cancellPendingApplicationsForAThesis.mockResolvedValue();
        dao.cancellPendingApplicationsOfAStudent.mockResolvedValue();

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(res);
    });

    test("should successfully reject an application", async () => {
        mockRequest.body.decision = 'rejected';
        let res = { id: mockRequest.params.thesisId, status: 'rejected'};

        dao.rejectApplication.mockResolvedValue(res);

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(res);
    });

    test("should return error if invalid decision", async () => {
        mockRequest.body.decision = 'being confused';
        let err = {error: "Invalid decision field"};

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    test("should return error if undefined teacherid", async () => {
        mockRequest.user = {};
        let err = { error: "problem with the authentication" };

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(503);
        expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    test("should return error if empty decision in body", async () => {
        mockRequest.body.decision = '';
        let err = { error: "decision is missing in body" };

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    test("should return error if empty studentId in body", async () => {
        mockRequest.body.studentId = '';
        let err = { error: "studentId is missing in body" };

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    test("should return error if invalid param thesisid", async () => {
        mockRequest.params = {};
        let err = { error: "thesisId non valido" };

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(422);
        expect(mockResponse.json).toHaveBeenCalledWith(err);
    });

    test("should handle other errors during acceptance", async () => {
        let error = new Error('Some other error');
        dao.acceptApplication.mockRejectedValue(error);

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(error.message);
    });

    test("should handle other errors during rejection", async () => {
        mockRequest.body.decision = 'rejected';
        let error = new Error('Some other error');
        dao.rejectApplication.mockRejectedValue(error);

        await professorApi.decideApplication(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(error.message);
    });
})