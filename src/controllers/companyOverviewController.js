import CompanyOverview from '../models/companyOverviewModel.js';

// Create or Update Company Overview
export const createOrUpdateCompanyOverview = async (req, res) => {
  try {
    // 🔍 Extract workEmail from employerDetails safely
    const workEmail = req.body?.employerDetails?.workEmail || req.body?.workEmail;

    if (!workEmail) {
      return res.status(400).json({
        success: false,
        message: 'Work email is required to create or update the company profile',
      });
    }

    const existingCompany = await CompanyOverview.findOne({ 'employerDetails.workEmail': workEmail });

    if (existingCompany) {
      const updated = await CompanyOverview.findOneAndUpdate(
        { 'employerDetails.workEmail': workEmail },
        req.body,
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Company overview updated successfully',
        data: updated,
      });
    }

    const newCompany = await CompanyOverview.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Company overview created successfully',
      data: newCompany,
    });
  } catch (error) {
    console.error("❌ Error in Company Overview API:", error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

