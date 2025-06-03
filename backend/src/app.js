import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from "dotenv";

import Connection from '../config/Db.js';

import Jobs from './Routes/Jobs.route.js';
import Internship from './Routes/Internship.route.js';
import Application from './Routes/Application.route.js';
import Resume from './Routes/Resume.route.js';
import Hackathon from './Routes/Hackathon.route.js';
import EmployerDahsboard from './Routes/EmployerDahsboard.route.js';
import Company from './Routes/Company.route.js';

import savedJobsRouter from "./Routes/savedjobsandinternships.js";
import serviceRequestRouter from "./Routes/servicerequest.js";
import servicerequestinterview from "./Routes/servicerequest_interview.js";
import servicerequestreferraljobs from "./Routes/servicerequest_referraljobs.js";
import servicerequest_offcampusinfo from "./Routes/servicerequest_offcampusinfo.js";
import servicerequest_offcampusregister from "./Routes/servicerequest_offcampusregister.js";
import servicerequest_oncampusinfo from "./Routes/servicerequest_oncampusinfo.js";
import servicerequest_oncampusregister from "./Routes/servicerequest_oncampusregister.js";
import servicerequest_ondemandtraining from "./Routes/servicerequest_ondemandtraining.js";
import servicerequest_oncampusplacement from "./Routes/servicerequest_oncampusplacement.js";
import servicerequest_studenttraining from "./Routes/servicerequest_studenttraining.js";
import studentroute from "./Routes/student.route.js";
import application_to_admin from "./Routes/application_to_admin.js";
import uploadResumeRoute from "./Routes/uploadresume.js";
import manage_application from "./Routes/manage_application.js";
import jobapplication from "./Routes/jobapplication.js";
import registeroncampus from "./controllers/registeredcandidates_oncampusapplication.js";
import servicerequest from "./Routes/servicerequest_company_workforcesolutions.js";
import employeetraining from "./Routes/servicerequest_company_employeetraining.js";
import branding from "./Routes/servicerequest_company_branding.js";
import employeerbranding from "./Routes/servicerequest_company_employeerbranding.js";
import oncampushiring from "./Routes/hiringchannels_oncampus.js";
import oncampusregister from "./Routes/hiringchannels_oncampus_register.js";
import internship from "./Routes/hiringchannels_postinternships.js";
import jobs from "./Routes/hiringchannels_postjob.js";
import seminars from "./Routes/servicerequest_college_seminars.js";
import requestinfo from "./Routes/servicerequest_college_studenttraining_requestinfo.js";
import collegeoncampus from "./Routes/servicerequest_college_oncampus.js";
import collegerequestinfo from "./Routes/servicerequest_college_oncampusrequest.js";
import additionalinfo from "./Routes/onboarding_additionalinfo.js";
import preferences from "./Routes/onboarding_preferences.js";
import education from "./Routes/onboarding_education.js";
import basicdetails from "./Routes/onboarding_basicdetails.js";
import resume from "./Routes/onboarding_resume.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/jobs", Jobs);
app.use("/internship", Internship);
app.use("/application", Application);
app.use("/hackathon", Hackathon);
app.use("/company/dashboard", EmployerDahsboard);
app.use("/company/dashboard/resume", Resume);
app.use("/company", Company);

app.use("/api/rawrecruit", savedJobsRouter);
app.use("/api/rawrecruit", serviceRequestRouter);
app.use("/api/rawrecruit", servicerequestinterview);
app.use("/api/rawrecruit", servicerequestreferraljobs);
app.use("/api/rawrecruit", servicerequest_offcampusinfo);
app.use("/api/rawrecruit", servicerequest_offcampusregister);
app.use("/api/rawrecruit", servicerequest_oncampusinfo);
app.use("/api/rawrecruit", servicerequest_oncampusregister);
app.use("/api/rawrecruit", servicerequest_ondemandtraining);
app.use("/api/rawrecruit", servicerequest_oncampusplacement);
app.use("/api/rawrecruit", servicerequest_studenttraining);
app.use("/api/rawrecruit", studentroute);
app.use("/api/rawrecruit", application_to_admin);
app.use("/api/rawrecruit/resume", uploadResumeRoute);
app.use("/api/rawrecruit", manage_application);
app.use("/api/rawrecruit", jobapplication);
app.use("/api/rawrecruit", registeroncampus);
app.use("/api/rawrecruit", servicerequest);
app.use("/api/rawrecruit", employeetraining);
app.use("/api/rawrecruit", branding);
app.use("/api/rawrecruit", employeerbranding);
app.use("/api/rawrecruit", oncampushiring);
app.use("/api/rawrecruit", oncampusregister);
app.use("/api/rawrecruit", internship);
app.use("/api/rawrecruit", jobs);
app.use("/api/rawrecruit", seminars);
app.use("/api/rawrecruit", requestinfo);
app.use("/api/rawrecruit", collegeoncampus);
app.use("/api/rawrecruit", collegerequestinfo);
app.use("/api/rawrecruit", additionalinfo);
app.use("/api/rawrecruit", preferences);
app.use("/api/rawrecruit", education);
app.use("/api/rawrecruit", basicdetails);
app.use("/api/rawrecruit", resume);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    Connection();
});

// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true
// }));