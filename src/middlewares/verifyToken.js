// In middlewares/verifyToken.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Temporarily bypass token verification and get userId from URL for testing
  const userId = req.params.userId;  // Getting userId from the route param directly

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  req.user = { id: userId }; // Set userId in the request object

  next();
};

export default verifyToken;
