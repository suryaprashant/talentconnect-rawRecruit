import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  category: { type: String, required: true },
  skillset: { type: String, required: true },
  date: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentOverview",
    required: true,
  },
  time: { type: String, required: true },
  message: { type: String },
  termsAccepted: { type: Boolean, required: true },
});

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
