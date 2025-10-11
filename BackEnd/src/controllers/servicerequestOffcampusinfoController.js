import OffCampusInfo from "../models/servicerequestOffcampusinfoModel.js";

export const submitOffCampusInfo = async (req, res) => {
  try {
    const data = new OffCampusInfo(req.body);
    await data.save();
    res.status(201).json({ message: "Info submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
