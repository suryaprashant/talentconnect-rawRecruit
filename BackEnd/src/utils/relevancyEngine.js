import RelevancyWeights from "../models/Relevancyweightsmodel.js";
import Auth from "../models/authModel.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const norm = (v) =>
  v ? String(v).toLowerCase().replace(/[\s.\-_]/g, "").trim() : "";

export const calcExperienceYears = (experiences = []) => {
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
  return totalMonths / 12;
};

export const parseYearsFromString = (str) => {
  if (!str) return 0;
  const match = String(str).match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// ─── Fetch weights from DB ────────────────────────────────────────────────────
export const fetchWeights = async () => {
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
    console.error("[WEIGHTS] DB fetch failed, using defaults:", err.message);
  }
  return {
    skills: 30, jobRoles: 18, experience: 15,
    cgpa: 5, batchYear: 7, location: 8,
    degree: 7, stream: 5, salary: 5,
    _source: "hardcoded-defaults",
  };
};

// ─── Fetch admin threshold ────────────────────────────────────────────────────
export const fetchThreshold = async () => {
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
    console.error("[THRESHOLD] DB fetch failed, defaulting to 0:", err.message);
  }
  return { value: 0, adminEmail: "N/A", _source: "hardcoded-default" };
};

// ─── Pretty-print config ──────────────────────────────────────────────────────
export const logConfig = (W, threshold, label = "RELEVANCY ENGINE") => {
  const total =
    W.skills + W.jobRoles + W.experience + W.cgpa +
    W.batchYear + W.location + W.degree + W.stream + W.salary;

  console.log(`\n\x1b[33m╔══════════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[33m║     ${label.padEnd(41)}\x1b[0m║`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  Source (Weights)   : ${String(W._source).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m║  Admin Email        : ${String(threshold.adminEmail).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  Skills      : ${String(W.skills + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Job Roles   : ${String(W.jobRoles + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Experience  : ${String(W.experience + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  CGPA        : ${String(W.cgpa + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Batch Year  : ${String(W.batchYear + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Location    : ${String(W.location + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Degree      : ${String(W.degree + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Stream      : ${String(W.stream + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Salary      : ${String(W.salary + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  TOTAL       : ${String(total + "%").padEnd(29)}\x1b[0m${total !== 100 ? "\x1b[31m⚠ NOT 100!\x1b[0m" : "\x1b[32m✔\x1b[0m"}`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  THRESHOLD   : ${String(threshold.value + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m╚══════════════════════════════════════════════╝\x1b[0m\n`);
};

// ─── Core scoring function (shared by off-campus & referral) ─────────────────
export const scoreJob = (job, student, W, index, label = "Job") => {
  const breakdown = {
    skills: 0, roles: 0, experience: 0,
    cgpa: 0, batchYear: 0, location: 0,
    degree: 0, stream: 0, salary: 0,
  };
  const logs = {};

  const fullJobText = (
    (job.description || "") + " " + (job.eligibilityCriteria || "")
  ).toLowerCase();

  const jobReqSkills  = (job.skills || []).map(norm);
  const studentNormLocs = (student.locations || []).map(norm);
  const studentExpYears =
    parseYearsFromString(student.totalYearsOfExperience) ||
    calcExperienceYears(student.experiences || []);

  // Referral: poster is candidatePosted (Onboarding doc)
  // Off-campus: poster is companyPosted (CompanyProfile doc)
  const posterName =
    job.candidatePosted?.name ||
    job.companyPosted?.companyDetails?.companyName ||
    "Unknown";

  // ── 1. SKILLS ───────────────────────────────────────────────────────────────
  const studentSkills = (student.skills || []).map(norm);
  if (jobReqSkills.length === 0) {
    breakdown.skills = W.skills;
    logs.skills = `Full Credit (no skills listed) → ${W.skills}/${W.skills}`;
  } else {
    const matched = jobReqSkills.filter(
      (s) => studentSkills.includes(s) || fullJobText.includes(s)
    );
    breakdown.skills = Math.round((matched.length / jobReqSkills.length) * W.skills);
    logs.skills = `[${matched.join(", ") || "none"}] → ${breakdown.skills}/${W.skills}`;
  }

  // ── 2. JOB ROLES ────────────────────────────────────────────────────────────
 // ── 2. JOB ROLES ────────────────────────────────────────────────────────────
const sRoles = (student.jobRoles || []).map(norm);
const jRoles = (job.jobRoles || []).map(norm);              // array field
const jTitleNorm = norm(job.jobTitle || "");                // string field

// Combine: treat jobTitle as an additional role to match against
const allJobRoles = jTitleNorm
  ? [...new Set([...jRoles, jTitleNorm])]
  : jRoles;

if (allJobRoles.length === 0) {
  breakdown.roles = W.jobRoles;
  logs.roles = `Full Credit (no roles specified) → ${W.jobRoles}/${W.jobRoles}`;
} else {
  // Exact match
  const matchedRoles = sRoles.filter((r) => allJobRoles.includes(r));

  if (matchedRoles.length > 0) {
    breakdown.roles = Math.min(
      Math.round((matchedRoles.length / allJobRoles.length) * W.jobRoles),
      W.jobRoles
    );
    logs.roles = `Exact [${matchedRoles.join(", ")}] → ${breakdown.roles}/${W.jobRoles}`;
  } else {
    // Soft match: student role keyword found in job title or description
    const softMatch = sRoles.some(
      (r) => jTitleNorm.includes(r) || fullJobText.includes(r)
    );
    if (softMatch) {
      breakdown.roles = Math.round(W.jobRoles * 0.35);
      logs.roles = `Soft match (title/description) → ${breakdown.roles}/${W.jobRoles}`;
    } else {
      logs.roles = `No match → 0/${W.jobRoles}`;
    }
  }
}

  // ── 3. EXPERIENCE ───────────────────────────────────────────────────────────
  const jobExpRequired = parseYearsFromString(job.yearsOfExperience);
  const expRegex = /([0-9]+(?:\.[0-9]+)?)\s*(?:\+\s*)?years?\s*(?:of\s*)?(?:experience|exp)/i;
  const effectiveExp =
    jobExpRequired > 0
      ? jobExpRequired
      : (() => { const m = fullJobText.match(expRegex); return m ? parseFloat(m[1]) : 0; })();

  if (effectiveExp === 0) {
    breakdown.experience = W.experience;
    logs.experience = `Full Credit (no exp req) → ${W.experience}/${W.experience}`;
  } else if (studentExpYears >= effectiveExp) {
    breakdown.experience = W.experience;
    logs.experience = `Match (${studentExpYears.toFixed(1)}y ≥ ${effectiveExp}y) → ${W.experience}/${W.experience}`;
  } else if (studentExpYears >= effectiveExp * 0.7) {
    breakdown.experience = Math.round(W.experience * 0.5);
    logs.experience = `Near match (${studentExpYears.toFixed(1)}y) → ${breakdown.experience}/${W.experience}`;
  } else {
    logs.experience = `Fail (${studentExpYears.toFixed(1)}y < ${effectiveExp}y) → 0/${W.experience}`;
  }

  // ── 4. DEGREE ───────────────────────────────────────────────────────────────
  const studentDegree = norm(student.degree);
  const jobDegrees = (job.degree || []).map(norm);
  const degreeKeywords = ["btech","be","bsc","mtech","mca","mba","bca","bcom","ba","bba"];

  if (jobDegrees.length === 0) {
    const anyDegreeInText = degreeKeywords.some((d) => fullJobText.includes(d));
    if (!anyDegreeInText) {
      breakdown.degree = W.degree;
      logs.degree = `Full Credit (no degree specified) → ${W.degree}/${W.degree}`;
    } else if (studentDegree && fullJobText.includes(studentDegree)) {
      breakdown.degree = W.degree;
      logs.degree = `Text match (${student.degree}) → ${W.degree}/${W.degree}`;
    } else {
      breakdown.degree = Math.round(W.degree * 0.4);
      logs.degree = `Partial Credit → ${breakdown.degree}/${W.degree}`;
    }
  } else {
    if (studentDegree && jobDegrees.includes(studentDegree)) {
      breakdown.degree = W.degree;
      logs.degree = `Match (${student.degree}) → ${W.degree}/${W.degree}`;
    } else {
      const partial = jobDegrees.some(
        (d) => d.includes(studentDegree) || studentDegree.includes(d)
      );
      breakdown.degree = partial ? Math.round(W.degree * 0.5) : 0;
      logs.degree = partial
        ? `Partial match → ${breakdown.degree}/${W.degree}`
        : `No match → 0/${W.degree}`;
    }
  }

  // ── 5. STREAM ───────────────────────────────────────────────────────────────
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
    logs.stream = `Full Credit (no stream specified) → ${W.stream}/${W.stream}`;
  } else if (studentStream && jobStreams.includes(studentStream)) {
    breakdown.stream = W.stream;
    logs.stream = `Match (${student.specialization}) → ${W.stream}/${W.stream}`;
  } else {
    const studentGroup = relatedGroups.find((g) => g.includes(studentStream));
    const partial = studentGroup && jobStreams.some((s) => studentGroup.includes(s));
    breakdown.stream = partial ? Math.round(W.stream * 0.57) : 0;
    logs.stream = partial
      ? `Related stream → ${breakdown.stream}/${W.stream}`
      : `No match → 0/${W.stream}`;
  }

  // ── 6. CGPA ─────────────────────────────────────────────────────────────────
  const sCGPA = parseFloat(student.cgpa) || 0;
  const requiredCGPA = parseFloat(job.cgpa) || 0;
  const cgpaRegex = /(?:cgpa|cut-off|cutoff|minimum|min)\s*[:>=]*\s*([0-9]\.[0-9]|[0-9]{2})/i;
  const effectiveCGPA =
    requiredCGPA > 0
      ? requiredCGPA
      : (() => { const m = fullJobText.match(cgpaRegex); return m ? parseFloat(m[1]) : 0; })();

  if (effectiveCGPA === 0) {
    breakdown.cgpa = W.cgpa;
    logs.cgpa = `Full Credit (no min CGPA) → ${W.cgpa}/${W.cgpa}`;
  } else if (sCGPA >= effectiveCGPA) {
    breakdown.cgpa = W.cgpa;
    logs.cgpa = `Match (${sCGPA} ≥ ${effectiveCGPA}) → ${W.cgpa}/${W.cgpa}`;
  } else {
    logs.cgpa = `Fail (${sCGPA} < ${effectiveCGPA}) → 0/${W.cgpa}`;
  }

  // ── 7. BATCH YEAR ───────────────────────────────────────────────────────────
  const sYear = norm(student.yearOfGraduation);
  const yearRegex = /\b(202[0-9]|2030)\b/;
  if (!yearRegex.test(fullJobText)) {
    breakdown.batchYear = W.batchYear;
    logs.batchYear = `Full Credit (no batch year) → ${W.batchYear}/${W.batchYear}`;
  } else if (sYear && fullJobText.includes(sYear)) {
    breakdown.batchYear = W.batchYear;
    logs.batchYear = `Match (${sYear}) → ${W.batchYear}/${W.batchYear}`;
  } else {
    logs.batchYear = `Fail (batch mismatch) → 0/${W.batchYear}`;
  }

  // ── 8. LOCATION ─────────────────────────────────────────────────────────────
  // Job schema has both `location` (required) and `workLocation` (optional)
  // We check both, plus city and venue
  const sLocs = (student.locations || []).map(norm);
  const jWorkLocs = (job.workLocation || []).map(norm);
  const jLocs = (job.location || []).map(norm);          // required field in schema
  const allJobLocs = [...new Set([...jWorkLocs, ...jLocs])];
  const isRemote = (job.workMode || []).some((m) => norm(m).includes("remote"));

  if (allJobLocs.length === 0 && !job.city && !job.venue) {
    breakdown.location = W.location;
    logs.location = `Full Credit (no location specified) → ${W.location}/${W.location}`;
  } else if (isRemote) {
    breakdown.location = W.location;
    logs.location = `Remote role → ${W.location}/${W.location}`;
  } else {
    const matchedLocs = sLocs.filter(
      (l) =>
        allJobLocs.includes(l) ||
        norm(job.city) === l ||
        norm(job.venue || "").includes(l)
    );
    breakdown.location = matchedLocs.length > 0 ? W.location : 0;
    logs.location = matchedLocs.length > 0
      ? `Matched [${matchedLocs.join(", ")}] → ${W.location}/${W.location}`
      : `Mismatch → 0/${W.location}`;
  }

  // ── 9. SALARY ───────────────────────────────────────────────────────────────
  const sExpSalary = Number(student.expectedSalaryAmount) || 0;
  const jSalary = Number(job.packageDetails?.totalCTC) || 0;

  if (sExpSalary === 0 || jSalary === 0) {
    breakdown.salary = W.salary;
    logs.salary = `Full Credit (no salary data) → ${W.salary}/${W.salary}`;
  } else if (jSalary >= sExpSalary) {
    breakdown.salary = W.salary;
    logs.salary = `Match (${jSalary} ≥ ${sExpSalary}) → ${W.salary}/${W.salary}`;
  } else if (jSalary >= sExpSalary * 0.85) {
    breakdown.salary = Math.round(W.salary * 0.67);
    logs.salary = `Near match 85%+ → ${breakdown.salary}/${W.salary}`;
  } else {
    logs.salary = `Below target (${jSalary} < ${sExpSalary}) → 0/${W.salary}`;
  }

  // ── BROADCAST FILTER ────────────────────────────────────────────────────────
  // let broadcastAllowed = true;
  // let broadcastLog = "Everyone → allowed";
  // if (job.broadcastType === "Location") {
  //   const venueNorm = norm(job.venue);
  //   const venueMatch = venueNorm && sLocs.includes(venueNorm);
  //   const workLocMatch = allJobLocs.some((l) => sLocs.includes(l));
  //   broadcastAllowed = venueMatch || workLocMatch;
  //   broadcastLog = broadcastAllowed
  //     ? `Location broadcast → allowed`
  //     : `Location broadcast → BLOCKED (student: [${sLocs.join(", ")}], job: [${allJobLocs.join(", ")}])`;
  // }
  // console.log("DEBUG ROLES → job.jobTitle:", job.jobTitle, "| student.jobRoles:", student.jobRoles);

  // ── TOTAL ───────────────────────────────────────────────────────────────────
  const totalScore = Math.min(
    breakdown.skills + breakdown.roles + breakdown.experience +
    breakdown.cgpa + breakdown.batchYear + breakdown.location +
    breakdown.degree + breakdown.stream + breakdown.salary,
    100
  );

  // ── PER-JOB LOG ─────────────────────────────────────────────────────────────
  console.log(`\x1b[36m┌─ ${label} #${index + 1}: "${job.jobTitle || "N/A"}" | ${posterName}\x1b[0m`);
  console.log(`\x1b[36m│  Skills     : ${logs.skills}\x1b[0m`);
  console.log(`\x1b[36m│  Roles      : ${logs.roles}\x1b[0m`);
  console.log(`\x1b[36m│  Experience : ${logs.experience}\x1b[0m`);
  console.log(`\x1b[36m│  CGPA       : ${logs.cgpa}\x1b[0m`);
  console.log(`\x1b[36m│  Batch Year : ${logs.batchYear}\x1b[0m`);
  console.log(`\x1b[36m│  Location   : ${logs.location}\x1b[0m`);
  console.log(`\x1b[36m│  Degree     : ${logs.degree}\x1b[0m`);
  console.log(`\x1b[36m│  Stream     : ${logs.stream}\x1b[0m`);
  console.log(`\x1b[36m│  Salary     : ${logs.salary}\x1b[0m`);
 // console.log(`\x1b[36m│  Broadcast  : ${broadcastLog}\x1b[0m`);
 console.log(
  `\x1b[36m└─ SCORE: \x1b[1m${totalScore}%\x1b[0m\x1b[36m | THRESHOLD: N/A here\n`
);

  return {
    ...job,
    matchScore: totalScore,
    // Expose poster name consistently regardless of job type
    companyName: posterName,
   // _broadcastAllowed: broadcastAllowed,
  };
};