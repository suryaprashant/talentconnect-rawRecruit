import Jobs from "../models/HiringChannels_employeer_postinternship.js";

export const createInternshipJob = async (req, res) => {
  try {
    const job = new Jobs(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllInternshipJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
