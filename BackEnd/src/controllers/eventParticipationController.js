import EventParticipation from 'src/models/eventParticipationDetails.js';
// import { sendEmail } from "../utils/sendEmail.js"
import sendInvitationEmail from 'src/utils/sendInvitationEmail.js';
// import Hackathon from '../models/hackathon.js';

// @desc    Create a new event participation entry
// @route   POST /eventParticipation/register
export const registerParticipant = async (req, res) => {
  try {
    const {
      eventID,
      name,
      email,
      projectTitle,
      teamMembers = [],
    } = req.body;
    const teamLeaderId = req.user._id;
    console.log("before sending mail");
    
    // 1. Send invitation email to team members who don't have a teamMemberId
    for (const member of teamMembers) {
      if (!member.teamMemberId) {
        try {
          await sendInvitationEmail(member.email, member.name);
          console.log(`Invitation sent to ${member.email}`);
        } catch (emailErr) {
          console.error(`Failed to send email to ${member.email}:`, emailErr.message);
        }
      }
    }
    console.log("After sending mail");
    
    // 2. Save participant in DB
    const newParticipation = new EventParticipation({
      teamLeaderId,
      eventID,
      name,
      email,
      projectTitle,
      teamMembers,
    });

    await newParticipation.save();

    res.status(201).json({
      success: true,
      message: 'Participant registered successfully',
      data: newParticipation,
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};



// @desc    Get all participants for an event
// @route   GET /eventParticipation/:eventID
export const getParticipantsByEvent = async (req, res) => {
  try {
    const { eventID } = req.params;

    const participants = await EventParticipation.find({ eventID });

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching participants:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// // @desc    Get all participants 
// // @route   GET /eventParticipation
export const getAllParticipants = async (req, res) => {
  try {
    const participants = await EventParticipation.find();

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Error fetching all participants:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// // @desc    update participant with id
// // @route   GET /eventParticipation/update/:eventID
export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await EventParticipation.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating participant:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// // @desc    delete al participand
// // @route   GET /eventParticipation/delete/:eventID
export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await EventParticipation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Participant deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting participant:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
