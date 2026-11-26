import nodemailer from 'nodemailer';
import config from '../config';

const emailSender = async (email: string, html: string, subject = 'Reset Password Link') => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS on 587; certificates are verified
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio dashboard" <${config.emailSender.email}>`,
    to: email,
    subject,
    html,
  });
};

export default emailSender;
