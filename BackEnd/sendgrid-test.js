import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

console.log("API KEY LOADED:", !!process.env.SENDGRID_API_KEY);
console.log("SENDER:", process.env.SENDGRID_SENDER);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.SENDGRID_SENDER, // send to yourself
  from: process.env.SENDGRID_SENDER,
  subject: "SendGrid Test Email",
  text: "If you got this, SendGrid works",
};

try {
  const [res] = await sgMail.send(msg);
  console.log("SEND SUCCESS:", res.statusCode);
} catch (err) {
  console.error("SEND FAIL BODY:", err.response?.body);
}
