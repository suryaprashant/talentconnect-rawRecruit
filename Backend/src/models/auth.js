import mongoose from 'mongoose';

const AuthSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null // Optional for manual users
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null // Optional for Google/LinkedIn users
  },
  profileImage: {
    type: String,
    default: null // Optional, only used by OAuth
  },
  userType: {
    type: String,
    enum: ['candidate', 'college', 'company'],
    default: 'candidate' // Optional unless you use role-based logic
  },
  authProvider: {
    type: String,
    enum: ['manual', 'google', 'linkedin'],
    default: 'manual' // Optional but useful for login handling
  }
}, { timestamps: true });

export default mongoose.models.Auth || mongoose.model('Auth', AuthSchema);
