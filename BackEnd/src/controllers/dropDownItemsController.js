import CollegeOnboarding from "src/models/collegeDashboard/collegeOnboardingModel.js"
import CompanyProfile from "src/models/companyDashboard/companyProfileModel.js";


// Get All companies names for dropdown
export const getAllCompanies = async (req, res) => {
  try {
    const companyNames = await CompanyProfile.distinct('companyDetails.companyName') ;

        const formattedCompanies = companyNames
            .filter(name => name) 
            .map(name => ({
                value: name,
                label: name
        }));
     

    res.status(200).json(formattedCompanies) ;
  } catch (error) {
    console.error("Error fetching company names:", error);
    res.status(500).json({ message: "Failed to fetch company names", error: error.message });
  }
};

//Get all colleges name for dropdown 
export const getAllColleges = async (req, res) => {
  try {
    
    const collegeNames = await CollegeOnboarding.distinct('collegeUniversityDetails.collegeName');

    const formattedColleges = collegeNames
      .filter(name => name) 
      .map(name => ({
        value: name,
        label: name
      }));
      console.log("College nmes",formattedColleges) ;
    res.status(200).json(formattedColleges);
  } catch (error) {
    console.error("Error fetching college names:", error);
    res.status(500).json({ message: "Failed to fetch college names", error: error.message });
  }
};