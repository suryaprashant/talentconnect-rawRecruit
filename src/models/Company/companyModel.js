import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one company per user
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
    required: true,
  },
  industryType: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: Number,
    required: true,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  linkedinUrl: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  alternatePhoneNumber: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  hiringPreferences: {
    jobRoles: [String],
    hiringLocations: [String],
    lookingFor: {
      type: String,
      enum: ['job', 'internship', 'both'],
    },
    employmentType: {
      type: String,
      enum: ['part-time', 'full-time', 'contract'],
    },
  },
  kycDetails: {
    kycStatus: Boolean,
    photoVerificationStatus: Boolean,
    aadharNumber: String,
    nameOnAadhar: String,
    address: String,
    country: String,
    state: String,
    city: String,
    pincode: String,
    gstin: String,
    tan: String,
    gstNumber: String,
    companyRegNumber: String,
  },
  documents: [String], // To store URLs of uploaded documents
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;
