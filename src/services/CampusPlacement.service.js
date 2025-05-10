import CampusPlacement from "../models/CampusPlacement.js";

export async function getCollegesService() {
    try {
        const response = await CampusPlacement.find();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}