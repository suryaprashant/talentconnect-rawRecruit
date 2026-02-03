// middleware/verifyUser.js
import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        const user = await Auth.findById(decoded.userId).select("-password");
        if (user) {
          req.user = user; // Attach user if token is valid
        }
      }
    }
    next(); // Always proceed to the controller
  } catch (error) {
    console.log("Auth skipped (Guest Mode):", error.message);
    next();
  }
};

export default verifyUser;