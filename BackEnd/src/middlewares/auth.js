// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token, authorization denied' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token is not valid' 
        });
    }
};

// Optional: Role-based middleware
export const authorize = (...allowedUserTypes) => {
  return (req, res, next) => {
    if (!allowedUserTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "User not authorized"
      });
    }
    next();
  };
};