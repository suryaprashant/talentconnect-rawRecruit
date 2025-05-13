import ProfessionalProfile from '../models/professionalProfileModel.js';

const checkProfessional = async (req, res, next) => {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);
    const { userId } = parsedData;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    const profile = await ProfessionalProfile.findOne({ userId });
    if (profile) {
      req.existingProfile = profile;
    }

    next();
  } catch (error) {
    console.error('Error in checkProfessional middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default checkProfessional;
