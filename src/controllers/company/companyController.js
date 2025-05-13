import Company from "../../models/Company/companyModel.js";
import cloudinary from "../../utils/cloudinary.js";
import { v4 as uuidv4 } from 'uuid';

// Create a new company profile
export const createCompanyProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from auth middleware

    const { 
      name, description, companyType, industryType, numberOfEmployees, 
      establishedYear, websiteUrl, phoneNumber, alternatePhoneNumber, location, 
      state, city, country, pincode, 
      hiringPreferences, kycDetails 
    } = req.body;

    // Check if a company profile already exists for this user
    const existingCompany = await Company.findOne({ userId });
    if (existingCompany) {
      return res.status(400).json({ message: "Company profile already exists for this user." });
    }

    const newCompany = new Company({
      userId,
      name,
      description,
      companyType,
      industryType,
      numberOfEmployees,
      establishedYear,
      websiteUrl,
      phoneNumber,
      alternatePhoneNumber,
      location,
      state,
      city,
      country,
      pincode,
      hiringPreferences,
      kycDetails,
      documents: []
    });

    const company = await newCompany.save();
    res.status(201).json({ message: 'Company profile created successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating company profile' });
  }
};

// Update company profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updateData = req.body;

    // Optionally: ensure the user owns the profile
    // const company = await Company.findOneAndUpdate({ _id: companyId, userId: req.user._id }, updateData, { new: true });

    const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Company profile updated successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating company profile' });
  }
};

// Upload documents to Cloudinary and save URLs to company profile
export const uploadDocuments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'company_documents',
    });

    const { companyId } = req.body;
    const documentUrl = result.secure_url;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    // Optional: Validate ownership
    // if (String(company.userId) !== String(req.user._id)) {
    //   return res.status(403).json({ message: 'Unauthorized access to company profile.' });
    // }

    company.documents.push(documentUrl);
    await company.save();

    res.status(200).json({
      message: 'Document uploaded successfully.',
      documentUrl: documentUrl,
      updatedCompany: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while uploading document.' });
  }
};
