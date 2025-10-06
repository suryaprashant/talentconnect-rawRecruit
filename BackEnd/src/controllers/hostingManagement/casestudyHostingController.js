import Casestudy from '../../models/casestudyModel.js';
import CasestudyParticipation from '../../models/casestudyParticipationDetails.js';
import Auth from '../../models/authModel.js';
import StudentOverview from '../../models/studentModel.js';
import ProfessionalProfile from '../../models/professionalProfileModel.js';
import FresherProfile from '../../models/fresherProfileModel.js';
import { sendEmail } from '../../utils/sendEmail.js';
import { sendBulkNotifications } from '../../utils/sendNotification.js';
import cloudinary from '../../../config/cloudinary.js';

// Helper function to get user details by email
const getUserDetailsByEmail = async (email) => {
  try {
    // First find the auth record to get user type
    const authUser = await Auth.findOne({ email });
    if (!authUser) return null;

    let userDetails = {
      name: authUser.name,
      email: authUser.email,
      userType: authUser.userType
    };

    // Based on user type, fetch additional profile information
    switch (authUser.userType) {
      case 'student':
        const studentProfile = await StudentOverview.findOne({ email });
        if (studentProfile) {
          userDetails = {
            ...userDetails,
            name: studentProfile.name,
            phone: studentProfile.mobileNumber,
            locations: studentProfile.preferredJobLocations?.join(', '),
            degree: studentProfile.branchOfStudy,
            specialization: studentProfile.batch,
            industry: studentProfile.interestedIndustry,
            skills: studentProfile.skills,
            linkedIn: studentProfile.linkedinUrl,
            github: studentProfile.githubUrl,
            portfolio: studentProfile.portfolioUrl,
            cv: studentProfile.resumeUrl
          };
        }
        break;
      
      case 'professional':
        const professionalProfile = await ProfessionalProfile.findOne({ email });
        if (professionalProfile) {
          userDetails = {
            ...userDetails,
            name: professionalProfile.name,
            phone: professionalProfile.mobileNumber,
            locations: professionalProfile.currentLocation,
            currentSalaryCurrency: professionalProfile.currentSalaryCurrency,
            currentSalaryAmount: professionalProfile.currentSalaryAmount,
            expectedSalaryCurrency: professionalProfile.expectedSalaryCurrency,
            expectedSalaryAmount: professionalProfile.expectedSalaryAmount,
            degree: professionalProfile.highestQualification,
            specialization: professionalProfile.fieldOfStudy,
            industry: professionalProfile.currentIndustry,
            skills: professionalProfile.skills,
            linkedIn: professionalProfile.linkedinUrl,
            github: professionalProfile.githubUrl,
            portfolio: professionalProfile.portfolioUrl,
            cv: professionalProfile.resumeUrl
          };
        }
        break;
      
      case 'fresher':
        const fresherProfile = await FresherProfile.findOne({ email });
        if (fresherProfile) {
          userDetails = {
            ...userDetails,
            name: fresherProfile.name,
            phone: fresherProfile.mobileNumber,
            locations: fresherProfile.preferredJobLocations?.join(', '),
            expectedSalaryCurrency: fresherProfile.expectedSalaryCurrency,
            expectedSalaryAmount: fresherProfile.expectedSalaryAmount,
            degree: fresherProfile.highestQualification,
            specialization: fresherProfile.fieldOfStudy,
            industry: fresherProfile.interestedIndustry,
            skills: fresherProfile.skills,
            linkedIn: fresherProfile.linkedinUrl,
            github: fresherProfile.githubUrl,
            portfolio: fresherProfile.portfolioUrl,
            cv: fresherProfile.resumeUrl
          };
        }
        break;
    }

    return userDetails;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// @desc    Get all case studies hosted by a company with registration counts
// @route   GET /hosting-management/casestudies
export const getCompanyCasestudiesWithRegistrations = async (req, res) => {
  try {
    const companyId = req.user.id;

    // Find all case studies created by this company
    const casestudies = await Casestudy.find({ createdBy: companyId })
      .sort({ createdAt: -1 });

    // Get registration counts for each case study
    const casestudiesWithCounts = await Promise.all(
      casestudies.map(async (casestudy) => {
        const totalRegistrations = await CasestudyParticipation.countDocuments({ 
          eventID: casestudy._id 
        });
        
        const pendingRegistrations = await CasestudyParticipation.countDocuments({ 
          eventID: casestudy._id, 
          registrationStatus: 'Pending' 
        });
        
        const confirmedRegistrations = await CasestudyParticipation.countDocuments({ 
          eventID: casestudy._id, 
          registrationStatus: 'Confirmed' 
        });
        
        const rejectedRegistrations = await CasestudyParticipation.countDocuments({ 
          eventID: casestudy._id, 
          registrationStatus: 'Rejected' 
        });

        return {
          ...casestudy.toObject(),
          registrationCounts: {
            total: totalRegistrations,
            pending: pendingRegistrations,
            confirmed: confirmedRegistrations,
            rejected: rejectedRegistrations
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: casestudiesWithCounts.length,
      data: casestudiesWithCounts
    });
  } catch (error) {
    console.error('Error fetching company case studies:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all registrations for a specific case study
// @route   GET /hosting-management/casestudies/:casestudyId/registrations
export const getCasestudyRegistrations = async (req, res) => {
  try {
    const { casestudyId } = req.params;
    const companyId = req.user.id;

    // Verify that the case study belongs to the company
    const casestudy = await Casestudy.findOne({ 
      _id: casestudyId, 
      createdBy: companyId 
    });

    if (!casestudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found or you do not have permission to view its registrations'
      });
    }

    // Get all registrations for this case study with user details
    const registrations = await CasestudyParticipation.find({ eventID: casestudyId })
      .sort({ createdAt: -1 });

    // Populate user details for each registration
    const registrationsWithUserDetails = await Promise.all(
      registrations.map(async (registration) => {
        const userDetails = await getUserDetailsByEmail(registration.email);
        
        return {
          ...registration.toObject(),
          userDetails: userDetails
        };
      })
    );

    res.status(200).json({
      success: true,
      casestudy: casestudy,
      count: registrationsWithUserDetails.length,
      data: registrationsWithUserDetails
    });
  } catch (error) {
    console.error('Error fetching case study registrations:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get detailed information about a specific registration
// @route   GET /hosting-management/registrations/:registrationId
export const getCasestudyRegistrationDetails = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const companyId = req.user.id;

    // Find the registration
    const registration = await CasestudyParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Verify that the case study belongs to the company
    const casestudy = await Casestudy.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!casestudy) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this registration'
      });
    }

    // Get user details
    const userDetails = await getUserDetailsByEmail(registration.email);

    // Get team member details if any
    const teamMembersWithDetails = await Promise.all(
      registration.teamMembers.map(async (member) => {
        if (member.teamMemberId) {
          // For team members, we'll try to get details by their email if available
          const memberDetails = await getUserDetailsByEmail(member.email);
          return {
            ...member.toObject(),
            userDetails: memberDetails
          };
        }
        return member;
      })
    );

    res.status(200).json({
      success: true,
      data: {
        ...registration.toObject(),
        casestudy: casestudy,
        userDetails: userDetails,
        teamMembers: teamMembersWithDetails
      }
    });
  } catch (error) {
    console.error('Error fetching registration details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Confirm a registration
// @route   PUT /hosting-management/registrations/:registrationId/confirm
export const confirmCasestudyRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const companyId = req.user.id;

    // Find the registration
    const registration = await CasestudyParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Verify that the case study belongs to the company
    const casestudy = await Casestudy.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!casestudy) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this registration'
      });
    }

    // Update registration status
    registration.registrationStatus = 'Confirmed';
    await registration.save();

    // Send confirmation email to the participant
    try {
      const emailSubject = `Registration Confirmed - ${casestudy.title}`;
      const emailBody = `
        Dear ${registration.name},

        Congratulations! Your registration for the case study "${casestudy.title}" has been confirmed.

        Event Details:
        - Title: ${casestudy.title}
        - Start Date: ${new Date(casestudy.startDate).toLocaleDateString()}
        - End Date: ${new Date(casestudy.endDate).toLocaleDateString()}
        - Location: ${casestudy.location}

        We look forward to your participation!

        Best regards,
        ${casestudy.contactEmail}
      `;

      await sendEmail(registration.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Registration confirmed successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error confirming registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reject a registration
// @route   PUT /hosting-management/registrations/:registrationId/reject
export const rejectCasestudyRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { reason } = req.body;
    const companyId = req.user.id;

    // Find the registration
    const registration = await CasestudyParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Verify that the case study belongs to the company
    const casestudy = await Casestudy.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!casestudy) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this registration'
      });
    }

    // Update registration status
    registration.registrationStatus = 'Rejected';
    if (reason) {
      registration.rejectionReason = reason;
    }
    await registration.save();

    // Send rejection email to the participant
    try {
      const emailSubject = `Registration Update - ${casestudy.title}`;
      const emailBody = `
        Dear ${registration.name},

        Thank you for your interest in the case study "${casestudy.title}".

        Unfortunately, we are unable to confirm your registration at this time.
        ${reason ? `\n\nReason: ${reason}` : ''}

        We encourage you to apply for future events.

        Best regards,
        ${casestudy.contactEmail}
      `;

      await sendEmail(registration.email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Registration rejected successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error rejecting registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Send file to confirmed registrations
// @route   POST /hosting-management/casestudies/:casestudyId/send-file
export const sendFileToConfirmedUsers = async (req, res) => {
  try {
    const { casestudyId } = req.params;
    const { fileUrl, fileName, message } = req.body;
    const companyId = req.user.id;
    let uploadedFileUrl = fileUrl;
    let uploadedFileName = fileName;
    
    // Parse selectedCandidates from FormData (comes as array with [] notation)
    const selectedCandidates = req.body['selectedCandidates[]'] 
      ? (Array.isArray(req.body['selectedCandidates[]']) 
          ? req.body['selectedCandidates[]'] 
          : [req.body['selectedCandidates[]']])
      : null;

    const casestudy = await Casestudy.findOne({ 
      _id: casestudyId, 
      createdBy: companyId 
    });

    if (!casestudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found or you do not have permission'
      });
    }

    // Handle file upload if file is provided
    if (req.file) {
      try {
        // Upload file to Cloudinary using buffer stream
        const uploadPromise = new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'auto', 
              folder: 'casestudy_files',
              use_filename: true,
              unique_filename: true
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

        const result = await uploadPromise;
        uploadedFileUrl = result.secure_url;
        uploadedFileName = req.file.originalname;
      } catch (uploadError) {
        console.error('Error uploading file to Cloudinary:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file',
          error: uploadError.message
        });
      }
    }

    // Validate that we have file URL and name
    if (!uploadedFileUrl || !uploadedFileName) {
      return res.status(400).json({
        success: false,
        message: 'File URL and file name are required'
      });
    }

    // Determine which registrations to send to
    let targetRegistrations;
    
    if (selectedCandidates && selectedCandidates.length > 0) {
      // Send to specific selected candidates
      targetRegistrations = await CasestudyParticipation.find({ 
        _id: { $in: selectedCandidates },
        eventID: casestudyId
      });
    } else {
      // Send to all confirmed registrations (default behavior)
      targetRegistrations = await CasestudyParticipation.find({ 
        eventID: casestudyId,
        registrationStatus: 'Confirmed'
      });
    }

    if (targetRegistrations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No registrations found to send file to'
      });
    }

    // Send notifications to each target user
    const recipientEmails = targetRegistrations.map(reg => reg.email);
    
    const notificationMessage = message 
      ? `${message}\n\nFile: ${uploadedFileName}` 
      : `A new file has been shared for ${casestudy.title}. Download: ${uploadedFileName}`;
    
    const results = await sendBulkNotifications(recipientEmails, {
      senderId: companyId,
      type: 'FILE_SHARED',
      message: notificationMessage,
      referenceId: casestudyId,
      fileUrl: uploadedFileUrl,
      fileName: uploadedFileName,
      eventTitle: casestudy.title
    });

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      message: `File sent to ${successCount} user(s)`,
      data: {
        totalSent: successCount,
        totalFailed: failCount,
        fileUrl: uploadedFileUrl,
        fileName: uploadedFileName,
        results: results
      }
    });
  } catch (error) {
    console.error('Error sending file:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
