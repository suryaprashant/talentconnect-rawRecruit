import HiringDrive from "../models/HiringChannelOffCampusRegister.js";
import OffCampusApplication from "../models/offcampusApplicationModel.js";

export async function getOffCampusJobsService(companyId) {
    try {
        const response = await HiringDrive.find({ companyId: companyId }, {
            // custom fields
        }).lean();
        return { success: true, data: response.data };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create profile");
    }
}