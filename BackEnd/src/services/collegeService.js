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

const ALLOWED_PROFILE_TYPES = ['student', 'fresher', 'professional'];
 
const STUDENT_PROJECTION =
  'name email phone college degree semester specialization cgpa yearOfGraduation profileType skills experiences profileImage about jobRoles linkedin github portfolio lookingFor employmentType industry locations';

const PRO_FRESHER_PROJECTION =
  'name email phone college degree specialization yearOfGraduation profileType skills experiences currentCompany totalYearsOfExperience profileImage about jobRoles linkedin github portfolio lookingFor employmentType industry locations noticePeriod';
 
export const getStudentsByCollegeIdService = async (authUserId, profileType) => {
  // 1. Fetch college
  const college = await collegeOnboardingModel
    .findOne({ userId: authUserId })
    .lean();
 
  if (!college) {
    return { success: false, status: 404, message: 'College profile not found for this user' };
  }
 
  const collegeName = college.collegeUniversityDetails?.collegeName || '';
  if (!collegeName) {
    return { success: false, status: 400, message: 'College name missing in record' };
  }
 
  const normalizedCollegeName = normalizeString(collegeName);
 
  // 2. Build query
  const query = { college: { $regex: collegeName, $options: 'i' } };
 
  if (profileType && ALLOWED_PROFILE_TYPES.includes(profileType)) {
    query.profileType = profileType;
  }
 
  // 3. Pick projection based on type
  const projection = profileType === 'student'
    ? STUDENT_PROJECTION
    : PRO_FRESHER_PROJECTION;
 
  // 4. Fetch
  const students = await Onboarding.find(query, projection);
 
  // 5. Exact name match after regex pre-filter
  const matchedStudents = students.filter(
    s => normalizeString(s.college) === normalizedCollegeName
  );
 
  return {
    success: true,
    status:  200,
    data:    matchedStudents,
    count:   matchedStudents.length,
  };
};