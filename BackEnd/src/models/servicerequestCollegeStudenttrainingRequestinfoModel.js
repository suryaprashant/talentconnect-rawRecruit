// models/StudentRegistration.js
import mongoose from "mongoose";

const studentRegistrationSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    acceptedTerms: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "studenttrainingrequestinfo", // 👈 Explicitly set collection name
  }
);

const StudentRegistration = mongoose.model(
  "StudentRegistration",
  studentRegistrationSchema
);

export default StudentRegistration;
