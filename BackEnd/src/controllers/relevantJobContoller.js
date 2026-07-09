import { JobPostingTable } from "../models/jobPostingsModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import Application from "../models/applicationModel.js";
import Auth from "../models/authModel.js";
import RelevancyWeights from "../models/Relevancyweightsmodel.js";
import { paginatedResponse } from "../utils/paginate.js";
/*
 * WEIGHT DISTRIBUTION — loaded dynamically from RelevancyWeights collection
 * ─────────────────────────────────────────────────────────────────────────
 *  Skills        → 30%   (W.skills)
 *  Job Roles     → 18%   (W.jobRoles)
 *  Experience    → 15%   (W.experience)
 *  Academics     → 12%   (W.cgpa [5%] + W.batchYear [7%])
 *  Location      →  8%   (W.location)
 *  Degree        →  7%   (W.degree)
 *  Stream        →  5%   (W.stream)
 *  Salary        →  5%   (W.salary)
 *  ─────────────────
 *  Total           100%
 *
 * Weights are fetched fresh on each request from the DB so admin changes
 * take effect immediately without restarting the server.
 *
 * Threshold is fetched from the admin Auth document (jobVisibilityThreshold).
 * Broadcasting filter (broadcastType === "Location") is applied AFTER scoring
 * so that only location-matched AND threshold-passing jobs are returned.
 */

// ─── Helper: normalise strings for loose comparison ──────────────────────────
const norm = (v) =>
  v ? String(v).toLowerCase().replace(/[\s.\-_]/g, "").trim() : "";

// ─── Helper: calculate total years of experience from student.experiences ────
const calcExperienceYears = (experiences = []) => {
  let totalMonths = 0;
  for (const exp of experiences) {
    if (!exp.startDate) continue;
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    if (isNaN(start) || isNaN(end)) continue;
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months > 0) totalMonths += months;
  }
  return totalMonths / 12; // decimal years
};

