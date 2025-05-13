// src/controllers/companyDashboard/jobManagement/manageOnCampusController.js
/*
import Job from "../../../models/CompanyModels/jobModels.js";
import OnCampusDrive from "../../../models/CompanyModels/onCampusDriveModel.js";

// ------------------- Job Postings (First Page) -------------------

export const createJob = async (req, res) => {
  try {
    const createdBy = req.user?.id || "mockUserId"; // Replace or inject auth later
    const { title, employmentType, location, status, deadline } = req.body;

    const newJob = await Job.create({
      title,
      employmentType,
      location,
      status,
      deadline,
      createdBy,
    });

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const query = { createdBy: req.user?.id || "mockUserId" };

    if (search) query.title = { $regex: search, $options: "i" };
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({ success: true, jobs, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const deletedJob = await Job.findByIdAndDelete(jobId);
    if (!deletedJob) return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const newJob = await Job.create({
      title: job.title,
      employmentType: job.employmentType,
      location: job.location,
      status: "Draft",
      deadline: job.deadline,
      createdBy: job.createdBy,
    });

    res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------- On-Campus Drive (Second Page) -------------------

export const createOnCampusDrive = async (req, res) => {
  try {
    const createdBy = req.user?.id || "mockUserId"; // Replace later
    const newDrive = await OnCampusDrive.create({ ...req.body, createdBy });

    res.status(201).json({ success: true, drive: newDrive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOnCampusDrives = async (req, res) => {
  try {
    const { status, search = "" } = req.query;
    const query = { createdBy: req.user?.id || "mockUserId" };

    if (status) query.status = status;
    if (search) query.collegeName = { $regex: search, $options: "i" };

    const drives = await OnCampusDrive.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, drives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOnCampusDriveById = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = await OnCampusDrive.findById(id);

    if (!drive) return res.status(404).json({ success: false, message: "Drive not found" });

    res.status(200).json({ success: true, drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["Accepted", "Rejected", "Shortlisted"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedDrive = await OnCampusDrive.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedDrive) {
      return res.status(404).json({ success: false, message: "Drive not found" });
    }

    res.status(200).json({ success: true, drive: updatedDrive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/