import mongoose from "mongoose";

const rawRecruitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      enum: ["09:00", "11:00", "13:00", "15:00"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    acceptTerms: {
      type: Boolean,
      required: [true, "Terms must be accepted"],
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
    serviceType: {
      type: String,
      enum: [
        "on-campus",
        "off-campus",
        "pool-campus",
        "branding",
        "employee-training",
        "seminar",
        "work-force",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    adminMessage: {
      type: String,
      default: "",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "reqinfo",
  },
);

rawRecruitSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
rawRecruitSchema.index({ email: 1, createdAt: -1 });
rawRecruitSchema.index({ status: 1, createdAt: -1 });

const ReqInfo = mongoose.model("RawRecruit", rawRecruitSchema);
export default ReqInfo;
