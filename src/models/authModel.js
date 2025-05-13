import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["candidate", "Company","employer", "college"],
    required: true,
  },
  subRole: {
    type: String,
    enum: ["student", "fresher", "professional", null],
    default: null,
  },
  authProvider: {
    type: String,
    enum: ["manual", "google", "linkedin"],
    default: "manual",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
