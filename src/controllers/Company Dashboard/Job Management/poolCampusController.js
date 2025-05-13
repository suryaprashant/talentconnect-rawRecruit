/*import PoolCampusApplication from '../../../models/companyModels/poolCampusModel.js';
import Job from '../../../models/companyModels/jobModels.js'; // <-- Import Job model also

// Get All Pool Campus Applications (First Page) - From Job Model
export const getAllPoolCampusApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ jobType: 'Pool Campus' })
      .populate({
        path: 'applications', // Assuming applications array exists inside Job
        populate: [
          { path: 'applicantId', select: 'name email phone' }
        ]
      })
      .select('title location jobType applications');

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching Pool Campus Applications:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Shortlist a candidate (Second Page) - From PoolCampusApplication Model
export const shortlistPoolCampusCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await PoolCampusApplication.findByIdAndUpdate(
      applicationId,
      { applicationStatus: 'Shortlisted' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, message: 'Candidate shortlisted successfully', application });
  } catch (error) {
    console.error('Error shortlisting candidate:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Reject a candidate (Second Page) - From PoolCampusApplication Model
export const rejectPoolCampusCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await PoolCampusApplication.findByIdAndUpdate(
      applicationId,
      { applicationStatus: 'Rejected' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, message: 'Candidate rejected successfully', application });
  } catch (error) {
    console.error('Error rejecting candidate:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get Single Application (Second Page) - From PoolCampusApplication Model
export const getSinglePoolCampusApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await PoolCampusApplication.findById(applicationId)
      .populate('jobId')
      .populate('applicantId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};*/
