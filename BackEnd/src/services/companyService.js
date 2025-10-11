import CompanyProfile from '../models/companyDashboard/companyProfileModel.js';
import Auth from "../models/authModel.js";

export async function createProfileService(profileData) {
    try {
        const newProfileData = new CompanyProfile(profileData);
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

        if (!company) {
            return { success: false, msg: "Company profile not found" };
        }
        return { success: true, data: company };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function updateCompanyProfileService(userId, data) {
    try {
        const company = await CompanyProfile.findOneAndUpdate(
            { userId },
            data,
            { new: true, runValidators: true }
        );
        return company;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getCompanyEmail(companyId) {
    try {
        const company = await CompanyProfile.findOne({ _id: companyId });
        const user = await Auth.findById(company.userId);
        return { success: true, email: user.email };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}