import EventParticipation from '../models/eventParticipationDetails.js';
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
      teamMembers
    } = req.body;

    // 1. Fetch the hackathon to get max team size
    // const hackathon = await Hackathon.findById(eventID);
    // if (!hackathon) {
    //   return res.status(404).json({ success: false, message: 'Hackathon not found' });
    // }

    // 2. Parse and check team size limit
    // const maxTeamSize = parseInt(hackathon.participationModel.teamSize || 1, 10);
    // const actualTeamSize = teamMembers?.length || 0;

    // if (actualTeamSize > maxTeamSize) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Team size exceeds the maximum allowed (${maxTeamSize})`
    //   });
    // }

    // 3. Create participant entry
    const newParticipant = await EventParticipation.create({
      eventID,
      name,
      email,
      projectTitle,
      teamMembers
    });

    res.status(201).json({
      success: true,
      message: 'Participant registered successfully',
      data: newParticipant
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// // @desc    Get all participants for an event
// // @route   GET /eventParticipation/:eventID
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
