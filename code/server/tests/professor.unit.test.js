"use strict";

const daoTeacher = require("../daoTeacher.js");
const daoStudent = require("../daoStudent.js");
const daoGeneral = require("../daoGeneral.js");
const professorApi = require("../routes/controller/professor.js")



jest.mock('../daoTeacher'); // Mock the daoTeacher module
jest.mock('../daoStudent'); // Mock the daoTeacher module
jest.mock('../daoGeneral'); // Mock the daoTeacher module
/*
 -- TEMPLATE --
 IMPORT ALL THE RELATIVE MODULES TO MOCK ON TOP
 USE THE NAME OF THE API IN THE describe BLOCK
 EXPLOIT BEFOREACH AND AFTEREACH TO MOCK THE NECESSARY FOR THE BLOCK TO AVOI DUPLICATIONS
 STICK TO MOCKrESOLVE, MOCKREJECT, FORGET SPYON SYNTAX

 */
describe('getPossibleCosupervisors', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get possible cosupervisors successfully', async () => {
    const internals = [
      { name: 'John', surname: 'Doe', id: '123', department_code: 'DAD' },
      // Add more internal professor objects as needed
    ];
    const externals = [
      { name: 'Jane', surname: 'Smith', company: 'TestCompany' },
      // Add more external professor objects as needed
    ];

    daoTeacher.getProfessors.mockResolvedValueOnce(internals);
    daoTeacher.getExternals.mockResolvedValueOnce(externals);

    await professorApi.getPossibleCosupervisors(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      internals: ['John Doe, 123, DAD'],
      externals: ['Jane Smith, TESTCOMPANY']
    });
  });

  test('should handle no internal professors found', async () => {
    daoTeacher.getProfessors.mockResolvedValueOnce({ error: 'No internal professors found' });

    await professorApi.getPossibleCosupervisors(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No internal professors found' });
  });

  test('should handle no external professors found', async () => {
    daoTeacher.getProfessors.mockResolvedValueOnce([]);
    daoTeacher.getExternals.mockResolvedValueOnce({ error: 'No external professors found' });

    await professorApi.getPossibleCosupervisors(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No external professors found' });
  });

  test('should handle an error during the process', async () => {
    const error = new Error('Some error');
    daoTeacher.getProfessors.mockRejectedValueOnce(error);

    await professorApi.getPossibleCosupervisors(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });

});

describe('insertNewProposal', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        title: 'Test Proposal',
        supervisor: 'John Doe, 123, DAD',
        cosupervisors: ['Jane Smith, 456, DISMA'],
        keywords: 'test, proposal',
        type: 'Thesis',
        description: 'Test description',
        requirements: 'Test requirements',
        notes: 'Test notes',
        expiration: '31/12/2023',
        level: 'Master',
        cds: ['LM-1', 'LM-2']
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

  test('should insert a new proposal successfully', async () => {
    daoTeacher.getGroupForTeacherById.mockResolvedValueOnce('Test Group');
    daoTeacher.saveNewProposal.mockResolvedValueOnce(1);

    await professorApi.insertNewProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(1);
  });

  test('should handle an error during proposal insertion', async () => {
    const error = new Error('Some error');
    daoTeacher.getGroupForTeacherById.mockResolvedValueOnce('Test Group');
    daoTeacher.saveNewProposal.mockRejectedValueOnce(error);

    await professorApi.insertNewProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });

});

