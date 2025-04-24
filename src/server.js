// src/server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

import studentRoutes from './routes/studentRoutes.js';
import fresherRoutes from './routes/fresherRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js'; // ✅ Import college routes

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/student', studentRoutes);
app.use('/api/fresher', fresherRoutes); 
app.use('/api/company', companyRoutes);
app.use('/api/college', collegeRoutes); // ✅ Register college routes

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
