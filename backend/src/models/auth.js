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
  userType: {
    type: String,
    enum: ['candidate', 'college', 'company', 'student', 'fresher', 'professional'],
    default: 'candidate'
  },
  authProvider: {
    type: String,
    enum: ['manual', 'google', 'linkedin'],
    default: 'manual'
  },

  // ✅ Added for password reset
  resetToken: String,
  resetTokenExpires: Date

}, { timestamps: true });

export default mongoose.models.Auth || mongoose.model('Auth', AuthSchema);
