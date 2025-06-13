import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  date: String,
  time: String,
  message: String,
  termsAccepted: Boolean,
});

// Use a different collection name, e.g., "hiring_requests"
const modelName = "poolCampusRequest";

const Request =
  mongoose.models[modelName] ||
  mongoose.model(modelName, requestSchema, "poolCampusRequest");

export default Request;
