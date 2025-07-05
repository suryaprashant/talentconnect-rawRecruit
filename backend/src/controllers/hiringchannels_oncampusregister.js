import Registration from "../models/HiringChannels_oncampusregister.js";

export const submitRegistration = async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
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

export const getRegistrationDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Registration.findById(id).lean();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
