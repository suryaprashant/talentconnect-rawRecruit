import mongoose from "mongoose";

// const baseOptions = {
//   discriminatorKey: 'postType', // Will store either 'Job' or 'Internship'
//   timestamps: true,
// };

const jobSchema = new mongoose.Schema(
  {
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['Full-time', 'Part-time', 'Contract'],
      default: 'Full-time',
    },
    workMode: { 
      type: [String], 
     //  required: true 
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    locations: {
      type: [String],
      required: [true, 'At least one location is required'],
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: 'At least one location must be provided',
      },
    },
    numberOfOpenings: {
      type: Number,
      required: [true, 'Number of openings is required'],
      min: [1, 'Number of openings must be at least 1'],
    },
    salary: {
      amount: {
        type: Number,
        required: [true, 'Salary amount is required'],
        min: [0, 'Salary amount cannot be negative'],
      },
      currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR',
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
  
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
    },
    educationLevel: {
      type: String,
      required: [true, 'Education level is required'],
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
    },
    certification: {
      type: String,
      default: '',
    },
    workAuthorization: { 
      type: String, enum: ["Yes", "No"] 
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
       //ref: 'User',  // for the fututre when create all 
      required:"true"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true ,
    discriminatorKey: "postType"
  }
);

// Index for searching
jobSchema.index({ title: 'text', description: 'text' });

export const JobModel =  mongoose.model("Job", jobSchema);

