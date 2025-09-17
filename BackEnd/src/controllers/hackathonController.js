import Hackathon from "../models/hackathonModel.js";

export const createHackathon = async (req, res, next) => {
    try {
        // Debug: Log the incoming request body
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        
        const {
            title,
            subTitle,
            description,
            problemStatements, // Changed from goal to problemStatements
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
        } = req.body;
        
        // Debug: Log the extracted location value
        console.log('Extracted location value:', location);

        // Handle logo upload if provided (optional for now)
        let logoUrl = '';
        if (req.file) {
            console.log('File upload detected but not processed yet:', req.file);
            // TODO: Implement file upload when Cloudinary is properly configured
        }

        // Transform rewards data to match model structure
        const rewardsAndBenefits = [];

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

        // Determine hackathon type based on mode
        let hackathonType = 'Virtual';
        if (mode === 'Online') hackathonType = 'Virtual';
        else if (mode === 'Hybrid') hackathonType = 'Hybrid';
        else if (mode === 'Private') hackathonType = 'In-person';

        // Determine max team size based on participation type
        let maxTeamSize = 1;
        if (participationType === 'Team') {
            maxTeamSize = parseInt(maxTeamMembers) || 5;
        } else if (participationType === 'Both') {
            maxTeamSize = parseInt(maxTeamMembers) || 5;
        }

        // Validate required fields
        if (!location || location.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Location is required',
                error: 'Please provide a location for the hackathon'
            });
        }

        // Normalize rounds input (support JSON string from multipart/form-data)
        let normalizedRounds = rounds;
        if (typeof normalizedRounds === 'string') {
            try {
                normalizedRounds = JSON.parse(normalizedRounds);
            } catch (e) {
                console.warn('Failed to parse rounds JSON string, keeping as-is.');
            }
        }

        // Normalize faqs input (support JSON string from multipart/form-data)
        let normalizedFaqs = faqs;
        if (typeof normalizedFaqs === 'string') {
            try {
                normalizedFaqs = JSON.parse(normalizedFaqs);
            } catch (e) {
                normalizedFaqs = [];
            }
        }
        // Filter out empty FAQ entries
        if (Array.isArray(normalizedFaqs)) {
            normalizedFaqs = normalizedFaqs.filter(f => f.question && f.answer);
        } else {
            normalizedFaqs = [];
        }

        // Normalize panelMembers input (support JSON string from multipart/form-data)
        let normalizedPanelMembers = panelMembers;
        if (typeof normalizedPanelMembers === 'string') {
            try {
                normalizedPanelMembers = JSON.parse(normalizedPanelMembers);
            } catch (e) {
                normalizedPanelMembers = [];
            }
        }
        // Ensure all panel member IDs are valid ObjectIds (as strings)
        if (Array.isArray(normalizedPanelMembers)) {
            normalizedPanelMembers = normalizedPanelMembers.filter(id => !!id);
        } else {
            normalizedPanelMembers = [];
        }

        // Normalize domains input
        let normalizedDomains = domains;
        if (typeof domains === 'string') {
            normalizedDomains = domains.split(',').map(domain => domain.trim()).filter(domain => domain);
        } else if (Array.isArray(domains)) {
            normalizedDomains = domains.filter(domain => domain && typeof domain === 'string');
        } else {
            normalizedDomains = [];
        }

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
            // Changed goal to problemStatements
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
            eligibility: eligibility || '', // Ensure eligibility is included
            domains: normalizedDomains,    // Add normalized domains
        });

        res.status(201).json({
            success: true,
            message: 'Hackathon created successfully',
            data: hackathon
        });
    } catch (error) {
        console.error('Error creating hackathon:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create hackathon',
            error: error.message
        });
    }
};

// @desc    Update hackathon
export const updateHackathon = async (req, res, next) => {
    try {
        let hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                error: `Hackathon not found with id of ${req.params.id}`
            });
        }

        // Handle image upload if a new banner is provided
        if (req.file) {
            // Delete previous image from Cloudinary
            const publicId = hackathon.bannerImage
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId);

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'hackathon_banners',
                width: 1200,
                crop: 'scale'
            });

            req.body.bannerImage = result.secure_url;
        }

        // Handle rewards and benefits if provided as a string
        if (req.body.rewardsAndBenefits && typeof req.body.rewardsAndBenefits === 'string') {
            req.body.rewardsAndBenefits = JSON.parse(req.body.rewardsAndBenefits);
        }

        // Normalize rounds input on update as well
        if (req.body.rounds && typeof req.body.rounds === 'string') {
            try {
                req.body.rounds = JSON.parse(req.body.rounds);
            } catch (e) {
                console.warn('Failed to parse rounds JSON string on update, keeping as-is.');
            }
        }

        // Normalize faqs input on update as well
        if (req.body.faqs && typeof req.body.faqs === 'string') {
            try {
                req.body.faqs = JSON.parse(req.body.faqs);
            } catch (e) {
                req.body.faqs = [];
            }
        }

        // Normalize panelMembers input on update as well
        if (req.body.panelMembers && typeof req.body.panelMembers === 'string') {
            try {
                req.body.panelMembers = JSON.parse(req.body.panelMembers);
            } catch (e) {
                req.body.panelMembers = [];
            }
        }

        hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        next(error);
    }
};

export const deleteHackathon = async (req, res, next) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                error: `Hackathon not found with id of ${req.params.id}`
            });
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

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

//   Get all hackathons
export const getHackathons = async (req, res, next) => {
    try {
        const hackathons = await Hackathon.find()
            // .populate('panelMembers')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: hackathons.length,
            data: hackathons
        });
    } catch (error) {
        next(error);
    }
};

//  Get single hackathon
export const getHackathon = async (req, res, next) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id).populate([
            { path: 'panelMembers' },
            // { path: 'teams' }
        ]);

        if (!hackathon) {
            return res.status(404).json({
                success: false,
                error: `Hackathon not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add panel member to hackathon
// @route   PUT /api/v1/hackathons/:id/panel-members/:memberId
// @access  Private (Admin)
// export const addPanelMember = async (req, res, next) => {
//   try {
//     const hackathon = await Hackathon.findById(req.params.id);
//     const memberId = req.params.memberId;

//     if (!hackathon) {
//       return res.status(404).json({
//         success: false,
//         error: Hackathon not found with id of ${req.params.id}
//       });
//     }

//     // Check if member already exists in panel
//     if (hackathon.panelMembers.includes(memberId)) {
//       return res.status(400).json({
//         success: false,
//         error: Panel member is already added to this hackathon
//       });
//     }

//     hackathon.panelMembers.push(memberId);
//     await hackathon.save();

//     res.status(200).json({
//       success: true,
//       data: hackathon
//     });
//   } catch (error) {
//     next(error);
//   }
// };