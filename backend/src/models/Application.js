import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentOverview",
            required: true
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "Applied",
                        "Application Sent",
                        "Awaiting Recruiter Action",
                        "Rejected",
                        "Shortlisted",
                        "Interview Scheduled",
                        "Offer Extended",
                    ],
                    required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        currentStatus: {
            type: String,
            enum: [
                "Applied",
                "Application Sent",
                "Awaiting Recruiter Action",
                "Shortlisted",
                "Interview Scheduled",
                "Offer Extended",
                "Rejected"
            ],
            default: "Applied"
        }
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;