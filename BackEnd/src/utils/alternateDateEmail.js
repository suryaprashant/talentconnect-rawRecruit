// import sgMail from "@sendgrid/mail";
// import dotenv from 'dotenv';
// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendAlternateDateEmailToCollege = async (to, collegeName, companyName, originalDates, alternateDates, jobRole) => {
//   const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";
  
//   const msg = {
//     to,
//     from: `<${sender}>`,
//     subject: `Alternate Dates Proposed for ${jobRole} at ${collegeName}`,
//     html: `
//       <p>Dear Placement Coordinator,</p>
      
//       <p>A company has proposed alternate dates for the on-campus drive.</p>
      
//       <p><strong>Company:</strong> ${companyName}</p>
//       <p><strong>Job Role:</strong> ${jobRole}</p>
//       <p><strong>College:</strong> ${collegeName}</p>
      
//       <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
//         <h4 style="margin-top: 0;">Original Proposed Dates:</h4>
//         <p><strong>Start Date:</strong> ${originalDates.startDate}</p>
//         <p><strong>End Date:</strong> ${originalDates.endDate}</p>
//       </div>
      
//       <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
//         <h4 style="margin-top: 0; color: #0066cc;">Alternate Dates Proposed:</h4>
//         <p><strong>Start Date:</strong> ${alternateDates.startDate}</p>
//         <p><strong>End Date:</strong> ${alternateDates.endDate}</p>
//       </div>
      
//       <p>Please log in to your TalentConnect account to review and respond to this proposal.</p>
      
//       <p>Best regards,</p>
//       <p>Team TalentConnect</p>
//     `
//   };
  
//   try {
//     await sgMail.send(msg);
//     return { success: true, message: "Alternate date email sent successfully to college" };
//   } catch (error) {
//     console.error("Error sending alternate date email:", error);
//     throw new Error("Failed to send alternate date email");
//   }
// };


import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate SendGrid configuration
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing from environment variables");
  throw new Error("SendGrid API key is required");
}

if (!process.env.SENDGRID_SENDER) {
  console.error("❌ SENDGRID_SENDER is missing from environment variables");
  throw new Error("SendGrid sender email is required");
}

// console.log("SendGrid API Key exists:", !!process.env.SENDGRID_API_KEY);
// console.log("SendGrid Sender:", process.env.SENDGRID_SENDER);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendAlternateDateEmailToCollege = async (to, collegeName, companyName, originalDates, alternateDates, jobRole) => {
  const sender = process.env.SENDGRID_SENDER;
  
  console.log("📧 Attempting to send email...");
  console.log("To:", to);
  console.log("From:", sender);
  console.log("Subject: Alternate Dates Proposed for", jobRole, "at", collegeName);

  const msg = {
    to,
    from: sender, // Remove the < > brackets, just use the email
    subject: `Alternate Dates Proposed for ${jobRole} at ${collegeName}`,
    html: `
      <p>Dear Placement Coordinator,</p>
      
      <p>A company has proposed alternate dates for the on-campus drive.</p>
      
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Job Role:</strong> ${jobRole}</p>
      <p><strong>College:</strong> ${collegeName}</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h4 style="margin-top: 0;">Original Proposed Dates:</h4>
        <p><strong>Start Date:</strong> ${originalDates.startDate}</p>
        <p><strong>End Date:</strong> ${originalDates.endDate}</p>
      </div>
      
      <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #0066cc;">Alternate Dates Proposed:</h4>
        <p><strong>Start Date:</strong> ${alternateDates.startDate}</p>
        <p><strong>End Date:</strong> ${alternateDates.endDate}</p>
      </div>
      
      <p>Please log in to your TalentConnect account to review and respond to this proposal.</p>
      
      <p>Best regards,</p>
      <p>Team TalentConnect</p>
    `
  };
  
  try {
    const result = await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", to);
    return { success: true, message: "Alternate date email sent successfully to college" };
  } catch (error) {
    console.error("❌ SendGrid Error Details:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Response body:", JSON.stringify(error.response.body, null, 2));
    }
    
    throw new Error(`Failed to send alternate date email: ${error.message}`);
  }
};