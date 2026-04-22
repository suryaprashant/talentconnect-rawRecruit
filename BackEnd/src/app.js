import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { startRankingCron } from "./cron/rankingCron.js";
startRankingCron();
// DB & Socket
import Connection from "../config/Db.js";
import { app, server } from "./socketIO/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - This must be the first logic that needs env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// dotenv.config({ path: path.resolve(__dirname, '../.env') });
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// Auth and Profile Routes
import adminAuth from "./routes/admin/adminAuth.js";
import adminDashboard from "./routes/admin/adminDashboardRoute.js";
import userManagement from "./routes/admin/userManagementRoutes.js";
import jobDriveManagement from "./routes/admin/jobDriveManagementRoute.js";
import applicationManagement from "./routes/admin/applicationManagementRoute.js"
import serviceRequestManagement from "./routes/admin/serviceRequestManagementRoutes.js"
import authRoutes from "./routes/authRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import fresherProfileRoutes from "./routes/fresherProfileRoutes.js";
import professionalProfileRoutes from "./routes/professionalProfileRoutes.js";
import companyProfileRoutes from "./routes/companyDashboard/companyProfileRoutes.js";
import collegeProfileRoutes from "./routes/collegeDashboard/collegeProfileRoutes.js";
import collegeOnboardingRoutes from "./routes/collegeDashboard/collegeOnboardingRoutes.js";
//import employerProfileRoutes from "./routes/employerProfileRoutes.js";
import employerProfileRoutes from './routes/employerDashboard/employerProfileRoute.js'
import messageRoute from "./routes/messageRoute.js";

// Main Features
import Application from "./routes/applicationRoute.js";
import Resume from "./routes/resumeroute.js";
import Hackathon from "./routes/hackathonRoute.js";
import Casestudy from "./routes/casestudyRoute.js";
import Workshop from "./routes/workshopRoute.js";
import eventParticipation from "./routes/eventParticipationRoute.js";
import EmployerDashboard from "./routes/employerDahsboardRoute.js";
import Company from "./routes/companyRoute.js";
import Jobs from "./routes/jobsRoute.js"
import Internship from "./routes/internshipRoute.js";
import LiveTicker from "./routes/liveTickerRoute.js";
// RawRecruit APIs
import serviceRequestRouter from "./routes/servicerequestRoute.js";
import servicerequestinterview from "./routes/servicerequestInterviewRoute.js";
import servicerequestreferraljobs from "./routes/servicerequestReferraljobsRoute.js";
import servicerequest_offcampusinfo from "./routes/servicerequestOffcampusinfoRoute.js";
import servicerequest_offcampusregister from "./routes/servicerequestOffcampusregisterRoute.js";
import servicerequest_oncampusinfo from "./routes/servicerequestOncampusinfoRoute.js";
import servicerequest_oncampusregister from "./routes/servicerequestOncampusregisterRoute.js";
import servicerequest_ondemandtraining from "./routes/servicerequestOndemandtrainingRoute.js";
import servicerequest_oncampusplacement from "./routes/servicerequestOncampusplacementRoute.js";
import servicerequest_studenttraining from "./routes/servicerequestStudenttrainingRoute.js";
import studentroute from "./routes/studentRoute.js";
import application_to_admin from "./routes/applicationToAdminRoute.js";
import uploadResumeRoute from "./routes/uploadresumeRoute.js";
// import manage_application from "./routes/manage_applicationRoute.js";
// import jobapplication from "./routes/jobApplication.js";
// import registeroncampus from "./controllers/registeredcandidates_oncampusapplication.js";
import servicerequest from "./routes/servicerequestCompanyWorkforcesolutionsRoute.js";
import employeetraining from "./routes/servicerequestCompanyEmployeetrainingRoute.js";
import branding from "./routes/servicerequestCompanyBrandingRoute.js";
import employeerbranding from "./routes/servicerequestCompanyEmployeerbrandingRoute.js";
import seminars from "./routes/servicerequestCollegeSeminarsRoute.js";
import requestinfo from "./routes/servicerequestCollegeStudenttrainingRequestinfoRoute.js";
import collegeoncampus from "./routes/servicerequestCollegeOncampusRoute.js";
import collegerequestinfo from "./routes/servicerequestCollegeOncampusrequestRoute.js";
// import additionalinfo from "./routes/onboardingAdditionalinfoRoute.js";
// import preferences from "./routes/onboardingPreferencesRoute.js";
// import education from "./routes/onboardingEducationRoute.js";
import basicdetails from "./routes/onboardingBasicdetailsRoute.js";
// import resume from "./routes/onboardingResumeRoute.js";
import CollegeApplication from './routes/collegeApplicationRoute.js';
// import jobinterest from "./routes/onboardingJobinterestsRoute.js";
import student_onboardingroutes from "./routes/studentOnboardingRoutes.js";
import JobManagement from "./routes/jobManagementRoute.js"
import poolCampusRoute from "./routes/jobManagement/poolCampusRoute.js";
import OncampusJobmanagement from "./routes/jobManagement/onCampusRoute.js"
import TeamMemberRoute from "./routes/teamMemberRoute.js";
import notificationRoute from "./routes/notificationRoute.js"
import dropDownItems from "./routes/dropDownItemsRoute.js" ;
import jobPosting from './routes/jobPostingsRoute.js' ;
import studentDashboardRoute from './routes/studentDashboard/studentDashboardRoute.js';
import EmployerHiringChannelRoute from './routes/employerHiringChannel/hiringChannelRoute.js'
import CollegeJobManagement from "./routes/collegeJobManageRoute.js" ;
import resumeRoutes from './routes/resumeroute.js';
import hackathonHostingRoute from './routes/hostingManagement/hackathonHostingRoute.js';
import casestudyHostingRoute from './routes/hostingManagement/casestudyHostingRoute.js';
import workshopHostingRoute from './routes/hostingManagement/workshopHostingRoute.js';
import serviceRequests from "./routes/serviceRequestsRoute.js"
import interviewRoutes from "./routes/interviewRoutes.js";
import metaRoutes from "./routes/metaRoutes.js"
import { seedDB } from "./scripts/metaScript.js";
import collegeRoutes from './routes/collegeNameRoute.js';
import companyRoute from "./routes/companyRoute.js"
import CustomDropDown from "./routes/CustomDropDown.js"

