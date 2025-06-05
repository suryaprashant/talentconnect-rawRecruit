import EmployerProfile from '../../models/employerDashboard/employerProfileModel.js'
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

export const createEmployerProfile = async (req, res) => {
  try {
    const {
      companyName,
      description,
      companyType,
      industryType,
      numberOfEmployees,
      establishedYear,
      contactNumber,
      alternateNumber,
      companyLocation,
      state,
      city,
      country,
      pincode,
      companyWebsite,
      linkedinProfile,
      jobRoles,
      preferredHiringLocations,
      lookingFor,
      employmentType,
      tanNumber,
      gstNumber,
      companyRegNumber,
    } = req.body;

    const files = req.files;
    const uploads = [];

    // Handle multiple verification document uploads
    if (files?.verificationDocuments) {
      for (const file of files.verificationDocuments) {
        const uploaded = await streamUpload(file.buffer, 'employerKYC');
        uploads.push(uploaded.secure_url);
      }
    }

    const employerProfile = await EmployerProfile.create({
      companyName,
      description,
      companyType,
      industryType,
      numberOfEmployees,
      establishedYear,
      contactNumber,
      alternateNumber,
      companyLocation,
      state,
      city,
      country,
      pincode,
      companyWebsite,
      linkedinProfile,
      hiringPreferences: {
        jobRoles: JSON.parse(jobRoles),
        preferredHiringLocations: JSON.parse(preferredHiringLocations),
        lookingFor,
        employmentType
      },
      companyVerification: {
        verificationDocuments: uploads,
        tanNumber,
        gstNumber,
        companyRegNumber
      }
    });

    res.status(201).json({
      message: 'Employer profile created successfully',
      profile: employerProfile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create employer profile', error: error.message });
  }
};
