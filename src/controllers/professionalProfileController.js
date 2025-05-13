import ProfessionalProfile from '../models/professionalProfileModel.js';
import cloudinary from '../utils/cloudinary.js';

export const createOrUpdateProfessionalProfile = async (req, res) => {
  try {
    const { data } = req.body;
    console.log('Request Body:', req.body);

    // Parse the incoming data string (assuming it's JSON)
    const parsedData = JSON.parse(data);
    console.log('Parsed Data:', parsedData);

    // Destructure fields from parsed data
    const {
      userId,
      name,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      education,
      about,
      mobileNumber,
      skills,
      interestedIndustryType,
      interestedJobRoles,
      jobDetails,
      preferredJobLocations,
      currentSalary,
      expectedSalary,
      lookingFor,
      employmentType,
      languages,
      workExperience,
      internationalExperience,
      awardsRecognitions,
      leadershipExperience,
      skillsDescription,
      certificationsUrl
    } = parsedData;

    // Upload files to Cloudinary if they are present
    const resume = req.files?.resume?.[0]
      ? await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'resumes', resource_type: 'auto' },
            (error, result) => (error ? reject(error) : resolve(result))
          ).end(req.files.resume[0].buffer);
        })
      : null;

    const profileImage = req.files?.profileImage?.[0]
      ? await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'profileImages' },
            (error, result) => (error ? reject(error) : resolve(result))
          ).end(req.files.profileImage[0].buffer);
        })
      : null;

    const backgroundImage = req.files?.backgroundImage?.[0]
      ? await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'backgroundImages' },
            (error, result) => (error ? reject(error) : resolve(result))
          ).end(req.files.backgroundImage[0].buffer);
        })
      : null;

    // Check if a profile already exists
    const existingProfile = await ProfessionalProfile.findOne({ userId });

    if (existingProfile) {
      // Update existing profile
      existingProfile.name = name;
      existingProfile.email = email;
      existingProfile.linkedinUrl = linkedinUrl;
      existingProfile.githubUrl = githubUrl;
      existingProfile.portfolioUrl = portfolioUrl;
      existingProfile.education = education;
      existingProfile.about = about;
      existingProfile.mobileNumber = mobileNumber;
      existingProfile.skills = skills;
      existingProfile.interestedIndustryType = interestedIndustryType;
      existingProfile.interestedJobRoles = interestedJobRoles;
      existingProfile.jobDetails = jobDetails;
      existingProfile.preferredJobLocations = preferredJobLocations;
      existingProfile.currentSalary = currentSalary;
      existingProfile.expectedSalary = expectedSalary;
      existingProfile.lookingFor = lookingFor;
      existingProfile.employmentType = employmentType;
      existingProfile.languages = languages;
      existingProfile.workExperience = workExperience;
      existingProfile.internationalExperience = internationalExperience;
      existingProfile.awardsRecognitions = awardsRecognitions;
      existingProfile.leadershipExperience = leadershipExperience;
      existingProfile.skillsDescription = skillsDescription;
      existingProfile.certificationsUrl = certificationsUrl;

      // Update files only if new ones are uploaded
      if (resume) existingProfile.resume = resume.secure_url;
      if (profileImage) existingProfile.profileImage = profileImage.secure_url;
      if (backgroundImage) existingProfile.backgroundImage = backgroundImage.secure_url;

      const updatedProfile = await existingProfile.save();
      return res.status(200).json(updatedProfile);
    } else {
      // Create a new profile
      const newProfile = new ProfessionalProfile({
        userId,
        name,
        email,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        profileImage: profileImage?.secure_url,
        backgroundImage: backgroundImage?.secure_url,
        resume: resume?.secure_url,
        education,
        about,
        mobileNumber,
        skills,
        interestedIndustryType,
        interestedJobRoles,
        jobDetails,
        preferredJobLocations,
        currentSalary,
        expectedSalary,
        lookingFor,
        employmentType,
        languages,
        workExperience,
        internationalExperience,
        awardsRecognitions,
        leadershipExperience,
        skillsDescription,
        certificationsUrl
      });

      const savedProfile = await newProfile.save();
      return res.status(201).json(savedProfile);
    }
  } catch (error) {
    console.error('Error in createOrUpdateProfessionalProfile:', error);
    res.status(500).json({ message: 'Server error while processing professional profile.' });
  }
};
