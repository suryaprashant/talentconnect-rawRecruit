import ProfessionalProfile from '../models/professionalOverviewModel.js';

// Create Profile
export const createProfessionalProfile = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await ProfessionalProfile.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Profile already exists' });
    }

    const profile = new ProfessionalProfile(req.body);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Professional profile created successfully',
      data: profile,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Get Profile by Email
export const getProfessionalProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await ProfessionalProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Update Profile
export const updateProfessionalProfile = async (req, res) => {
  try {
    const { email } = req.params;

    const updated = await ProfessionalProfile.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
