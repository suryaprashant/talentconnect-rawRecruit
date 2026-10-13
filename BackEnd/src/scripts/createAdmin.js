import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Auth from '../models/authModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Auth.findOne({ 
      email: 'admin@rawrecruit.com',
      userType: 'admin'
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = new Auth({
      name: 'Admin User',
      email: 'admin@rawrecruit.com',
      password: hashedPassword,
      userType: 'admin',
      onboardingCompleted: true
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@rawrecruit.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
