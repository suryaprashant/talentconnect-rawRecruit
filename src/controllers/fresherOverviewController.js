// src/controllers/fresherOverviewController.js

import FresherOverview from '../models/fresherOverviewModel.js';

// POST: Add fresher overview
export const addFresherOverview = async (req, res) => {
  try {
    const existing = await FresherOverview.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Overview already exists' });
    }

    const newOverview = new FresherOverview(req.body);
    await newOverview.save();
    res.status(201).json({
      success: true,
      message: 'Fresher overview created successfully',
      data: newOverview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating overview', error });
  }
};

// GET: Get fresher overview by email
export const getFresherOverviewByEmail = async (req, res) => {
  try {
    const overview = await FresherOverview.findOne({ email: req.params.email });
    if (!overview) {
      return res.status(404).json({ success: false, message: 'Overview not found' });
    }
    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching overview', error });
  }
};

// PUT: Update fresher overview by email
export const updateFresherOverview = async (req, res) => {
  try {
    const updated = await FresherOverview.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Overview not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Fresher overview updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating overview', error });
  }
};
