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


NOW:
As a Student
I want to be notified when a decision on my application on a thesis proposal is taken
 
As a Professor
  I want to be notified when a new application is sent 
  So that I can evaluate it

THEN:


 
As a Professor
  I want to be notified when a new thesis request is made by a student with me as supervisor
  So that I can accept or reject it


 TODO A switch case to build the emails will serve well in this case
*/

// general.js
// curly braces to create new scopes and reuse the same name, afterl all we can only enter in one case of the switch
const buildEmail = (type, data) => {
  switch (type) {
      case 'application-decision': {
        let { studentName, thesisTitle, decision } = data;
        let text = `Dear ${studentName},\n\nYour application for the thesis "${thesisTitle}" has been ${decision === 'accepted' ? 'ACCEPTED' : 'REJECTED'}.\n\nBest regards,\nThe Thesis Management Team`;
        let to = 'thesismanagementstudent@gmail.com';
        return { text, to };
      }
    
      case 'application-sent': {
        let { professorName, studentName, studentId, thesisTitle } = data;
        let text = `Dear ${professorName},\n\nA new application for you thesis "${thesisTitle}" has been submitted by ${studentName} (${studentId}).\n\nBest regards,\nThe Thesis Management Team`;
        let to = "thesismanagementteacher@gmail.com"
        return { text, to };
      }


    return { text, to };
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
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

module.exports = { sendEmail };