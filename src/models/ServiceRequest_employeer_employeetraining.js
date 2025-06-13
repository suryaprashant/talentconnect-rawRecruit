import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceRequesttt = new Schema(
  {
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
  },
  {
    collection: "employeer_employee_training_requests",
  }
);

const serviceRequestModell = mongoose.model(
  "employeer_employee_training_requests",
  serviceRequesttt
);

export default serviceRequestModell;
