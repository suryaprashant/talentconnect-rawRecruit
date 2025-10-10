import casestudyService from '../services/casestudyService.js';
import eventParticipationService from '../services/eventParticipationService.js';
import hackathonHostingService from '../services/hackathonHostingService.js';
import workshopService from '../services/workshopService.js';

// @desc    Create a new event participation entry
// @route   POST /eventParticipation/register

export const registerParticipant = async (req, res) => {
  try {
    const participantData = req.body;
    const createdBy = req.user._id;
    let roundDetails;
    switch (participantData.eventName) {
      case 'hacakthon':
        roundDetails=await hackathonHostingService.getHackathonRoundsById(participantData.eventID)
        break;
      case 'casestudy':
        roundDetails=await casestudyService.getCasestudyRoundsById(participantData.eventID)
        break;
      case 'workshop':
        roundDetails=await workshopService.getWorkshopRoundsById(participantData.eventID)
        break;
      default: roundDetails=null;
        break;
    }
    if (Array.isArray(roundDetails) && roundDetails.length > 0) {
      const mappedRounds = roundDetails.map((round) => ({
        roundNumber: round.roundNumber,
        roundStatus: 'Notdefined', 
        inputType: '', 
        startDate: round.startDate,
        endDate: round.endDate,
        inputType: round.inputType || '' // Include inputType
      }));

      participantData.rounds = mappedRounds;
    }

    
    const newParticipant = await eventParticipationService.registerParticipantService(participantData, createdBy);

    res.status(201).json({
      success: true,
      message: 'Participant registered successfully',
      data: newParticipant,
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
export const updateInputType = async (req, res) => {
  try {
    const payload = req.body;
    console.log('Received payload:', payload);
    const update = await eventParticipationService.updateInputTypeService(payload);
    // You can add logic here to process the payload, e.g., save to DB

    console.log('Received payload:', update);
    res.status(200).json({ message: 'Payload received', payload });
  } catch (error) {
    console.error('Error in updateInputType:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// @desc    Get all participants for an event
// @route   GET /eventParticipation/:eventID
export const getParticipantsByEvent = async (req, res) => {
  try {
    const { eventID } = req.params;
    const participants = await eventParticipationService.getByEventId(eventID);

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
    const participants = await eventParticipationService.getall();

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
// // @desc    Get by participantId 
// // @route   GET /eventParticipation/byParticipantId
export const getByParticipantId = async (req, res) => {
  try {
    const participantId = req.user._id;
    const participants = await eventParticipationService.getByParticipantId(participantId);
    const result = [];
    for (const participant of participants) {
      const eventID = participant.eventID.toString();
      let event;
      // Fetch event data
      switch (participant.eventName) {
        case "workshop":
          event = await workshopService.getWorkshopById(eventID);
          break;
        case "casestudy":
          event = await casestudyService.getCasestudyById(eventID);
          break;
        case "hackathon":
          event = await hackathonHostingService.getHackathonById(eventID);
          break;
        default:
          event=null;
          break;
      }
      

      if (event) {
        result.push({
          ...event.toObject?.() ?? event, // handle Mongoose docs
          participant: participant
        });
      }

    }
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
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
    console.log("I am  in backends");
    
    const { id } = req.params;
    const updateData = req.body;

    const updated = await eventParticipationService.updateParticipantService(id, updateData);

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

    const deleted = await eventParticipationService.deleteParticipantService(id);

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
