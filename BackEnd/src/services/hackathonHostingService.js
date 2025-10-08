import Hackathon from "../models/hackathonModel.js";
import { v2 as cloudinary } from 'cloudinary';
import EventParticipation from "../models/eventParticipationModel.js";
import Auth from "../models/authModel.js";
import StudentOverview from "../models/studentModel.js";
import ProfessionalProfile from "../models/professionalProfileModel.js";
import FresherProfile from "../models/fresherProfileModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendBulkNotifications } from "../utils/sendNotification.js";

/**
 * Service class for handling hackathon-related business logic
 */
class HackathonHostingService {

    /**
     * Create a new hackathon
     * @param {Object} hackathonData - The hackathon data from request body
     * @param {Object} file - The uploaded file (if any)
     * @param {string} createdBy - The ID of the user creating the hackathon
     * @returns {Object} Created hackathon object
     */
    async createHackathon(hackathonData, file = null, createdBy = null) {
        const {
            title,
            subTitle,
            description,
            problemStatements,
            mode,
            visibility,
            participationType,
            startDate,
            endDate,
            location,
            maxParticipants,
            maxTeams,
            minTeamMembers,
            maxTeamMembers,
            numberOfRounds,
            rounds,
            rewards,
            registrationDeadline,
            requirements,
            rules,
            website,
            contactEmail,
            tags,
            faqs,
            panelMembers,
            eligibility,
            domains
        } = hackathonData;

        // Handle logo upload if provided (optional for now)
        let logoUrl = '';
        if (file) {
            console.log('File upload detected but not processed yet:', file);
            // TODO: Implement file upload when Cloudinary is properly configured
        }

        // Transform rewards data to match model structure
        const rewardsAndBenefits = this._transformRewardsData(rewards);

        // Determine hackathon type based on mode
        const hackathonType = this._determineHackathonType(mode);

        // Determine max team size based on participation type
        const maxTeamSize = this._determineMaxTeamSize(participationType, maxTeamMembers);

        // Validate required fields
        this._validateRequiredFields({ location, createdBy });

        // Normalize various inputs
        const normalizedRounds = this._normalizeJsonInput(rounds, []);
        const normalizedFaqs = this._normalizeFaqs(faqs);
        const normalizedPanelMembers = this._normalizePanelMembers(panelMembers);
        const normalizedDomains = this._normalizeDomains(domains);

        // Create hackathon
        const hackathon = await Hackathon.create({
            title,
            description,
            hackathonType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            venue: location,
            location: location,
            bannerImage: logoUrl,
            maxTeamSize,
            registrationDeadline: new Date(registrationDeadline),
            rewardsAndBenefits,
            faqs: normalizedFaqs,
            panelMembers: normalizedPanelMembers,
            problemStatements: problemStatements || [],
            subTitle,
            visibility,
            participationType,
            maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
            maxTeams: maxTeams ? parseInt(maxTeams) : null,
            minTeamMembers: minTeamMembers ? parseInt(minTeamMembers) : null,
            maxTeamMembers: maxTeamMembers ? parseInt(maxTeamMembers) : null,
            numberOfRounds: numberOfRounds ? parseInt(numberOfRounds) : 1,
            rounds: normalizedRounds || [],
            requirements,
            rules,
            website,
            contactEmail,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            eligibility: eligibility || '',
            domains: normalizedDomains,
            createdBy: createdBy
        });

        return hackathon;
    }

    /**
     * Update an existing hackathon
     * @param {string} hackathonId - The hackathon ID
     * @param {Object} updateData - The update data
     * @param {Object} file - The uploaded file (if any)
     * @returns {Object} Updated hackathon object
     */
    async updateHackathon(hackathonId, updateData, file = null) {
        let hackathon = await Hackathon.findById(hackathonId);

        if (!hackathon) {
            throw new Error(`Hackathon not found with id of ${hackathonId}`);
        }

        // Handle image upload if a new banner is provided
        if (file) {
            // Delete previous image from Cloudinary
            if (hackathon.bannerImage) {
                const publicId = hackathon.bannerImage
                    .split('/')
                    .slice(-2)
                    .join('/')
                    .split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'hackathon_banners',
                width: 1200,
                crop: 'scale'
            });

            updateData.bannerImage = result.secure_url;
        }

