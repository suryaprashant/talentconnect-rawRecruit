import Education from "../models/Onboarding_education.js";

export const submitEducationDetails = async (req, res) => {
  try {
    const data = req.body;
    const education = await Education.create(data);
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
