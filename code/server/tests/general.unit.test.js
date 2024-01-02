const { sendEmail, buildEmail } = require('../routes/controller/general.js');
const nodemailer = require('nodemailer');

// Mock the nodemailer module
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
      // Simulate successful email sending
      if (typeof callback === 'function') {
        callback(null, { response: 'mocked-response' });
      }

      // Return a resolved promise for successful email sending
      return Promise.resolve({ response: 'mocked-response' });
    }),
  }),
}));

describe('sendemail', () => {
  test('sendEmail - success', async () => {
    const req = {
      body: {
        subject: 'Test Subject',
        type: 'application-decision',
        studentName: 'John Doe',
        thesisTitle: 'Sample Thesis',
        decision: 'accepted',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the function and wait for it to complete
    await sendEmail(req, res);

    // Expectations for success
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Email sent successfully.',
    });
  });

  test('sendEmail - error', async () => {
    const req = {
      body: {
        subject: 'Test Subject',
        type: 'application-decision',
        studentName: 'John Doe',
        thesisTitle: 'Sample Thesis',
        decision: 'accepted',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the sendMail method to simulate an error
    nodemailer.createTransport().sendMail.mockImplementationOnce((mailOptions, callback) => {
      // Simulate an error by rejecting the promise
      if (typeof callback === 'function') {
        callback(new Error('Email sending failed'));
      }

      return Promise.reject(new Error('Email sending failed'));
    });

    // Call the function and wait for it to complete
    await sendEmail(req, res);

    // Expectations for error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Internal server error.',
    });
  });
});

describe(' build Email', () => {
  test('buildEmail - application-decision', () => {
    const data = {
      studentName: 'John Doe',
      thesisTitle: 'Sample Thesis',
      decision: 'accepted',
    };
    const result = buildEmail('application-decision', data);
    expect(result.text).toContain('ACCEPTED');
    expect(result.to).toBe('thesismanagementstudent@gmail.com');
  });

  test('buildEmail - application-sent', () => {
    const data = {
      teacherName: 'Dr. Smith',
      studentName: 'Jane Doe',
      studentId: '12345',
      thesisTitle: 'Another Thesis',
    };
    const result = buildEmail('application-sent', data);
    expect(result.text).toContain('A new application request');
    expect(result.to).toBe('thesismanagementteacher@gmail.com');
  });

  test('buildEmail - unknown type', () => {
    const result = buildEmail('unknown-type', {});
    expect(result.text).toBe('');
    expect(result.to).toBe('');
  });

  
});