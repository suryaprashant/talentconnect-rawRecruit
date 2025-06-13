import PlacementRequest from "../models/HiringChannels_employeer_poolcampusregister.js";

export const createPoolCampusRegistration = async (req, res) => {
  try {
    const placement = new PlacementRequest(req.body);
    await placement.save();
    res.status(201).json(placement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPoolCampusRegistrations = async (req, res) => {
  try {
    const placements = await PlacementRequest.find();
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
