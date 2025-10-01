import EventParticipation from "../models/eventParticipationDetails.js";
import Hackathon from "../models/hackathonModel.js";
import { v2 as cloudinary } from 'cloudinary';
class EventParticipationService {

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
    async getByParticipantId(participantId = "68d2c197c338b573957c3fbb") {
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
        const eventParticipants = await EventParticipation
            .find({ eventID: EventId }) // optional: include full event details
        return eventParticipants;
    }

    /**
     * Create a new workshop
     * @param {Object} participantData - participant data
     * @param {String} teamLeaderId - createdby
     * @returns {Object} Created workshop object
     */

    async registerParticipantService(participantData, teamLeaderId) {
        const {
            eventID,
            name,
            email,
            projectTitle,
            teamMembers = [],
        } = participantData;


        // Send invitation emails to new team members (without teamMemberId)
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

        // Save participation record
        const newParticipation = new EventParticipation({
            teamLeaderId,
            eventID,
            name,
            email,
            projectTitle,
            teamMembers,
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

}

export default new EventParticipationService();