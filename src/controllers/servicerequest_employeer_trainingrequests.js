// controllers/employeeTrainingRequestController.js
import serviceRequestModell from "../models/ServiceRequest_employeer_employeetraining.js";

export const submitEmployeeTrainingRequest = async (req, res) => {
  try {
    const request = new serviceRequestModell(req.body);
    await request.save();
    res
      .status(201)
      .json({ message: "Employee training request submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
