import FresherProfile from '../models/fresherProfileModel.js';

const checkFresher = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const existingProfile = await FresherProfile.findOne({ userId });

    if (existingProfile) {
      return res.status(409).json({
        message: 'Profile already exists for this user. You can update it instead.',
        profileId: existingProfile._id,
      });
    }

    next();
  } catch (error) {
    console.error('Error in checkFresher middleware:', error);
    res.status(500).json({ error: 'Internal server error in middleware' });
  }
};

export default checkFresher;
