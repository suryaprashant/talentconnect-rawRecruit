import Onboarding from "../models/studentonboardingModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";

const profileModelMap = {
    professional: Onboarding,
    student:      Onboarding,
    fresher:      Onboarding,
    company:      CompanyProfile,
    college:      CollegeOnboarding,
     employer:     CompanyProfile,
};

/**
 * Resolves the correct profile document based on the user's role.
 * @param {ObjectId} userId  - from req.user._id
 * @param {string}   role    - from req.user.role (stored on Auth model)
 * @returns {{ profile, profileType }}
 */
export const resolveProfile = async (userId, role) => {
    const Model = profileModelMap[role];
    if (!Model) {
        const err = new Error(`Unsupported role: ${role}`);
        err.status = 400;
        throw err;
    }

    const profile = await Model.findOne({ userId });
    if (!profile) {
        const err = new Error(`${role} profile not found`);
        err.status = 404;
        throw err;
    }

    return { profile, profileType: role };
};