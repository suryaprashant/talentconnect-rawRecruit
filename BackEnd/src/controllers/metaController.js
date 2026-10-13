import JobMeta from "../models/jobMeta.js";

export const getJobMetadata = async (req, res) => {
  try {
    const meta = await JobMeta.find();
    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ message: "Error fetching metadata", error: err.message });
  }
};

export const addMetadata = async (req, res) => {
  const { type, name, parentDegree } = req.body;

  try {
    let updated;
    // 1. Adding a brand new Degree
    if (type === 'degree') {
      updated = await JobMeta.findOneAndUpdate(
        { degree: name },
        { $setOnInsert: { degree: name, streams: [], skills: [] } },
        { upsert: true, new: true }
      );
    } 
    // 2. Adding a Stream or Skill to an existing Degree (Default or New)
    else if (type === 'studentStreams' || type === 'skills') {
      if (!parentDegree) {
        return res.status(400).json({ message: `Please select a degree to link this ${type} to.` });
      }

      const updateQuery = type === 'studentStreams' 
        ? { $addToSet: { streams: name } } 
        : { $addToSet: { skills: name } };

      updated = await JobMeta.findOneAndUpdate(
        { degree: parentDegree },
        updateQuery,
        { new: true }
      );
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Database operation failed", error: err.message });
  }
};