import CollegeProfile from '../../models/collegeDashboard/collegeProfileModel.js';
import cloudinary from '../../../config/cloudinary.js';
import streamifier from 'streamifier';
import { updateCollegeProfileService, getStudentsByCollegeIdService } from '../../services/collegeService.js';
import CollegeOnboarding from "../../models/collegeDashboard/collegeOnboardingModel.js";





const PROFILE_FIELDS = [
  // ── College / University Details ──────────────────────────────────────
  { section: "collegeUniversityDetails", path: "collegeName"          },
  { section: "collegeUniversityDetails", path: "affiliatedUniversity" },
  { section: "collegeUniversityDetails", path: "establishedYear"      },
  { section: "collegeUniversityDetails", path: "phoneNumber"          },
  { section: "collegeUniversityDetails", path: "alternatePhoneNumber" },
  { section: "collegeUniversityDetails", path: "collegeLocation"      },
  { section: "collegeUniversityDetails", path: "country"              },
  { section: "collegeUniversityDetails", path: "state"                },
  { section: "collegeUniversityDetails", path: "pincode"              },
 
  // ── Placement Coordinator Details ─────────────────────────────────────
  { section: "placementCoordinatorDetails", path: "coordinatorName"   },
  { section: "placementCoordinatorDetails", path: "designation"       },
  { section: "placementCoordinatorDetails", path: "officialEmail"     },
  { section: "placementCoordinatorDetails", path: "officialMobile"    },
  { section: "placementCoordinatorDetails", path: "linkedinUrl"       },
 
  // ── Placement & Recruitment Details ───────────────────────────────────
  { section: "placementRecruitmentDetails", path: "programsOffered",              isArray: true },
  { section: "placementRecruitmentDetails", path: "popularCoursesForRecruitment", isArray: true },
  { section: "placementRecruitmentDetails", path: "preferredHiringCompanies",     isArray: true },
  { section: "placementRecruitmentDetails", path: "recruitmentServicesRequired",  isArray: true },
  { section: "placementRecruitmentDetails", path: "collegeBrochureUrl"            },
 
  // ── College Profile & Achievements ────────────────────────────────────
  { section: "profileAchievements", path: "collegeWebsite"    },
  { section: "profileAchievements", path: "linkedinProfile"   },
 
  // ── Dynamic sections (at least 1 entry = filled) ─────────────────────
  { section: null, path: "workshops",    isTopLevelArray: true },
  { section: null, path: "volunteering", isTopLevelArray: true },
  { section: null, path: "awards",       isTopLevelArray: true },
 
  // ── Images ────────────────────────────────────────────────────────────
  { section: null, path: "profileImage"    },
  { section: null, path: "backgroundImage" },
];
 
const TOTAL_FIELDS = PROFILE_FIELDS.length; // 26
 
function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
 
function calcPercentage(profile) {
  let filled = 0;
 
  for (const field of PROFILE_FIELDS) {
    if (field.isTopLevelArray) {
      // Dynamic sections: filled if array has at least 1 entry
      if (isFilled(profile[field.path])) filled++;
      continue;
    }
 
    const parent = field.section ? (profile[field.section] || {}) : profile;
    if (isFilled(parent[field.path])) filled++;
  }
 
  return Math.round((filled / TOTAL_FIELDS) * 100);
}
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

const safeParse = (data) => {
  try {
    return data ? JSON.parse(data) : {};
  } catch (err) {
    return {};
  }
};

