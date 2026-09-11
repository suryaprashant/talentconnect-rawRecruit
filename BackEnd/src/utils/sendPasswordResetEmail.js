import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";

export const sendPasswordResetEmail = async (to, resetLink, userName = null) => {
  const msg = {
    to,
    from: `Rawrecruit Support <${sender}>`,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #143694;">Password Reset Request</h2>
        ${userName ? `<p>Hi ${userName},</p>` : '<p>Hello,</p>'}
        <p>We received a request to reset your password for your Rawrecruit account.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #143694; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold;
                    display: inline-block; border: none;">
            Reset Your Password
          </a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <div style="background: #f4f4f4; padding: 12px; border-radius: 6px; margin: 15px 0;">
          <code>${resetLink}</code>
        </div>
        
        <p><strong>This link will expire in 15 minutes.</strong></p>
        
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <p>Best Regards,<br/>Team Rawrecruit</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>For security reasons, this link can only be used once. If you need another reset link, 
          please submit a new password reset request.</p>
        </div>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('Password reset email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('SendGrid Error sending password reset email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send password reset email');
  }
};

export const sendPasswordChangedConfirmation = async (to, userName = null) => {
  const msg = {
    to,
    from: `Rawrecruit Security <${sender}>`,
    subject: "Password Changed Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #43e97b;">Password Updated Successfully</h2>
        ${userName ? `<p>Hi ${userName},</p>` : '<p>Hello,</p>'}
        <p>Your Rawrecruit account password has been successfully changed.</p>
        
        <div style="background: #f0f9ff; border-left: 4px solid #143694; padding: 15px; margin: 20px 0;">
          <p><strong>Security Tips:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Use a strong, unique password</li>
            <li>Never share your password with anyone</li>
            <li>Enable two-factor authentication if available</li>
            <li>Log out from shared devices</li>
          </ul>
        </div>
        
        <p>If you did not make this change, please contact our support team immediately.</p>
        
        <p>Best Regards,<br/>Team Rawrecruit</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log('Password change confirmation sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('SendGrid Error sending confirmation:', error);

    return { success: false };
  }
};