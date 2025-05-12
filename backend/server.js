import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './config/Db.js';  // ✅

import jobRoutes from './routes/Job.route.js';
import hackathonRoutes from './routes/hackathon.route.js';
import panelMemberRoutes from './routes/panelMember.route.js';
import errorHandler from './middlewares/error.js';
import IntershipRoute from './routes/internship.route.js'

import Application from './routes/Application.route.js'
import StudentOverview from './routes/student.route.js'

dotenv.config();

const app = express();
app.use(express.json()) ;
// app.use(cookie-parser) ;
app.use(cors()) ;
app.use('/api/rawrecruit', jobRoutes);
app.use('/api/rawrecruit', hackathonRoutes);
app.use('/api/rawrecruit', panelMemberRoutes);
app.use('/api/rawrecruit', IntershipRoute);

app.use("/api/rawrecruit",Application)

// Use the student overview routes
app.use('/api/rawrecruit', StudentOverview);

// Error handler middleware
app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('server is ready');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
    connectDb() ;
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
