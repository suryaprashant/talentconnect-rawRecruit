// controllers/employeerBrandingController.js
import Employeerbranding from "../models/ServiceRequest_employeer_branding_register.js";

export const submitBrandingRequest = async (req, res) => {
  try {
    const brandingRequest = new Employeerbranding(req.body);
    await brandingRequest.save();
    res
      .status(201)
      .json({ message: "Branding request submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
