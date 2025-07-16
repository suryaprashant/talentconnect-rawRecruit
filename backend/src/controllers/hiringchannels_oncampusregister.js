import Registration from "../models/HiringChannels_oncampusregister.js";
import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import { checkOnCampusApplicationExitence, oncampusApplicationService, poolcampusApplicationService } from "../services/Application.service.js";


export const submitRegistration = async (req, res) => {
  try {

    const userId = req.user._id;

    const companyProfile = await CompanyProfile.findOne({ userId });

    if (!companyProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }

    const registration = new Registration({
      ...req.body,
      companyPosted: companyProfile._id, // Store the company ID
    });
    console.log("Registration Data:", registration);
    await registration.save();
    //console.log("Registration saved successfully");
    res.status(201).json({
      success: true,
      //  message: "Pool campus hiring request submitted successfully",
      data: registration,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {

    const response = await Registration.find()
      .populate({
        path: 'companyPosted',
        select: 'companyDetails profileImage', // Add fields you need
      })
      .lean();
    //  console.log("API Response:", JSON.stringify(response, null, 2));
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getRegistrationDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Registration.findById(id)
      .populate({
        path: 'companyPosted',
        select: 'companyDetails profileImage hiringPreferences',
      })
      .lean();

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// export const getRegistrationDetail = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const response = await Registration.findById(id)
//       .populate({
//         path: 'companyPosted',
//         select: 'companyDetails profileImageUrl hiringPreferences'
//       })
//       .lean();

//     if (!response) {
//       return res.status(404).json({ error: "Registration not found" });
//     }

//     // Transform data with comprehensive defaults
//     const transformedData = {
//       _id: response._id,
//       company: response.companyPosted?.companyDetails?.companyName || 'Company',
//       description: response.description || 'No description available',
//       startDate: response.startDate || 'Not specified',
//       endDate: response.endDate || 'Not specified',
//       companyInfo: {
//         about: response.companyPosted?.companyDetails?.description || 'No company description',
//         website: response.companyPosted?.companyDetails?.websiteUrl || '',
//         stats: {
//           employees: response.companyPosted?.companyDetails?.numberOfEmployees || 'N/A',
//           revenue: 'N/A',
//           industries: response.companyPosted?.companyDetails?.industryType || 'N/A',
//           countries: 'N/A'
//         }
//       },
//       programDetails: {
//         eligibleDegrees: Array.isArray(response.degree) ? response.degree : ['Not specified'],
//         cutoff: 'N/A',
//         locations: Array.isArray(response.preferredLocations) ? response.preferredLocations : ['Not specified'],
//         compensation: {
//           amount: response.minimumSalary || 'Not specified',
//           details: 'As per company standards'
//         }
//       },
//       jobDetails: {
//         role: response.lookingFor || 'Not specified',
//         industry: response.companyPosted?.companyDetails?.industryType || 'Not specified',
//         department: 'Not specified',
//         employmentType: response.employmentType || 'Not specified',
//         roleCategory: 'Not specified',
//         workMode: 'On-campus',
//         locations: Array.isArray(response.preferredLocations) ? response.preferredLocations : ['Not specified'],
//         joiningDate: response.startDate || 'Not specified'
//       },
//       eligibility: {
//         degrees: Array.isArray(response.degree) ? response.degree : ['Not specified'],
//         branches: ['All'],
//         graduationYear: '2025',
//         minimumScores: {
//           tenth: '60%',
//           twelfth: '60%',
//           cgpa: '6.0'
//         }
//       },
//       benefits: Array.isArray(response.benefits) ? response.benefits : ['As per company policy'],
//       selectionProcess: {
//         steps: Array.isArray(response.rounds) ? response.rounds : ['Not specified'],
//         dates: {
//           registrationDeadline: response.endDate || 'Not specified',
//           onlineTest: 'N/A',
//           interview: 'N/A',
//           offerRollout: 'N/A'
//         }
//       },
//       requiredDocuments: Array.isArray(response.requiredDocuments) ? 
//         response.requiredDocuments : [
//           'Updated Resume',
//           'College ID Proof',
//           'Academic Mark Sheets'
//         ],
//       contactInfo: {
//         name: response.contactPerson || 'Company HR',
//         email: response.email || 'hr@company.com',
//         phone: response.mobile || 'Not specified'
//       }
//     };

//     res.status(200).json({ success: true, data: transformedData });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// apply
export async function createOnCampusApplication(req, res) {
  const collegeId = req.user._id;
  const { jobId } = req.body;

  // console.log("ids", collegeId, " ", jobId);

  try {
    const college = await collegeOnboardingModel.find({ userId: collegeId });

    if (await checkOnCampusApplicationExitence(college[0]._id, jobId) === true) return res.status(403).json({ msg: "Already Applied!" })

    const application = await oncampusApplicationService(college[0]._id, jobId);
    res.status(201).json({ msg: "Application Submitted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server" });
  }
}