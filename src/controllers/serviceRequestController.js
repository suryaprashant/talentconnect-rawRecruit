import ServiceRequestemployeer from "../models/ServiceRequests.js";

export const createemployer = async (req, res) => {
  console.log("HELLO");
  try {
    const { date, time, message, acceptTerms } = req.body;

    if (!date || !time || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequest = new ServiceRequestemployeer({
      date,
      time,
      message,
      acceptTerms,
    });
    //     console.lo;

    const savedRequest = await newRequest.save();
    res
      .status(201)
      .json({ message: "Request submitted successfully", data: savedRequest });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
