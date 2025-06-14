import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  degree: [String],
  preferredLocations: [String],
  lookingFor: String,
  employmentType: String,
  minimumSalary: String,
  startDate: String,
  endDate: String,
  rounds: [String],
  selectionProcess: [String],
  contactPerson: String,
  contactDesignation: String,
  email: String,
  mobile: String,
  linkedin: String,
  minimumStudents: [String],
});

// Use a unique model name, and conditional registration to avoid overwrite errors
const modelName = "CampusRegistration";

const Registration =
  mongoose.models[modelName] ||
  mongoose.model(modelName, registrationSchema, "campus_registrations"); // <- collection name

export default Registration;
