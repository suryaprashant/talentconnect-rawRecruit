import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

// Admin middleware to protect admin routes
export const adminAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
      
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
     
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "No token, authorization denied" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid Token" 
      });
    }

    // Check if user exists and is admin
    const user = await Auth.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "No user found" 
      });
    }

    // Check if user is admin
    if (user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: "Access denied. Admin privileges required." 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in adminAuth middleware: ", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

export default adminAuth;
