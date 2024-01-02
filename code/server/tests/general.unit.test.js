// general.test.js

const general = ("../routes/controller/general.js"); 
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('sendEmail', () => {
    let mockRequest;
    let mockResponse;
  
    beforeEach(() => {
      mockRequest = {
        body: {
          subject: 'Test Subject',
          type: 'application-decision',
          studentName: 'John Doe',
          thesisTitle: 'Test Thesis',
          decision: 'accepted',
        },
      };
  
      mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(),
      };
  
      nodemailer.createTransport.mockReturnValue({
        sendMail: jest.fn(() => Promise.resolve({ response: 'Mocked response' })),
      });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should send an email successfully for application-decision', async () => {
      await general.sendEmail(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Email sent successfully.',
      });
    });
  
    test('should handle an error during email sending', async () => {
      const error = new Error('Email sending failed');
      nodemailer.createTransport.mockReturnValueOnce({
        sendMail: jest.fn(() => Promise.reject(error)),
      });
  
      await general.sendEmail(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error.',
      });
    });
  
    test('should handle an unknown email type', async () => {
      mockRequest.body.type = 'unknown-type';
  
      await general.sendEmail(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Email sent successfully.',
      });
    });
  
    // Add more test cases for different scenarios, edge cases, and validations.
  });
  
  describe('buildEmail', () => {
    test('should build email for application-decision', () => {
      const data = {
        studentName: 'John Doe',
        thesisTitle: 'Test Thesis',
        decision: 'accepted',
      };
  
      const result = general.buildEmail('application-decision', data);
  
      expect(result.text).toContain('John Doe');
      expect(result.text).toContain('Test Thesis');
      expect(result.text).toContain('ACCEPTED');
      expect(result.to).toBe('thesismanagementstudent@gmail.com');
    });
  
    test('should build email for application-sent', () => {
      const data = {
        teacherName: 'Jane Smith',
        studentName: 'John Doe',
        studentId: '123',
        thesisTitle: 'Test Thesis',
      };
  
      const result = general.buildEmail('application-sent', data);
  
      expect(result.text).toContain('Jane Smith');
      expect(result.text).toContain('John Doe');
      expect(result.text).toContain('123');
      expect(result.text).toContain('Test Thesis');
      expect(result.to).toBe('thesismanagementteacher@gmail.com');
    });
  
    // Add more test cases for different types as needed.
  });