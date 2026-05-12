import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema({
    skills: { 
        type: String, 
        required: true,
        trim: true
    }
});

// This is the "Magic" part that prevents "google" vs "Google" duplicates
skillsSchema.index(
    { skills: 1 }, 
    { 
        unique: true, 
        collation: { locale: 'en', strength: 2 } 
    }
);

const SkillsModel = mongoose.model('Skills', skillsSchema);

// This line ensures the index is created immediately on startup
SkillsModel.createIndexes(); 

export default SkillsModel;