describe('getDegreesInfo', () => {
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get degrees info successfully', async () => {
    const degrees = [
      { code: 'LM-1', name: 'Computer Engineering' },
      // Add more degree objects as needed
    ];

    daoTeacher.getDegrees.mockResolvedValueOnce(degrees);

    await professorApi.getDegreesInfo(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(degrees);
  });

  test('should handle no degrees found', async () => {
    daoTeacher.getDegrees.mockResolvedValueOnce({ error: 'No degrees found' });

    await professorApi.getDegreesInfo(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No degrees found' });
  });

  test('should handle an error during the process', async () => {
    const error = new Error('Some error');
    daoTeacher.getDegrees.mockRejectedValueOnce(error);

    await professorApi.getDegreesInfo(null, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });

});

describe("getAllApplicationsByProf", () => {
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
    daoTeacher.getAllApplicationsByProf.mockResolvedValue(applications);
    daoStudent.getStudentById.mockResolvedValue(studentInfo);
    daoGeneral.getThesisProposalById.mockResolvedValue(thesisInfo);

    let res = { enhancedApplications: [{ ...applications[0], studentInfo, thesisInfo }] };

    await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(res);
  });

  test("should return error if no applications found for the teacher", async () => {
    let noAppls = { error: 'No Applications found for professor ' + mockRequest.user.id }
    daoTeacher.getAllApplicationsByProf.mockResolvedValue(noAppls);

    await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(noAppls);
  });

  test("should handle other errors", async () => {
    let error = new Error('Some other error');
    daoTeacher.getAllApplicationsByProf.mockRejectedValue(error);

    await professorApi.getAllApplicationsByProf(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });
})

describe("decideApplication()", () => {
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
    let res = { id: mockRequest.params.thesisId, status: 'accepted' };
    const proposal = {
      id: 1,
      title: "AI-Driven Healthcare Solutions",
      supervisor: "268553, Maria Rossi",
      cosupervisors: [
        "Luigi Bianchi, 268554, DAUIN"
      ],
      keywords: [
        "Artificial Intelligence",
        " Healthcare",
        " Machine Learning"
      ],
      type: "Company Thesis",
      groups: [
        "SO",
        "AI"
      ],
      description: "Develop AI-powered healthcare solutions for diagnosing diseases.",
      requirements: "Machine Learning, Medical Science, Data Analysis",
      notes: "This project focuses on leveraging AI for healthcare advancements.",
      expiration: "20/11/2024",
      level: "bachelor",
      cds: [
        "LT-2",
        "LT-3"
      ]
    };
  

    daoTeacher.acceptApplication.mockResolvedValue(res);
    daoGeneral.cancellPendingApplicationsForAThesis.mockResolvedValue();
    daoGeneral.cancellPendingApplicationsOfAStudent.mockResolvedValue();
    daoGeneral.getThesisProposalById.mockResolvedValueOnce(proposal);
    daoTeacher.archiveProposal.mockResolvedValueOnce();
    daoTeacher.deleteProposal.mockResolvedValue();

    await professorApi.decideApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(res);
  });

  test("should successfully reject an application", async () => {
    mockRequest.body.decision = 'rejected';
    let res = { id: mockRequest.params.thesisId, status: 'rejected' };

    daoTeacher.rejectApplication.mockResolvedValue(res);

    await professorApi.decideApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(res);
  });

  test("should return error if invalid decision", async () => {
    mockRequest.body.decision = 'being confused';
    let err = { error: "Invalid decision field" };

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
    let err = { error: "not valid thesisId" };

    await professorApi.decideApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith(err);
  });

  test("should handle other errors during acceptance", async () => {
    let error = new Error('Some other error');
    daoTeacher.acceptApplication.mockRejectedValue(error);

    await professorApi.decideApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });

  test("should handle other errors during rejection", async () => {
    mockRequest.body.decision = 'rejected';
    let error = new Error('Some other error');
    daoTeacher.rejectApplication.mockRejectedValue(error);

    await professorApi.decideApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });
})

