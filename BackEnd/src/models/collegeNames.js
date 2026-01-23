import mongoose from 'mongoose';

const collegeNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
}, { timestamps: true });

// CHANGE THIS LINE: 
// Use 'CollegeName' instead of 'College' to avoid conflict with collegeModel.js
const CollegeName = mongoose.models.CollegeName || mongoose.model('CollegeName', collegeNameSchema);

export default CollegeName;