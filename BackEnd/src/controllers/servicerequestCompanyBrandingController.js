import serviceRequestModel from "src/models/servicerequestCompanyBrandingModel.js";

export const createServiceRequest = async (req, res) => {
  try {
    console.log("🔥 Incoming request payload:", req.body);

    const { user, Date, time, message } = req.body;

    // Validation log
    if (!user || !Date || !time || !message) {
      console.warn("⚠️ Missing fields in request");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newServiceRequest = new serviceRequestModel({
      user,
      Date,
      time,
      message,
    });

    await newServiceRequest.save();

    console.log("✅ Service request saved:", newServiceRequest);

    return res.status(201).json({
      message: "Service request created successfully",
      newServiceRequest,
    });
  } catch (error) {
    console.error("❌ Error while saving service request:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
