import { JobPostingTable } from "../models/jobPostingsModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import { calculateDeepMatchScore } from "../services/matchingService.js";
import { getJobPostingsByJobTypeService } from "../services/jobPostingService.js";

export const getRelevantOffCampusJobs = async (req, res) => {
  try {
    const userId=req.user._id
    const student = await Onboarding.findOne({ userId });
    if(!student) console.log('not found student')
    if (!student) return res.status(404).json({ message: "Profile missing" });

    // Fetch Off-campus jobs
    const jobs =  await getJobPostingsByJobTypeService("Off-campus", userId, student);

    console.log('all the jobs',jobs)

    const scoredJobs = jobs.map(job => {
      const { total, details } = calculateDeepMatchScore(student, job);
      
      // LOG TO BACKEND CONSOLE
      console.log(`
      Job Title: ${job.jobTitle}
      - Parsed Min CGPA: ${details.parsedReqs.minCgpa} (Student: ${details.studentCgpa})
      - Parsed Min Exp: ${details.parsedReqs.minExp} (Student: ${details.studentExp})
      - Final Score: ${total}%
      -----------------------------------------`);

      return { ...job._doc, matchScore: total,id: job._id };
    });
  

    // Send only those with > 60%
    const filtered = scoredJobs
      .filter(j => j.matchScore > 10)
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log(`\x1b[32m%s\x1b[0m`, `Sent ${filtered.length} relevant jobs to frontend.\n`);

    res.status(200).json({ data: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Matching Failed" });
  }
};