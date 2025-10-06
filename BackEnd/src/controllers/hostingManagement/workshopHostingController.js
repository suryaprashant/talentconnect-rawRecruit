import Workshop from '../../models/workshopModel.js';
import EventParticipation from '../../models/eventParticipationModel.js';
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
    const authUser = await Auth.findOne({ email });
    if (!authUser) return null;

    let userDetails = {
      name: authUser.name,
      email: authUser.email,
      userType: authUser.userType
    };

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

// @desc    Get all workshops hosted by a company with registration counts
// @route   GET /hosting-management/workshops
export const getCompanyWorkshopsWithRegistrations = async (req, res) => {
  try {
    const companyId = req.user.id;

    const workshops = await Workshop.find({ createdBy: companyId })
      .sort({ createdAt: -1 });

    const workshopsWithCounts = await Promise.all(
      workshops.map(async (workshop) => {
        const totalRegistrations = await EventParticipation.countDocuments({ 
          eventID: workshop._id 
        });
        
        const pendingRegistrations = await EventParticipation.countDocuments({ 
          eventID: workshop._id, 
          registrationStatus: 'Pending' 
        });
        
        const confirmedRegistrations = await EventParticipation.countDocuments({ 
          eventID: workshop._id, 
          registrationStatus: 'Confirmed' 
        });
        
        const rejectedRegistrations = await EventParticipation.countDocuments({ 
          eventID: workshop._id, 
          registrationStatus: 'Rejected' 
        });

        return {
          ...workshop.toObject(),
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
      count: workshopsWithCounts.length,
      data: workshopsWithCounts
    });
  } catch (error) {
    console.error('Error fetching company workshops:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all registrations for a specific workshop
// @route   GET /hosting-management/workshops/:workshopId/registrations
export const getWorkshopRegistrations = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const companyId = req.user.id;

    const workshop = await Workshop.findOne({ 
      _id: workshopId, 
      createdBy: companyId 
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found or you do not have permission to view its registrations'
      });
    }

    const registrations = await EventParticipation.find({ eventID: workshopId })
      .sort({ createdAt: -1 });

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
      workshop: workshop,
      count: registrationsWithUserDetails.length,
      data: registrationsWithUserDetails
    });
  } catch (error) {
    console.error('Error fetching workshop registrations:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get detailed information about a specific registration
// @route   GET /hosting-management/registrations/:registrationId
export const getRegistrationDetails = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const companyId = req.user.id;

    const registration = await EventParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const workshop = await Workshop.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!workshop) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this registration'
      });
    }

    const userDetails = await getUserDetailsByEmail(registration.email);

    const teamMembersWithDetails = await Promise.all(
      registration.teamMembers.map(async (member) => {
        if (member.teamMemberId) {
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
        workshop: workshop,
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
export const confirmRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const companyId = req.user.id;

    const registration = await EventParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const workshop = await Workshop.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!workshop) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this registration'
      });
    }

    registration.registrationStatus = 'Confirmed';
    await registration.save();

    try {
      const emailSubject = `Registration Confirmed - ${workshop.title}`;
      const emailBody = `
        Dear ${registration.name},

        Congratulations! Your registration for the workshop "${workshop.title}" has been confirmed.

        Event Details:
        - Title: ${workshop.title}
        - Start Date: ${new Date(workshop.startDate).toLocaleDateString()}
        - End Date: ${new Date(workshop.endDate).toLocaleDateString()}
        - Location: ${workshop.location}

        We look forward to your participation!

        Best regards,
        ${workshop.contactEmail}
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
export const rejectRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { reason } = req.body;
    const companyId = req.user.id;

    const registration = await EventParticipation.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const workshop = await Workshop.findOne({ 
      _id: registration.eventID, 
      createdBy: companyId 
    });

    if (!workshop) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this registration'
      });
    }

    registration.registrationStatus = 'Rejected';
    if (reason) {
      registration.rejectionReason = reason;
    }
    await registration.save();

    try {
      const emailSubject = `Registration Update - ${workshop.title}`;
      const emailBody = `
        Dear ${registration.name},

        Thank you for your interest in the workshop "${workshop.title}".

        Unfortunately, we are unable to confirm your registration at this time.
        ${reason ? `\n\nReason: ${reason}` : ''}

        We encourage you to apply for future events.

        Best regards,
        ${workshop.contactEmail}
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
// @route   POST /hosting-management/workshops/:workshopId/send-file
export const sendFileToConfirmedUsers = async (req, res) => {
  try {
    const { workshopId } = req.params;
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

    const workshop = await Workshop.findOne({ 
      _id: workshopId, 
      createdBy: companyId 
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: 'Workshop not found or you do not have permission'
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
              folder: 'workshop_files',
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
      targetRegistrations = await EventParticipation.find({ 
        _id: { $in: selectedCandidates },
        eventID: workshopId
      });
    } else {
      // Send to all confirmed registrations (default behavior)
      targetRegistrations = await EventParticipation.find({ 
        eventID: workshopId,
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
      : `A new file has been shared for ${workshop.title}. Download: ${uploadedFileName}`;
    
    const results = await sendBulkNotifications(recipientEmails, {
      senderId: companyId,
      type: 'FILE_SHARED',
      message: notificationMessage,
      referenceId: workshopId,
      fileUrl: uploadedFileUrl,
      fileName: uploadedFileName,
      eventTitle: workshop.title
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
