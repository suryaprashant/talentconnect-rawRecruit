import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendStatusChangeEmail = async (to, status, appId, jobRole, companyName = "") => {
  const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";
  const msg = {
    to,
    from: `<${sender}>`,
    subject: "Your application status has changed",
    html: `
      <p>Dear Candidate,</p>
      <p>Your application${appId ? ` (ID: ${appId})` : ''} for <strong>${jobRole}</strong> ${companyName ? ` at ${companyName}` : ''} status has been updated to: <strong>${status}</strong>.</p>
      <p>Please log in to your account for more details.</p>
      <p>Thanks</p>
      <p>From</p>
      <p>Team TalentConnect</p>
    `
  };
  await sgMail.send(msg);
};

export default sendStatusChangeEmail;