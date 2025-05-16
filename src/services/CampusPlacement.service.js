import CampusPlacement from "../models/CampusPlacement.js";
import Application from "../models/Application.js";

export async function campusPlacementRegistrationService(campusData) {
    try {
        const newRegistration = new CampusPlacement(campusData);
        await newRegistration.save();

        return { success: true, message: "Campus Placement registration successful" };

    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to register");
    }
}

export async function getCollegesService() {
    try {
        const response = await CampusPlacement.find().lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}