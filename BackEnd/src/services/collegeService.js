import collegeOnboardingModel from "src/models/collegeDashboard/collegeOnboardingModel.js";
import Auth from "src/models/authModel.js";

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