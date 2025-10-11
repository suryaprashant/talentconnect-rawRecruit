import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendScheduledInterviewEmail = async (to, date, time, message, meetLink, jobRole, companyName) => {
    const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";
    const msg = {
        to,
        from: `<${sender}>`,
        subject: `Interview Scheduled for ${jobRole} at ${companyName} on ${date}`,
        html: `
        <p>Dear Candidate,</p>

        <p>We are pleased to inform you that your interview for the <strong>${jobRole}</strong> position at <strong>${companyName}</strong> has been scheduled.</p>

        <p><strong>Date:</strong> ${date}<br/>
        <strong>Time:</strong> ${time} (24-hour clock)<br/>
        <strong>Meeting Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></p>

        ${message ? `<p>Additional Message: ${message}</p>` : ''}

        <p>Please ensure you are available on the scheduled date and time. If you have any questions or need to reschedule, feel free to contact us.</p>

        <p>Thank you</p>
        <p>Team TalentConnect</p>
        `
    };
    await sgMail.send(msg);
};

export default sendScheduledInterviewEmail;