import { JobModel } from "../models/createJob.model.js";
import { InternshipModel } from "../models/createIntership.model.js";
const Job = InternshipModel;

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private
export const createInternship = async (req, res) => {
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
      duration
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
      currency,
      description,
      fieldOfStudy,
      educationLevel,
      experience,
      certification,
      workAuthorization,
      postedBy: req.body.postedBy, // for now give from body later change it 
      duration
       // assuming you're using `protectRoute` middleware
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get all internships (with filtering)
//  Public
export const getInternships = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Add type filter to only get internships
    queryObj.postType = "Internship";

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

    const internships = await query;
    const total = await Job.countDocuments({...JSON.parse(queryStr), postType: "Internship"});

    res.status(200).json({
      success: true,
      count: internships.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Get single internship

//   Public
export const getInternship = async (req, res) => {
  try {
    const internship = await Job.findOne({
      _id: req.params.id,
      postType: "Internship"
    }).populate({
      path: 'postedBy',
      select: 'name company',
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update internship
//  PUT /api/internships/:id
//  Private
export const updateInternship = async (req, res) => {
  try {
    let internship = await Job.findOne({
      _id: req.params.id,
      postType: "Internship"
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this internship' });
    }

    internship = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//   Delete internship

//   Private
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Job.findOne({
      _id: req.params.id,
      postType: "Internship"
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (internship.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this internship' });
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get internships posted by logged in user
//  Private
export const getMyInternships = async (req, res) => {
  try {
    const internships = await Job.find({ 
      postedBy: req.user.id,
      postType: "Internship" 
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};