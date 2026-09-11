import Company from '../models/company.model.js';

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch companies', error: error.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    // This will now fail if "google" exists and you try to add "Google"
    const company = await Company.create({ name }); 
    
    return res.status(201).json({ 
      success: true, 
      message: 'Company created successfully', 
      data: company 
    });
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: `The company "${req.body.name}" already exists (case-insensitive).` 
      });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};