import CompanyOverview from "../models/companyOverviewModel.js";
// Add Company Profile
export const addCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      companyDescription,
      companyDetails,
      companyType,
      industryType,
      numberOfEmployees,
      establishedYear,
      websiteURL,
      companyLinkedIn,
      phoneNumber,
      alternatePhoneNumber,
      companyLocation,
      pincode,
      state,
      city,
      country,

      employerName,
      employerPhoto,
      designation,
      workEmail,
      employerPhoneNumber,
      employerLinkedIn,

      hiringPreferencesText,
      jobRoles,
      hiringLocations,
      lookingFor,
      employmentType,

      kycStatus,
      photoVerificationStatus,
      aadharNumber,
      nameOnAadhar,
      addressLabel,
      address,
      kycPincode,
      verificationDocuments,
      tanNumber,
      gstin,
      registrationNumber,

      profileLinkedIn,
      profileWebsite
    } = req.body;

    const existingProfile = await CompanyOverview.findOne({ workEmail });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this email',
      });
    }

    const newProfile = new CompanyOverview({
      companyName,
      companyDescription,
      companyDetails,
      companyType,
      industryType,
      numberOfEmployees,
      establishedYear,
      websiteURL,
      companyLinkedIn,
      phoneNumber,
      alternatePhoneNumber,
      companyLocation,
      pincode,
      state,
      city,
      country,

      employerName,
      employerPhoto,
      designation,
      workEmail,
      employerPhoneNumber,
      employerLinkedIn,

      hiringPreferencesText,
      jobRoles,
      hiringLocations,
      lookingFor,
      employmentType,

      kycStatus,
      photoVerificationStatus,
      aadharNumber,
      nameOnAadhar,
      addressLabel,
      address,
      kycPincode,
      verificationDocuments,
      tanNumber,
      gstin,
      registrationNumber,

      profileLinkedIn,
      profileWebsite
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: 'Company profile added successfully',
      data: newProfile,
    });
  } catch (error) {
    console.error('Error adding company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
