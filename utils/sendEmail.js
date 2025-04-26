const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async ({to, subject, text}) => {
    console.log('Sending email to:', to);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_EMAIL,  
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Bookstore Bliss" <${process.env.SMTP_EMAIL}>`,
    to: to,
    subject: subject,
    text: text,
  };

  console.log('Mail options:', to);
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
} catch (error) {
    console.error('Error sending email:', error);
}};

module.exports = sendEmail;
