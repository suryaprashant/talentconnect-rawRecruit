import casestudyService from "src/services/casestudyService.js";

export const createCasestudy = async (req, res, next) => {
    try {
        // Debug: Log the incoming request body
        console.log('Received request body:', JSON.stringify(req.body, null, 2));
        
        // Debug: Log the extracted location value
        console.log('Extracted location value:', req.body.location);

        // Use the service to create case study
        const casestudy = await casestudyService.createCasestudy(req.body, req.file, req.user?.id);

        res.status(201).json({
            success: true,
            message: 'Case study created successfully',
            data: casestudy
        });
    } catch (error) {
        console.error('Error creating case study:', error);
        
        // Handle validation errors
        if (error.message === 'Location is required') {
            return res.status(400).json({
                success: false,
                message: 'Location is required',
                error: 'Please provide a location for the case study'
            });
        }
        
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
        const casestudy = await casestudyService.updateCasestudy(req.params.id, req.body, req.file);

        res.status(200).json({
            success: true,
            data: casestudy
        });
    } catch (error) {
        console.error('Error updating case study:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update case study',
            error: error.message
        });
    }
};

export const deleteCasestudy = async (req, res, next) => {
    try {
        await casestudyService.deleteCasestudy(req.params.id);

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

//   Get all case studies
export const getCasestudies = async (req, res, next) => {
    try {
        const casestudies = await casestudyService.getAllCasestudies();

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
        const casestudy = await casestudyService.getCasestudyById(req.params.id);

        res.status(200).json({
            success: true,
            data: casestudy
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

