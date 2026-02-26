import candidateMasterData from "../models/candidateMasterData.js";
import {
  getAllOnboardingFormsService,
  getOnboardingFormService,
  updateOnboardingFormService,
  submitOnboardingFormService,
  handleOnboardingUpdate
} from "../services/studentService.js";



export const getAllOnboardingForms = async (req, res) => {
  try {
    const result = await getAllOnboardingFormsService();
    res.status(200).json({
      message: "Successfully fetched all onboarding forms.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching all onboarding forms:", error);
    res.status(500).json({
      message: "Internal server error while fetching forms.",
      error: error.message,
    });
  }
};



export const submitOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated." });
    }
    const result = await submitOnboardingFormService(req.user._id, req.body, req.files);
    if (!result.updatedUser) {
      return res.status(404).json({ error: "User not found after update." });
    }
    res.status(201).json({
      message: "Form submitted successfully!",
      userType: req.user.userType,
      user: result.updatedUser,
      onboarding: result.updatedOnboarding
    });
  } catch (error) {
    console.error("Form submission error (backend):", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "A profile for this user already exists." });
    }
    res.status(500).json({ error: "Form submission failed.", details: error.message });
  }
};



export const getOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated." });
    }
    const entry = await getOnboardingFormService(req.user._id);
    if (!entry) {
      return res.status(404).json({ error: "Onboarding entry not found for this user." });
    }
    res.json(entry);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data.", details: error.message });
  }
};


export const updateOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated." });
    }
    const updated = await updateOnboardingFormService(req.user._id, req.body, req.files);
    if (!updated) return res.status(404).json({ error: "Entry not found." });
    res.json({ message: "Form updated successfully.", data: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Update failed.", details: error.message });
  }
};

export const getMasterData = async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ msg: "Type is required" });
  }

  try {
    const data = await candidateMasterData.find({
      type,
      isActive: true
    }).sort({ value: 1 });

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Get Master Data Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const createMasterData = async (req, res) => {
  const { type, value, parent } = req.body;
  const userId = req.user._id;

  if (!type || !value) {
    return res.status(400).json({ msg: "Type and value are required" });
  }

  if (type === "STREAM" && !parent) {
    return res.status(400).json({
      msg: "Parent degree is required for stream"
    });
  }

  try {
    const existing = await candidateMasterData.findOne({
      type,
      value: { $regex: `^${value}$`, $options: "i" },
      parent: parent || null
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing
      });
    }

    const newEntry = await candidateMasterData.create({
      type,
      value,
      parent: parent || null,
      isCustom: true,
      createdBy: userId
    });

    res.status(201).json({
      success: true,
      data: newEntry
    });
  } catch (error) {
    console.error("Create Master Data Error:", error);

    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        msg: "Value already exists"
      });
    }

    res.status(500).json({ msg: "Internal server error" });
  }
};