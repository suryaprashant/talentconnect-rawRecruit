import CollegeOverview from '../models/collegeOverview.js';

// Create or Update College Profile
export const createOrUpdateCollegeProfile = async (req, res) => {
  try {
    const { officialEmail } = req.body;

    let college = await CollegeOverview.findOne({ officialEmail });

    if (college) {
      // Update
      college.set(req.body);
      await college.save();
      return res.status(200).json({ success: true, message: 'College profile updated successfully', data: college });
    } else {
      // Create
      const newCollege = new CollegeOverview(req.body);
      await newCollege.save();
      return res.status(201).json({ success: true, message: 'College profile created successfully', data: newCollege });
    }
  } catch (error) {
    console.error('Error in College Profile:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
