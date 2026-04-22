import mongoose from "mongoose";
import dotenv from "dotenv";

import CollegeMasterData from "./models/collegeMasterData.js";
import CompanyMasterData from "./models/companyMasterData.js";
import SkillsModel from "./models/skillsModel.js";

dotenv.config();

/* ------------------ COLLEGE DESIGNATIONS ------------------ */
const designationOptions = [
  "Professor",
  "HOD",
  "Placement Officer",
  "Dean",
  "Coordinator",
];

/* ------------------ COMPANY TYPES ------------------ */
const companyTypeOptions = ["MNC", "Startup", "SME", "Public Sector"];

/* ------------------ SKILLS ------------------ */
const defaultSkills = [
  "JavaScript",
  "Node.js",
  "MongoDB",
  "React",
  "Python",
  "Docker",
  "AWS",
  "TypeScript",
  "GraphQL",
  "Redis",
];

const companyDesignationOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Lead Engineer",
  "Engineering Manager",
  "HR Manager",
  "HR Executive",
  "Talent Acquisition Specialist",
  "Product Manager",
  "Project Manager",
  "Business Analyst",
  "Data Analyst",
  "Marketing Manager",
  "Sales Manager",
  "Operations Manager",
  "Finance Manager",
  "CEO",
  "CTO",
  "Founder",
  "Co-Founder",
  "Intern",
];

/* ------------------ INDUSTRY TYPES ------------------ */
const industryTypeOptions = [
  "IT Industry",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Retail",
  "Manufacturing",
  "Automotive",
];

/* ------------------ JOB ROLES ------------------ */
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

    /* ------------------ INDUSTRY TYPES ------------------ */
    for (const industry of industryTypeOptions) {
      await CompanyMasterData.updateOne(
        { type: "INDUSTRY_TYPE", value: industry, parent: null },
        {
          $setOnInsert: {
            type: "INDUSTRY_TYPE",
            value: industry,
            parent: null,
            isCustom: false,
            isActive: true,
          },
        },
        { upsert: true }
      );

      console.log(`✔ Industry Type: ${industry}`);
    }

    /* ------------------ COMPANY DESIGNATIONS ------------------ */
    for (const designation of companyDesignationOptions) {
      await CompanyMasterData.updateOne(
        { type: "COMPANY_DESIGNATION", value: designation, parent: null },
        {
          $setOnInsert: {
            type: "COMPANY_DESIGNATION",
            value: designation,
            parent: null,
            isCustom: false,
            isActive: true,
          },
        },
        { upsert: true }
      );
    
      console.log(`✔ Company Designation: ${designation}`);
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

    /* ------------------ SKILLS ------------------ */
    const skillOperations = defaultSkills.map((skill) => ({
      updateOne: {
        filter: { skills: skill },
        update: { $setOnInsert: { skills: skill } },
        upsert: true,
      },
    }));

    const skillResult = await SkillsModel.bulkWrite(skillOperations);

    if (skillResult.upsertedCount > 0) {
      console.log(`✔ ${skillResult.upsertedCount} new skills added`);
    } else {
      console.log("ℹ️ Skills already up to date");
    }

    console.log("\n🎉 Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error ❌", error);
    process.exit(1);
  }
};

seedData();