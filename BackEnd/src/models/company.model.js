import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Create a case-insensitive unique index
companySchema.index(
  { name: 1 }, 
  { 
    unique: true, 
    collation: { locale: 'en', strength: 2 } 
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;