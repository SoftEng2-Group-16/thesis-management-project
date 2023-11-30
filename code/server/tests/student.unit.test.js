// studentController.test.js

const dayjs = require('dayjs');
const { insertNewApplication, getApplicationsForStudent, getThesisProposals } = require('../routes/controller/student.js'); //import the api to mock
const dao = require('../dao');

// here we go again with jest

jest.mock('../dao'); // Mock the dao module

describe('tests for insertNewApplication', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        studentId: 'student123',
        proposalId: 'proposal456',
        teacherId: 'teacher789'
      },
      user: {
        id: 'student123'
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

  test('should insert a new application successfully', async () => {
    dao.addApplicationForThesis.mockResolvedValueOnce(1);

    await insertNewApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(1);
  });

  test('should handle a student not matching the logged-in user', async () => {
    mockRequest.user.id = 'differentStudent';

    await insertNewApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "the student who is sending the application is not the logged in one"
    });
  });

  test('should handle a SQLite constraint violation', async () => {
    const error = new Error('SQLITE_CONSTRAINT');
    dao.addApplicationForThesis.mockRejectedValueOnce(error);

    await insertNewApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      "Application already submitted, wait for professor response"
    );
  });

  test('should handle other errors', async () => {
    const error = new Error('Some other error');
    dao.addApplicationForThesis.mockRejectedValueOnce(error);

    await insertNewApplication(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });
});

describe('getApplicationsForStudent', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: 'student123'
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

  test('should get applications for a student successfully', async () => {
    const applications = [
      { id: 1, teacherId: 'teacher456', thesisId: 'thesis789', studentId: 'student123' },
      // Add more application objects as needed
    ];

    dao.getApplicationsForStudent.mockResolvedValueOnce(applications);
    dao.getTeacherById.mockResolvedValueOnce({ id: 'teacher456', name: 'John Doe' });
    dao.getThesisProposalById.mockResolvedValueOnce({ id: 'thesis789', title: 'Thesis Title' });
    dao.getStudentById.mockResolvedValueOnce({ id: 'student123', name: 'Student Name' });

    await getApplicationsForStudent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      enhancedApplications: [
        {
          id: 1,
          teacherId: 'teacher456',
          thesisId: 'thesis789',
          studentId: 'student123',
          teacherInfo: { id: 'teacher456', name: 'John Doe' },
          thesisInfo: { id: 'thesis789', title: 'Thesis Title' },
          studentInfo: { id: 'student123', name: 'Student Name' }
        },
        // Add more enhanced application objects as needed
      ]
    });
  });

  test('should handle no applications found for a student', async () => {
    dao.getApplicationsForStudent.mockResolvedValueOnce({ error: 'No applications found' });

    await getApplicationsForStudent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No applications found' });
  });

  test('should handle an error during the process', async () => {
    const error = new Error('Some error');
    dao.getApplicationsForStudent.mockRejectedValueOnce(error);

    await getApplicationsForStudent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });
});

describe('getThesisProposals', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      user: {
        degree_code: 'LM-1'
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

  test('should get thesis proposals for a student course successfully', async () => {
    const proposals = [
      { id: 1, title: 'Proposal 1', degreeCode: 'LM-1' },
      // Add more proposal objects as needed
    ];

    dao.getThesisProposals.mockResolvedValueOnce(proposals);

    await getThesisProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(proposals);
  });

  test('should handle no thesis proposals found for a student course', async () => {
    dao.getThesisProposals.mockResolvedValueOnce({ error: 'No thesis proposals found' });

    await getThesisProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No thesis proposals found' });
  });

  test('should handle an error during the process', async () => {
    const error = new Error('Some error');
    dao.getThesisProposals.mockRejectedValueOnce(error);

    await getThesisProposals(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(error.message);
  });
});
