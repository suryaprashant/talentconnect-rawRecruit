import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    preferredHiringLocation: {
      type: String,
      required: true,
    },
    numberOfOpenings: {
      type: Number,
      required: true,
    },
    monthlyInHandSalary: {
      currency: {
        type: String,
        enum: ["USD", "INR", "EUR", "GBP", "Other"], // Adjust as needed
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
    jobDescription: {
      type: String,
      required: true,
    },
    selectionCriteria: {
      minimumEducation: {
        type: String,
        enum: [
          "High School",
          "Diploma",
          "Bachelor’s",
          "Master’s",
          "PhD",
          "Other",
        ],
      },
      preferredFieldOfStudy: {
        type: String,
      },
      yearsOfExperience: {
        type: String,
        enum: [
          "Fresher",
          "0-1 years",
          "1-3 years",
          "3-5 years",
          "5+ years",
          "Any",
        ],
      },
      skills: {
        type: [String],
        required: true,
      },
      certifications: {
        type: [String],
      },
      workAuthorizationRequirement: {
        type: String,
        enum: [
          "None",
          "Work Visa Required",
          "Citizen Only",
          "Any Authorized to Work",
          "Other",
        ],
      },
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Jobss", jobSchema, "job_listings");

export default Job;
