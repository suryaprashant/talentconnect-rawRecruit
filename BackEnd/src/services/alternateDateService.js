import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";
import Auth from "../models/authModel.js";

import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import { sendAlternateDateEmailToCollege } from "../utils/alternateDateEmail.js";


export const submitAlternateDatesService = async (jobId, companyId, alternateDates) => {
  try {
    // Get job posting details with college information
    const jobPosting = await JobPostingTable.findById(jobId)
      .populate({ 
        path: 'collegePosted', 
        select: 'collegeUniversityDetails userId'
      })
      .lean();

    if (!jobPosting) {
      return { success: false, msg: "Job posting not found" };
    }

   
    const company = await CompanyProfile.findById(companyId);
     console.log("companyId in service:", company);
    if (!company) {
      return { success: false, msg: "Company not found" };
    }

    // Get college email from Auth model using college's userId
    const college = await collegeOnboardingModel.findOne({ _id: jobPosting.collegePosted._id });
    if (!college) {
      return { success: false, msg: "College not found" };
    }

    const collegeUser = await Auth.findById(college.userId);
    if (!collegeUser || !collegeUser.email) {
      return { success: false, msg: "College email not found" };
    }

    // Format dates for email
    const formatDateForEmail = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (err) {
        return 'N/A';
      }
    };

    const originalDates = {
      startDate: formatDateForEmail(jobPosting.proposedSchedule?.startDate),
      endDate: formatDateForEmail(jobPosting.proposedSchedule?.endDate)
    };

    const formattedAlternateDates = {
      startDate: formatDateForEmail(alternateDates.startDate),
      endDate: formatDateForEmail(alternateDates.endDate)
    };

    // Send email to college
    await sendAlternateDateEmailToCollege(
      collegeUser.email,
      jobPosting.collegePosted.collegeUniversityDetails?.collegeName || "the College",
      company.companyDetails?.companyName || "Company",
      originalDates,
      formattedAlternateDates,
      jobPosting.jobTitle || "On-Campus Drive"
    );

    return { 
      success: true, 
      msg: "Alternate dates submitted successfully and email sent to college" 
    };

  } catch (error) {
    console.log("Error in submitAlternateDatesService: ", error.message);
    throw new Error("Failed to submit alternate dates");
  }
};