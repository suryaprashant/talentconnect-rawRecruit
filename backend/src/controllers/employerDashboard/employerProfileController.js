

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

//     // Upload images if they are part of the initial creation form
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
//     console.error('Error in createEmployerOnboarding:', error);
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
//     console.error('Error in getEmployerOnboarding:', error);
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

//     // Image updates (if files are provided via the main update form)
//     if (files?.profileImage?.[0]) {
//       updates['employerDetails.profileImageUrl'] = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
//     }
//     if (files?.backgroundImage?.[0]) {
//       updates['employerDetails.backgroundImageUrl'] = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
//     }

//     // Parse stringified JSON fields
//     const parsedEmployerDetails = employerDetails ? JSON.parse(employerDetails) : {};
//     const parsedCompanyDetails = companyDetails ? JSON.parse(companyDetails) : {};
//     const parsedHiringPreferences = hiringPreferences ? JSON.parse(hiringPreferences) : {};


//     // Merge updates for nested objects carefully
//     // Fetch existing data to merge, if necessary, or ensure client sends full objects for updates
//     const existingProfile = await EmployerOnboarding.findOne({ userId });
//     if (!existingProfile) {
//         return res.status(404).json({ message: 'No onboarding found to update.' });
//     }

//     // Apply updates to the existing profile data
//     const mergedEmployerDetails = { ...existingProfile.employerDetails._doc, ...parsedEmployerDetails, ...updates };
//     const mergedCompanyDetails = { ...existingProfile.companyDetails._doc, ...parsedCompanyDetails };
//     const mergedHiringPreferences = { ...existingProfile.hiringPreferences._doc, ...parsedHiringPreferences };

//     const updated = await EmployerOnboarding.findOneAndUpdate(
//       { userId },
//       {
//         $set: {
//           employerDetails: mergedEmployerDetails,
//           companyDetails: mergedCompanyDetails,
//           hiringPreferences: mergedHiringPreferences,
//         }
//       },
//       { new: true, runValidators: true } // Return updated document, run schema validators
//     );

//     res.status(200).json({ message: 'Onboarding updated successfully.', profile: updated });
//   } catch (error) {
//     console.error('Error in updateEmployerOnboarding:', error);
//     res.status(500).json({ message: 'Failed to update onboarding.', error: error.message });
//   }
// };

// // NEW: Upload a single image (profile or background)
// export const uploadSingleImage = async (req, res) => {
//   try {
//     const userId = req.user._id; // Get user ID from authenticated request
//     const { imageType } = req.body; // Expect 'profile' or 'background'
//     const file = req.file; // Multer makes the file available here

//     if (!file) {
//       return res.status(400).json({ message: 'No image file provided.' });
//     }
//     if (!imageType || (imageType !== 'profile' && imageType !== 'background')) {
//       return res.status(400).json({ message: 'Invalid imageType. Must be "profile" or "background".' });
//     }

//     // Determine the Cloudinary folder based on imageType
//     const folder = imageType === 'profile' ? 'employerProfileImages' : 'employerBackgroundImages';
//     const uploadedResult = await streamUpload(file.buffer, folder);
//     const imageUrl = uploadedResult.secure_url;

//     // Update the corresponding field in the employer's profile
//     const updateField = `employerDetails.${imageType}ImageUrl`;
//     const updatedProfile = await EmployerOnboarding.findOneAndUpdate(
//       { userId: userId },
//       { $set: { [updateField]: imageUrl } }, // Use computed property name
//       { new: true, runValidators: true, upsert: true } // Create if not exists, return new doc
//     );

//     if (!updatedProfile) {
//       return res.status(404).json({ message: 'Employer profile not found or could not be updated.' });
//     }

//     res.status(200).json({
//       message: `${imageType} image uploaded successfully!`,
//       imageUrl: imageUrl,
//       profile: updatedProfile // Optionally return updated profile for immediate UI refresh
//     });

//   } catch (error) {
//     console.error('Error in uploadSingleImage:', error);
//     res.status(500).json({ message: 'Failed to upload image.', error: error.message });
//   }
// };

import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js';
import cloudinary from '../../../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper function to upload a file stream to Cloudinary
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

