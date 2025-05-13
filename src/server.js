import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import collegeRoutes from './routes/collegeRoutes.js';
import generalRoutes from './routes/generalRoutes.js';
import companyRoutes from './routes/company.js'; // ✅ Added Company Routes

// ✅ Import auth routes
import authRoutes from './routes/authRoutes.js';
//import studentDashboardProfileRoutes from "./routes/studentDashboardProfileRoutes.js";
import fresherProfileRoutes from './routes/fresherProfileRoutes.js';
import professionalProfileRoutes from './routes/professionalProfileRoutes.js';

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ Mount auth routes first
app.use('/api/auth', authRoutes);

// Student Profile Section
//app.use('/api/student/profile', studentDashboardProfileRoutes);

// Fresher Profile Section
app.use('/api/fresherProfile', fresherProfileRoutes);

// Professional Profile Section
app.use('/api/professionalProfile', professionalProfileRoutes);

// ✅ Company Profile API
app.use('/api/company', companyRoutes);

// Other App Routes
app.use('/api/college', collegeRoutes);
app.use('/api/general', generalRoutes);

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
