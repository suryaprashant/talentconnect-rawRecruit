import bcrypt from 'bcryptjs'; // ✅ Correct for native bcrypt
import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Manual Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, subRole } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      subRole: role === "candidate" ? subRole : null,
      authProvider: "manual",
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ✅ Manual Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || user.authProvider !== "manual") {
      return res.status(401).json({ message: "Invalid credentials or provider" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
