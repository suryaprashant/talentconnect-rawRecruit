import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Onboarding from "../models/studentonboardingModel.js";

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 ABSOLUTE PATH TO .env
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

console.log("Loaded DB_URL =", process.env.DB_URL);

const getAllOnboardingData = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("❌ DB_URL is still undefined. .env not loaded.");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected");

    const data = await Onboarding.find({});
    console.log(JSON.stringify(data, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
};

getAllOnboardingData();
