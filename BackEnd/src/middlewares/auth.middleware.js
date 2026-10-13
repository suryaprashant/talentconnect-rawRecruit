import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ From cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2️⃣ From Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Auth.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // 🔥 THIS IS IMPORTANT
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
