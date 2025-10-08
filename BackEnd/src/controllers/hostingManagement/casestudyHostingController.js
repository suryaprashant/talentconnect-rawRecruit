// controllers/casestudyHostingController.js
import casestudyService from "../../services/casestudyService.js";

// @desc    Get all case studies hosted by a company with registration counts
// @route   GET /hosting-management/casestudies
export const getCompanyCasestudiesWithRegistrations = async (req, res, next) => {
  try {
    const data = await casestudyService.getCompanyCasestudiesWithRegistrations(req.user.id);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("Error fetching company case studies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company case studies",
      error: error.message
    });
  }
};

// @desc    Get all registrations for a specific case study
// @route   GET /hosting-management/casestudies/:casestudyId/registrations
export const getCasestudyRegistrations = async (req, res, next) => {
  try {
    const data = await casestudyService.getCasestudyRegistrations(req.params.casestudyId, req.user.id);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("Error fetching case study registrations:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get detailed information about a specific registration
// @route   GET /hosting-management/registrations/:registrationId
export const getCasestudyRegistrationDetails = async (req, res, next) => {
  try {
    const data = await casestudyService.getCasestudyRegistrationDetails(req.params.registrationId, req.user.id);

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
export const confirmCasestudyRegistration = async (req, res, next) => {
  try {
    const data = await casestudyService.confirmCasestudyRegistration(req.params.registrationId, req.user.id);

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
export const rejectCasestudyRegistration = async (req, res, next) => {
  try {
    const data = await casestudyService.rejectCasestudyRegistration(
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
// @route   POST /hosting-management/casestudies/:casestudyId/send-file
export const sendFileToConfirmedUsers = async (req, res, next) => {
  try {
    const result = await casestudyService.sendFileToConfirmedUsers(req, req.user.id);

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
