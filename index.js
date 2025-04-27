import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

import Connection from './config/db.js';

import Jobs from './src/Routes/Jobs.route.js';
import Application from './src/Routes/application.route.js';
import Resume from './src/Routes/Resume.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// routes
app.use("/jobs", Jobs);
app.use("/studentApply", Application)
app.use('/resume', Resume);

app.listen(PORT, () => {
    console.log('listening..', PORT);
    Connection();
});