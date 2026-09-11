
import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendInvitationEmail = async (to, name) => {
  const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";
  const msg = {
    to,
    from: `Hackathon Team <${sender}>`,
    subject: "You've been invited to join a Hackathon team!",
    html: `
      <p>Hi ${name || "there"},</p>
      <p>You’ve been added as a team member to a Hackathon project.</p>
      <p>Please contact your team leader for more details.</p>
      <p>Thanks,<br/>Hackathon Organizers</p>
    `
  };
  await sgMail.send(msg);
};

export default sendInvitationEmail;
