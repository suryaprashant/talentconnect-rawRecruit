import CollegeOverview from "../models/collegeOverview.js";

// POST or UPDATE
export const createOrUpdateCollegeOverview = async (req, res) => {
  try {
    const { officialEmail } = req.body;

    const existing = await CollegeOverview.findOne({ officialEmail });

    if (existing) {
      const updated = await CollegeOverview.findOneAndUpdate(
        { officialEmail },
        req.body,
        { new: true }
      );
      return res.status(200).json({ success: true, message: 'College overview updated', data: updated });
    }

    const newOverview = new CollegeOverview(req.body);
    await newOverview.save();

    res.status(201).json({ success: true, message: 'College overview created', data: newOverview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

