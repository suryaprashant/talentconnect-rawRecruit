import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";

export const sendOtpEmail = async (to, otp) => {
  const msg = {
    to,
    from: `Rawrecruit Security <${sender}>`,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #667eea;">Verify Your Email</h2>
        <p>Thank you for signing up with Rawrecruit. Please use the following One-Time Password (OTP) to complete your registration:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
        </div>
        <p>This code is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Best Regards,<br/>Team Rawrecruit</p>
      </div>
    `
  };
  await sgMail.send(msg);
};
