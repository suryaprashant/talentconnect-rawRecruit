// import EmployerProfile from '../../models/employerDashboard/employerProfileModel.js'
// import cloudinary from '../../../config/cloudinary.js';
// import streamifier from 'streamifier';

// const streamUpload = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: 'auto', folder: `rawrecruit/${folder}` },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// export const createEmployerProfile = async (req, res) => {
//   try {
//     const {
//       companyName,
//       description,
//       companyType,
//       industryType,
//       numberOfEmployees,
//       establishedYear,
//       contactNumber,
//       alternateNumber,
//       companyLocation,
//       state,
//       city,
//       country,
//       pincode,
//       companyWebsite,
//       linkedinProfile,
//       jobRoles,
//       preferredHiringLocations,
//       lookingFor,
//       employmentType,
//       tanNumber,
//       gstNumber,
//       companyRegNumber,
//     } = req.body;

//     const files = req.files;
//     const uploads = [];

//     // Handle multiple verification document uploads
//     if (files?.verificationDocuments) {
//       for (const file of files.verificationDocuments) {
//         const uploaded = await streamUpload(file.buffer, 'employerKYC');
//         uploads.push(uploaded.secure_url);
//       }
//     }

//     const employerProfile = await EmployerProfile.create({
//       companyName,
//       description,
//       companyType,
//       industryType,
//       numberOfEmployees,
//       establishedYear,
//       contactNumber,
//       alternateNumber,
//       companyLocation,
//       state,
//       city,
//       country,
//       pincode,
//       companyWebsite,
//       linkedinProfile,
//       hiringPreferences: {
//         jobRoles: JSON.parse(jobRoles),
//         preferredHiringLocations: JSON.parse(preferredHiringLocations),
//         lookingFor,
//         employmentType
//       },
//       companyVerification: {
//         verificationDocuments: uploads,
//         tanNumber,
//         gstNumber,
//         companyRegNumber
//       }
//     });

//     res.status(201).json({
//       message: 'Employer profile created successfully',
//       profile: employerProfile
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create employer profile', error: error.message });
//   }
// };

// import EmployerOnboarding from '../../models/employerDashboard/employerOnboarding.model.js';
// import cloudinary from '../../../config/cloudinary.js';
// import streamifier from 'streamifier';

// // Stream upload to Cloudinary
// const streamUpload = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: 'auto', folder: `rawrecruit/${folder}` },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// // POST: Create onboarding
// export const createEmployerOnboarding = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     if (await EmployerOnboarding.findOne({ userId })) {
//       return res.status(400).json({ message: 'Onboarding already exists for this user.' });
//     }

//     const { employerDetails, companyDetails, hiringPreferences } = req.body;
//     const files = req.files;
//     const uploads = {};

//     // Upload images
//     if (files?.profileImage?.[0]) {
//       uploads.profileImageUrl = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
//     }
//     if (files?.backgroundImage?.[0]) {
//       uploads.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
//     }

//     // Create document
//     const onboardingData = await EmployerOnboarding.create({
//       userId,
//       employerDetails: {
//         ...JSON.parse(employerDetails),
//         ...uploads,
//       },
//       companyDetails: JSON.parse(companyDetails),
//       hiringPreferences: JSON.parse(hiringPreferences),
//     });

//     res.status(201).json({ message: 'Onboarding created successfully.', profile: onboardingData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create onboarding.', error: error.message });
//   }
// };

// // GET: Fetch onboarding
// export const getEmployerOnboarding = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const onboarding = await EmployerOnboarding.findOne({ userId }).select('-__v').lean();

//     if (!onboarding) return res.status(404).json({ message: 'No onboarding data found.' });

//     res.status(200).json({ message: 'Success', profile: onboarding });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch onboarding.', error: error.message });
//   }
// };

// // PUT: Update onboarding
// export const updateEmployerOnboarding = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { employerDetails, companyDetails, hiringPreferences } = req.body;
//     const files = req.files;
//     const updates = {};

//     // Image updates
//     if (files?.profileImage?.[0]) {
//       updates['employerDetails.profileImageUrl'] = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
//     }
//     if (files?.backgroundImage?.[0]) {
//       updates['employerDetails.backgroundImageUrl'] = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
//     }

//     // Other updates
//     if (employerDetails) updates.employerDetails = { ...JSON.parse(employerDetails), ...updates.employerDetails };
//     if (companyDetails) updates.companyDetails = JSON.parse(companyDetails);
//     if (hiringPreferences) updates.hiringPreferences = JSON.parse(hiringPreferences);

//     const updated = await EmployerOnboarding.findOneAndUpdate(
//       { userId },
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ message: 'No onboarding found to update.' });

//     res.status(200).json({ message: 'Onboarding updated successfully.', profile: updated });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to update onboarding.', error: error.message });
//   }
// };



import EmployerOnboarding from '../../models/employerDashboard/employerOnboarding.model.js';
import cloudinary from '../../../config/cloudinary.js';
import streamifier from 'streamifier';

// Stream upload to Cloudinary
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

