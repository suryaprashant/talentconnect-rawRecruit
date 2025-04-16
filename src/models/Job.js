import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        location: { type: String }, // later on to create array
        workMode: { type: [String], required: true }, // "Remote", "Onsite", or "Hybrid"
        industryType: String, // "IT"
        jobType: {
            type: String,
            enum: ["Internship", "Job"]
        }, // "Internship" or "Job"
        employementType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Contract"],
            required: true,
        },
        noOfOpenings: String,
        salaryPerMonth: { type: String, required: true },

        minimumEducation: { type: String, required: true },
        preferedFieldOfStudy: String,
        yearsOfExperience: Number,
        skillsRequired: { type: [String], required: true }, // ["Node.js", "React.js"]

        certificates: String, //later to be replaced by files or links
        workAuthorizationRequired: { type: String, enum: ["Yes", "No"] },

        companyPosted: { type: mongoose.Schema.Types.ObjectId, ref:"Company", required: true }, //ref to posting company for populate
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;