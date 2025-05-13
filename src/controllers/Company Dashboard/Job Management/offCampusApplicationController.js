/*import OffCampusApplication from '../../../models/companyModels/offCampusApplicationModel.js';
import Job from '../../../models/companyModels/jobModels.js'; // <-- Import Job model also

// Get All Off-Campus Applications (First Page) - From Job Model
export const getAllOffCampusApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ jobType: 'Off Campus' })
      .populate({
        path: 'applications', // Assuming you store applications inside job document
        populate: [
          { path: 'applicantId', select: 'name email phone' }
        ]
      })
      .select('title location jobType applications'); // Only selecting necessary fields

    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error fetching Off-Campus Applications:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Shortlist a candidate (Second Page) - From OffCampusApplication Model
export const shortlistOffCampusCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await OffCampusApplication.findByIdAndUpdate(
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

// Reject a candidate (Second Page) - From OffCampusApplication Model
export const rejectOffCampusCandidate = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await OffCampusApplication.findByIdAndUpdate(
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

// Get Single Application (Second Page) - From OffCampusApplication Model
export const getSingleOffCampusApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await OffCampusApplication.findById(applicationId)
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
