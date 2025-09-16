import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const eventParticipationDetailSchema = new mongoose.Schema({
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'hackathon', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  projectTitle: { type: String },
  teamMembers: [TeamMemberSchema],
  status: {
    type: String,
    enum: ['Qualified', 'Disqualified'],
    default: 'Qualified'
  },
  checkInStatus: {
    type: String,
    enum: ['CheckedIn', 'NotCheckedIn'],
    default: 'NotCheckedIn'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const eventParticipation = mongoose.model('eventParticipationDetails', eventParticipationDetailSchema);
export default eventParticipation;
