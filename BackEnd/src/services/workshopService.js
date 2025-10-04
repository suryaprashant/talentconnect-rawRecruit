import Workshop from "../models/workshopModel.js";
import { v2 as cloudinary } from 'cloudinary';
import EventRegistration from '../models/eventParticipationDetails.js'

/**
 * Service class for handling workshop-related business logic
 */
class WorkshopService {

    /**
     * Create a new workshop
     * @param {Object} workshopData - The workshop data from request body
     * @param {Object} file - The uploaded file (if any)
     * @param {string} createdBy - The ID of the user creating the workshop
     * @returns {Object} Created workshop object
     */
    async createWorkshop(workshopData, file = null, createdBy = null) {
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
        } = workshopData;

        // Handle logo upload if provided (optional for now)
        let logoUrl = '';
        if (file) {
            console.log('File upload detected but not processed yet:', file);
            // TODO: Implement file upload when Cloudinary is properly configured
        }

        // Transform rewards data to match model structure
        const rewardsAndBenefits = this._transformRewardsData(rewards);

        // Determine workshop type based on mode
        const workshopType = this._determineWorkshopType(mode);

        // Determine max team size based on participation type
        const maxTeamSize = this._determineMaxTeamSize(participationType, maxTeamMembers);

        // Validate required fields
        this._validateRequiredFields({ location });

        // Normalize various inputs
        const normalizedRounds = this._normalizeJsonInput(rounds, []);
        const normalizedFaqs = this._normalizeFaqs(faqs);
        const normalizedPanelMembers = this._normalizePanelMembers(panelMembers);
        const normalizedDomains = this._normalizeDomains(domains);

        // Create workshop
        const workshop = await Workshop.create({
            title,
            description,
            workshopType,
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

        return workshop;
    }

    /**
     * Update an existing workshop
     * @param {string} workshopId - The workshop ID
     * @param {Object} updateData - The update data
     * @param {Object} file - The uploaded file (if any)
     * @returns {Object} Updated workshop object
     */
    async updateWorkshop(workshopId, updateData, file = null) {
        let workshop = await Workshop.findById(workshopId);

        if (!workshop) {
            throw new Error(`Workshop not found with id of ${workshopId}`);
        }

        // Handle image upload if a new banner is provided
        if (file) {
            // Delete previous image from Cloudinary
            if (workshop.bannerImage) {
                const publicId = workshop.bannerImage
                    .split('/')
                    .slice(-2)
                    .join('/')
                    .split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'workshop_banners',
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

        workshop = await Workshop.findByIdAndUpdate(workshopId, updateData, {
            new: true,
            runValidators: true
        });

        return workshop;
    }

    /**
     * Delete a workshop
     * @param {string} workshopId - The workshop ID
     * @returns {Object} Success response
     */
    async deleteWorkshop(workshopId) {
        const workshop = await Workshop.findById(workshopId);

        if (!workshop) {
            throw new Error(`Workshop not found with id of ${workshopId}`);
        }

        // Delete banner image from Cloudinary
        if (workshop.bannerImage) {
            const publicId = workshop.bannerImage
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await workshop.deleteOne();

        return { success: true };
    }

    /**
     * Get all workshops
     * @returns {Array} Array of workshops
     */
    async getAllWorkshops() {
        const workshops = await Workshop.find().sort('-createdAt');
        const workshopsWithRegistrations = await Promise.all(
            workshops.map(async (workshop) => {
                const count = await EventRegistration.countDocuments({ eventID: workshop._id });
                return {
                    ...workshop.toObject(),
                    registeredUsers: count
                };
            })
        );
        return workshopsWithRegistrations;
    }


    /**
     * Get a single workshop by ID
     * @param {string} workshopId - The workshop ID
     * @returns {Object} Workshop object
     */
    async getWorkshopById(workshopId) {
        const workshop = await Workshop.findById(workshopId).populate([
            { path: 'panelMembers' },
        ]);

        if (!workshop) {
            throw new Error(`Workshop not found with id of ${workshopId}`);
        }

        return workshop;
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
     * Determine workshop type based on mode
     * @param {string} mode - The mode value
     * @returns {string} Workshop type
     */
    _determineWorkshopType(mode) {
        let workshopType = 'Virtual';
        if (mode === 'Online') workshopType = 'Virtual';
        else if (mode === 'Hybrid') workshopType = 'Hybrid';
        else if (mode === 'Private') workshopType = 'In-person';
        return workshopType;
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
}

// Export a singleton instance
export default new WorkshopService();
