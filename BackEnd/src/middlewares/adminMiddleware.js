import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const adminAuth = async (req, res, next) => {
  

  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    
    // Check for token in cookies
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log("token",token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await Auth.findById(decoded.userId);
    console.log("Decoded token:", decoded);
    console.log("User from DB:", user?._id, user?.userType);

    if (!user || user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized as admin",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default adminAuth;
