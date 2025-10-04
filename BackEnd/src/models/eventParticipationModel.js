import mongoose from "mongoose";
import { type } from "os";

const TeamMemberSchema = new mongoose.Schema({
  teamMemberId: String,
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const eventParticipationDetailSchema = new mongoose.Schema({
  teamLeaderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'hackathon', required: true },
  eventName: { type: String },
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
  rounds: [
    {
      roundNumber: {
        type: Number,
      },
      rountStatus: {
        type: String,
        enum: ['Notdefined','Inprogress','Qualified', 'Disqualified'],
        default: 'Notdefined'
      },
      userInput: {
        type: String,
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
    }
  ],
  invitationClosed:{
    type:Boolean,
    default:false,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId },
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
