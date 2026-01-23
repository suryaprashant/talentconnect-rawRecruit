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