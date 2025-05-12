import mongoose from "mongoose";
import {JobModel } from "./createJob.model.js";

const internshipSchema = new mongoose.Schema({
    duration: {
      type: String,
      required: [true, 'Internship duration is required'],
    },
  });
  
export const InternshipModel = JobModel.discriminator("Internship", internshipSchema);
  