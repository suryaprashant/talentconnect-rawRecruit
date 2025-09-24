// utils/sendStatusChangeEmail.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    },
});

/**
 * Send an email to user when their application status changes.
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} status - New application status
 * @param {string} [appId] - Optional application ID
 */
const sendStatusChangeEmail = async (to, status, appId, jobRole, companyName) => {
    const mailOptions = {
        from: `<${process.env.MAIL_USER}>`,
        to,
        subject: "Your Application Status Has Changed",
        html: `
      <p>Dear Candidate,</p>
      <p>Your application${appId ? ` (ID: ${appId})` : ''} for job-role: ${jobRole} at ${companyName} status has been updated to: <strong>${status}</strong>.</p>
      <p>Please log in to your account for more details.</p>
      <p>Thanks</p>
    `
    };

    await transporter.sendMail(mailOptions);
};

export default sendStatusChangeEmail;