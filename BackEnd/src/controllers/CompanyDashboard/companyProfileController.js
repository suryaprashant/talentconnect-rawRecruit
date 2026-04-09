// In your controller file (e.g., controllers/companyProfileController.js)

//import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js'
import CollegeProfile from '../../models/collegeDashboard/collegeProfileModel.js' // Ensure this import exists

import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js'
import cloudinary from '../../../config/cloudinary.js'
import streamifier from 'streamifier';
import { updateAuthUserService } from '../../services/authService.js';

import { getCompanyService, updateCompanyProfileService } from '../../services/companyService.js'

const COMPANY_FIELDS = [
  // ── Company Details ───────────────────────────────────────────────────
  { section: "companyDetails", path: "companyName"          },
  { section: "companyDetails", path: "description"          },
  { section: "companyDetails", path: "companyType"          },
  { section: "companyDetails", path: "industryType"         },
  { section: "companyDetails", path: "numberOfEmployees"    },
  { section: "companyDetails", path: "establishedYear"      },
  { section: "companyDetails", path: "phoneNumber"          },
  { section: "companyDetails", path: "alternatePhoneNumber" },
  { section: "companyDetails", path: "country"              },
  { section: "companyDetails", path: "state"                },
  { section: "companyDetails", path: "city"                 },
  { section: "companyDetails", path: "pincode"              },
 
  // ── Hiring Preferences ────────────────────────────────────────────────
  { section: "hiringPreferences", path: "jobRoles",        isArray: true },
  { section: "hiringPreferences", path: "hiringLocations", isArray: true },
  { section: "hiringPreferences", path: "lookingFor",      isArray: true },
  { section: "hiringPreferences", path: "employmentType",  isArray: true },
 
  // ── KYC / Verification ────────────────────────────────────────────────
  { section: "kycDetails", path: "kycDocuments",             isArray: true },
  { section: "kycDetails", path: "TAN"                       },
  { section: "kycDetails", path: "GSTNumber"                 },
  { section: "kycDetails", path: "companyRegistrationNumber" },
  { section: "kycDetails", path: "GSTIN"                     },
  { section: "kycDetails", path: "address"                   },
 
  // ── Company Profiles ──────────────────────────────────────────────────
  { section: "companyDetails", path: "companyLinkedin" },
  { section: "companyDetails", path: "websiteUrl"      },
 
  // ── Images (top-level fields) ─────────────────────────────────────────
  { section: null, path: "profileImageUrl"    },
  { section: null, path: "backgroundImageUrl" },
];
 
const TOTAL_FIELDS = COMPANY_FIELDS.length; // 26
 
function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
 
function calcPercentage(profile) {
  let filled = 0;
  for (const field of COMPANY_FIELDS) {
    const parent = field.section ? (profile[field.section] || {}) : profile;
    if (isFilled(parent[field.path])) filled++;
  }
  return Math.round((filled / TOTAL_FIELDS) * 100);
}

// Utility for streaming upload
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: `rawrecruit/${folder}` },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const createCompanyProfile = async (req, res) => {

  try {

    const userId = req.user._id; 
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated or ID missing.' });
    }

    const {
      companyDetails,
      employerDetails,
      hiringPreferences,
      kycDetails
    } = req.body;


    const files = req.files;
    const uploads = {};

    // Upload background image
    if (files?.backgroundImage?.[0]) {
      uploads.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'companyBackgroundImages')).secure_url;
    }

    // Upload KYC documents (multiple)
    const kycDocs = [];
    if (files?.kycDocuments) {
      for (const doc of files.kycDocuments) {
        const uploaded = await streamUpload(doc.buffer, 'kycDocuments');
        kycDocs.push(uploaded.secure_url);
      }
    }

    // Create company profile
    const companyProfile = await CompanyProfile.create({
      userId,
      employerDetails: JSON.parse(employerDetails),
      companyDetails: JSON.parse(companyDetails),
      hiringPreferences: JSON.parse(hiringPreferences),
      kycDetails: {
        ...JSON.parse(kycDetails),
        kycDocuments: kycDocs
      },
      backgroundImageUrl: uploads.backgroundImageUrl || ''
    });


    const updatedUser = await updateAuthUserService(userId, {
      //userType: "company", // Changed from "college" to "company"
      onboardingCompleted: true,
      onboardingStep: 6
    })

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found after update." });
    }

    res.status(201).json({
      message: 'Company profile created successfully',
      profile: companyProfile,
      user: updatedUser 
    });



  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A company profile already exists for this user.',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Failed to create company profile',
      error: error.message
    });
  }
};


