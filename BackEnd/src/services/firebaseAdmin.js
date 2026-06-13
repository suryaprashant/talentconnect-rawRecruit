import admin from "firebase-admin";
import { getApps, getApp } from "firebase-admin/app";
import  Auth  from "../models/authModel.js";

console.log("🔥 Initializing Firebase Admin...");
console.log("FCM ENV exists:", !!process.env.FCM_SERVER_KEY);

const serviceAccount = JSON.parse(process.env.FCM_SERVER_KEY);
console.log("Firebase project_id:", serviceAccount.project_id);

const app = getApps().length === 0
  ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  : getApp();


export const pushNotification = async ({ deviceToken, title, body, data = {} }) => {
  if (!deviceToken) {
    console.log("⛔ Skipping FCM — No device token");
    return;
  }

  try {
    const message = {
      token: deviceToken,
      notification: { title, body },
      data: Object.fromEntries(               // 👈 FCM requires all values as strings
        Object.entries(data).map(([k, v]) => [k, String(v ?? "")])
      ),
      android: { priority: "high" },          // 👈 delivers even in doze mode
      apns: {
        payload: { aps: { contentAvailable: true } },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ FCM SUCCESS:", response);
    return response;
  } catch (err) {
    console.error("❌ FCM ERROR CODE:", err.code);
    console.error("❌ FCM ERROR MESSAGE:", err.message);
    if (err.code === "messaging/registration-token-not-registered") {
      console.log("🧹 Clearing invalid token from DB");
      await Auth.findOneAndUpdate({ deviceToken }, { deviceToken: null });
    }
  }
};