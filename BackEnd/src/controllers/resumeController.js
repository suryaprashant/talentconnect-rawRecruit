import {
  fetchAllResumeService,
  saveParsedResumeService,
} from "../services/resumeService.js";
import { calculateMatchScore } from "../utils/weightedResumeSearch.js";
import { parseResume } from "../services/resumeParserService.js";
import cloudinary from "../../config/cloudinary.js";
/*export const uploadResume = async (req, res) => {
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
};*/

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "rawrecruit/resumes",
        resource_type: "raw",
      }
    );

    const extractedData = await parseResume(req.file.buffer);

    res.status(200).json({
      resumeUrl: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      parsedData: extractedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume upload failed" });
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
      preferedResume = calculateMatchScore(
        response.data,
        query,
        location,
        experience,
        salary
      );
      return res.status(200).json(preferedResume);
    }

    // res.status(200).json(response.data);
    res.status(204).json({ msg: "No matching resume" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
