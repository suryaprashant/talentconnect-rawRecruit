import mongoose from "mongoose";
import dotenv from "dotenv";

import CollegeMasterData from "./models/CollegeMasterData.js";
import CompanyMasterData from "./models/CompanyMasterData.js";

dotenv.config();

const MONGO_URI = "mongodb+srv://Admin:VneGXxUJDOwHV260@cluster1.guimnhi.mongodb.net/?retryWrites=true&w=majority";

const designationOptions = [
  "Professor",
  "HOD",
  "Placement Officer",
  "Dean",
  "Coordinator",
];

const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];

const jobRoleOptions = [
  "Software Developer",
  "Data Scientist",
  "DevOps Engineer",
  "QA Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
  "Business Analyst",
  "Data Analyst",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Network Engineer",
  "Cyber Security Specialist",
  "Technical Writer",
  "Sales Engineer",
  "Marketing Specialist",
  "HR Recruiter",
  "Finance Analyst",
  "Other",
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected ✅");

    /* ------------------ COLLEGE DESIGNATIONS ------------------ */
    for (const designation of designationOptions) {
      await CollegeMasterData.updateOne(
        { type: "COLLEGE_DESIGNATION", value: designation },
        {
          $setOnInsert: {
            type: "COLLEGE_DESIGNATION",
            value: designation,
            isActive: true,
          },
        },
        { upsert: true }
      );

      console.log(`✔ College Designation: ${designation}`);
    }

    /* ------------------ COMPANY TYPES ------------------ */
    for (const companyType of companyTypeOptions) {
      await CompanyMasterData.updateOne(
        { type: "COMPANY_TYPE", value: companyType, parent: null },
        {
          $setOnInsert: {
            type: "COMPANY_TYPE",
            value: companyType,
            parent: null,
            isCustom: false,
            isActive: true,
          },
        },
        { upsert: true }
      );

      console.log(`✔ Company Type: ${companyType}`);
    }

    /* ------------------ JOB ROLES ------------------ */
    for (const role of jobRoleOptions) {
      await CompanyMasterData.updateOne(
        { type: "JOB_ROLE", value: role, parent: null },
        {
          $setOnInsert: {
            type: "JOB_ROLE",
            value: role,
            parent: null,
            isCustom: false,
            isActive: true,
          },
        },
        { upsert: true }
      );

      console.log(`✔ Job Role: ${role}`);
    }

    console.log("\n🎉 Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error ❌", error);
    process.exit(1);
  }
};

seedData();