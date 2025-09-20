import Casestudy from "../models/casestudyModel.js";

export const createCasestudy = async (req, res, next) => {
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

        // Determine case study type based on mode
        let casestudyType = 'Virtual';
        if (mode === 'Online') casestudyType = 'Virtual';
        else if (mode === 'Hybrid') casestudyType = 'Hybrid';
        else if (mode === 'Private') casestudyType = 'In-person';

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
                error: 'Please provide a location for the case study'
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

        // Create case study
        const casestudy = await Casestudy.create({
            title,
            description,
            casestudyType,
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
            message: 'Case study created successfully',
            data: casestudy
        });
    } catch (error) {
        console.error('Error creating case study:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create case study',
            error: error.message
        });
    }
};

// @desc    Update case study
export const updateCasestudy = async (req, res, next) => {
    try {
        let casestudy = await Casestudy.findById(req.params.id);

        if (!casestudy) {
            return res.status(404).json({
                success: false,
                error: `Case study not found with id of ${req.params.id}`
            });
        }

        // Handle image upload if a new banner is provided
        if (req.file) {
            // Delete previous image from Cloudinary
            const publicId = casestudy.bannerImage
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId);

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'casestudy_banners',
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

        casestudy = await Casestudy.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: casestudy
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCasestudy = async (req, res, next) => {
    try {
        const casestudy = await Casestudy.findById(req.params.id);

        if (!casestudy) {
            return res.status(404).json({
                success: false,
                error: `Case study not found with id of ${req.params.id}`
            });
        }

        // Delete banner image from Cloudinary
        if (casestudy.bannerImage) {
            const publicId = casestudy.bannerImage
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await casestudy.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

//   Get all case studies
export const getCasestudies = async (req, res, next) => {
    try {
        const casestudies = await Casestudy.find()
            // .populate('panelMembers')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: casestudies.length,
            data: casestudies
        });
    } catch (error) {
        next(error);
    }
};

//  Get single case study
export const getCasestudy = async (req, res, next) => {
    try {
        const casestudy = await Casestudy.findById(req.params.id).populate([
            { path: 'panelMembers' },
            // { path: 'teams' }
        ]);

        if (!casestudy) {
            return res.status(404).json({
                success: false,
                error: `Case study not found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: casestudy
        });
    } catch (error) {
        next(error);
    }
};
