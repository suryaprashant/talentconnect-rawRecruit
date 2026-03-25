import { JobPostingTable } from "../models/jobPostingsModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import Application from "../models/applicationModel.js";
import Auth from "../models/authModel.js";

/*
 * WEIGHT DISTRIBUTION (total = 100%)
 * ─────────────────────────────────
 *  Job Roles    → 35%
 * add exp
 *  Skills       → 25%
 *  Degree       →  8%
 *  Stream       →  7%
 *  Academics    → 15%  (CGPA 7% + Batch Year 8%)
 *  Location     →  7%
 *  Salary       →  3%
 */

export const getRelevantOffCampusJobs = async (req, res) => {
  try {
    console.log("here");
    const userId = req.user?._id;
    let student = null;
    let appliedJobIds = [];

    // --- FETCH GLOBAL THRESHOLD FROM ADMIN ---
    const adminConfig = await Auth.findOne({ userType: "admin" }).lean();
    const visibilityThreshold = adminConfig?.jobVisibilityThreshold ?? 0;
    console.log(
      `\x1b[33m[THRESHOLD] Job visibility threshold: ${visibilityThreshold}%\x1b[0m`
    );

    if (userId) {
      student = await Onboarding.findOne({ userId }).lean();
      if (student) {
        appliedJobIds = await Application.find({
          applicant: student._id,
        }).distinct("job");
      }
    }

    const query = {
      jobType: "Off-campus",
      jobStatus: { $in: ["Open", "Pending"] },
    };

    if (userId && appliedJobIds.length > 0) {
      query._id = { $nin: appliedJobIds };
    }

    const jobs = await JobPostingTable.find(query)
      .populate("companyPosted")
      .lean();

    // ── GUEST (not logged in) ──────────────────────────────────────────
    if (!student) {
      const guestJobs = jobs
        .map((job) => ({
          ...job,
          matchScore: 0,
          companyName:
            job.companyPosted?.companyDetails?.companyName || "Company",
        }))
        .filter((job) => job.matchScore >= visibilityThreshold);

      return res.status(200).json({ data: guestJobs });
    }

    console.log(
      `\n\x1b[35m[RELEVANCY ENGINE] Scoring ${jobs.length} jobs for ${student.name}\x1b[0m`
    );

    const norm = (v) =>
      v ? String(v).toLowerCase().replace(/[\s.\-_]/g, "").trim() : "";

    const studentLocs = (student.locations || []).map(norm);

    // --- BROADCAST TYPE FILTERING ---
    const venueFilteredJobs = jobs.filter((job) => {
      if (job.broadcastType !== "Location") return true;
      const jVenue = norm(job.venue);
      return studentLocs.includes(jVenue);
    });

    const scoredJobs = venueFilteredJobs.map((job, index) => {
      let breakdown = {
        roles: 0,
        skills: 0,
        degree: 0,
        stream: 0,
        academics: 0,
        location: 0,
        salary: 0,
      };
      let logs = {
        roles: "",
        skills: "",
        degree: "",
        stream: "",
        academics: "",
        location: "",
        salary: "",
      };

      const fullJobText = (
        job.description +
        " " +
        (job.eligibilityCriteria || "")
      ).toLowerCase();

      const jobReqSkills = (job.skills || []).map(norm);

      // ── 1. JOB ROLES (35%) ────────────────────────────────────────────
      const sRoles = (student.jobRoles || []).map(norm);
      const jRoles = (job.jobRoles || []).map(norm);

      if (jRoles.length === 0) {
        breakdown.roles = 35;
        logs.roles = "Full Credit (No roles specified)";
      } else {
        const matchedRoles = sRoles.filter((role) => jRoles.includes(role));
        if (matchedRoles.length > 0) {
          const roleScore = Math.round(
            (matchedRoles.length / jRoles.length) * 35
          );
          breakdown.roles = Math.min(roleScore, 35);
          logs.roles = `Matched: [${matchedRoles.join(", ")}] -> ${breakdown.roles}/35`;
        } else {
          // soft match: check if any student role appears in job description
          const softMatch = sRoles.some((role) => fullJobText.includes(role));
          if (softMatch) {
            breakdown.roles = 12;
            logs.roles = "Soft match via description -> 12/35";
          } else {
            logs.roles = "No Role Match -> 0/35";
          }
        }
      }

      // ── 2. SKILLS (25%) ───────────────────────────────────────────────
      const studentSkills = (student.skills || []).map(norm);

      if (jobReqSkills.length === 0) {
        breakdown.skills = 25;
        logs.skills = "Full Credit (No skills listed in job)";
      } else {
        const matchedSkills = jobReqSkills.filter(
          (s) => studentSkills.includes(s) || fullJobText.includes(s)
        );
        breakdown.skills = Math.round(
          (matchedSkills.length / jobReqSkills.length) * 25
        );
        logs.skills = `Matched: [${matchedSkills.join(", ")}] -> ${breakdown.skills}/25`;
      }

      // ── 3. DEGREE (8%) ────────────────────────────────────────────────
      // job.degree is an array of accepted degrees e.g. ["B.Tech", "BE", "MCA"]
      // student.degree is a single string e.g. "B.Tech"
      const studentDegree = norm(student.degree);
      const jobDegrees = (job.degree || []).map(norm);

      if (jobDegrees.length === 0) {
        const degreeKeywords = [
          "btech", "be", "bsc", "mtech", "mca", "mba", "bca", "bcom", "ba", "bba",
        ];
        const anyDegreeInText = degreeKeywords.some((d) =>
          fullJobText.includes(d)
        );
        if (!anyDegreeInText) {
          breakdown.degree = 8;
          logs.degree = "Full Credit (No degree specified)";
        } else if (studentDegree && fullJobText.includes(studentDegree)) {
          breakdown.degree = 8;
          logs.degree = `Text Match: ${student.degree} -> 8/8`;
        } else {
          breakdown.degree = 3;
          logs.degree = "Partial Credit (Degree mentioned but no match) -> 3/8";
        }
      } else {
        if (studentDegree && jobDegrees.includes(studentDegree)) {
          breakdown.degree = 8;
          logs.degree = `Matched: ${student.degree} -> 8/8`;
        } else {
          const partialMatch = jobDegrees.some(
            (d) => d.includes(studentDegree) || studentDegree.includes(d)
          );
          if (partialMatch) {
            breakdown.degree = 4;
            logs.degree = `Partial Match -> 4/8`;
          } else {
            logs.degree = `No Degree Match -> 0/8`;
          }
        }
      }

      // ── 4. STREAM / SPECIALIZATION (7%) ───────────────────────────────
      // student.specialization vs job.studentStreams (array of accepted streams)
      const studentStream = norm(student.specialization);
      const jobStreams = (job.studentStreams || []).map(norm);

      // Related stream groups for partial credit
      const relatedGroups = [
        ["cs", "cse", "it", "computerscience", "informationtechnology", "computerapplication", "bca"],
        ["ece", "eee", "ee", "electronics", "electricalengineering", "electrical"],
        ["me", "mechanicalengineering", "mechanical"],
        ["ce", "civilengineering", "civil"],
        ["mba", "businessadministration", "management", "bba"],
        ["ds", "datascience", "ai", "artificialintelligence", "ml", "machinelearning"],
      ];

      if (jobStreams.length === 0) {
        if (studentStream && fullJobText.includes(studentStream)) {
          breakdown.stream = 7;
          logs.stream = `Text Match: ${student.specialization} -> 7/7`;
        } else {
          breakdown.stream = 7;
          logs.stream = "Full Credit (No stream specified)";
        }
      } else {
        if (studentStream && jobStreams.includes(studentStream)) {
          breakdown.stream = 7;
          logs.stream = `Matched: ${student.specialization} -> 7/7`;
        } else {
          const studentGroup = relatedGroups.find((g) =>
            g.includes(studentStream)
          );
          const partialMatch =
            studentGroup && jobStreams.some((s) => studentGroup.includes(s));
          if (partialMatch) {
            breakdown.stream = 4;
            logs.stream = `Related Stream Match -> 4/7`;
          } else {
            logs.stream = `No Stream Match -> 0/7`;
          }
        }
      }

      // ── 5. ACADEMICS — CGPA + BATCH YEAR (15%) ────────────────────────
      const sCGPA = parseFloat(student.cgpa) || 0;
      const sYear = norm(student.yearOfGraduation);
      let acadDetails = [];

      // CGPA (7%)
      const requiredCGPA = parseFloat(job.cgpa) || 0;
      if (requiredCGPA === 0) {
        const cgpaRegex =
          /(?:cgpa|cut-off|cutoff|minimum|min)\s*[:>=]*\s*([0-9]\.[0-9]|[0-9]{2})/i;
        const cgpaMatch = fullJobText.match(cgpaRegex);
        if (!cgpaMatch) {
          breakdown.academics += 7;
          acadDetails.push("CGPA: Full Credit (No min specified)");
        } else {
          const regexRequired = parseFloat(cgpaMatch[1]);
          if (sCGPA >= regexRequired) {
            breakdown.academics += 7;
            acadDetails.push(`CGPA: Match (Regex: ${sCGPA} >= ${regexRequired})`);
          } else {
            acadDetails.push(`CGPA: Fail (Regex: ${sCGPA} < ${regexRequired})`);
          }
        }
      } else {
        if (sCGPA >= requiredCGPA) {
          breakdown.academics += 7;
          acadDetails.push(`CGPA: Match (Schema: ${sCGPA} >= ${requiredCGPA})`);
        } else {
          acadDetails.push(`CGPA: Fail (Schema: ${sCGPA} < ${requiredCGPA})`);
        }
      }

      // Batch Year (8%)
      const yearRegex = /\b(202[0-9]|2030)\b/;
      const hasYearMention = yearRegex.test(fullJobText);
      if (!hasYearMention) {
        breakdown.academics += 8;
        acadDetails.push("Year: Full Credit (No batch specified)");
      } else if (sYear && fullJobText.includes(sYear)) {
        breakdown.academics += 8;
        acadDetails.push(`Year: Match (${sYear})`);
      } else {
        acadDetails.push("Year: Fail (Batch mismatch)");
      }

      logs.academics = acadDetails.join(" | ");

      // ── 6. LOCATION (7%) ──────────────────────────────────────────────
      const sLocs = (student.locations || []).map(norm);
      const jLocs = (job.workLocation || []).map(norm);

      if (jLocs.length === 0 && !job.city && !job.venue) {
        breakdown.location = 7;
        logs.location = "Full Credit (No location specified)";
      } else {
        const matchedLocs = sLocs.filter(
          (l) =>
            jLocs.includes(l) ||
            norm(job.city) === l ||
            norm(job.venue).includes(l)
        );
        if (matchedLocs.length > 0 || job.workMode?.includes("Remote")) {
          breakdown.location = 7;
          logs.location =
            matchedLocs.length > 0
              ? `Matched: [${matchedLocs.join(", ")}] -> 7/7`
              : "Remote Mode -> 7/7";
        } else {
          logs.location = "Location Mismatch -> 0/7";
        }
      }

      // ── 7. SALARY (3%) ────────────────────────────────────────────────
      const sExp = Number(student.expectedSalaryAmount) || 0;
      const jSal = Number(job.packageDetails?.totalCTC) || 0;

      if (sExp === 0 || jSal === 0) {
        breakdown.salary = 3;
        logs.salary = "Full Credit (No salary preference / hidden)";
      } else if (jSal >= sExp) {
        breakdown.salary = 3;
        logs.salary = `Matched (${jSal} >= ${sExp}) -> 3/3`;
      } else if (jSal >= sExp * 0.85) {
        breakdown.salary = 2;
        logs.salary = `Near Match 85%+ -> 2/3`;
      } else {
        breakdown.salary = 0;
        logs.salary = `Below Target (${jSal} < ${sExp}) -> 0/3`;
      }

      // ── TOTAL ─────────────────────────────────────────────────────────
      const totalScore =
        breakdown.roles +
        breakdown.skills +
        breakdown.degree +
        breakdown.stream +
        breakdown.academics +
        breakdown.location +
        breakdown.salary;

      console.log(
        `\x1b[36m--- Job #${index + 1}: ${job.companyPosted?.companyDetails?.companyName} ---\x1b[0m`
      );
      console.log(`  Roles:     ${logs.roles}`);
      console.log(`  Skills:    ${logs.skills}`);
      console.log(`  Degree:    ${logs.degree}`);
      console.log(`  Stream:    ${logs.stream}`);
      console.log(`  Academics: ${logs.academics} -> ${breakdown.academics}/15`);
      console.log(`  Location:  ${logs.location}`);
      console.log(`  Salary:    ${logs.salary}`);
      console.log(
        `  \x1b[1mFINAL SCORE: ${totalScore}% | THRESHOLD: ${visibilityThreshold}%\x1b[0m\n`
      );

      return {
        ...job,
        matchScore: Math.min(totalScore, 100),
        companyName:
         job.companyPosted?.companyDetails?.companyName || "Company",
      };
    });

    const finalData = scoredJobs
      .filter((j) => j.matchScore >= visibilityThreshold)
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log(
      `\x1b[33m[THRESHOLD] ${scoredJobs.length - finalData.length} jobs filtered out below ${visibilityThreshold}%\x1b[0m`
    );

    res.status(200).json({ data: finalData });
  } catch (error) {
    console.error("Relevancy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};