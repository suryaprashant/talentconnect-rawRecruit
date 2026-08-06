import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sender = process.env.SENDGRID_SENDER || "no-reply@yourdomain.com";

export const sendOtpEmail = async (to, otp) => {
  const msg = {
    to,
    from: sender,
    subject: "Your One-time Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #143694;">Verify Your Email</h2>
        <p>Thank you for signing up with Rawrecruit. Please use the following One-Time Password (OTP) to complete your registration:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
        </div>
        <p>This code is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br/>
        <p>Best Regards,<br/>Team Rawrecruit</p>
      </div>
    `,
  };
  await sgMail.send(msg);
};

export const sendWelcomeEmail = async (email, usertype) => {
  console.log({
    email,
    usertype,
  });

  const role = String(usertype || "")
    .trim()
    .toLowerCase();

  const isReferd = ["student", "professional", "fresher"].includes(role);

  const platformName = isReferd ? "Referd" : "RawRecruit";

  const loginUrl = isReferd
    ? "https://referd.in/login"
    : "https://rawrecruit.in/login";

  // Replace these with your actual logo URLs
  const logo = isReferd
    ? "https://referd.in/logo.png"
    : "https://rawrecruit.in/logo1.png";

  const features = isReferd
    ? `
      <li>Complete your profile</li>
      <li>Apply to jobs instantly</li>
      <li>Request employee referrals</li>
      <li>Connect with alumni & professionals</li>
      <li>Track your applications</li>
    `
    : `
      <li>Complete organization profile</li>
      <li>Post unlimited job openings</li>
      <li>Manage applicants</li>
      <li>Shortlist candidates</li>
      <li>Hire faster with AI tools</li>
    `;

  const msg = {
    to: email,
    from: sender,
    subject: `Welcome to ${platformName}! 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>Welcome to ${platformName}</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="background:#f5f7fb;padding:40px 15px;"
>

<tr>

<td align="center">

<table
  width="650"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    border:1px solid #e5e7eb;
  "
>

<tr>

<td
  align="center"
  style="
    background:#020d02;
    padding:45px 30px;
  "
>

<img
  src="${logo}"
  width="170"
  alt="${platformName}"
  style="
    display:block;
    margin-bottom:25px;
  "
/>

<h1
  style="
    margin:0;
    font-size:30px;
    color:white;
  "
>
  Welcome to ${platformName}
</h1>

<p
  style="
    margin-top:15px;
    font-size:16px;
    color:#ffffff;
  "
>
  Your account has been created successfully 🎉
</p>

</td>

</tr>

<tr>

<td style="padding:40px;">

<p
  style="
    font-size:16px;
    color:#333;
    line-height:28px;
  "
>
  Hello,
</p>

<p
  style="
    font-size:16px;
    line-height:28px;
    color:#444;
  "
>
  Thank you for joining <b>${platformName}</b>.
  <br /><br />
  Your account has been successfully verified and is ready to use.
</p>

<table
  cellpadding="8"
  cellspacing="0"
  style="
    margin-top:25px;
    margin-bottom:35px;
    border-collapse:collapse;
    width:100%;
  "
>

<tr>

<td
  style="
    background:#f4f6fb;
    font-weight:bold;
    width:130px;
  "
>
  Email
</td>

<td style="background:#fafafa;">
  ${email}
</td>

</tr>

<tr>

<td
  style="
    background:#f4f6fb;
    font-weight:bold;
  "
>
  Role
</td>

<td
  style="
    background:#fafafa;
    text-transform:capitalize;
  "
>
  ${role}
</td>

</tr>

</table>

<h2
  style="
    font-size:20px;
    color:#143694;
    margin-bottom:15px;
  "
>
  What you can do now
</h2>

<ul
  style="
    line-height:30px;
    font-size:15px;
    color:#444;
    padding-left:22px;
  "
>
  ${features}
</ul>

<div
  style="
    text-align:center;
    margin:45px 0;
  "
>

<a
  href="${loginUrl}"
  style="
    background:#143694;
    padding:16px 40px;
    border-radius:8px;
    display:inline-block;
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
    font-size:16px;
  "
>
  Login to ${platformName}
</a>

</div><hr
  style="
    border:none;
    border-top:1px solid #e5e7eb;
    margin:40px 0;
  "
/>

<h3
  style="
    color:#143694;
    font-size:20px;
    margin-bottom:20px;
  "
>
  Why choose ${platformName}?
</h3>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="border-collapse:collapse;"
>

<tr>

<td
  style="
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:18px;
  "
>

<h4
  style="
    margin:0;
    color:#143694;
    font-size:17px;
  "
>
  ✔ Easy to Use
</h4>

<p
  style="
    margin:10px 0 0;
    color:#555;
    line-height:25px;
    font-size:15px;
  "
>
  A clean and intuitive platform that helps you accomplish more with fewer
  clicks.
</p>

</td>

</tr>

<tr>
<td height="18"></td>
</tr>

<tr>

<td
  style="
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:18px;
  "
>

<h4
  style="
    margin:0;
    color:#143694;
    font-size:17px;
  "
>
  🔒 Secure Platform
</h4>

<p
  style="
    margin:10px 0 0;
    color:#555;
    line-height:25px;
    font-size:15px;
  "
>
  Your data is protected using secure authentication and modern security
  standards.
</p>

</td>

</tr>

<tr>
<td height="18"></td>
</tr>

<tr>

<td
  style="
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:18px;
  "
>

<h4
  style="
    margin:0;
    color:#143694;
    font-size:17px;
  "
>
  🚀 Grow Faster
</h4>

<p
  style="
    margin:10px 0 0;
    color:#555;
    line-height:25px;
    font-size:15px;
  "
>
  ${
    isReferd
      ? "Build your network, get employee referrals, connect with alumni, and land your dream job faster."
      : "Manage recruitment efficiently, streamline hiring workflows, and discover the right talent quickly."
  }
</p>

</td>

</tr>

</table>

<p
  style="
    margin-top:40px;
    font-size:15px;
    line-height:28px;
    color:#444;
  "
>
  We're excited to have you onboard and can't wait to see what you'll achieve
  with <strong>${platformName}</strong>.
</p>

<p
  style="
    font-size:15px;
    line-height:28px;
    color:#444;
  "
>
  If you need any assistance, simply reply to this email and our support team
  will be happy to help.
</p>

<p
  style="
    margin-top:35px;
    font-size:15px;
    line-height:28px;
    color:#444;
  "
>
  Best Regards,<br />
  <strong>${platformName} Team</strong>
</p><tr>

<td
  align="center"
  style="
    background:#143694;
    padding:35px 25px;
    color:#ffffff;
  "
>

<h3
  style="
    margin:0;
    font-size:20px;
    color:#ffffff;
  "
>
  Stay Connected
</h3>

<p
  style="
    margin:15px 0 25px;
    font-size:14px;
    line-height:24px;
    color:#dbe4ff;
  "
>
  Thank you for choosing ${platformName}. We're committed to helping you
  achieve your goals.
</p>

<table
  cellpadding="0"
  cellspacing="0"
  align="center"
>
<tr>

<td style="padding:0 8px;">
<a
  href="${loginUrl}"
  style="
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
  "
>
Visit Platform
</a>
</td>

<td style="padding:0 8px;">
|
</td>

<td style="padding:0 8px;">
<a
  href="mailto:support@${isReferd ? "referd.in" : "rawrecruit.in"}"
  style="
    color:#ffffff;
    text-decoration:none;
    font-weight:bold;
  "
>
Contact Support
</a>
</td>

</tr>
</table>

<p
  style="
    margin-top:30px;
    font-size:13px;
    color:#dbe4ff;
    line-height:22px;
  "
>
© ${new Date().getFullYear()} ${platformName}. All rights reserved.
</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
