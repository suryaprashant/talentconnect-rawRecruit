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
        appliedForCompany: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "CompanyProfile",
           default: null,
           index: true,
         },
         appliedByType: {
            type: String,
            enum: ['employer','company','college','student','fresher','professional'],
            required: true
        },
        adminApprovalStatus: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
          index: true
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
                "Referred To Company",
                
            ],
            default: "Applied",
        },
         matchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null, 
            }
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;