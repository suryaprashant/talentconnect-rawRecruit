import workshopService from "src/services/workshopService.js";

export const createWorkshop = async (req, res, next) => {
    try {
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        
        // Debug: Log the extracted location value
        console.log('Extracted location value:', req.body.location);

        // Use the service to create workshop
        const workshop = await workshopService.createWorkshop(req.body, req.file);

        res.status(201).json({
            success: true,
            message: 'Workshop created successfully',
            data: workshop
        });
    } catch (error) {
        console.error('Error creating workshop:', error);
        
        // Handle validation errors
        if (error.message === 'Location is required') {
            return res.status(400).json({
                success: false,
                message: 'Location is required',
                error: 'Please provide a location for the workshop'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create workshop',
            error: error.message
        });
    }
};

// @desc    Update workshop
export const updateWorkshop = async (req, res, next) => {
    try {
        const workshop = await workshopService.updateWorkshop(req.params.id, req.body, req.file);

        res.status(200).json({
            success: true,
            data: workshop
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

export const deleteWorkshop = async (req, res, next) => {
    try {
        await workshopService.deleteWorkshop(req.params.id);

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

//   Get all workshops
export const getWorkshops = async (req, res, next) => {
    try {
        const workshops = await workshopService.getAllWorkshops();

        res.status(200).json({
            success: true,
            count: workshops.length,
            data: workshops
        });
    } catch (error) {
        next(error);
    }
};

//  Get single workshop
export const getWorkshop = async (req, res, next) => {
    try {
        const workshop = await workshopService.getWorkshopById(req.params.id);

        res.status(200).json({
            success: true,
            data: workshop
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
