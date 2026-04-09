import CollegeProfileModel from '../models/collegeDashboard/collegeProfileModel.js';
import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import Auth from "../models/authModel.js";

export async function getCollegeService(userId) {
    try {
        const college = await collegeOnboardingModel.find({ userId: userId })
        return { success: true, data: college };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getCollegeEmail(collegeId) {
    try {
        const college = await collegeOnboardingModel.findOne({ _id: collegeId });
        const user = await Auth.findById(college.userId);
        return { success: true, email: user.email };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}


export async function updateCollegeProfileService(userId, updates) {
  const college = await collegeOnboardingModel.findOneAndUpdate(
    { userId },
    { $set: updates }, 
    { 
      new: true, 
      runValidators: true, 
      upsert: true // 🔹 This creates the profile if it doesn't exist!
    }
  );

  // You can remove the "if (!college)" check now, because upsert will ensure one exists
  return college;
}

//  Normalize function
const normalizeString = (str) =>
  str?.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

export const getStudentsByCollegeIdService = async (collegeId) => {
  //  Fetch college
  const college = await collegeOnboardingModel.findById(collegeId);

  if (!college) {
    return {
      success: false,
      status: 404,
      message: "College not found",
    };
  }

  //  Extract college name
  const collegeName =
    college.collegeUniversityDetails?.collegeName || "";

  if (!collegeName) {
    return {
      success: false,
      status: 400,
      message: "College name missing in record",
    };
  }

  const normalizedCollegeName = normalizeString(collegeName);

  // DB pre-filter (regex)
  const students = await Onboarding.find(
    {
      college: { $regex: collegeName, $options: "i" },
    },
    "name email college degree semester specialization yearOfGraduation"
  );

  //  Normalize + exact match
  const matchedStudents = students.filter((student) => {
    return (
      normalizeString(student.college) === normalizedCollegeName
    );
  });

  return {
    success: true,
    status: 200,
    data: matchedStudents,
    count: matchedStudents.length,
  };
};