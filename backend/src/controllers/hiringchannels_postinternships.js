import Intern from "../models/HiringChannels_postinternships.js";
export const createJob = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Add this for debugging

    const jobData = req.body;

    // Validate required fields
    if (
      !jobData.jobTitle ||
      !jobData.employmentType ||
      !jobData.jobDescription
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newJob = new Intern(jobData);
    const savedJob = await newJob.save();

    console.log("Job saved successfully:", savedJob); // Add this for debugging

    res.status(201).json({ success: true, job: savedJob });
  } catch (error) {
    console.error("Error creating job:", error); // Add this for debugging

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};
export const getJobs = async (req, res) => {
  try {
    const jobs = await Intern.find();
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Intern.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Intern.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
