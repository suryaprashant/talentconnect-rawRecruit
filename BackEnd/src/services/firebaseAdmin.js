import admin from "firebase-admin";
import { getApps, getApp } from "firebase-admin/app";
import  Auth  from "../models/authModel.js";

const serviceAccount = JSON.parse(process.env.FCM_SERVER_KEY);

const app = getApps().length === 0
  ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  : getApp();

export const pushNotification = async ({ deviceToken, title, body }) => {
  if (!deviceToken) return; // skip silently if no token
  try {
    const message = {
      token: deviceToken,
      notification: { title, body },
    };
    return await admin.messaging().send(message);
  } catch (err) {
    // Token expired/invalid — clear it from DB so we don't retry it
    if (err.code === "messaging/registration-token-not-registered") {
      await Auth.findOneAndUpdate({ deviceToken }, { deviceToken: null });
    }
    console.error("Push Notification Error:", err.message);
    // Don't throw — push failure should never break the main notification flow
  }
};