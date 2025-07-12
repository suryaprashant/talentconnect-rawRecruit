import jwt from "jsonwebtoken";
import Auth from "../models/auth.js";

 const secureRoute = async (req, res, next) => {

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // Get token from cookies or Authorization header
    // console.log("Token: ", token);
    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }

    const user = await Auth.findById(decoded.userId).select("-password"); // current loggedin user
    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }

    req.user = user;
    // console.log(req.user);
    // console.log("user h ye,, ",req.user," ",decoded," ",token);
    next();
  } catch (error) {
    console.log("Error in secureRoute: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default secureRoute;