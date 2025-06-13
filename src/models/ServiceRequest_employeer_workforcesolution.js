import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceRequestt = new Schema({
  Date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const serviceRequestModel = mongoose.model(
  "employeer_workforce_solution_requests", // this is the model name
  serviceRequestt
);

export default serviceRequestModel;
