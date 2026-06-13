import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
  skills: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }
});

skillsSchema.index(
  { skills: 1 },
  {
    name: "skills_unique",
    unique: true
  }
);

const SkillsModel = mongoose.model("Skills", skillsSchema);

export default SkillsModel;