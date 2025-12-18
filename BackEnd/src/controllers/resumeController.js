// src/controllers/resumeController.js
import { fetchAllResumeService } from "../services/resumeService.js";
import { calculateMatchScore } from "../utils/weightedResumeSearch.js";
import { parseResume } from "../services/resumeParserService.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No resume file was uploaded." });
    }

    const extractedData = await parseResume(req.file.buffer);
    return res.status(200).json(extractedData);
  } catch (error) {
    console.error("Error in uploadResume controller:", error);
    return res.status(500).json({
      message: "Server error during resume parsing.",
      error: error?.message || "Unknown error",
    });
  }
};

export async function resumeSearch(req, res) {
  const { query, location, experience, salary } = req.query;

  try {
    const response = await fetchAllResumeService(experience);

    if (response?.success) {
      const preferred = calculateMatchScore(response.data, query, location, experience, salary);
      return res.status(200).json(preferred);
    }

    return res.status(204).json({ msg: "No matching resume" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
