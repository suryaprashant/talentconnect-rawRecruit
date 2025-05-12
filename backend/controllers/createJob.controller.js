import {JobModel} from "../models/createJob.model.js";
const Job = JobModel;


// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
    try {
      const {
        employmentType,
        title,
        locations,
        numberOfOpenings,
        salary,
        currency ,
        description,
        fieldOfStudy,
        educationLevel,
        experience,
        certification,
        workAuthorization,
        postedBy, 
      } = req.body;
      if (
        !employmentType ||
        !title ||
        !locations ||
        !numberOfOpenings ||
        !salary ||
        !description ||
        !fieldOfStudy ||
        !educationLevel ||
        !experience
      ) {
        return res.status(400).json({
          success: false,
          message: 'All required job fields must be provided',
        });
      }
  
      const job = await Job.create({
        employmentType,
        title,
        locations,
        numberOfOpenings,
        salary,
        currency ,
        description,
        fieldOfStudy,
        educationLevel,
        experience,
        certification,
        workAuthorization,
        postedBy: req.body.postedBy, // for now taking from the frontend  // assuming you're using `protectRoute` middleware
      });
  
      res.status(201).json({
        success: true,
        data: job,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

//   Get all jobs (with filtering)
//   Public
export const getJobs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Job.find(JSON.parse(queryStr)).populate({
      path: 'postedBy',
      select: 'name company',
    });

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const jobs = await query;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get single job
//  GET /api/jobs/:id
//  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'postedBy',
      select: 'name company',
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//     Update job
//   Private
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Get jobs posted by logged in user
//  Private
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
