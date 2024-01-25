const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thesismanagementnoreply@gmail.com',
    pass: 'rbvyjpnwmwkgsilb', // this should not be here....
  },
});

/* 

 @emails:
 
 sender: thesismanagementnoreply@gmail.com

 student: thesismanagementstudent@gmail.com

 professor: thesismanagementteacher@gmail.com


*/

// general.js
// curly braces to create new scopes and reuse the same name, afterl all we can only enter in one case of the switch
const buildEmail = (type, data) => {
  switch (type) {
      case 'application-decision': {
        const { studentName, thesisTitle, decision } = data;
        const text = `Dear ${studentName},\n\nYour application for the thesis "${thesisTitle}" has been ${decision === 'accepted' ? 'ACCEPTED' : decision === 'canceled' ? 'CANCELED' : 'REJECTED'}.\n\nBest regards,\nThe Thesis Management Team`;
        const to = 'thesismanagementstudent@gmail.com';
        return { text, to };
      }
    
      case 'application-sent': {
        const { teacherName, studentName, studentId, thesisTitle } = data;
        const text = `Dear ${teacherName},\n\nA new application request for your thesis "${thesisTitle}" has been submitted by ${studentName} (${studentId}).\n\nBest regards,\nThe Thesis Management Team`;
        const to = "thesismanagementteacher@gmail.com"
        return { text, to };
      }

    // Add more cases for other types as needed
    default:
      return { text: '', to: '' }; // Default case if the type is not recognized
  }
};

const sendEmail = async (req, res) => {
  const { subject, type, ...data } = req.body; //...data since we will have different kinds of notifications

  // Use these parameters to build the email text and recipient's email address
  const { text, to } = buildEmail(type, data);

  const mailOptions = {
    from: 'thesismanagementnoreply@gmail.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

const sendEmailInternal = async (emailData) => {
  const { subject, type, ...data } = emailData; //...data since we will have different kinds of notifications

  // Use these parameters to build the email text and recipient's email address
  const { text, to } = buildEmail(type, data);

  const mailOptions = {
    from: 'thesismanagementnoreply@gmail.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = { sendEmail, buildEmail, sendEmailInternal };