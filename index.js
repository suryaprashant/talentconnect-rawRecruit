import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import Connection from './db/dbConnect.js';

import Jobs from './Routes/Jobs.route.js';
import Application from './Routes/application.route.js';

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
app.use("/studentApply",Application)

app.listen(PORT, () => {
    console.log('listening..',PORT);
    Connection();
});