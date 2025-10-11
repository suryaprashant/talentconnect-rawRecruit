import hackathonHostingService from "src/services/hackathonHostingService.js";

export const createHackathon = async (req, res, next) => {
    try {
        // Debug: Log the incoming request body
        // console.log('Received request body:', JSON.stringify(req.body, null, 2));
        
        // Debug: Log the extracted location value
        // console.log('Extracted location value:', req.body.location);

        // Use the service to create hackathon
        const hackathon = await hackathonHostingService.createHackathon(req.body, req.file);

        res.status(201).json({
            success: true,
            message: 'Hackathon created successfully',
            data: hackathon
        });
    } catch (error) {
        console.error('Error creating hackathon:', error);
        
        // Handle validation errors
        if (error.message === 'Location is required') {
            return res.status(400).json({
                success: false,
                message: 'Location is required',
                error: 'Please provide a location for the hackathon'
            });
        }
        
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
        const hackathon = await hackathonHostingService.updateHackathon(req.params.id, req.body, req.file);

        res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

export const deleteHackathon = async (req, res, next) => {
    try {
        await hackathonHostingService.deleteHackathon(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};

//   Get all hackathons
export const getHackathons = async (req, res, next) => {
    try {
        const hackathons = await hackathonHostingService.getAllHackathons();

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
        const hackathon = await hackathonHostingService.getHackathonById(req.params.id);

        res.status(200).json({
            success: true,
            data: hackathon
        });
    } catch (error) {
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        next(error);
    }
};
