import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER, 
    pass: process.env.EMAIL_KEY
  }
});

export default async function sendEmail(to: string,subject: string, text: string,type: string) {
  const mailOptions = {
    to,
    subject,
    text,
    headers: {
      'Content-Type': type,
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
