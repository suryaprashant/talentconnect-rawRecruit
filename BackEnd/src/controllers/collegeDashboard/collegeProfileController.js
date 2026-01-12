import CollegeProfile from '../../models/collegeDashboard/collegeProfileModel.js';
import cloudinary from '../../../config/cloudinary.js';
import streamifier from 'streamifier';
import { updateCollegeProfileService } from '../../services/collegeService.js';

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