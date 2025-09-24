import CompanyProfile from '../models/companyDashboard/companyProfileModel.js';
import CompanyOverview from '../models/companyOverviewModel.js';

export async function createProfileService(profileData) {
    try {
        const newProfileData = new CompanyOverview(profileData);
        await newProfileData.save();

        return { success: true, msg: "profile created" };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create profile");
    }
}

export async function getCompanyService(userId) {
    try {
        const company = await CompanyProfile.find({ userId: userId }).lean();
        return { success: true, data: company };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}