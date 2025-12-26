import mongoose from "mongoose";

// applicationSchema
const ApplicationSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        applicantType: {
            type: String,
            required: true,
        },
        // applicant: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     refPath: 'applicantType'  // Dynamic reference based on applicantType
        // },
        // applicantType: {
        //     type: String,
        //     required: true,
        //     enum: ['college', 'student', 'company', 'employer']  // Add all possible types
        // },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobPostingTable",
            required: true,
        },
        jobType: {
            type: String,
            required: true,
        },
        isVisited: {
            type: Boolean,
            default: false
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    // enum: [
                    //     "Applied",
                    //     "Application Sent",
                    //     "Awaiting Recruiter Action",
                    //     "Rejected",
                    //     "Shortlisted",
                    //     "Interview Scheduled",
                    //     "Offer Extended",
                    // ],
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        currentStatus: {
            type: String,
            enum: [
                "Saved",
                "Applied",
                "Application Sent",
                "Awaiting Recruiter Action",
                "Shortlisted",
                "Interview Scheduled",
                "Offer Extended",
                "Accepted",
                "Rejected",
            ],
            default: "Applied",
        },
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;