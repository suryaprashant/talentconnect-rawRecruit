import bcrypt from "bcryptjs";
import Auth from "../../models/authModel.js";
import { createUserSession, destroyUserSession } from "../../services/sessionService.js";
// Admin login controller
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    // Find admin user by email
    const admin = await Auth.findOne({ 
      email: email.toLowerCase(),
      userType: 'admin'
    });

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const { accessToken } = await createUserSession({
      user: admin,
      req,
      res,
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: accessToken,
      user: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        userType: admin.userType,
        profileImage: admin.profileImage,
      },
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Create admin user (for initial setup)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Name, email, and password are required" 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Auth.findOne({ 
      email: email.toLowerCase(),
      userType: 'admin'
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: "Admin user already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = new Auth({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType: 'admin',
      onboardingCompleted: true
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        userType: admin.userType
      }
    });

  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Admin logout
export const adminLogout = async (req, res) => {
  try {
    await destroyUserSession(req, res);

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error('Admin Logout Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};


