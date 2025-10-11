import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// DB & Socket
import Connection from "../../config/Db.js";
import { app, server } from "src/socketIO/server.js";

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
import authRoutes from "src/routes/authRoute.js";
import uploadRoutes from "src/routes/uploadRoute.js";
import studentProfileRoutes from "src/routes/studentProfileRoutes.js";
import fresherProfileRoutes from "src/routes/fresherProfileRoutes.js";
import professionalProfileRoutes from "src/routes/professionalProfileRoutes.js";
import companyProfileRoutes from "src/routes/companyDashboard/companyProfileRoutes.js";
import collegeProfileRoutes from "src/routes/collegeDashboard/collegeProfileRoutes.js";
import collegeOnboardingRoutes from "src/routes/collegeDashboard/collegeOnboardingRoutes.js";
//import employerProfileRoutes from "./routes/employerProfileRoutes.js";
import employerProfileRoutes from 'src/routes/employerDashboard/employerProfileRoute.js'
import messageRoute from "src/routes/messageRoute.js";

// Main Features
import Application from "src/routes/applicationRoute.js";
import Resume from "src/routes/resumeroute.js";
import Hackathon from "src/routes/hackathonRoute.js";
import Casestudy from "src/routes/casestudyRoute.js";
import Workshop from "src/routes/workshopRoute.js";
import eventParticipation from "src/routes/eventParticipationRoute.js";
import EmployerDashboard from "src/routes/employerDahsboardRoute.js";
import Company from "src/routes/companyRoute.js";
import Jobs from "src/routes/jobsRoute.js"

// RawRecruit APIs
import serviceRequestRouter from "src/routes/servicerequestRoute.js";
import servicerequestinterview from "src/routes/servicerequestInterviewRoute.js";
import servicerequestreferraljobs from "src/routes/servicerequestReferraljobsRoute.js";
import servicerequest_offcampusinfo from "src/routes/servicerequestOffcampusinfoRoute.js";
import servicerequest_offcampusregister from "src/routes/servicerequestOffcampusregisterRoute.js";
import servicerequest_oncampusinfo from "src/routes/servicerequestOncampusinfoRoute.js";
import servicerequest_oncampusregister from "src/routes/servicerequestOncampusregisterRoute.js";
import servicerequest_ondemandtraining from "src/routes/servicerequestOndemandtrainingRoute.js";
import servicerequest_oncampusplacement from "src/routes/servicerequestOncampusplacementRoute.js";
import servicerequest_studenttraining from "src/routes/servicerequestStudenttrainingRoute.js";
import studentroute from "src/routes/studentRoute.js";
import application_to_admin from "src/routes/applicationToAdminRoute.js";
import uploadResumeRoute from "src/routes/uploadresumeRoute.js";
// import manage_application from "./routes/manage_applicationRoute.js";
// import jobapplication from "./routes/jobApplication.js";
// import registeroncampus from "./controllers/registeredcandidates_oncampusapplication.js";
import servicerequest from "src/routes/servicerequestCompanyWorkforcesolutionsRoute.js";
import employeetraining from "src/routes/servicerequestCompanyEmployeetrainingRoute.js";
import branding from "src/routes/servicerequestCompanyBrandingRoute.js";
import employeerbranding from "src/routes/servicerequestCompanyEmployeerbrandingRoute.js";
import seminars from "src/routes/servicerequestCollegeSeminarsRoute.js";
import requestinfo from "src/routes/servicerequestCollegeStudenttrainingRequestinfoRoute.js";
import collegeoncampus from "src/routes/servicerequestCollegeOncampusRoute.js";
import collegerequestinfo from "src/routes/servicerequestCollegeOncampusrequestRoute.js";
// import additionalinfo from "./routes/onboardingAdditionalinfoRoute.js";
// import preferences from "./routes/onboardingPreferencesRoute.js";
// import education from "./routes/onboardingEducationRoute.js";
import basicdetails from "src/routes/onboardingBasicdetailsRoute.js";
// import resume from "./routes/onboardingResumeRoute.js";
import CollegeApplication from 'src/routes/collegeApplicationRoute.js';
// import jobinterest from "./routes/onboardingJobinterestsRoute.js";
import student_onboardingroutes from "src/routes/studentOnboardingRoutes.js";
import JobManagement from "src/routes/jobManagementRoute.js"
import poolCampusRoute from "src/routes/jobManagement/poolCampusRoute.js";
import OncampusJobmanagement from "src/routes/jobManagement/onCampusRoute.js"
import TeamMemberRoute from "src/routes/teamMemberRoute.js";
import notificationRoute from "src/routes/notificationRoute.js"
import dropDownItems from "src/routes/dropDownItemsRoute.js" ;
import jobPosting from 'src/routes/jobPostingsRoute.js' ;
import studentDashboardRoute from 'src/routes/studentDashboard/studentDashboardRoute.js';
import EmployerHiringChannelRoute from 'src/routes/employerHiringChannel/hiringChannelRoute.js'
import CollegeJobManagement from "src/routes/collegeJobManageRoute.js" ;
import resumeRoutes from 'src/routes/resumeroute.js';
app.use("/api/auth", authRoutes);
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
app.use("/dropdown" , dropDownItems) ;

//student dashboard
app.use("/api/student-dashboard", studentDashboardRoute);

// employer Hiring channel
app.use("/api/employer/hiring-channel", EmployerHiringChannelRoute);

app.use("/jobs", Jobs);
// app.use("/internship", Internship);
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
// app.use("/rawrecruit", jobinterest);

// Start the server
server.listen(PORT, async () => {
  console.log(`Server is running on PORT: ${PORT}`);
  await Connection();
});
