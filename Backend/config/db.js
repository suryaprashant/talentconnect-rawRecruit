import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const url = process.env.MONGO_URL;
console.log(url);
if (!url) {
  console.error("MONGO_URL is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(url)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error("Error while creating MongoDB connection", err);
    process.exit(1);
  });