export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const companyProfile = await getCompanyService(userId)
    
    console.log('for',req.user._id)
    console.log('in here',companyProfile)

    if (!companyProfile) {
      return res.status(404).json({
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      message: 'Company profile retrieved successfully',
      profile: companyProfile.data[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch company profile',
      error: error.message
    });
  }
};

// Update company profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
     console.log('User ID:', userId);
    const {
      companyDetails,
      hiringPreferences,
      kycDetails
    } = req.body;


      console.log('Request body fields present:', {
      companyDetails: !!companyDetails,
      hiringPreferences: !!hiringPreferences,
      kycDetails: !!kycDetails
    });

    const files = req.files;
    const updates = {};
    const kycDocs = [];

    // Handle file uploads if they exist
    if (files?.backgroundImage?.[0]) {
      updates.backgroundImageUrl = (await streamUpload(
        files.backgroundImage[0].buffer,
        'companyBackgroundImages'
      )).secure_url;
    }

    if (files?.profileImage?.[0]) { // Handle profile image for update
      updates.profileImageUrl = (await streamUpload(
        files.profileImage[0].buffer,
        'companyProfileImages'
      )).secure_url;
    }


    if (files?.kycDocuments) {
      for (const doc of files.kycDocuments) {
        const uploaded = await streamUpload(doc.buffer, 'kycDocuments');
        kycDocs.push(uploaded.secure_url);
      }
    }

    const safeJsonParse = (str, defaultValue = {}) => {
    try {
        return str ? JSON.parse(str) : defaultValue;
    } catch (error) {
        console.error('JSON parsing error:', error);
        return defaultValue;
    }
};

    // Prepare update object
 const updateData = {
    ...(companyDetails && { companyDetails: safeJsonParse(companyDetails) }),
    ...(hiringPreferences && { hiringPreferences: safeJsonParse(hiringPreferences) }),
    ...(kycDetails && {
        kycDetails: {
            ...safeJsonParse(kycDetails),
            ...(kycDocs.length > 0 && { kycDocuments: kycDocs })
        }
    }),
    ...updates
};

    // Find and update the profile
    const updatedProfile = await updateCompanyProfileService(userId , updateData)

    if (!updatedProfile) {
      return res.status(404).json({
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      message: 'Company profile updated successfully',
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Failed to update company Profile", error);

    res.status(500).json({
      message: 'Failed to update company profile',
      error: error.message
    });
  }
};



// controllers/CompanyDashboard/companyProfileController.js
export const getCompanyImageByUserId = async (req, res) => {
  try {
    const userId = req.params.userId

    const companyProfile = await getCompanyService(userId)
  
    console.log('for',userId)
    console.log('pp',companyProfile)

    if (!companyProfile) {
      return res.status(404).json({
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      message: 'Company profile retrieved successfully',
      profile: companyProfile.data[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch company profile',
      error: error.message
    });
  }
};

export const getCompanyProfileCompleteness = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user._id }).lean();
 
    if (!profile) {
      return res.status(404).json({ success: false, message: "Company profile not found." });
    }
 
    const percentage = calcPercentage(profile);
 
    return res.status(200).json({ success: true, percentage });
  } catch (error) {
    console.error("[getCompanyProfileCompleteness]", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};