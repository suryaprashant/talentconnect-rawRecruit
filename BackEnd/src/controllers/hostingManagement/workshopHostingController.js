import workshopService from "../../services/workshopService.js";

// @desc    Get all workshops hosted by a company with registration counts
// @route   GET /hosting-management/workshops
export const getCompanyWorkshopsWithRegistrations = async (req, res, next) => {
  try {
    const data = await workshopService.getCompanyWorkshopsWithRegistrations(req.user.id);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("Error fetching company workshops:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company workshops",
      error: error.message
    });
  }
};

// @desc    Get all registrations for a specific workshop
// @route   GET /hosting-management/workshops/:workshopId/registrations
export const getWorkshopRegistrations = async (req, res, next) => {
  try {
    const data = await workshopService.getWorkshopRegistrations(req.params.workshopId, req.user.id);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("Error fetching workshop registrations:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get detailed information about a specific registration
// @route   GET /hosting-management/registrations/:registrationId
export const getRegistrationDetails = async (req, res, next) => {
  try {
    const data = await workshopService.getWorkshopRegistrationDetails(req.params.registrationId, req.user.id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error fetching registration details:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm a registration
// @route   PUT /hosting-management/registrations/:registrationId/confirm
export const confirmRegistration = async (req, res, next) => {
  try {
    const data = await workshopService.confirmWorkshopRegistration(req.params.registrationId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Registration confirmed successfully",
      data
    });
  } catch (error) {
    console.error("Error confirming registration:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject a registration
// @route   PUT /hosting-management/registrations/:registrationId/reject
export const rejectRegistration = async (req, res, next) => {
  try {
    const data = await workshopService.rejectWorkshopRegistration(
      req.params.registrationId,
      req.user.id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: "Registration rejected successfully",
      data
    });
  } catch (error) {
    console.error("Error rejecting registration:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send file to confirmed registrations
// @route   POST /hosting-management/workshops/:workshopId/send-file
export const sendFileToConfirmedUsers = async (req, res, next) => {
  try {
    const result = await workshopService.sendFileToConfirmedUsers(req, req.user.id);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};