// POST: Create onboarding profile
export const createEmployerOnboarding = async (req, res) => {
    try {
        const userId = req.user._id;

        if (await CompanyProfile.findOne({ userId })) {
            return res.status(400).json({ message: 'Onboarding already exists for this user.' });
        }

        const { employerDetails, companyDetails, hiringPreferences } = req.body;
        const files = req.files;
        const uploads = {};

        // Handle file uploads
        if (files?.profileImage?.[0]) {
            uploads.profileImageUrl = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
        }
        if (files?.backgroundImage?.[0]) {
            uploads.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
        }

        // Create the new document
        const onboardingData = await CompanyProfile.create({
            userId,
            ...uploads, // FIX: Spread the image URLs at the root level
            employerDetails: JSON.parse(employerDetails),
            companyDetails: JSON.parse(companyDetails),
            hiringPreferences: JSON.parse(hiringPreferences),
        });

        res.status(201).json({ message: 'Onboarding created successfully.', profile: onboardingData });
    } catch (error) {
        console.error('Error in createEmployerOnboarding:', error);
        res.status(500).json({ message: 'Failed to create onboarding.', error: error.message });
    }
};

// GET: Fetch onboarding profile
export const getEmployerOnboarding = async (req, res) => {
 
    try {
        const userId = req.user._id;
        const onboarding = await CompanyProfile.findOne({ userId }).select('-__v').lean();
        //console.log(onboarding);
        if (!onboarding) {
            return res.status(404).json({ message: 'No onboarding data found.' });
        }
     //   console.log("Employer data aa rha hai ");
        res.status(200).json({ message: 'Success', profile: onboarding });
    } catch (error) {
        console.error('Error in getEmployerOnboarding:', error);
        res.status(500).json({ message: 'Failed to fetch onboarding.', error: error.message });
    }
};

// PUT: Update onboarding profile
export const updateEmployerOnboarding = async (req, res) => {
    try {
        const userId = req.user._id;
        const { employerDetails, companyDetails, hiringPreferences } = req.body;
        const files = req.files;
        const updates = {};

        // Handle file uploads and add them to the root of the update object
        if (files?.profileImage?.[0]) {
            // FIX: Update the root `profileImageUrl` field
            updates.profileImageUrl = (await streamUpload(files.profileImage[0].buffer, 'employerProfileImages')).secure_url;
        }
        if (files?.backgroundImage?.[0]) {
            // FIX: Update the root `backgroundImageUrl` field
            updates.backgroundImageUrl = (await streamUpload(files.backgroundImage[0].buffer, 'employerBackgroundImages')).secure_url;
        }

        // Use dot notation to update nested fields without overwriting entire objects
        if (employerDetails) {
            Object.entries(JSON.parse(employerDetails)).forEach(([key, value]) => {
                updates[`employerDetails.${key}`] = value;
            });
        }
        if (companyDetails) {
            Object.entries(JSON.parse(companyDetails)).forEach(([key, value]) => {
                updates[`companyDetails.${key}`] = value;
            });
        }
        if (hiringPreferences) {
            Object.entries(JSON.parse(hiringPreferences)).forEach(([key, value]) => {
                updates[`hiringPreferences.${key}`] = value;
            });
        }
        
        const updatedProfile = await CompanyProfile.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'No onboarding profile found to update.' });
        }

        res.status(200).json({ message: 'Onboarding updated successfully.', profile: updatedProfile });
    } catch (error) {
        console.error('Error in updateEmployerOnboarding:', error);
        res.status(500).json({ message: 'Failed to update onboarding.', error: error.message });
    }
};

// POST: Upload a single image (profile or background)
export const uploadSingleImage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { imageType } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }
        if (!imageType || (imageType !== 'profile' && imageType !== 'background')) {
            return res.status(400).json({ message: 'Invalid imageType. Must be "profile" or "background".' });
        }

        const folder = imageType === 'profile' ? 'employerProfileImages' : 'employerBackgroundImages';
        const imageUrl = (await streamUpload(file.buffer, folder)).secure_url;

        // FIX: Determine the correct root-level field name
        const updateField = imageType === 'profile' ? 'profileImageUrl' : 'backgroundImageUrl';

        const updatedProfile = await CompanyProfile.findOneAndUpdate(
            { userId: userId },
            { $set: { [updateField]: imageUrl } },
            { new: true, runValidators: true } // Removed upsert to prevent creating a doc with just an image
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Employer profile not found. Please complete onboarding first.' });
        }

        res.status(200).json({
            message: `${imageType} image uploaded successfully!`,
            imageUrl: imageUrl,
            profile: updatedProfile
        });
    } catch (error) {
        console.error('Error in uploadSingleImage:', error);
        res.status(500).json({ message: 'Failed to upload image.', error: error.message });
    }
};