        // Handle rewards and benefits if provided as a string
        if (updateData.rewardsAndBenefits && typeof updateData.rewardsAndBenefits === 'string') {
            updateData.rewardsAndBenefits = JSON.parse(updateData.rewardsAndBenefits);
        }

        // Normalize various inputs for update
        if (updateData.rounds && typeof updateData.rounds === 'string') {
            updateData.rounds = this._normalizeJsonInput(updateData.rounds, []);
        }

        if (updateData.faqs && typeof updateData.faqs === 'string') {
            updateData.faqs = this._normalizeFaqs(updateData.faqs);
        }

        if (updateData.panelMembers && typeof updateData.panelMembers === 'string') {
            updateData.panelMembers = this._normalizePanelMembers(updateData.panelMembers);
        }

        hackathon = await Hackathon.findByIdAndUpdate(hackathonId, updateData, {
            new: true,
            runValidators: true
        });

        return hackathon;
    }

    /**
     * Delete a hackathon
     * @param {string} hackathonId - The hackathon ID
     * @returns {Object} Success response
     */
    async deleteHackathon(hackathonId) {
        const hackathon = await Hackathon.findById(hackathonId);

        if (!hackathon) {
            throw new Error(`Hackathon not found with id of ${hackathonId}`);
        }

        // Delete banner image from Cloudinary
        if (hackathon.bannerImage) {
            const publicId = hackathon.bannerImage
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await hackathon.deleteOne();

        return { success: true };
    }

    /**
     * Get all hackathons
     * @returns {Array} Array of hackathons
     */
    async getAllHackathons() {
        const hackathons = await Hackathon.find().sort('-createdAt');

        // Add registeredUsers to each hackathon
        const hackathonsWithRegistrations = await Promise.all(
            hackathons.map(async (hackathon) => {
                const count = await EventParticipation.countDocuments({ eventID: hackathon._id });
                return {
                    ...hackathon.toObject(),
                    registeredUsers: count
                };
            })
        );

        return hackathonsWithRegistrations;
    }


    /**
     * Get a single hackathon by ID
     * @param {string} hackathonId - The hackathon ID
     * @returns {Object} Hackathon object
     */
    async getHackathonById(hackathonId) {
        const hackathon = await Hackathon.findById(hackathonId).populate([
            { path: 'panelMembers' },
        ]);

        if (!hackathon) {
            throw new Error(`Hackathon not found with id of ${hackathonId}`);
        }

        return hackathon;
    }
    /**
     * Get a single hackathon rounds by ID
     * @param {string} hackathonId - The hackathon ID
     * @returns {Object} Hackathon object
     */
    async getHackathonRoundsById(hackathonId) {
        const hackathon = await Hackathon.findById(hackathonId).populate([
            { path: 'panelMembers' },
        ]);

        if (!hackathon) {
            throw new Error(`Hackathon not found with id of ${hackathonId}`);
        }

        return hackathon.rounds;
    }

    // Private helper methods

    /**
     * Transform rewards data to match model structure
     * @param {Object} rewards - Raw rewards data
     * @returns {Array} Transformed rewards array
     */
    _transformRewardsData(rewards) {
        const rewardsAndBenefits = [];

        if (!rewards) return rewardsAndBenefits;

        const isAmount = rewards?.rewardType === 'Amount';

        // Add main prizes
        if (rewards.firstPlace) {
            rewardsAndBenefits.push({
                title: '1st Place',
                rank: 'Winner',
                type: isAmount ? 'Cash' : 'Other',
                amount: isAmount ? parseInt(rewards.firstPlace) : undefined,
            });
        }

        if (rewards.secondPlace) {
            rewardsAndBenefits.push({
                title: '2nd Place',
                rank: '1st Runner-up',
                type: isAmount ? 'Cash' : 'Other',
                amount: isAmount ? parseInt(rewards.secondPlace) : undefined,
            });
        }

    if (rewards.thirdPlace) {
        rewardsAndBenefits.push({
            title: '3rd Place',
            rank: '2nd Runner-up',
            type: isAmount ? 'Cash' : 'Other',
            amount: isAmount ? parseInt(rewards.thirdPlace) : undefined,
        });
    }

    // Add special awards
    if (rewards.specialAwards && rewards.specialAwards.length > 0) {
        rewards.specialAwards.forEach(award => {
            if (!award?.name) return;
            if (isAmount && award.amount) {
                rewardsAndBenefits.push({
                    title: award.name,
                    type: 'Cash',
                    amount: parseInt(award.amount)
                });
            } else if (!isAmount && award.perk) {
                rewardsAndBenefits.push({
                    title: award.name,
                    type: 'Other',
                });
            }
        });
    }

    return rewardsAndBenefits;
}

/**
 * Determine hackathon type based on mode
 * @param {string} mode - The mode value
 * @returns {string} Hackathon type
 */
_determineHackathonType(mode) {
    let hackathonType = 'Virtual';
    if (mode === 'Online') hackathonType = 'Virtual';
    else if (mode === 'Hybrid') hackathonType = 'Hybrid';
    else if (mode === 'Private') hackathonType = 'In-person';
    return hackathonType;
}

/**
 * Determine max team size based on participation type
 * @param {string} participationType - The participation type
 * @param {string|number} maxTeamMembers - Max team members value
 * @returns {number} Max team size
 */
_determineMaxTeamSize(participationType, maxTeamMembers) {
    let maxTeamSize = 1;
    if (participationType === 'Team') {
        maxTeamSize = parseInt(maxTeamMembers) || 5;
    } else if (participationType === 'Both') {
        maxTeamSize = parseInt(maxTeamMembers) || 5;
    }
    return maxTeamSize;
}

/**
 * Validate required fields
 * @param {Object} fields - Fields to validate
 */
_validateRequiredFields(fields) {
    if (!fields.location || fields.location.trim() === '') {
        throw new Error('Location is required');
    }
    if (!fields.createdBy) {
        throw new Error('Creator ID is required - user must be authenticated');
    }
}

    /**
     * Normalize JSON input (support JSON string from multipart/form-data)
     * @param {string|Array|Object} input - Input to normalize
     * @param {*} defaultValue - Default value if parsing fails
     * @returns {*} Normalized input
     */
    _normalizeJsonInput(input, defaultValue = []) {
        if (typeof input === 'string') {
            try {
                return JSON.parse(input);
            } catch (e) {
                console.warn('Failed to parse JSON string, using default value.');
                return defaultValue;
            }
        }
        return input || defaultValue;
    }

    /**
     * Normalize FAQs input
     * @param {string|Array} faqs - FAQs input
     * @returns {Array} Normalized FAQs array
     */
    _normalizeFaqs(faqs) {
        let normalizedFaqs = this._normalizeJsonInput(faqs, []);

        // Filter out empty FAQ entries
        if (Array.isArray(normalizedFaqs)) {
            normalizedFaqs = normalizedFaqs.filter(f => f.question && f.answer);
        } else {
            normalizedFaqs = [];
        }

        return normalizedFaqs;
    }

    /**
     * Normalize panel members input
     * @param {string|Array} panelMembers - Panel members input
     * @returns {Array} Normalized panel members array
     */
    _normalizePanelMembers(panelMembers) {
        let normalizedPanelMembers = this._normalizeJsonInput(panelMembers, []);

        // Ensure all panel member IDs are valid ObjectIds (as strings)
        if (Array.isArray(normalizedPanelMembers)) {
            normalizedPanelMembers = normalizedPanelMembers.filter(id => !!id);
        } else {
            normalizedPanelMembers = [];
        }

        return normalizedPanelMembers;
    }

    /**
     * Normalize domains input
     * @param {string|Array} domains - Domains input
     * @returns {Array} Normalized domains array
     */
    _normalizeDomains(domains) {
        let normalizedDomains = domains;

        if (typeof domains === 'string') {
            normalizedDomains = domains.split(',').map(domain => domain.trim()).filter(domain => domain);
        } else if (Array.isArray(domains)) {
            normalizedDomains = domains.filter(domain => domain && typeof domain === 'string');
        } else {
            normalizedDomains = [];
        }

        return normalizedDomains;
    }
    
    
    // ==========================================
    // HOSTING MANAGEMENT OPERATIONS
    // ==========================================

    async getUserDetailsByEmail(email) {
        const authUser = await Auth.findOne({ email });
        if (!authUser) return null;

        let userDetails = {
            name: authUser.name,
            email: authUser.email,
            userType: authUser.userType
        };

        let profile;
        switch (authUser.userType) {
            case "student":
                profile = await StudentOverview.findOne({ email });
                if (profile) userDetails = { ...userDetails, ...profile.toObject() };
                break;
            case "professional":
                profile = await ProfessionalProfile.findOne({ email });
                if (profile) userDetails = { ...userDetails, ...profile.toObject() };
                break;
            case "fresher":
                profile = await FresherProfile.findOne({ email });
                if (profile) userDetails = { ...userDetails, ...profile.toObject() };
                break;
        }
        return userDetails;
    }

    async getCompanyHackathonsWithRegistrations(companyId) {
        const hackathons = await Hackathon.find({ createdBy: companyId }).sort({ createdAt: -1 });

        const hackathonsWithCounts = await Promise.all(
            hackathons.map(async (h) => {
                const total = await EventParticipation.countDocuments({ eventID: h._id });
                const pending = await EventParticipation.countDocuments({ eventID: h._id, registrationStatus: "Pending" });
                const confirmed = await EventParticipation.countDocuments({ eventID: h._id, registrationStatus: "Confirmed" });
                const rejected = await EventParticipation.countDocuments({ eventID: h._id, registrationStatus: "Rejected" });

                return {
                    ...h.toObject(),
                    registrationCounts: { total, pending, confirmed, rejected }
                };
            })
        );
        return hackathonsWithCounts;
    }

    async getHackathonRegistrations(hackathonId, companyId) {
        const hackathon = await Hackathon.findOne({ _id: hackathonId, createdBy: companyId });
        if (!hackathon) throw new Error("Hackathon not found or unauthorized");

        const registrations = await EventParticipation.find({ eventID: hackathonId }).sort({ createdAt: -1 });

        const detailed = await Promise.all(
            registrations.map(async (r) => ({
                ...r.toObject(),
                userDetails: await this.getUserDetailsByEmail(r.email)
            }))
        );
        return detailed;
    }

    async getHackathonRegistrationDetails(registrationId, companyId) {
        const registration = await EventParticipation.findById(registrationId);
        if (!registration) throw new Error("Registration not found");

        const hackathon = await Hackathon.findOne({ _id: registration.eventID, createdBy: companyId });
        if (!hackathon) throw new Error("Unauthorized to view this registration");

        const userDetails = await this.getUserDetailsByEmail(registration.email);

        const teamMembersWithDetails = await Promise.all(
            registration.teamMembers.map(async (m) => ({
                ...m.toObject(),
                userDetails: await this.getUserDetailsByEmail(m.email)
            }))
        );

        return { ...registration.toObject(), hackathon, userDetails, teamMembers: teamMembersWithDetails };
    }

    async confirmHackathonRegistration(registrationId, companyId) {
        const registration = await EventParticipation.findById(registrationId);
        if (!registration) {
            const error = new Error("Registration not found");
            error.statusCode = 404;
            throw error;
        }
    
        const hackathon = await Hackathon.findById(registration.eventID);
        if (!hackathon) {
            const error = new Error("Hackathon not found");
            error.statusCode = 404;
            throw error;
        }
    
        // Convert both to strings for comparison (in case one is ObjectId)
        const hackathonCreatorId = hackathon.createdBy?.toString();
        const requestingCompanyId = companyId?.toString();
    
        console.log('Debug - Registration ID:', registrationId);
        console.log('Debug - Event ID:', registration.eventID);
        console.log('Debug - Hackathon Creator ID:', hackathonCreatorId);
        console.log('Debug - Requesting Company ID:', requestingCompanyId);
        console.log('Debug - Match:', hackathonCreatorId === requestingCompanyId);
    
        if (hackathonCreatorId !== requestingCompanyId) {
            const error = new Error(
                `Unauthorized: You do not have permission to confirm this registration. ` +
                `Hackathon creator: ${hackathonCreatorId}, Your ID: ${requestingCompanyId}`
            );
            error.statusCode = 403;
            throw error;
        }
    
        registration.registrationStatus = "Confirmed";
        await registration.save();
    
        const emailSubject = `Registration Confirmed - ${hackathon.title}`;
        const emailBody = `
        Dear ${registration.name},
    
        Your registration for "${hackathon.title}" has been confirmed.
        Start Date: ${new Date(hackathon.startDate).toLocaleDateString()}
        End Date: ${new Date(hackathon.endDate).toLocaleDateString()}
        Location: ${hackathon.location}
    
        Regards,
        ${hackathon.contactEmail}
        `;
        
        try {
            await sendEmail(registration.email, emailSubject, emailBody);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Don't throw - registration is still confirmed
        }
    
        return registration;
    }

    async rejectHackathonRegistration(registrationId, companyId, reason) {
        const registration = await EventParticipation.findById(registrationId);
        if (!registration) throw new Error("Registration not found");

        const hackathon = await Hackathon.findOne({ _id: registration.eventID, createdBy: companyId });
        if (!hackathon) throw new Error("Unauthorized");

        registration.registrationStatus = "Rejected";
        registration.rejectionReason = reason || "No reason provided";
        await registration.save();

        const emailSubject = `Registration Update - ${hackathon.title}`;
        const emailBody = `
        Dear ${registration.name},
        Unfortunately, your registration for "${hackathon.title}" has been rejected.
        Reason: ${reason || "Not specified"}

        Regards,
        ${hackathon.contactEmail}
        `;
        await sendEmail(registration.email, emailSubject, emailBody);

        return registration;
    }

    async sendFileToConfirmedUsers(req, companyId) {
        const { hackathonId } = req.params;
        const { fileUrl, fileName, message } = req.body;

        let uploadedFileUrl = fileUrl;
        let uploadedFileName = fileName;

        const selectedCandidates = req.body['selectedCandidates[]'] 
            ? (Array.isArray(req.body['selectedCandidates[]']) 
                ? req.body['selectedCandidates[]'] 
                : [req.body['selectedCandidates[]']])
            : null;

        const hackathon = await Hackathon.findOne({ _id: hackathonId, createdBy: companyId });
        if (!hackathon) throw new Error("Hackathon not found or unauthorized");

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "hackathon_files", use_filename: true, unique_filename: true },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(req.file.buffer);
            });

            uploadedFileUrl = result.secure_url;
            uploadedFileName = req.file.originalname;
        }

        if (!uploadedFileUrl || !uploadedFileName) throw new Error("File upload failed or missing data");

        let targetRegs;
        if (selectedCandidates && selectedCandidates.length > 0) {
            targetRegs = await EventParticipation.find({ 
                _id: { $in: selectedCandidates },
                eventID: hackathonId
            });
        } else {
            targetRegs = await EventParticipation.find({
                eventID: hackathonId,
                registrationStatus: "Confirmed"
            });
        }

        if (targetRegs.length === 0) throw new Error("No registrations found to send file to");

        const emails = targetRegs.map((r) => r.email);
        const notificationMessage = message 
            ? `${message}\n\nFile: ${uploadedFileName}` 
            : `A new file has been shared for ${hackathon.title}. Download: ${uploadedFileName}`;

        const results = await sendBulkNotifications(emails, {
            senderId: companyId,
            type: "FILE_SHARED",
            message: notificationMessage,
            referenceId: hackathonId,
            fileUrl: uploadedFileUrl,
            fileName: uploadedFileName,
            eventTitle: hackathon.title
        });

        const successCount = results.filter((r) => r.success).length;
        const failCount = results.length - successCount;

        return {
            message: `File sent to ${successCount} users, failed for ${failCount}`,
            data: { results, fileUrl: uploadedFileUrl, fileName: uploadedFileName }
        };
    }
}

// Export a singleton instance
export default new HackathonHostingService();
