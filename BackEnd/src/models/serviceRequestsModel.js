import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
    {
        requester:{
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: "requester.role",
            },
            role: {
                type: String,
                required: true,
                enum: ['candidate', 'college', 'company', 'student', 'fresher', 'professional', 'employer']
            },
        },
        serviceRequestType: {
            type: String,
            required: true,

        },
        date: {
            type: Date,
            
        },
        time: {
            type: String,
          
        },
        message: {  
            type: String,
          
            maxlength: 500,
        },
        category: { type: String },
        skillset: [{ type: String }],
        counsellingType: {
            type: String,
        },

        numOfEmployees: { type: String },
        typeOfSkill: [{ type: String }],
        modeOfTraining: {
            type: String,
               enum: ["virtual", "in-person", "hybrid" ,"classroom" , "field"],
        },
    evaluationBasedOn: {
      type: String,
      enum: ["test", "project","examination", "attendance", "feedback"],
    },
    numOfHoursPerDay: { type: String },
 
         status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending'
        }
    },
    { timestamps: true}
);
const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);
export default ServiceRequest;    
