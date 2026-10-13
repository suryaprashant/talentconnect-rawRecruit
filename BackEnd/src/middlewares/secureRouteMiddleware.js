import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

 const secureRoute = async (req, res, next) => {
  try {
    const ACCESS_SECRET =
      process.env.JWT_ACCESS_SECRET;

    if (!ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not configured");
    }
    
    // const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];  
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    // console.log("token :",token);
    if (!token) {
      return res.status(401).json({
          success: false,
          code: "NO_ACCESS_TOKEN",
          message: "Authentication required",
      });
    }
    console.log("entering decoded.. ");

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(
        token,
        ACCESS_SECRET
    );
    // console.log("decoded" , decoded);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    // console.log("finding user..");
    const user = await Auth.findById(decoded.userId).select("-password");
    // console.log("user.:",user);
    if (!user) {
      return res.status(401).json({
          success: false,
          code: "USER_NOT_FOUND",
          message: "User not found",
      });
    }
    req.user = user;  
    // console.log("req.user : ",user); 
    next();
  } catch (error) {
      if (error.name === "TokenExpiredError") {
          return res.status(401).json({
              code: "TOKEN_EXPIRED",
              message: "Access token expired",
          });
      }

      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
              code: "INVALID_TOKEN",
              message: "Invalid token",
          });
      }

      console.error(error);

      return res.status(500).json({
          message: "Internal server error",
      });
  }
};
export default secureRoute;

