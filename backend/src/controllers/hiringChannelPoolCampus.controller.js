import PoolCampusHiring from '../models/HiringChannelPoolCampusModel.js'
import CompanyProfile from '../models/companyDashboard/companyProfileModel.js'

export const poolCampusRegister = async (req, res) => {
  try {
    const userId = req.user._id ; 
     
    const companyProfile = await CompanyProfile.findOne({ userId });

    if (!companyProfile) {
      return res.status(404).json({ error: "Company profile not found" });
    }
    const poolCampusHiring = new PoolCampusHiring({
        ...req.body,
      companyId: companyProfile._id,  
    });
    await poolCampusHiring.save();
    res.status(201).json({
      success: true,
    //  message: "Pool campus hiring request submitted successfully",
      data: poolCampusHiring,
    });
  } catch (err) {
  //  message: "Error creating pool campus hiring request",
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export const getAllRegistrations = async(req, res) => {
  try {
    const response = await PoolCampusHiring.find()
      .populate({
        path: 'companyId',
        select: 'companyDetails profileImage', // Add fields you need
      })
      .lean();
    res.status(200).json({ success: true, data: response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

}

export const getJobById = async (req, res) =>{
  const { id } = req.params;
  try {
    const response = await PoolCampusHiring.findById(id)
      .populate({ 
      path: 'companyId',
      select: 'companyDetails profileImage hiringPreferences',
      })
      .lean();
    res.status(200).json(response);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }  
}