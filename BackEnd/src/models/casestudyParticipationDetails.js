import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  teamMemberId: String,
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const casestudyParticipationDetailSchema = new mongoose.Schema({
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Casestudy', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectTitle: { type: String },
  teamMembers: [TeamMemberSchema],
  status: {
    type: String,
    enum: ['Qualified', 'Disqualified'],
    default: 'Qualified'
  },
  registrationStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected'],
    default: 'Pending'
  },
  checkInStatus: {
    type: String,
    enum: ['CheckedIn', 'NotCheckedIn'],
    default: 'NotCheckedIn'
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const casestudyParticipation = mongoose.model('casestudyParticipationDetails', casestudyParticipationDetailSchema);
export default casestudyParticipation;
