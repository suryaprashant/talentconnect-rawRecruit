import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected successfully");
  } catch (error) {
    console.error("connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