// POST: Create onboarding
export const createEmployerOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;

    if (await EmployerOnboarding.findOne({ userId })) {
      return res.status(400).json({ message: 'Onboarding already exists for this user.' });
    }

    const { employerDetails, companyDetails, hiringPreferences } = req.body;
    const files = req.files;
    const uploads = {};

    // Upload images if they are part of the initial creation form
    if (files?.profileImage?.[0]) {
      uploads.profileImageUrl = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
    }
    if (files?.backgroundImage?.[0]) {
      uploads.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
    }

    // Create document
    const onboardingData = await EmployerOnboarding.create({
      userId,
      employerDetails: {
        ...JSON.parse(employerDetails),
        ...uploads,
      },
      companyDetails: JSON.parse(companyDetails),
      hiringPreferences: JSON.parse(hiringPreferences),
    });

    res.status(201).json({ message: 'Onboarding created successfully.', profile: onboardingData });
  } catch (error) {
    console.error('Error in createEmployerOnboarding:', error);
    res.status(500).json({ message: 'Failed to create onboarding.', error: error.message });
  }
};

// GET: Fetch onboarding
export const getEmployerOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const onboarding = await EmployerOnboarding.findOne({ userId }).select('-__v').lean();

    if (!onboarding) return res.status(404).json({ message: 'No onboarding data found.' });

    res.status(200).json({ message: 'Success', profile: onboarding });
  } catch (error) {
    console.error('Error in getEmployerOnboarding:', error);
    res.status(500).json({ message: 'Failed to fetch onboarding.', error: error.message });
  }
};

// PUT: Update onboarding
export const updateEmployerOnboarding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { employerDetails, companyDetails, hiringPreferences } = req.body;
    const files = req.files;
    const updates = {};

    // Image updates (if files are provided via the main update form)
    if (files?.profileImage?.[0]) {
      updates['employerDetails.profileImageUrl'] = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
    }
    if (files?.backgroundImage?.[0]) {
      updates['employerDetails.backgroundImageUrl'] = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
    }

    // Parse stringified JSON fields
    const parsedEmployerDetails = employerDetails ? JSON.parse(employerDetails) : {};
    const parsedCompanyDetails = companyDetails ? JSON.parse(companyDetails) : {};
    const parsedHiringPreferences = hiringPreferences ? JSON.parse(hiringPreferences) : {};


    // Merge updates for nested objects carefully
    // Fetch existing data to merge, if necessary, or ensure client sends full objects for updates
    const existingProfile = await EmployerOnboarding.findOne({ userId });
    if (!existingProfile) {
        return res.status(404).json({ message: 'No onboarding found to update.' });
    }

    // Apply updates to the existing profile data
    const mergedEmployerDetails = { ...existingProfile.employerDetails._doc, ...parsedEmployerDetails, ...updates };
    const mergedCompanyDetails = { ...existingProfile.companyDetails._doc, ...parsedCompanyDetails };
    const mergedHiringPreferences = { ...existingProfile.hiringPreferences._doc, ...parsedHiringPreferences };

    const updated = await EmployerOnboarding.findOneAndUpdate(
      { userId },
      {
        $set: {
          employerDetails: mergedEmployerDetails,
          companyDetails: mergedCompanyDetails,
          hiringPreferences: mergedHiringPreferences,
        }
      },
      { new: true, runValidators: true } // Return updated document, run schema validators
    );

    res.status(200).json({ message: 'Onboarding updated successfully.', profile: updated });
  } catch (error) {
    console.error('Error in updateEmployerOnboarding:', error);
    res.status(500).json({ message: 'Failed to update onboarding.', error: error.message });
  }
};

// NEW: Upload a single image (profile or background)
export const uploadSingleImage = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const { imageType } = req.body; // Expect 'profile' or 'background'
    const file = req.file; // Multer makes the file available here

    if (!file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }
    if (!imageType || (imageType !== 'profile' && imageType !== 'background')) {
      return res.status(400).json({ message: 'Invalid imageType. Must be "profile" or "background".' });
    }

    // Determine the Cloudinary folder based on imageType
    const folder = imageType === 'profile' ? 'employerProfileImages' : 'employerBackgroundImages';
    const uploadedResult = await streamUpload(file.buffer, folder);
    const imageUrl = uploadedResult.secure_url;

    // Update the corresponding field in the employer's profile
    const updateField = `employerDetails.${imageType}ImageUrl`;
    const updatedProfile = await EmployerOnboarding.findOneAndUpdate(
      { userId: userId },
      { $set: { [updateField]: imageUrl } }, // Use computed property name
      { new: true, runValidators: true, upsert: true } // Create if not exists, return new doc
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Employer profile not found or could not be updated.' });
    }

    res.status(200).json({
      message: `${imageType} image uploaded successfully!`,
      imageUrl: imageUrl,
      profile: updatedProfile // Optionally return updated profile for immediate UI refresh
    });

  } catch (error) {
    console.error('Error in uploadSingleImage:', error);
    res.status(500).json({ message: 'Failed to upload image.', error: error.message });
  }
};