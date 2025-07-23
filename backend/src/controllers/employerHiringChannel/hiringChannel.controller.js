import Auth from '../../models/auth.js'
import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js'
import Registration from '../../models/HiringChannels_oncampusregister.js'
import PoolCampusHiring from '../../models/HiringChannelPoolCampusModel.js';
import HiringDrive from '../../models/HiringChannelOffCampusRegister.js';



export const createJobPosting = async (req, res) => {
  try {
    // 1. Get the logged-in user's ID from your auth middleware
    
    const loggedInUserId = req.user.id; 
    if (!loggedInUserId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Fetch the user's full auth document to check for activeCompanyId
    const user = await Auth.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
   
    let companyToPostAsId;

    // 2. CORE LOGIC: Determine which company profile to use
    if (user.activeCompanyId) {
      // SCENARIO A: User has switched profiles. Use the active company ID.
      console.log(`User ${user.email} is posting on behalf of switched company: ${user.activeCompanyId}`);
      companyToPostAsId = user.activeCompanyId;
    
      // Optional: Verify that the company profile still exists
      const activeCompanyExists = await CompanyProfile.findById(companyToPostAsId);
      if (!activeCompanyExists) {
          return res.status(404).json({ message: 'The selected company profile no longer exists.' });
         
      }

    } else {
     
      console.log(`User ${user.email} is posting for their own company.`);
      const ownProfile = await CompanyProfile.findOne({ userId: loggedInUserId });
      
      if (!ownProfile) {
        return res.status(400).json({ message: 'You must create a company profile before you can post a job.' });
      }
      companyToPostAsId = ownProfile._id;
    }

    
    const newRegistration = new Registration({
      ...req.body, 
      companyPosted: companyToPostAsId, 
    });

  
    await newRegistration.save();

    res.status(201).json({
      message: 'Job posting created successfully!',
      data: newRegistration,
    });

  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({ message: 'Server error while creating job posting.' });
  }
};



export const createPoolCampusHiring = async (req, res) => {
    try {
        console.log("hero 1")
        // 1. Get the logged-in user's ID from auth middleware (e.g., req.user.id)
        const loggedInUserId = req.user.id;
        if (!loggedInUserId) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        // 2. Fetch the user's auth document to check for activeCompanyId
        const user = await Auth.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let companyIdToUse;

        // 3. CORE LOGIC: Determine which company profile to use for the post
        if (user.activeCompanyId) {
            // SCENARIO A: User has switched profiles. Use the active company ID.
            const activeCompanyExists = await CompanyProfile.findById(user.activeCompanyId);
            if (!activeCompanyExists) {
                return res.status(404).json({ success: false, message: 'The selected active company profile no longer exists.' });
            }
            companyIdToUse = user.activeCompanyId;

        } else {
            // SCENARIO B: User is posting for their own default company.
            const ownProfile = await CompanyProfile.findOne({ userId: loggedInUserId });
            if (!ownProfile) {
                return res.status(400).json({ success: false, message: 'You must create a company profile before you can post a hiring event.' });
            }
            companyIdToUse = ownProfile._id;
        }
        
        // 4. Create the new hiring event with the determined companyId
        const newHiring = new PoolCampusHiring({
            ...req.body,
            companyId: companyIdToUse, // Set the correct company ID
        });

        await newHiring.save();

        res.status(201).json({
            success: true,
            message: 'Pool campus hiring event created successfully!',
            data: newHiring,
        });

    } catch (error) {
        console.error('Error creating pool campus hiring event:', error);
        res.status(500).json({ success: false, message: 'Server error while creating the event.', error: error.message });
    }
};


export const createOffCampusHiring = async (req, res) => {
    try {
        // 1. Get the logged-in user's ID from the auth middleware (e.g., req.user.id)
        const loggedInUserId = req.user.id;
        if (!loggedInUserId) {
            return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
        }

        // 2. Fetch the user's auth document to check for an activeCompanyId
        const user = await Auth.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let companyIdToUse;

        
        if (user.activeCompanyId) {
         
            const activeCompanyExists = await CompanyProfile.findById(user.activeCompanyId);
            if (!activeCompanyExists) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'The selected active company profile no longer exists. Please switch to another profile.' 
                });
            }
            companyIdToUse = user.activeCompanyId;

        } else {
            // SCENARIO B: User is posting for their own default company.
            // We need to find their own company profile.
            const ownProfile = await CompanyProfile.findOne({ userId: loggedInUserId });
            if (!ownProfile) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'You must create a company profile before you can post a hiring drive.' 
                });
            }
            companyIdToUse = ownProfile._id;
        }
        
        // 4. Create the new off-campus hiring drive with the determined companyId
        const newHiringDrive = new HiringDrive({
            ...req.body, // Spread all the form data from the request body
            companyId: companyIdToUse, // Set the correct company ID based on the logic above
        });

        // 5. Save the new document to the database
        await newHiringDrive.save();

        // 6. Send a success response
        res.status(201).json({
            success: true,
            message: 'Off-campus hiring drive created successfully!',
            data: newHiringDrive,
        });

    } catch (error) {
        console.error('Error creating off-campus hiring drive:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An internal server error occurred while creating the hiring drive.', 
            error: error.message 
        });
    }
};
