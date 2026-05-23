import mongoose from "mongoose";
import candidatemasterData from "./models/candidateMasterData.js"; // adjust path



const degreeStreamMapping = {
  'B.Tech': ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics', 'Bio-medical', 'Information Technology', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
  'B.E': ['Computer Science', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics & Communication', 'Information Technology', 'Chemical Engineering', 'Biotechnology', 'Aerospace Engineering'],
  'M.Tech': ['Computer Science', 'Data Science', 'AI & Machine Learning', 'Cyber Security', 'VLSI Design', 'Structural Engineering'],
  'B.Sc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Biology'],
  'M.Sc': ['Computer Science', 'Data Science', 'Mathematics', 'Physics', 'Chemistry', 'Statistics', 'Biology'],
  'MBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management', 'IT & Systems', 'International Business'],
  'BBA': ['Marketing', 'Finance', 'Human Resources', 'Operations Management'],
  'B.Com': ['Accounting', 'Finance', 'Taxation', 'Economics', 'Marketing'],
  'M.Com': ['Accounting', 'Finance', 'Taxation', 'International Business'],
  'B.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
  'M.A': ['History', 'Political Science', 'Sociology', 'English Literature', 'Economics', 'Psychology'],
  'PhD': ['All Specializations'],
  'Postgraduate Diploma': ['Varies by Specialization'],
};

const seed = async () => {
  
  try {
   
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    for (const degreeName in degreeStreamMapping) {

      // 1️⃣ Create or find Degree
      let degree = await candidatemasterData.findOne({
        type: "DEGREE",
        value: degreeName
      });

      if (!degree) {
        degree = await candidatemasterData.create({
          type: "DEGREE",
          value: degreeName,
          isCustom: false
        });
        console.log(`Created Degree: ${degreeName}`);
      } else {
        console.log(`Degree Exists: ${degreeName}`);
      }

      // 2️⃣ Insert Streams under that degree
      const streams = degreeStreamMapping[degreeName];

      for (const streamName of streams) {

        const existingStream = await candidatemasterData.findOne({
          type: "STREAM",
          value: streamName,
          parent: degree._id
        });

        if (!existingStream) {
          await candidatemasterData.create({
            type: "STREAM",
            value: streamName,
            parent: degree._id,
            isCustom: false
          });

          console.log(`   ↳ Added Stream: ${streamName}`);
        }
      }
    }

    console.log("Seeding Complete ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();