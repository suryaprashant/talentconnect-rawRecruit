import { JobPostingTable } from "../models/jobPostingsModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import Application from "../models/applicationModel.js";

export const getRelevantOffCampusJobs = async (req, res) => {
  try {
   
    // 1. Check if user is logged in
    const userId = req.user?._id; 
    let student = null;
    let appliedJobIds = [];

    //let appliedSet = new Set();

    // 2. Only fetch student-specific data if a user exists
    if (userId) {
      student = await Onboarding.findOne({ userId }).lean();
      if (student) {
        appliedJobIds = await Application
  .find({ applicant: student._id })
  .distinct("job");
        //appliedSet = new Set(appliedJobIds.map(id => id.toString()));
      }
    }
   
    const query = { 
      jobType: "Off-campus", 
      jobStatus: { $in: ["Open", "Pending"] } 
    };
    
    if (userId && appliedJobIds.length > 0) {
  query._id = { $nin: appliedJobIds };
}

    const jobs = await JobPostingTable.find(query).populate('companyPosted').lean();

    if (!student) {
      const guestJobs = jobs.map(job => ({
        ...job,
        matchScore: 0,
        companyName: job.companyPosted?.companyDetails?.companyName || "Company"
      }));
      return res.status(200).json({ data: guestJobs });
    }
    
    console.log(`\n\x1b[35m[RELEVANCY ENGINE] Scoring ${jobs.length} jobs for ${student.name}\x1b[0m`);

    const norm = (v) => v ? String(v).toLowerCase().replace(/[\s.-]/g, "").trim() : "";


    const studentLocs = (student.locations || []).map(norm);

    // --- BROADCAST TYPE FILTERING ---
    const venueFilteredJobs = jobs.filter(job => {
      // Rule 1: If broadcast is 'Everyone', allow it
      if (job.broadcastType !== "Location") return true;

      // Rule 2: If broadcast is 'Location', match strictly with Venue
      const jVenue = norm(job.venue);
      
      // Check if student's any location matches the job's venue
      const isVenueMatch = studentLocs.includes(jVenue);

      // Rule 3: Remote bypass (Optional - remove if you want 100% strictness even for remote)
      //if (job.workMode?.includes("Remote")) return true;

      return isVenueMatch;
    });

    const scoredJobs = venueFilteredJobs.map((job, index) => {
      let breakdown = { skills: 0, tools: 0, roles: 0, academics: 0, location: 0, salary: 0 };
      let logs = { skills: "", tools: "", academics: "", location: "", salary: "" };
      
      const fullJobText = (job.description + " " + (job.eligibilityCriteria || "")).toLowerCase();
      const jobReqSkills = (job.skills || []).map(norm);

      // --- 1. CORE SKILLS (20%) ---
      const studentSkills = (student.skills || []).map(norm);  
      if (jobReqSkills.length > 0) {
        let matchedSkills = jobReqSkills.filter(s => studentSkills.includes(s) || fullJobText.includes(s));
        breakdown.skills = Math.round((matchedSkills.length / jobReqSkills.length) * 20);
        logs.skills = `Matched: [${matchedSkills.join(", ")}]`;
      } else {
        breakdown.skills = 20; 
        logs.skills = "Full Credit (No skills listed in job)";
      }

      // --- 2. TOOLS & PLATFORMS (10%) ---
      const studentTools = (student.toolsAndPlatforms || []).map(norm);
      const jobTools = (job.toolsAndPlatforms || []).map(norm); // Structured field
      
      let matchedTools = studentTools.filter(t => 
        jobTools.includes(t) || fullJobText.includes(t)
      );

      if (matchedTools.length >= 2) breakdown.tools = 10;
      else if (matchedTools.length === 1) breakdown.tools = 5;
      logs.tools = `Matched Tools: [${matchedTools.join(", ") || "None"}]`;

      // --- 3. JOB ROLES (20%) ---
      const sRoles = (student.jobRoles || []).map(norm);
      const jRoles = (job.jobRoles || []).map(norm);
      if (jRoles.length === 0) {
        breakdown.roles = 20;
        logs.roles = "Full Credit (No roles specified)";
      } else {
        const matchedRoles = sRoles.filter(role => jRoles.includes(role));
        if (matchedRoles.length > 0) {
           breakdown.roles = 20;
           logs.roles = `Matched: [${matchedRoles.join(", ")}]`;
        } else { logs.roles = "No Role Match"; }
      }

      // --- 4. ACADEMICS (20%) ---
      const sCGPA = parseFloat(student.cgpa) || 0;
      const sYear = norm(student.yearOfGraduation);
      let acadDetails = [];

      // CGPA check
     const requiredCGPA = parseFloat(job.cgpa) || 0;
      
      if (requiredCGPA === 0) {
        // Fallback to existing Regex if the structured field is empty
        const cgpaRegex = /(?:cgpa|cut-off|minimum|min)\s*[:>=]*\s*([0-9]\.[0-9]|[0-9]{2})/i;
        const cgpaMatch = fullJobText.match(cgpaRegex);
        
        if (!cgpaMatch) {
          breakdown.academics += 10;
          acadDetails.push("CGPA: Full Credit (No min specified)");
        } else {
          const regexRequired = parseFloat(cgpaMatch[1]);
          if (sCGPA >= regexRequired) {
            breakdown.academics += 10;
            acadDetails.push(`CGPA: Match (Regex: ${sCGPA} >= ${regexRequired})`);
          } else { acadDetails.push(`CGPA: Fail (Regex: ${sCGPA} < ${regexRequired})`); }
        }
      } else {
        // Use the structured Double field
        if (sCGPA >= requiredCGPA) {
          breakdown.academics += 10;
          acadDetails.push(`CGPA: Match (Schema: ${sCGPA} >= ${requiredCGPA})`);
        } else {
          acadDetails.push(`CGPA: Fail (Schema: ${sCGPA} < ${requiredCGPA})`);
        }
      }
      // Year check
      const yearRegex = /\b(202[0-9]|2030)\b/;
      const hasYearMention = yearRegex.test(fullJobText);
      if (!hasYearMention) {
        breakdown.academics += 10;
        acadDetails.push("Year: Full Credit (No batch specified)");
      } else if (fullJobText.includes(sYear)) {
        breakdown.academics += 10;
        acadDetails.push(`Year: Match (${sYear})`);
      } else { acadDetails.push(`Year: Fail (Batch mismatch)`); }

      logs.academics = acadDetails.join(" | ");

      // --- 5. LOCATION (15%) ---
      const sLocs = (student.locations || []).map(norm);
      const jLocs = (job.workLocation || []).map(norm);
      if (jLocs.length === 0 && !job.city && !job.venue) {
        breakdown.location = 15;
        logs.location = "Full Credit (No location specified)";
      } else {
        const matchedLocs = sLocs.filter(l => 
          jLocs.includes(l) || norm(job.city) === l || norm(job.venue).includes(l)
        );
        if (matchedLocs.length > 0 || job.workMode?.includes("Remote")) {
          breakdown.location = 15;
          logs.location = matchedLocs.length > 0 ? `Matched: [${matchedLocs.join(", ")}]` : "Remote Mode";
        } else { logs.location = "Location Mismatch"; }
      }

      // --- 6. SALARY (15%) ---
      const sExp = Number(student.expectedSalaryAmount) || 0;
      const jSal = Number(job.packageDetails?.totalCTC) || 0;
      if (sExp === 0 || jSal >= sExp || jSal === 0) {
        breakdown.salary = 15;
        logs.salary = jSal === 0 ? "Full Credit (Salary hidden)" : "Matched/No preference";
      } else if (jSal >= sExp * 0.85) {
        breakdown.salary = 7;
        logs.salary = "Near Match (85%+)";
      } else { logs.salary = `Below Target (${jSal} < ${sExp})`; }

      const totalScore = breakdown.skills + breakdown.tools + breakdown.roles + breakdown.academics + breakdown.location + breakdown.salary;

      // --- DIAGNOSTIC LOGS ---
      console.log(`\x1b[36m--- Job #${index + 1}: ${job.companyPosted?.companyDetails?.companyName} ---\x1b[0m`);
      console.log(` Skills: ${logs.skills} -> ${breakdown.skills}/20`);
      console.log(` Tools: ${logs.tools} -> ${breakdown.tools}/10`);
      console.log(`  Academics: ${logs.academics} -> ${breakdown.academics}/20`);
      console.log(`   Location: ${logs.location} -> ${breakdown.location}/15`);
      console.log(`   Salary: ${logs.salary} -> ${breakdown.salary}/15`);
      console.log(`   \x1b[1m FINAL SCORE: ${totalScore}%\x1b[0m\n`);

      return {
        ...job,
        matchScore: Math.min(totalScore, 100),
        companyName: job.companyPosted?.companyDetails?.companyName || "Company"
      };
    });

    const finalData = scoredJobs
      .filter(j => j.matchScore >= 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ data: finalData });
  } catch (error) {
    console.error("Relevancy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};