import BasicDetails from "../models/Onboarding_basicdetails.js";

export const submitBasicDetails = async (req, res) => {
  try {
    const data = req.body;
    const details = await BasicDetails.create(data);
    res.status(201).json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
