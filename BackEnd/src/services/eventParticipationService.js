import EventParticipation from "../models/eventParticipationModel.js";
import Hackathon from "../models/hackathonModel.js";
import { v2 as cloudinary } from 'cloudinary';
import sendInvitationEmail from '../utils/sendInvitationEmail.js';

class EventParticipationService {
/**
 * Updates the user input for a specific round in a participation record
 * @param {Object} payload - EventParticipation data
 * @returns {Object} Updated EventParticipation document
 */
async updateInputTypeService(payload) {
  try {
    const { _id, roundNumber, inputType } = payload; // ✅ Destructure the needed fields

    console.log("eventparticipantId:", _id);

    const participation = await EventParticipation.findById(_id);

    if (!participation) {
      throw new Error('Participation not found');
    }

    // Find the round with the given roundNumber
    const roundToUpdate = participation.rounds.find(
      (round) => round.roundNumber === roundNumber
    );

    if (!roundToUpdate) {
      throw new Error(`Round ${roundNumber} not found`);
    }

    // Update the user input
    roundToUpdate.inputType = inputType;

    // Save the updated document
    const updatedParticipation = await participation.save();
    return updatedParticipation;
  } catch (err) {
    console.error('Error in updateInputTypeService:', err.message);
    throw err;
  }
}



    /**
* Select all data from EventParticipationDetails
* @returns {Object} return value
*/
    async getall() {
        const eventParticipants = await EventParticipation.find();
        return eventParticipants;
    }

    /**
 * get data by participantId
 * @param {string} participantId - The hackathon data from request body
 * @returns {Object} return value
 */
    async getByParticipantId(participantId) {
        const eventParticipants = await EventParticipation
            .find({ teamLeaderId: participantId }) // optional: include full event details
        return eventParticipants;
    }

    /**
 * get data by participantId
 * @param {string} EventId - The hackathon data from request body
 * @returns {Object} return value
 */ 
    async getByEventId(EventId) {
        const eventParticipants = await EventParticipation.find({ eventID: EventId }) 
        return eventParticipants;
    }

    /**
     * Create a new workshop
     * @param {Object} participantData - participant data
     * @param {String} createdBy - createdby
     * @returns {Object} Created workshop object
     */

    async registerParticipantService(participantData, createdBy) {
        const {

            eventID,
            eventName,
            name,
            email,
            rounds = [],
            invitationClosed,
            projectTitle,
            teamMembers = [],
        } = participantData;
        const teamLeaderId=createdBy;

        // Filter out empty team members (those with empty name or email)
        const validTeamMembers = teamMembers.filter(member => 
            member.name && member.name.trim() !== '' && 
            member.email && member.email.trim() !== ''
        );

        // Send invitation emails to new team members (without teamMemberId)
        for (const member of validTeamMembers) {
            if (!member.teamMemberId) {
                try {
                    await sendInvitationEmail(member.email, member.name);
                    console.log(`Invitation sent to ${member.email}`);
                } catch (emailErr) {
                    console.error(`Failed to send email to ${member.email}:`, emailErr.message);
                }
            }
        }

        // Save participation record
        const newParticipation = new EventParticipation({
            teamLeaderId,
            eventID,
            eventName,
            name,
            email,
            projectTitle,
            invitationClosed,
            rounds,
            teamMembers: validTeamMembers,
            createdBy,            
        });

        const savedParticipation = await newParticipation.save();
        return savedParticipation;
    }
/**
 * Updates a participant's information by ID
 * @param {string} participantId - The participant document ID (MongoDB _id)
 * @param {Object} updateData - The fields to update
 * @returns {Object|null} The updated participant document or null if not found
 */
async updateParticipantService(participantId, updateData) {
  const updatedParticipant = await EventParticipation.findByIdAndUpdate(
    participantId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  return updatedParticipant; // May return null if not found
}

/**
 * Deletes a participant by ID
 * @param {string} registrationID - The participant document ID (MongoDB _id)
 * @returns {Object|null} The deleted participant document or null if not found
 */
async deleteParticipantService(registrationID) {
  const deletedParticipant = await EventParticipation.findByIdAndDelete(registrationID);
  return deletedParticipant; // May return null if not found
}

}

export default new EventParticipationService();