import CandidateRoute from "./routes/CandidateRoute.js"
import CareerInsightsRoute from "./routes/careerInsightsRoute.js";
import adminBlogRoute from "./routes/admin/adminBlogRoute.js";
import blogRoutes from "./routes/blogRoutes.js";
import deleteJobRoute from "./routes/deleteJobRoute.js";



app.use("/api/auth", authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use("/api/blogs", blogRoutes);

app.use('/api/candidate',CandidateRoute)

// admin related auths
app.use("/api/admin", adminAuth);

app.use("/api/admin/dashboard", adminDashboard);
app.use("/api/admin/blogs", adminBlogRoute);
app.use("/api/admin/users", userManagement);
app.use("/api/admin/job-n-drive", jobDriveManagement);
app.use("/api/admin/application", applicationManagement)
app.use("/api/admin/servicerequest", serviceRequestManagement);
app.use("/api/candidate", CandidateRoute);
app.use("/api/ticker", LiveTicker);

app.use("/api/meta", CustomDropDown);
// admin relatd auth ends

app.use("/api", student_onboardingroutes);
app.use("/api/hiring-channels", jobPosting);
app.use("/api/upload", uploadRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/fresher-profile", fresherProfileRoutes);
app.use("/api/professional-profile", professionalProfileRoutes);
app.use("/api/companyDashboard", companyProfileRoutes);
app.use("/api/college", collegeProfileRoutes);
app.use("/api/college-onboarding", collegeOnboardingRoutes);
app.use("/api/dashboard", employerProfileRoutes);
app.use("/api/messages", messageRoute);
// app.use("/api/company" , hiringOffCampus);
app.use("/api/company" , poolCampusRoute);
app.use("/api/company/jobmanagement", OncampusJobmanagement);
app.use("/api/team-member" , TeamMemberRoute) ;
app.use("/api/notifications" , notificationRoute )
app.use("/interviews", interviewRoutes);

app.use("/dropdown" , dropDownItems) ;


//student dashboard
app.use("/api/student-dashboard", studentDashboardRoute);
app.use("/api/career-insights", CareerInsightsRoute);

// employer Hiring channel
app.use("/api/employer/hiring-channel", EmployerHiringChannelRoute);

app.use("/jobs", Jobs);
app.use("/internship", Internship);
app.use("/application", Application);
app.use("/college/application",CollegeApplication);
app.use("/hackathon", Hackathon);
app.use("/workshop", Workshop);
app.use("/casestudy", Casestudy);
app.use("/api/hosting/workshop", Workshop);
app.use("/eventParticipation", eventParticipation);
app.use("/company/dashboard", EmployerDashboard);
app.use("/company/dashboard/resume", Resume);
app.use("/company", Company);
app.use('/company/jobmanagement',JobManagement);
app.use('/college/jobmanagement',CollegeJobManagement) ;
app.use('/api/hosting-management', hackathonHostingRoute);
app.use('/api/hosting-management', casestudyHostingRoute);
app.use('/api/hosting-management', workshopHostingRoute);
app.use('/api/servicerequests', serviceRequests);
app.use("/api/company-master-data", companyRoute);
app.use("/api/delete-job", deleteJobRoute);

// RawRecruit API Mounts
app.use("/api/rawrecruit", [
  // savedJobsRouter,
  serviceRequestRouter,
  servicerequestinterview,
  servicerequestreferraljobs,
  servicerequest_offcampusinfo,
  servicerequest_offcampusregister,
  servicerequest_oncampusinfo,
  servicerequest_oncampusregister,
  servicerequest_ondemandtraining,
  servicerequest_oncampusplacement,
  servicerequest_studenttraining,
  studentroute,
  application_to_admin,
  // manage_application,
  // jobapplication,
  // registeroncampus,
  servicerequest,
  employeetraining,
  branding,
  employeerbranding,
  // oncampushiring,
  // oncampusregister,
  seminars,
  requestinfo,
  collegeoncampus,
  collegerequestinfo,
  // additionalinfo,
  // preferences,
  // education,
  // resume,
]);
app.use("/api/rawrecruit/resume", uploadResumeRoute);
app.use("/rawrecruit/link", basicdetails);
app.use("/api/resumes", resumeRoutes);
app.use("api/meta",CustomDropDown)

// app.use("/rawrecruit", jobinterest);

// Start the server
const startServer = async () => {
  try {
    // Connect to database FIRST
    await Connection();
    console.log('Database connected successfully');
    await seedDB();
    // THEN start the server
    server.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

import testRoute from "./routes/test.js";
app.use("/api/test", testRoute);

startServer();