describe("getOwnProposals()", () => {
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

  test("should return successfully the proposals of the teacher", async () => {
    const proposals = [
      {
        id: 1,
        title: "AI-Driven Healthcare Solutions",
        supervisor: "268553, Maria Rossi",
        cosupervisors: [
          "Luigi Bianchi, 268554, DAUIN"
        ],
        keywords: [
          "Artificial Intelligence",
          " Healthcare",
          " Machine Learning"
        ],
        type: "Company Thesis",
        groups: [
          "SO",
          "AI"
        ],
        description: "Develop AI-powered healthcare solutions for diagnosing diseases.",
        requirements: "Machine Learning, Medical Science, Data Analysis",
        notes: "This project focuses on leveraging AI for healthcare advancements.",
        expiration: "20/11/2024",
        level: "bachelor",
        cds: [
          "LT-2",
          "LT-3"
        ]
      }
    ];

    daoTeacher.getOwnProposals.mockResolvedValueOnce(proposals);

    await professorApi.getOwnProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(proposals);
  });

  test("should return error if no proposals found", async () => {
    let error = { error: `No thesis proposals found for teacher ${mockRequest.user.id}` };

    daoTeacher.getOwnProposals.mockResolvedValueOnce(error);

    await professorApi.getOwnProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(error);
  });

  test("should handle other errors", async () => {
    const error = new Error('Some error');
    daoTeacher.getOwnProposals.mockRejectedValueOnce(error);

    await professorApi.getOwnProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });

})

describe("updateThesisProposal", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '268553'
      },
      params: {
        thesisid: 2
      },
      body: {
        "id": 2,
        "title": "test title2",
        "supervisor": "268553, Name Surname",
        "cosupervisors": ["Luigi Bianchi, 268554, DAUIN"],
        "keywords": "test1, test2",
        "type": "Abroad Thesis",
        "groups": [],
        "description": "test description",
        "requirements": "test requirements",
        "notes": "test notes",
        "expiration": "31/12/2023",
        "level": "master",
        "cds": ["LM-1", "LM-2"]
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

  test("should successfully update a thesis proposal", async () => {
    daoTeacher.getGroupForTeacherById.mockResolvedValueOnce('cosupervisor Group');
    daoTeacher.getGroupForTeacherById.mockResolvedValueOnce('supervisor Group');
    daoTeacher.getAllApplicationsByThesisId.mockResolvedValueOnce([]);
    daoTeacher.updateThesisProposal.mockResolvedValueOnce(mockRequest.body);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
  });
  test("should handle missing authentication", async () => {
    mockRequest.user.id = null;

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "problem with the authentication" });
  });

  test("should handle param and body id mismatch", async () => {
    mockRequest.body.id = 456;

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'URL and body id mismatch' });
  });

  test('should handle an error during group information retrieval', async () => {
    const message = { error: 'Prolem while retrieving group info for teacher 268554' };
    daoTeacher.getGroupForTeacherById.mockResolvedValueOnce(message);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(message);
  });

  test("should handle already accepted thesis error", async () => {
    const mockAcceptedThesis = [{status: "accepted"}];
    daoTeacher.getGroupForTeacherById.mockResolvedValue('Test Group');
    daoTeacher.getAllApplicationsByThesisId.mockResolvedValueOnce(mockAcceptedThesis);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'already accepted/pending application for the thesis' });
  });

  test("should handle already pending thesis error", async () => {
    const mockAcceptedThesis = [{status: "pending"}];
    daoTeacher.getGroupForTeacherById.mockResolvedValue('Test Group');
    daoTeacher.getAllApplicationsByThesisId.mockResolvedValueOnce(mockAcceptedThesis);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(405);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'already accepted/pending application for the thesis' });
  });

  test("should handle thesis not found error", async () => {
    let message = { error: 'thesis not found.' }
    daoTeacher.getGroupForTeacherById.mockResolvedValue('Test Group');
    daoTeacher.getAllApplicationsByThesisId.mockResolvedValueOnce([]);
    daoTeacher.updateThesisProposal.mockResolvedValueOnce(message);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(message);
  });

  test("should handle database error during thesis update", async () => {
    const mockError = new Error('Database error');
    daoTeacher.getGroupForTeacherById.mockResolvedValue('Test Group');
    daoTeacher.getAllApplicationsByThesisId.mockResolvedValueOnce([]);
    daoTeacher.updateThesisProposal.mockRejectedValueOnce(mockError);

    await professorApi.updateThesisProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: `Database error during the update of thesis 2: ${mockError}` });
  });
});

