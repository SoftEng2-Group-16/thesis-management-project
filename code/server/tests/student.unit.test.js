// studentController.test.js

const dayjs = require('dayjs');
const { insertNewApplication } = require('../routes/controller/student.js');
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
