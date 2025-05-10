import CampusPlacement from "../models/CampusPlacement.js";
import { getCollegesService } from "../services/CampusPlacement.service.js";

export const registerCampusPlacement = async (req, res) => {
    try {
        const formData = req.body;
        const newRegistration = new CampusPlacement(formData);
        await newRegistration.save();
        res
            .status(201)
            .json({
                message: "Campus Placement registration successful",
                data: newRegistration,
            });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Something went wrong", details: error.message });
    }
};

// get college
export const getRegisteredCampus = async (req, res) => {
    try {
        const response = await getCollegesService();
        // console.log("response", response);
        if (response.success === true) return res.status(200).json(response.data);
        return res.status(404).json({ msg: "No Colleges" });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}