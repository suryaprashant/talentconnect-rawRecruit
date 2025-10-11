import { fetchAllResumeService, saveParsedResumeService } from "src/services/resumeService.js";
import { calculateMatchScore } from "src/utils/weightedResumeSearch.js";
import { parseResume } from 'src/services/resumeParserService.js';
export const uploadResume = async (req, res) => {
  try {
    // --- All Pre-checks are here in the controller ---
    console.log("Resume upload request received by controller.");
    if (!req.file) {
      return res.status(400).json({ message: "No resume file was uploaded." });
    }

    // Call the service to do the hard work
    const extractedData = await parseResume(req.file.buffer);
    
    // Send the successful response
    res.status(200).json(extractedData);

  } catch (error) {
    console.error("Error in uploadResume controller:", error.message);
    res.status(500).json({ message: "Server error during resume parsing." });
  }
};

export async function resumeSearch(req, res) {
    // reqbody jobdesc. 
    // if(!req.body) return res.status(404).json({msg:"No job description"});
    const { query, location, experience, salary } = req.query;
    try {
        // resume
        const response = await fetchAllResumeService(experience);
        // console.log(response);
        // perform weighted search 
        let preferedResume;
        if (response.success) {
            preferedResume = calculateMatchScore(response.data, query, location, experience, salary);
            return res.status(200).json(preferedResume);
        }

        // res.status(200).json(response.data);
        res.status(204).json({ msg: "No matching resume" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
}