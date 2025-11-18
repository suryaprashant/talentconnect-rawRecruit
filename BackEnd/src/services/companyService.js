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
        console.log("Company profile found:", company);
        return { success: true, data: company };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function updateCompanyProfileService(userId, data) {
    try {
        const company = await CompanyProfile.findOneAndUpdate(
            { userId:userId },
            data,
            { new: true, runValidators: true }
        );

        if(!company){
            throw new Error('Company Profile not found') ;
        }

        return company;
    } catch (error) {
        console.error("Update Company Profile Error: ", error.message);
        
        // Provide more specific error messages
        if (error.name === 'ValidationError') {
            throw new Error(`Validation failed: ${Object.values(error.errors).map(err => err.message).join(', ')}`);
        } else if (error.name === 'CastError') {
            throw new Error('Invalid user ID format');
        } else {
            throw new Error(`Failed to update company profile: ${error.message}`);
        }
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



export const getEmployerService = async (user) => {
    const { _id: authUserId, activeCompanyId } = user;
   
    
    if (activeCompanyId) {
        return { success: true, data: [{ _id: activeCompanyId }] };
    }
    
    const ownProfileResult = await getCompanyService(authUserId);

    if (!ownProfileResult || !ownProfileResult.success || ownProfileResult.data.length === 0) {
        return { success: false, msg: 'You must have a company profile to apply, even as an independent.' };
    }

    return ownProfileResult;
};
