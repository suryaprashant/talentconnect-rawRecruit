// utils/sendInvitationEmail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP credentials
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendInvitationEmail = async (to, name) => {
  const mailOptions = {
    from: `"Hackathon Team" <${process.env.MAIL_USER}>`,
    to,
    subject: "You've been invited to join a Hackathon team!",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>You’ve been added as a team member to a Hackathon project.</p>
      <p>Please contact your team leader for more details.</p>
      <p>Thanks,<br/>Hackathon Organizers</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendInvitationEmail;
