import mongoose from 'mongoose';

const collegeNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }
}, { timestamps: true });

// Case-insensitive unique index
collegeNameSchema.index(
  { name: 1 }, 
  { 
    unique: true, 
    collation: { locale: 'en', strength: 2 },
    name: "collegename_unique" 
  }
);

const CollegeName = mongoose.models.CollegeName || mongoose.model('CollegeName', collegeNameSchema);

export default CollegeName;