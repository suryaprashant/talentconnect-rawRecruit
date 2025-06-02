import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js'
import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

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
    const {
      companyDetails,
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
      companyDetails: JSON.parse(companyDetails),
      hiringPreferences: JSON.parse(hiringPreferences),
      kycDetails: {
        ...JSON.parse(kycDetails),
        kycDocuments: kycDocs
      },
      backgroundImageUrl: uploads.backgroundImageUrl || ''
    });

    res.status(201).json({
      message: 'Company profile created successfully',
      profile: companyProfile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create company profile',
      error: error.message
    });
  }
};
