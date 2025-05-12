import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import savedJobsRouter from "./src/routes/savedjobsandinternships.js";
import serviceRequestRouter from "./src/routes/servicerequest.js";
import servicerequestinterview from "./src/routes/servicerequest_interview.js";
import servicerequestreferraljobs from "./src/routes/servicerequest_referraljobs.js";
import servicerequest_offcampusinfo from "./src/routes/servicerequest_offcampusinfo.js";
import servicerequest_offcampusregister from "./src/routes/servicerequest_offcampusregister.js";
import servicerequest_oncampusinfo from "./src/routes/servicerequest_oncampusinfo.js";
import servicerequest_oncampusregister from "./src/routes/servicerequest_oncampusregister.js";
import servicerequest_ondemandtraining from "./src/routes/servicerequest_ondemandtraining.js";
import servicerequest_oncampusplacement from "./src/routes/servicerequest_oncampusplacement.js";
import servicerequest_studenttraining from "./src/routes/servicerequest_studenttraining.js";
import studentroute from "./src/routes/student.route.js";
import application_to_admin from "./src/routes/application_to_admin.js";
import uploadResumeRoute from "./src/routes/uploadresume.js";
import offCampusApplicationRoutes from "./src/routes/jobmanagement.js";
import oncampus from "./src/routes/oncampus.js";
import manage_application from "./src/routes/manage_application.js";
import jobapplication from "./src/routes/jobapplication.js";
import registeroncampus from "./src/controllers/registeredcandidates_oncampusapplication.js";
import "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

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
app.use("/resume", uploadResumeRoute);
// app.use("/api/rawrecruit", offCampusApplicationRoutes);
// app.use("/api/rawrecruit", oncampus);
app.use("/api/rawrecruit", manage_application);
app.use("/api/rawrecruit", jobapplication);
app.use("/api/rawrecruit", registeroncampus);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
