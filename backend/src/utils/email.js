import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Using ethereal for dev testing. In production, use SendGrid/AWS SES.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER || 'test_user',
      pass: process.env.EMAIL_PASS || 'test_pass',
    },
  });

  const mailOptions = {
    from: 'Women Safety App <noreply@womensafety.app>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
