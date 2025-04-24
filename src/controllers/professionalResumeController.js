import ProfessionalProfile from '../models/professionalOverviewModel.js';

// Add Resume
export const addProfessionalResume = async (req, res) => {
  try {
    const { email, resumeUrl } = req.body;

    if (!email || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Email and Resume URL are required',
      });
    }

    const profile = await ProfessionalProfile.findOne({ email });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found',
      });
    }

    if (profile.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resume already exists. Use update instead.',
      });
    }

    profile.resumeUrl = resumeUrl;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume added successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Update Resume
export const updateProfessionalResume = async (req, res) => {
  try {
    const { email } = req.params;
    const { resumeUrl } = req.body;

    const profile = await ProfessionalProfile.findOneAndUpdate(
      { email },
      { resumeUrl },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get Resume
export const getProfessionalResume = async (req, res) => {
  try {
    const { email } = req.params;

    const profile = await ProfessionalProfile.findOne({ email }).select('resumeUrl');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume retrieved successfully',
      data: profile.resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
