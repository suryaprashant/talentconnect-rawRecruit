import Registration from "../models/HiringChannels_oncampusregister.js";

export const submitRegistration = async (req, res) => {
  try {
    console.log("Registration data received:", req.body);
    const registration = new Registration(req.body);
    console.log("Registration object created:", registration);
    await registration.save();
    console.log("Registration saved successfully");
    res.status(201).json({ message: "Registration submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const response = await Registration.find().lean();
    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
