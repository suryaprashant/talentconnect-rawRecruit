import Registration from "../models/servicerequestOncampusregisterModel.js";

export const submitRegistration = async (req, res) => {
  try {
    console.log('manav was here')
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: "Registration submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
