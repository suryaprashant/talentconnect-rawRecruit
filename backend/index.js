import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

import Connection from './config/db.js';

import Jobs from './src/Routes/Jobs.route.js';
import Internship from './src/Routes/Internship.route.js';
import Application from './src/Routes/Application.route.js';
import Resume from './src/Routes/Resume.route.js';
import Hackathon from './src/Routes/Hackathon.route.js';
import EmployerDahsboard from './src/Routes/EmployerDahsboard.route.js';
import Company from './src/Routes/Company.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true
// }));

// temp
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// routes
app.use("/jobs", Jobs);
app.use("/internship", Internship);
app.use("/application", Application)
app.use('/hackathon', Hackathon);
app.use('/company/dashboard', EmployerDahsboard);
app.use('/company/dashboard/resume', Resume);
app.use('/company',Company);

app.listen(PORT, () => {
    console.log('listening..', PORT);
    Connection();
});