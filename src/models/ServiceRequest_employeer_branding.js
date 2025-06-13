import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceRequestSchemas = new Schema(
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
    collection: "employee_branding_requests",
  }
);

const serviceRequestModellll = mongoose.model(
  "employee_branding_requests",
  serviceRequestSchemas
);

export default serviceRequestModellll;