// ─── Helper: parse "X years" / "X" from a string ─────────────────────────────
const parseYearsFromString = (str) => {
  if (!str) return 0;
  const match = String(str).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// ─── Fetch weights from DB with fallback to hardcoded defaults ───────────────
const fetchWeights = async () => {
  try {
    const config = await RelevancyWeights.findOne().lean();
    if (config) {
      return {
        skills:     config.skills     ?? 30,
        jobRoles:   config.jobRoles   ?? 18,
        experience: config.experience ?? 15,
        cgpa:       config.cgpa       ??  5,
        batchYear:  config.batchYear  ??  7,
        location:   config.location   ??  8,
        degree:     config.degree     ??  7,
        stream:     config.stream     ??  5,
        salary:     config.salary     ??  5,
        _source: "database",
      };
    }
  } catch (err) {
    console.error("\x1b[31m[WEIGHTS] DB fetch failed, using defaults:\x1b[0m", err.message);
  }
  // Hardcoded fallback defaults
  return {
    skills: 30, jobRoles: 18, experience: 15,
    cgpa: 5, batchYear: 7, location: 8,
    degree: 7, stream: 5, salary: 5,
    _source: "hardcoded-defaults",
  };
};

// ─── Fetch admin visibility threshold from Auth collection ───────────────────
const fetchThreshold = async () => {
  try {
    const adminDoc = await Auth.findOne({ userType: "admin" })
      .select("jobVisibilityThreshold email")
      .lean();

    if (adminDoc) {
      return {
        value: adminDoc.jobVisibilityThreshold ?? 0,
        adminEmail: adminDoc.email || "unknown",
        _source: "database",
      };
    }
  } catch (err) {
    console.error("\x1b[31m[THRESHOLD] DB fetch failed, defaulting to 0:\x1b[0m", err.message);
  }
  return { value: 0, adminEmail: "N/A", _source: "hardcoded-default" };
};

// ─── Pretty-print weights & threshold for verification ───────────────────────
const logConfig = (W, threshold) => {
  const total =
    W.skills + W.jobRoles + W.experience + W.cgpa +
    W.batchYear + W.location + W.degree + W.stream + W.salary;

  console.log("\n\x1b[33m╔══════════════════════════════════════════════╗\x1b[0m");
  console.log(  "\x1b[33m║        RELEVANCY ENGINE CONFIGURATION        ║\x1b[0m");
  console.log(  "\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m");
  console.log(`\x1b[33m║  Source (Weights)   : ${String(W._source).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m║  Source (Threshold) : ${String(threshold._source).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m║  Admin Email        : ${String(threshold.adminEmail).padEnd(22)}\x1b[0m║`);
  console.log(  "\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m");
  console.log(`\x1b[33m║  WEIGHTS                                     ║\x1b[0m`);
  console.log(`\x1b[33m║    Skills        : ${String(W.skills + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Job Roles     : ${String(W.jobRoles + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Experience    : ${String(W.experience + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    CGPA          : ${String(W.cgpa + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Batch Year    : ${String(W.batchYear + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Location      : ${String(W.location + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Degree        : ${String(W.degree + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Stream        : ${String(W.stream + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    Salary        : ${String(W.salary + "%").padEnd(26)}\x1b[0m║`);
  console.log(`\x1b[33m║    ─────────────────────────────────         ║\x1b[0m`);
  console.log(`\x1b[33m║    TOTAL         : ${String(total + "%").padEnd(26)}\x1b[0m${total !== 100 ? "\x1b[31m⚠ NOT 100!\x1b[0m" : "\x1b[32m✔\x1b[0m"}`);
  console.log(  "\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m");
  console.log(`\x1b[33m║  THRESHOLD       : ${String(threshold.value + "%").padEnd(26)}\x1b[0m║`);
  console.log(  "\x1b[33m╚══════════════════════════════════════════════╝\x1b[0m\n");
};

// ─────────────────────────────────────────────────────────────────────────────
export const getRelevantOffCampusJobs = async (req, res) => {
  try {
    const userId = req.user?._id;
    let student = null;
    let appliedJobIds = [];
    const { page, limit, skip } = req.pagination;
    // ── STEP 1: Fetch weights & threshold in parallel ─────────────────────
    const [W, thresholdConfig] = await Promise.all([
      fetchWeights(),
      fetchThreshold(),
    ]);
    const visibilityThreshold = thresholdConfig.value;
    // const academicsTotal = W.cgpa + W.batchYear;

    // Print verified config to console for admin/developer verification
    // logConfig(W, thresholdConfig);

    // ── STEP 2: Fetch student & applied jobs ──────────────────────────────
    if (userId) {
      student = await Onboarding.findOne({ userId }).lean();
      if (student) {
        appliedJobIds = await Application.find({
          applicant: student._id,
        }).distinct("job");
      }
    }

    // ── STEP 3: Base DB query (Off-campus, Open/Pending, not yet applied) ─
    const query = {
      jobType: "Off-campus",
      jobStatus: { $in: ["Open", "Pending"] },
      inactive: { $ne: true },
    };
    if (userId && appliedJobIds.length > 0) {
      query._id = { $nin: appliedJobIds };
    }

    const jobs = await JobPostingTable.find(query)
      .populate("companyPosted")
      .lean();

    // ── STEP 4: GUEST (not logged in) — return all, score 0 ──────────────
    if (!student) {
      // console.log("\x1b[35m[RELEVANCY] Guest user — skipping scoring\x1b[0m");
      const guestJobs = jobs
        .map((job) => ({
          ...job,
          matchScore: 0,
          companyName:
            job.companyPosted?.companyDetails?.companyName || "Company",
        }))
        // Guests see all jobs that pass the threshold (threshold=0 → all jobs)
        .filter((job) => job.matchScore >= visibilityThreshold);

      const total =
        guestJobs.length;

      const paginatedJobs =
        guestJobs.slice(
          skip,
          skip + limit
        );

      return res.status(200).json(
        paginatedResponse(
          paginatedJobs,
          total,
          { page, limit }
        )
      );
    }

    // console.log(
    //   `\x1b[35m[RELEVANCY ENGINE] Scoring ${jobs.length} jobs for student: ${student.name} (${student.email})\x1b[0m\n`
    // );

    // Pre-compute normalised student locations for broadcasting filter
    const studentNormLocs = (student.locations || []).map(norm);

    // Pre-compute student experience years
    const studentExpYears =
      parseYearsFromString(student.totalYearsOfExperience) ||
      calcExperienceYears(student.experiences || []);

    // ── STEP 5: SCORE every job (broadcast filter applied AFTER scoring) ──
    const scoredJobs = jobs.map((job) => {
      let breakdown = {
        skills: 0, roles: 0, experience: 0,
        cgpa: 0, batchYear: 0, location: 0,
        degree: 0, stream: 0, salary: 0,
      };
      // let logs = { ...breakdown };

      const fullJobText = (
        (job.description || "") + " " + (job.eligibilityCriteria || "")
      ).toLowerCase();

      const jobReqSkills = (job.skills || []).map(norm);
      const companyName =
        job.companyPosted?.companyDetails?.companyName || "Company";

      // ── 1. SKILLS (W.skills %) ───────────────────────────────────────
      const studentSkills = (student.skills || []).map(norm);

      if (jobReqSkills.length === 0) {
        breakdown.skills = W.skills;
        // logs.skills = `Full Credit (no skills listed) → ${W.skills}/${W.skills}`;
      } else {
        const matchedSkills = jobReqSkills.filter(
          (s) => studentSkills.includes(s) || fullJobText.includes(s)
        );
        breakdown.skills = Math.round(
          (matchedSkills.length / jobReqSkills.length) * W.skills
        );
        // logs.skills = `[${matchedSkills.join(", ") || "none"}] → ${breakdown.skills}/${W.skills}`;
      }

      // ── 2. JOB ROLES (W.jobRoles %) ─────────────────────────────────
      const sRoles = (student.jobRoles || []).map(norm);
      const jRoles = (job.jobRoles || job.jobTitle).map(norm);

      if (jRoles.length === 0) {
        breakdown.roles = W.jobRoles;
        // logs.roles = `Full Credit (no roles specified) → ${W.jobRoles}/${W.jobRoles}`;
      } else {
        const matchedRoles = sRoles.filter((r) => jRoles.includes(r));
        if (matchedRoles.length > 0) {
          breakdown.roles = Math.min(
            Math.round((matchedRoles.length / jRoles.length) * W.jobRoles),
            W.jobRoles
          );
          // logs.roles = `[${matchedRoles.join(", ")}] → ${breakdown.roles}/${W.jobRoles}`;
        } else {
          // Soft match: student role keyword found anywhere in job text
          const softMatch = sRoles.some((r) => fullJobText.includes(r));
          if (softMatch) {
            breakdown.roles = Math.round(W.jobRoles * 0.35);
            // logs.roles = `Soft match via description → ${breakdown.roles}/${W.jobRoles}`;
          } else {
            // logs.roles = `No match → 0/${W.jobRoles}`;
          }
        }
      }

      // ── 3. EXPERIENCE (W.experience %) ──────────────────────────────
      const jobExpRequired = parseYearsFromString(job.yearsOfExperience);
      const expRegex =
        /([0-9]+(?:\.[0-9]+)?)\s*(?:\+\s*)?years?\s*(?:of\s*)?(?:experience|exp)/i;

      const effectiveExpRequired =
        jobExpRequired > 0
          ? jobExpRequired
          : (() => {
              const m = fullJobText.match(expRegex);
              return m ? parseFloat(m[1]) : 0;
            })();

      if (effectiveExpRequired === 0) {
        breakdown.experience = W.experience;
        // logs.experience = `Full Credit (no exp requirement) → ${W.experience}/${W.experience}`;
      } else if (studentExpYears >= effectiveExpRequired) {
        breakdown.experience = W.experience;
        // logs.experience = `Match (${studentExpYears.toFixed(1)}y ≥ ${effectiveExpRequired}y) → ${W.experience}/${W.experience}`;
      } else if (studentExpYears >= effectiveExpRequired * 0.7) {
        breakdown.experience = Math.round(W.experience * 0.5);
        // logs.experience = `Near match 70%+ (${studentExpYears.toFixed(1)}y vs ${effectiveExpRequired}y) → ${breakdown.experience}/${W.experience}`;
      } else {
        // logs.experience = `Fail (${studentExpYears.toFixed(1)}y < ${effectiveExpRequired}y) → 0/${W.experience}`;
      }

      // ── 4. DEGREE (W.degree %) ──────────────────────────────────────
      const studentDegree = norm(student.degree);
      const jobDegrees = (job.degree || []).map(norm);
      const degreeKeywords = [
        "btech","be","bsc","mtech","mca","mba","bca","bcom","ba","bba",
      ];

      if (jobDegrees.length === 0) {
        const anyDegreeInText = degreeKeywords.some((d) =>
          fullJobText.includes(d)
        );
        if (!anyDegreeInText) {
          breakdown.degree = W.degree;
          // logs.degree = `Full Credit (no degree specified) → ${W.degree}/${W.degree}`;
        } else if (studentDegree && fullJobText.includes(studentDegree)) {
          breakdown.degree = W.degree;
          // logs.degree = `Text match (${student.degree}) → ${W.degree}/${W.degree}`;
        } else {
          breakdown.degree = Math.round(W.degree * 0.4);
          // logs.degree = `Partial Credit (degree mentioned, no match) → ${breakdown.degree}/${W.degree}`;
        }
      } else {
        if (studentDegree && jobDegrees.includes(studentDegree)) {
          breakdown.degree = W.degree;
          // logs.degree = `Match (${student.degree}) → ${W.degree}/${W.degree}`;
        } else {
          const partialMatch = jobDegrees.some(
            (d) => d.includes(studentDegree) || studentDegree.includes(d)
          );
          if (partialMatch) {
            breakdown.degree = Math.round(W.degree * 0.5);
            // logs.degree = `Partial match → ${breakdown.degree}/${W.degree}`;
          } else {
            // logs.degree = `No match → 0/${W.degree}`;
          }
        }
      }

      // ── 5. STREAM (W.stream %) ──────────────────────────────────────
      const studentStream = norm(student.specialization);
      const jobStreams = (job.studentStreams || []).map(norm);

      const relatedGroups = [
        ["cs","cse","it","computerscience","informationtechnology","computerapplication","bca"],
        ["ece","eee","ee","electronics","electricalengineering","electrical"],
        ["me","mechanicalengineering","mechanical"],
        ["ce","civilengineering","civil"],
        ["mba","businessadministration","management","bba"],
        ["ds","datascience","ai","artificialintelligence","ml","machinelearning"],
      ];

      if (jobStreams.length === 0) {
        breakdown.stream = W.stream;
        // logs.stream = `Full Credit (no stream specified) → ${W.stream}/${W.stream}`;
      } else if (studentStream && jobStreams.includes(studentStream)) {
        breakdown.stream = W.stream;
        // logs.stream = `Match (${student.specialization}) → ${W.stream}/${W.stream}`;
      } else {
        const studentGroup = relatedGroups.find((g) => g.includes(studentStream));
        const partialMatch =
          studentGroup && jobStreams.some((s) => studentGroup.includes(s));
        if (partialMatch) {
          breakdown.stream = Math.round(W.stream * 0.57);
          // logs.stream = `Related stream match → ${breakdown.stream}/${W.stream}`;
        } else {
          // logs.stream = `No match → 0/${W.stream}`;
        }
      }

      // ── 6. CGPA (W.cgpa %) ──────────────────────────────────────────
      const sCGPA = parseFloat(student.cgpa) || 0;
      const requiredCGPA = parseFloat(job.cgpa) || 0;
      const cgpaRegex =
        /(?:cgpa|cut-off|cutoff|minimum|min)\s*[:>=]*\s*([0-9]\.[0-9]|[0-9]{2})/i;

      const effectiveCGPA =
        requiredCGPA > 0
          ? requiredCGPA
          : (() => {
              const m = fullJobText.match(cgpaRegex);
              return m ? parseFloat(m[1]) : 0;
            })();

      if (effectiveCGPA === 0) {
        breakdown.cgpa = W.cgpa;
        // logs.cgpa = `Full Credit (no min CGPA) → ${W.cgpa}/${W.cgpa}`;
      } else if (sCGPA >= effectiveCGPA) {
        breakdown.cgpa = W.cgpa;
        // logs.cgpa = `Match (${sCGPA} ≥ ${effectiveCGPA}) → ${W.cgpa}/${W.cgpa}`;
      } else {
        // logs.cgpa = `Fail (${sCGPA} < ${effectiveCGPA}) → 0/${W.cgpa}`;
      }

      // ── 7. BATCH YEAR (W.batchYear %) ───────────────────────────────
      const sYear = norm(student.yearOfGraduation);
      const yearRegex = /\b(202[0-9]|2030)\b/;

      if (!yearRegex.test(fullJobText)) {
        breakdown.batchYear = W.batchYear;
        // logs.batchYear = `Full Credit (no batch year specified) → ${W.batchYear}/${W.batchYear}`;
      } else if (sYear && fullJobText.includes(sYear)) {
        breakdown.batchYear = W.batchYear;
        // logs.batchYear = `Match (${sYear}) → ${W.batchYear}/${W.batchYear}`;
      } else {
        // logs.batchYear = `Fail (batch mismatch) → 0/${W.batchYear}`;
      }

      // ── 8. LOCATION (W.location %) ──────────────────────────────────
      const sLocs = (student.locations || []).map(norm);
      const jLocs = (job.workLocation || []).map(norm);
      const isRemote = (job.workMode || []).some((m) =>
        norm(m).includes("remote")
      );

      if (jLocs.length === 0 && !job.city && !job.venue) {
        breakdown.location = W.location;
        // logs.location = `Full Credit (no location specified) → ${W.location}/${W.location}`;
      } else if (isRemote) {
        breakdown.location = W.location;
        // logs.location = `Remote role → ${W.location}/${W.location}`;
      } else {
        const matchedLocs = sLocs.filter(
          (l) =>
            jLocs.includes(l) ||
            norm(job.city) === l ||
            norm(job.venue).includes(l)
        );
        if (matchedLocs.length > 0) {
          breakdown.location = W.location;
          // logs.location = `Matched [${matchedLocs.join(", ")}] → ${W.location}/${W.location}`;
        } else {
          // logs.location = `Mismatch → 0/${W.location}`;
        }
      }

      // ── 9. SALARY (W.salary %) ──────────────────────────────────────
      const sExp = Number(student.expectedSalaryAmount) || 0;
      const jSal = Number(job.packageDetails?.totalCTC) || 0;

      if (sExp === 0 || jSal === 0) {
        breakdown.salary = W.salary;
        // logs.salary = `Full Credit (no salary preference/hidden) → ${W.salary}/${W.salary}`;
      } else if (jSal >= sExp) {
        breakdown.salary = W.salary;
        // logs.salary = `Match (${jSal} ≥ ${sExp}) → ${W.salary}/${W.salary}`;
      } else if (jSal >= sExp * 0.85) {
        breakdown.salary = Math.round(W.salary * 0.67);
        // logs.salary = `Near match 85%+ → ${breakdown.salary}/${W.salary}`;
      } else {
        // logs.salary = `Below target (${jSal} < ${sExp}) → 0/${W.salary}`;
      }

      // ── TOTAL SCORE ──────────────────────────────────────────────────
      const totalScore = Math.min(
        breakdown.skills +
          breakdown.roles +
          breakdown.experience +
          breakdown.cgpa +
          breakdown.batchYear +
          breakdown.location +
          breakdown.degree +
          breakdown.stream +
          breakdown.salary,
        100
      );

      // ── BROADCASTING FILTER FLAG ─────────────────────────────────────
      // broadcastType "Location" → job should only be visible to students
      // whose locations include the job's venue.
      // We flag it here (post-score) so the threshold is applied first,
      // then the broadcast filter removes location-mismatched jobs.
      let broadcastAllowed = true;
      // let broadcastLog = "Everyone → allowed";

      if (job.broadcastType === "Location") {
        const jobVenueNorm = norm(job.venue);
        const venueMatch =
          jobVenueNorm && studentNormLocs.includes(jobVenueNorm);
        const workLocMatch = jLocs.some((l) => studentNormLocs.includes(l));

        broadcastAllowed = venueMatch || workLocMatch;
        // broadcastLog = broadcastAllowed
        //   ? `Location broadcast → allowed (venue/workLocation matched)`
        //   : `Location broadcast → BLOCKED (student locs: [${studentNormLocs.join(", ")}], job venue: "${job.venue || ""}", workLoc: [${(job.workLocation || []).join(", ")}])`;
      }

      // ── PER-JOB CONSOLE LOG ──────────────────────────────────────────
      // console.log(`\x1b[36m┌─ Job #${index + 1}: ${companyName} | "${job.jobTitle || "N/A"}"\x1b[0m`);
      // console.log(`\x1b[36m│  Skills     : ${logs.skills}\x1b[0m`);
      // console.log(`\x1b[36m│  Roles      : ${logs.roles}\x1b[0m`);
      // console.log(`\x1b[36m│  Experience : ${logs.experience}\x1b[0m`);
      // console.log(`\x1b[36m│  CGPA       : ${logs.cgpa}\x1b[0m`);
      // console.log(`\x1b[36m│  Batch Year : ${logs.batchYear}\x1b[0m`);
      // console.log(`\x1b[36m│  Location   : ${logs.location}\x1b[0m`);
      // console.log(`\x1b[36m│  Degree     : ${logs.degree}\x1b[0m`);
      // console.log(`\x1b[36m│  Stream     : ${logs.stream}\x1b[0m`);
      // console.log(`\x1b[36m│  Salary     : ${logs.salary}\x1b[0m`);
      // console.log(`\x1b[36m│  Broadcast  : ${broadcastLog}\x1b[0m`);
      // console.log(
      //   `\x1b[36m└─ SCORE: \x1b[1m${totalScore}%\x1b[0m\x1b[36m | THRESHOLD: ${visibilityThreshold}% | ` +
      //     `${totalScore >= visibilityThreshold ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL (below threshold)\x1b[0m"}` +
      //     ` | Broadcast: ${broadcastAllowed ? "\x1b[32mALLOWED\x1b[0m" : "\x1b[31mBLOCKED\x1b[0m"}\n`
      // );

      return {
        ...job,
        matchScore: totalScore,
        companyName,
        _broadcastAllowed: broadcastAllowed, // internal flag, stripped before response
      };
    });


    // ── STEP 5.5: Enrich scored jobs with alumni count ────────────────────
const enrichedJobs = await Promise.all(
  scoredJobs.map(async (job) => {
    let alumniCount = 0;

    if (student?.college && job.companyName) {
      try {
        alumniCount = await Onboarding.countDocuments({
          college: student.college,
          userId: { $ne: userId },
          profileType: "professional",
          currentCompany: { $regex: new RegExp(`^${job.companyName}$`, "i") },
        });
      } catch (err) {
        console.error(`[ALUMNI] Failed to count for ${job.companyName}:`, err.message);
      }
    }

    return { ...job, alumniCount };
  })
);
    // ── STEP 6: Apply threshold AND broadcast filter ───────────────────────
    // const finalData = scoredJobs
    //   .filter((j) => j.matchScore >= visibilityThreshold) // threshold gate
    //   .filter((j) => j._broadcastAllowed)                 // broadcast gate
    //   .sort((a, b) => b.matchScore - a.matchScore)
    //   .map(({ _broadcastAllowed, ...job }) => job);       // strip internal flag

    // // ── Summary log ───────────────────────────────────────────────────────
    // const belowThreshold = scoredJobs.filter(
    //   (j) => j.matchScore < visibilityThreshold
    // ).length;
    // const broadcastBlocked = scoredJobs.filter(
    //   (j) => j.matchScore >= visibilityThreshold && !j._broadcastAllowed
    // ).length;
    
// ── STEP 6: Apply threshold AND broadcast filter ───────────────────────
const finalData = enrichedJobs                               // ← changed
  .filter((j) => j.matchScore >= visibilityThreshold)
  .filter((j) => j._broadcastAllowed)
  .sort((a, b) => b.matchScore - a.matchScore)
  .map(({ _broadcastAllowed, ...job }) => job);

// ── Summary log (update these two lines too) ──────────────────────────
// const belowThreshold = enrichedJobs.filter(              // ← changed
//   (j) => j.matchScore < visibilityThreshold
// ).length;
// const broadcastBlocked = enrichedJobs.filter(            // ← changed
//   (j) => j.matchScore >= visibilityThreshold && !j._broadcastAllowed
// ).length;

    // console.log("\x1b[33m╔══════════════════ FINAL SUMMARY ═════════════════╗\x1b[0m");
    // console.log(`\x1b[33m║  Total jobs fetched    : ${String(jobs.length).padEnd(24)}\x1b[0m║`);
    // console.log(`\x1b[33m║  Below threshold (<${String(visibilityThreshold + "%)").padEnd(4)}: ${String(belowThreshold).padEnd(24)}\x1b[0m║`);
    // console.log(`\x1b[33m║  Broadcast blocked     : ${String(broadcastBlocked).padEnd(24)}\x1b[0m║`);
    // console.log(`\x1b[33m║  Returned to client    : ${String(finalData.length).padEnd(24)}\x1b[0m║`);
    // console.log("\x1b[33m╚══════════════════════════════════════════════════╝\x1b[0m\n");

    const total =
      finalData.length;

    const paginatedJobs =
      finalData
        .slice(skip, skip + limit)
        .map((job) => {
          const {
            _scoreBreakdown,
            _gateMultiplier,
            _skillMatchPct,
            _profileType,
            _broadcastAllowed,
            jobRoles,
            ...cleanJob
          } = job;

          return {
            ...cleanJob,
            jobTitle: jobRoles, // or jobRoles?.[0] if you want only the first role
          };
        });

    return res.status(200).json(
      paginatedResponse(
        paginatedJobs,
        total,
        { page, limit }
      )
    );
  } catch (error) {
    console.error("\x1b[31m[RELEVANCY ERROR]\x1b[0m", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};