const safeParseArray = (data) => {
  try {
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const createCollegeProfile = async (req, res) => {
  try {
    const {
      coordinatorName,
      designation,
      collegeDetails,
      placementCoordinatorDetails,
      placementAndRecruitmentDetails,
      collegeProfileAchievements,
      workshops,
      volunteering,
      awards
    } = req.body;

    const files = req.files;
    const uploads = {};

    if (files?.collegeImage?.[0]) {
      uploads.collegeImageUrl = (await streamUpload(files.collegeImage[0].buffer, 'collegeImages')).secure_url;
    }
    if (files?.backgroundImage?.[0]) {
      uploads.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'collegeBackgroundImages')).secure_url;
    }
    if (files?.coordinatorImage?.[0]) {
      uploads.coordinatorImageUrl = (await streamUpload(files.coordinatorImage[0].buffer, 'placementCoordinatorImages')).secure_url;
    }
    if (files?.collegeBrochure?.[0]) {
      uploads.collegeBrochureUrl = (await streamUpload(files.collegeBrochure[0].buffer, 'collegeBrochures')).secure_url;
    }

    const profile = await CollegeProfile.create({
      coordinatorName,
      designation,
      collegeDetails: {
        ...safeParse(collegeDetails),
        collegeImageUrl: uploads.collegeImageUrl || '',
        backgroundImageUrl: uploads.backgroundImageUrl || ''
      },
      placementCoordinatorDetails: {
        ...safeParse(placementCoordinatorDetails),
        coordinatorImageUrl: uploads.coordinatorImageUrl || ''
      },
      placementAndRecruitmentDetails: {
        ...safeParse(placementAndRecruitmentDetails),
        collegeBrochureUrl: uploads.collegeBrochureUrl || ''
      },
      collegeProfileAchievements: safeParse(collegeProfileAchievements),
      workshops: safeParseArray(workshops),
      volunteering: safeParseArray(volunteering),
      awards: safeParseArray(awards)
    });

    res.status(201).json({ message: 'College profile created successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create college profile', error: error.message });
  }
};

export const getStudentsByCollegeId = async (req, res) => {
  try {
    console.log('ok',req.user)
    const collegeId  =  req.user._id;
    

    const result = await getStudentsByCollegeIdService(collegeId);

    return res.status(result.status).json({
      success: result.success,
      message: result.message,
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// export const updateCollegeProfile = async (req, res) => {
//   try {
//     console.log('here')
//     const userId = req.user._id;
//     const files = req.files;
//     const updates = {};

//     // College logo
//     if (files?.collegeImage?.[0]) {
//       updates['collegeDetails.collegeImageUrl'] =
//         (await streamUpload(
//           files.collegeImage[0].buffer,
//           'collegeLogos'
//         )).secure_url;
//     }

//     // Background image
//     if (files?.backgroundImage?.[0]) {
//       updates['collegeDetails.backgroundImageUrl'] =
//         (await streamUpload(
//           files.backgroundImage[0].buffer,
//           'collegeBackgrounds'
//         )).secure_url;
//     }

//     // Placement coordinator image
//     if (files?.coordinatorImage?.[0]) {
//       updates['placementCoordinatorDetails.coordinatorImageUrl'] =
//         (await streamUpload(
//           files.coordinatorImage[0].buffer,
//           'collegeCoordinators'
//         )).secure_url;
//     }

//     const updatedProfile = await updateCollegeProfileService(userId, updates);

//     res.status(200).json({
//       message: 'College profile updated successfully',
//       profile: updatedProfile
//     });

//   } catch (error) {
//     console.error('College profile update failed:', error);
//     res.status(500).json({
//       message: 'Failed to update college profile',
//       error: error.message
//     });
//   }
// };

export const updateCollegeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files;
    const updates = {};

    if (files?.collegeImage?.[0]) {
      const result = await streamUpload(files.collegeImage[0].buffer, 'collegeLogos');
      // 🔹 FIX: Use 'profileImage' to match your Onboarding Schema
      updates.profileImage = result.secure_url; 
    }

    if (files?.backgroundImage?.[0]) {
      const result = await streamUpload(files.backgroundImage[0].buffer, 'collegeBackgrounds');
      // 🔹 FIX: Use 'backgroundImage' to match your Onboarding Schema
      updates.backgroundImage = result.secure_url; 
    }

    const updatedProfile = await updateCollegeProfileService(userId, updates);

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getProfileCompleteness = async (req, res) => {
  try {
    const profile = await CollegeOnboarding.findOne({ userId: req.user._id }).lean();

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    const percentage = calcPercentage(profile);

    return res.status(200).json({ success: true, percentage });
  } catch (error) {
    console.error("[getProfileCompleteness]", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};