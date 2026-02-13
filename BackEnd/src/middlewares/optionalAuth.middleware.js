import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const optionalAuth = async (req, res, next) => {
    console.log("Optional Auth middleware called, ladkat");
  try {
    let token;

    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🔑 No token → just continue as guest
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Auth.findById(decoded.userId).select("-password");

    req.user = user || null;
    next();
  } catch (err) {
    // Invalid token → treat as guest
    req.user = null;
    next();
  }
};

export default optionalAuth;