import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
    companyPosted: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyProfile", required: true }, 

    jobType :{
        type: String,
        required : true ,
        enum : ["Off-campus" , "On-campus", "Pool-campus" , "Job-posting", "Internship"]
    },
    degree: [String],
    location: [String], required: true,
    collegeTypes: [{ type: String }], 
    jobTitle: { type: String },
    jobCategory: { type: String},
    venue : { type: String }, 
    lookingFor: {
        type: String,
        enum: ["Job", "Internship", "Both"],
    },
    employmentType: {
        type: String,
        enum: ["Part-time", "Full-time", "Contract"],
    },
    workMode: {
        type: String,
        enum: ["Hybrid", "On-site", "Remote"],
    },
    description : { type: String,  },
    jobRoles: [{ type: String }], 
    minPackage: {
        currency: { type: String },
        amount: { type: Number }
    },
    studentStreams: [{ type: String }], 

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rounds: [{ type: String }],
    selectionProcess: [{ type: String }],
    numberOfOpenings: { type: Number },
    contactPerson: {
        name: { type: String, required: true },
        designation: { type: String },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        linkedin: { type: String }
    },
    minEducation: {
        type: String,
    },
    yearsOfExperience: {
        type: String,
    },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    workAuthorization: {
        type: String,
        enum: ["Required", "Not Required"],
    },
    minimumStudents: { type: String }, 

}, { timestamps: true });
const JobPosting = mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;

