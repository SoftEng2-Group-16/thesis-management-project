const nodemailer = require('nodemailer');

// Nodemailer configuration
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thesismanagementnoreply@polito.it', // Replace with your mock email address
      pass: 'rbvyjpnwmwkgsilb', // this should not be here....
    },
  });

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'noreply@example.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Internal server error.' };
  }
};

module.exports = { sendEmail };
