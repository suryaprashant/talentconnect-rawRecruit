// import CollegeOnboarding from '../../models/collegeDashboard/collegeOnboardingModel.js';
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

// export const submitCollegeOnboarding = async (req, res) => {
//   try {

//       // req.user will be populated by your secureRoute middleware
//     const userId = req.user._id; // Assuming your Auth model's ID is `_id`

//     if (!userId) {
//       return res.status(401).json({ message: 'User not authenticated or ID missing.' });
//     }

//     const {
//       collegeUniversityDetails,
//       placementCoordinatorDetails,
//       placementRecruitmentDetails,
//       profileAchievements,
//       workshops,
//       volunteering,
//       awards
//     } = req.body;

//     const files = req.files;
//     let collegeBrochureUrl = '';

//     if (files?.collegeBrochure?.[0]) {
//       const brochureUpload = await streamUpload(files.collegeBrochure[0].buffer, 'collegeBrochures');
//       collegeBrochureUrl = brochureUpload.secure_url;
//     }

//      // Handle profileImage and backgroundImage if they are also files
//     let profileImageUrl = '';
//     if (files?.profileImage?.[0]) {
//       const profileImageUpload = await streamUpload(files.profileImage[0].buffer, 'profileImages');
//       profileImageUrl = profileImageUpload.secure_url;
//     }

//     let backgroundImageUrl = '';
//     if (files?.backgroundImage?.[0]) {
//       const backgroundImageUpload = await streamUpload(files.backgroundImage[0].buffer, 'backgroundImages');
//       backgroundImageUrl = backgroundImageUpload.secure_url;
//     }

//     const onboardingData = await CollegeOnboarding.create({
//       collegeUniversityDetails: JSON.parse(collegeUniversityDetails),
//       placementCoordinatorDetails: JSON.parse(placementCoordinatorDetails),
//       placementRecruitmentDetails: {
//         ...JSON.parse(placementRecruitmentDetails),
//         collegeBrochureUrl
//       },
//       profileImage: profileImageUrl, // Add profileImage URL
//       backgroundImage: backgroundImageUrl, // Add backgroundImage URL
//       profileAchievements: JSON.parse(profileAchievements),
//       workshops: JSON.parse(workshops),
//       volunteering: JSON.parse(volunteering),
//       awards: JSON.parse(awards)
//     });

//     res.status(201).json({
//       message: 'College onboarding form submitted successfully',
//       data: onboardingData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Submission failed', error: error.message });
//   }
// };

// export const getAllCollegeOnboarding = async (req, res) => {
//   try {
//     const allOnboardingData = await CollegeOnboarding.find({});
//     res.status(200).json({
//       message: 'Successfully retrieved all college onboarding data',
//       data: allOnboardingData
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to retrieve data', error: error.message });
//   }
// };


import CollegeOnboarding from '../../models/collegeDashboard/collegeOnboardingModel.js';
import cloudinary from '../../../config/cloudinary.js'; // Adjust path as needed
import streamifier from 'streamifier';

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

