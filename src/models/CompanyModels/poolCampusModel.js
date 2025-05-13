// models/poolCampusModel.js
/*
import mongoose from 'mongoose';

const poolCampusSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  collegeLogo: { type: String }, // optional, URL to image
  nirfRank: { type: Number },
  location: { type: String },
  placementRate: { type: Number },
  highestPackage: { type: Number },
  averagePackage: { type: Number },

  eligibleBranches: [{ type: String }],
  studentCount: { type: Number },
  proposedDates: {
    from: { type: Date },
    to: { type: Date },
  },
  uploadedDocuments: [{
    name: { type: String },
    url: { type: String },
  }],
  facilitiesRequired: [{ type: String }],

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Shortlisted', 'Rejected'],
    default: 'Pending'
  },
}, { timestamps: true });

const PoolCampusDrive = mongoose.model('PoolCampusDrive', poolCampusSchema);

export default PoolCampusDrive;
*/