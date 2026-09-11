import mongoose from 'mongoose';

const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  linkedinId: {
    type: String,
    unique: true,
    sparse: true
  },
  isNewUser: {
    type: Boolean,
    default: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 1
  },
  userType: {
    type: String,
    enum: ['college', 'company', 'student', 'fresher', 'professional', 'employer', 'admin'],
    // default: 'candidate'
  },
  authProvider: {
    type: String,
    enum: ['manual', 'google', 'linkedin'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'pending',
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  deviceToken: {
    type: String,
    default: null,
  },

  //  Added for password reset
  resetToken: String,
  resetTokenExpires: Date,

  activeCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    default: null,
  },
   jobVisibilityThreshold: {
    type: Number,
    default: 0,  // 0 = show all jobs
    min: 0,
    max: 100
  },
  trendingJobThreshold: {
    applicants: {
      type: Number,
      default: 0,
    },
    daysCount: {
      type: Number,
      default: 1,
    },
},

}, { timestamps: true });

export default mongoose.models.Auth || mongoose.model('Auth', AuthSchema);
