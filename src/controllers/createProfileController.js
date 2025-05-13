// src/controllers/createProfileController.js
import CreateProfile from '../models/createProfileModel.js';

export const createProfile = async (req, res) => {
  try {
    const newProfile = new CreateProfile(req.body);
    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: "Error creating profile", error: error.message });
  }
};

