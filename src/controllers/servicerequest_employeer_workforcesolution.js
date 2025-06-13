// controllers/workforceSolutionRequestController.js
import serviceRequestModel from "../models/ServiceRequest_employeer_workforcesolution.js";

export const submitWorkforceSolutionRequest = async (req, res) => {
  console.log("RECIEVEDREQUEST");
  try {
    console.log(req.body);
    const request = new serviceRequestModel(req.body);
    console.log(request);
    await request.save();
    res
      .status(201)
      .json({ message: "Workforce solution request submitted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
