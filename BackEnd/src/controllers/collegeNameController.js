import College from '../models/collegeNames.js';
import { createCollegeMasterData, getCollegeMasterDataByType } from '../services/collegeMasterDataService.js';

// Get all colleges for the dropdown
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).sort({ name: 1 });
    
    // Transform for React-Select { value, label }
    const formatted = colleges.map(c => ({
      value: c._id,
      label: c.name
    }));
    
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Register a new college
export const registerCollege = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    // Case-insensitive check for existing college
    const exists = await College.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) return res.status(400).json({ message: "College already exists" });

    const newCollege = await College.create({ name });
    
    res.status(201).json({
      value: newCollege._id,
      label: newCollege.name
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving college", error: error.message });
  }
};

export const createCollegeMasterDataController = async (req, res) => {
  try {
    const data = await createCollegeMasterData(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCollegeMasterDataByTypeController = async (req, res) => {
  try {
    const data = await getCollegeMasterDataByType(req.params.type);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};