describe("deleteProposal()", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: '268555'
      },
      params: {
        proposalid: '3'
      },
    };

    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test("should successfully delete the proposal", async () => {

    daoGeneral.getThesisProposalById.mockResolvedValue(thesisInfo);
    daoGeneral.cancellPendingApplicationsForAThesis.mockResolvedValue();
    daoTeacher.deleteProposal.mockResolvedValue(1);

    await professorApi.deleteProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(1);
  });
  test("should handle invalid teacher ID", async () => {
    mockRequest.user = {}; // Simula un ID utente non valido

    await professorApi.deleteProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "problem with the authentication" });
  });

  test("should handle invalid proposal ID", async () => {
    mockRequest.params.proposalid = 'invalid_id'; // Simula un ID proposta non valido

    await professorApi.deleteProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "not valid proposalId" });
  });

  test("should handle proposal not found", async () => {
    daoGeneral.getThesisProposalById.mockResolvedValue({ error: "Proposal not found" });

    await professorApi.deleteProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Proposal not found" });
  });

  test("should handle internal server error", async () => {
    daoGeneral.getThesisProposalById.mockRejectedValue(new Error("Internal Server Error"));

    await professorApi.deleteProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith("Internal Server Error");
  });
})

describe("archiveProposal", () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        proposalId: 3,
      },
      user: {
        id: '268555',
      },
    };

    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const proposal = {
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
  };

  test("should successfully archive proposal", async () => {
    const applications = [{ status: 'pending', thesisId: 3, teacherId: '268555', studentId: '200001' }];

    daoGeneral.getThesisProposalById.mockResolvedValueOnce(proposal);
    daoTeacher.getApplicationsByThesisId.mockResolvedValueOnce(applications);
    daoTeacher.archiveProposal.mockResolvedValueOnce(1); // Successfully archived proposal
    daoTeacher.rejectApplication.mockResolvedValueOnce(); // Resolved reject application promise
    daoTeacher.deleteProposal.mockResolvedValueOnce(1); // Successfully deleted proposal

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(1);
  });

  test("should return 404 if proposal or applications not found", async () => {
    daoGeneral.getThesisProposalById.mockResolvedValueOnce({ error: 'Proposal not found' });
    daoTeacher.getApplicationsByThesisId.mockResolvedValueOnce({ error: 'Applications not found' });

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Proposal not found' });
  });

  test("should return 422 if an application was accepted", async () => {
    const proposal = { id: 3, supervisor: '268555' };
    const applications = [{ status: 'accepted' }];

    daoGeneral.getThesisProposalById.mockResolvedValueOnce(proposal);
    daoTeacher.getApplicationsByThesisId.mockResolvedValueOnce(applications);

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: `Something went wrong: an application was accepted for proposal ${proposal.id}, should be already archived`,
    });
  });

  test("should return 401 if user not authorized to archive", async () => {
    const proposal = { id: 3, supervisor: '268555' };
    const applications = [{ status: 'pending' }];
    mockRequest.user.id = '268553';

    daoGeneral.getThesisProposalById.mockResolvedValueOnce(proposal);
    daoTeacher.getApplicationsByThesisId.mockResolvedValueOnce(applications);

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      "error": `User ${mockRequest.user.id} cannot archive proposal ${proposal.id}: NOT OWNED`
    });
  });

  test("should return 500 if encountered some problems", async () => {
    const applications = [{ status: 'pending', thesisId: 3, teacherId: '268555', studentId: '200001' }];

    daoGeneral.getThesisProposalById.mockResolvedValueOnce(proposal);
    daoTeacher.getApplicationsByThesisId.mockResolvedValueOnce(applications);
    daoTeacher.archiveProposal.mockResolvedValueOnce(1);
    daoTeacher.rejectApplication.mockResolvedValueOnce();
    daoTeacher.deleteProposal.mockResolvedValueOnce(2);

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Problem encountered while archiving proposal" });
  });

  test("should handle internal server error", async () => {
    daoGeneral.getThesisProposalById.mockRejectedValue(new Error("Internal Server Error"));

    await professorApi.archiveProposal(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith("Internal Server Error");
  });
});