export const submitCollegeOnboarding = async (req, res) => {
  try {


    console.log('User ID from secureRoute (req.user._id):', req.user?._id);

    const userId = req.user?._id; // Using optional chaining for safety
    console.log('Uploaded Files (req.files):', req.files);
    const files = req.files; // ✅ Add this to define `files` correctly


    if (!userId) {
      console.log('Error: User not authenticated or ID missing in req.user._id.');
      return res.status(401).json({ message: 'User not authenticated or ID missing.' });
    }

    
    const {
      collegeUniversityDetails,
      placementCoordinatorDetails,
      placementRecruitmentDetails,
      profileAchievements,
      workshops,
      volunteering,
      awards
    } = req.body;

    // Parse JSON strings back to objects
    // Use try-catch for JSON.parse in case of malformed strings
    let parsedCollegeUniversityDetails = {};
    try { parsedCollegeUniversityDetails = JSON.parse(collegeUniversityDetails || '{}'); } catch (e) { console.error("Failed to parse collegeUniversityDetails:", e); }

    let parsedPlacementCoordinatorDetails = {};
    try { parsedPlacementCoordinatorDetails = JSON.parse(placementCoordinatorDetails || '{}'); } catch (e) { console.error("Failed to parse placementCoordinatorDetails:", e); }

    let parsedPlacementRecruitmentDetails = {};
    try { parsedPlacementRecruitmentDetails = JSON.parse(placementRecruitmentDetails || '{}'); } catch (e) { console.error("Failed to parse placementRecruitmentDetails:", e); }

    let parsedProfileAchievements = {};
    try { parsedProfileAchievements = JSON.parse(profileAchievements || '{}'); } catch (e) { console.error("Failed to parse profileAchievements:", e); }

    let parsedWorkshops = [];
    try { parsedWorkshops = JSON.parse(workshops || '[]'); } catch (e) { console.error("Failed to parse workshops:", e); }

    let parsedVolunteering = [];
    try { parsedVolunteering = JSON.parse(volunteering || '[]'); } catch (e) { console.error("Failed to parse volunteering:", e); }

    let parsedAwards = [];
    try { parsedAwards = JSON.parse(awards || '[]'); } catch (e) { console.error("Failed to parse awards:", e); }

    // 3. Log parsed data
    console.log('Parsed College University Details:', parsedCollegeUniversityDetails);
    // ... add more logs for other parsed fields if needed

    let collegeBrochureUrl = '';
    let profileImageUrl = '';
    let backgroundImageUrl = '';

    // Upload files if they exist
    if (files?.collegeBrochure?.[0]) {
      try {
        const brochureUpload = await streamUpload(files.collegeBrochure[0].buffer, 'collegeBrochures');
        collegeBrochureUrl = brochureUpload.secure_url;
        console.log('Uploaded collegeBrochureUrl:', collegeBrochureUrl);
      } catch (uploadError) {
        console.error('Error uploading collegeBrochure:', uploadError);
        // Decide how to handle upload errors: stop, or continue without the file
      }
    }

    if (files?.profileImage?.[0]) {
      try {
        const profileImageUpload = await streamUpload(files.profileImage[0].buffer, 'profileImages');
        profileImageUrl = profileImageUpload.secure_url;
        console.log('Uploaded profileImageUrl:', profileImageUrl);
      } catch (uploadError) {
        console.error('Error uploading profileImage:', uploadError);
      }
    }

    if (files?.backgroundImage?.[0]) {
      try {
        const backgroundImageUpload = await streamUpload(files.backgroundImage[0].buffer, 'backgroundImages');
        backgroundImageUrl = backgroundImageUpload.secure_url;
        console.log('Uploaded backgroundImageUrl:', backgroundImageUrl);
      } catch (uploadError) {
        console.error('Error uploading backgroundImage:', uploadError);
      }
    }

    // 4. Check if profile already exists for this user
    let onboardingData = await CollegeOnboarding.findOne({ userId });
    console.log('Existing onboardingData found (or null if not found):', onboardingData);

    if (onboardingData) {
      // Update existing profile
      onboardingData.collegeUniversityDetails = {
        ...onboardingData.collegeUniversityDetails,
        ...parsedCollegeUniversityDetails
      };
      onboardingData.placementCoordinatorDetails = {
        ...onboardingData.placementCoordinatorDetails,
        ...parsedPlacementCoordinatorDetails
      };
      onboardingData.placementRecruitmentDetails = {
        ...onboardingData.placementRecruitmentDetails,
        ...parsedPlacementRecruitmentDetails,
        collegeBrochureUrl: collegeBrochureUrl || onboardingData.placementRecruitmentDetails.collegeBrochureUrl // Update only if new brochure provided
      };
      onboardingData.profileAchievements = {
        ...onboardingData.profileAchievements,
        ...parsedProfileAchievements
      };

      if (profileImageUrl) onboardingData.profileImage = profileImageUrl;
      if (backgroundImageUrl) onboardingData.backgroundImage = backgroundImageUrl;

      onboardingData.workshops = parsedWorkshops;
      onboardingData.volunteering = parsedVolunteering;
      onboardingData.awards = parsedAwards;

      // 5. Save the updated document
      await onboardingData.save();
      console.log('College onboarding form UPDATED successfully for userId:', userId);

      res.status(200).json({
        message: 'College onboarding form updated successfully',
        data: onboardingData
      });
    } else {
      // Create new profile
      onboardingData = await CollegeOnboarding.create({
        userId, // <-- userId is correctly passed here for creation
        collegeUniversityDetails: parsedCollegeUniversityDetails,
        placementCoordinatorDetails: parsedPlacementCoordinatorDetails,
        placementRecruitmentDetails: {
          ...parsedPlacementRecruitmentDetails,
          collegeBrochureUrl
        },
        profileAchievements: parsedProfileAchievements,
        profileImage: profileImageUrl,
        backgroundImage: backgroundImageUrl,
        workshops: parsedWorkshops,
        volunteering: parsedVolunteering,
        awards: parsedAwards
      });

      // 6. Log the newly created document
      console.log('College onboarding form CREATED successfully for userId:', userId);
      console.log('Newly created onboardingData:', onboardingData);

      res.status(201).json({
        message: 'College onboarding form submitted successfully',
        data: onboardingData
      });
    }
    console.log('--- submitCollegeOnboarding END ---');
  } catch (error) {
    console.error("Error in submitCollegeOnboarding:", error);
    if (error.code === 11000) {
      // Duplicate key error (userId unique constraint violation)
      console.log('Duplicate key error (11000): A profile already exists for this user.');
      return res.status(409).json({ message: 'A profile already exists for this user. Please update the existing profile.', error: error.message });
    }
    res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};
// Renamed from getAllCollegeOnboarding to be more specific
export const getCollegeOnboardingByUserId = async (req, res) => {
 
  try {
    const userId = req.user._id; // Assuming req.user._id is populated by secureRoute

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated or ID missing.' });
    }

    const onboardingData = await CollegeOnboarding.findOne({ userId });
    console.log('Result of CollegeOnboarding.findOne({ userId }):', onboardingData);
   
    if (!onboardingData) {
      return res.status(404).json({ message: 'No college onboarding data found for this user.' });
    }

    res.status(200).json({
      message: 'Successfully retrieved college onboarding data for the user',
      data: onboardingData
    });
  } catch (error) {
    console.error("Error in getCollegeOnboardingByUserId:", error);
    res.status(500).json({ message: 'Failed to retrieve data', error: error.message });
  }
};