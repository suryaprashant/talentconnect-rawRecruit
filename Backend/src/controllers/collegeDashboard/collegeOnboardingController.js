import CollegeOnboarding from '../../models/collegeDashboard/collegeOnboardingModel.js';
import cloudinary from '../../config/cloudinary.js';
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
    const {
      collegeUniversityDetails,
      placementCoordinatorDetails,
      placementRecruitmentDetails,
      profileAchievements,
      workshops,
      volunteering,
      awards
    } = req.body;

    const files = req.files;
    let collegeBrochureUrl = '';

    if (files?.collegeBrochure?.[0]) {
      const brochureUpload = await streamUpload(files.collegeBrochure[0].buffer, 'collegeBrochures');
      collegeBrochureUrl = brochureUpload.secure_url;
    }

    const onboardingData = await CollegeOnboarding.create({
      collegeUniversityDetails: JSON.parse(collegeUniversityDetails),
      placementCoordinatorDetails: JSON.parse(placementCoordinatorDetails),
      placementRecruitmentDetails: {
        ...JSON.parse(placementRecruitmentDetails),
        collegeBrochureUrl
      },
      profileAchievements: JSON.parse(profileAchievements),
      workshops: JSON.parse(workshops),
      volunteering: JSON.parse(volunteering),
      awards: JSON.parse(awards)
    });

    res.status(201).json({
      message: 'College onboarding form submitted successfully',
      data: onboardingData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Submission failed', error: error.message });
  }
};
