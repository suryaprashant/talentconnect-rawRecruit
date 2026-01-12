import CollegeProfileModel from '../models/collegeDashboard/collegeProfileModel.js';
import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";
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