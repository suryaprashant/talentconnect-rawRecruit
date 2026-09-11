import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const optionalAuth = async (req, res, next) => {
  try {
    let token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await Auth.findById(decoded.userId).select("-password");

    req.user = user || null;

    return next();
  } catch (error) {

    // THIS IS THE IMPORTANT CHANGE

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Access token expired",
      });
    }

    req.user = null;
    return next();
  }
};

export default optionalAuth;