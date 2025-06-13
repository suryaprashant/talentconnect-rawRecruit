// controllers/employeeBrandingRequestController.js
import serviceRequestModellll from "../models/ServiceRequest_employeer_branding.js";

export const submitEmployeeBrandingRequest = async (req, res) => {
  try {
    const request = new serviceRequestModellll(req.body);
    await request.save();
    res
      .status(201)
      .json({ message: "Employee branding request submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
