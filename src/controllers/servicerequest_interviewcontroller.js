import Interview from "../models/ServiceRequest_interview.js";

export const scheduleInterview = async (req, res) => {
  try {
    const { category, skillset, date, time, message, termsAccepted } = req.body;

    if (!category || !skillset || !date || !time || !termsAccepted) {
      return res.status(400).json({
        error:
          "All required fields must be provided and terms must be accepted.",
      });
    }

    const newInterview = new Interview({
      category,
      skillset,
      date,
      time,
      message,
      termsAccepted,
    });
    await newInterview.save();

    res.status(201).json({ message: "Interview scheduled successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
