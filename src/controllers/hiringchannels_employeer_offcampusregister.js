import HiringForm from "../models/HiringChannels_employeer_offcampusregister.js";

export const createOffCampusHiring = async (req, res) => {
  try {
    const form = new HiringForm(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllOffCampusHiring = async (req, res) => {
  try {
    const forms = await HiringForm.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
