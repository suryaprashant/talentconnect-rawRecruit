// middlewares/checkCompany.js
import User from '../models/authModel.js';

const checkCompany = async (req, res, next) => {
  try {
    const user = req.user; // Should be set by auth middleware

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Ensure user role is "Company"
    if (user.role !== 'Company') {
      return res.status(403).json({ message: 'Access denied: Only companies can access this route' });
    }

    next();
  } catch (error) {
    console.error('checkCompany error:', error);
    res.status(500).json({ message: 'Server error while checking company access' });
  }
};

export default checkCompany;
