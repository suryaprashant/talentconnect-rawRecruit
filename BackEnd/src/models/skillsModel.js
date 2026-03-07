import mongoose from "mongoose";

// Fixed: Schema (capital S) and variable name consistency
const skillsSchema = new mongoose.Schema({
    skills: { 
        type: String, 
        required: true,
        unique: true // Prevents duplicate skills
    },
   
});

const SkillsModel = mongoose.model('Skills', skillsSchema);
export default SkillsModel;