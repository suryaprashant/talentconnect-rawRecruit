import RelevancyWeights from "../models/Relevancyweightsmodel.js";
import Auth from "../models/authModel.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const norm = (v) => {
  if (Array.isArray(v)) return v.map((s) => norm(s));           // safe for arrays
  return v ? String(v).toLowerCase().replace(/[\s.\-_]/g, "").trim() : "";
};

// single-value norm (always returns a string, never an array)
export const normStr = (v) =>
  v ? String(v).toLowerCase().replace(/[\s.\-_]/g, "").trim() : "";

export const calcExperienceYears = (experiences = []) => {
  let totalMonths = 0;
  for (const exp of experiences) {
    if (!exp.startDate) continue;
    const start = new Date(exp.startDate);
    const end   = exp.endDate ? new Date(exp.endDate) : new Date();
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
        value:      adminDoc.jobVisibilityThreshold ?? 0,
        adminEmail: adminDoc.email || "unknown",
        _source:    "database",
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

  const ok = total === 100 ? "\x1b[32m✔\x1b[0m" : `\x1b[31m⚠ NOT 100 (got ${total})\x1b[0m`;
  console.log(`\n\x1b[33m╔══════════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[33m║     ${label.padEnd(41)}\x1b[0m║`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  Source (Weights)   : ${String(W._source).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m║  Admin Email        : ${String(threshold.adminEmail).padEnd(22)}\x1b[0m║`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  Skills      : ${String(W.skills      + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Job Roles   : ${String(W.jobRoles    + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Experience  : ${String(W.experience  + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  CGPA        : ${String(W.cgpa        + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Batch Year  : ${String(W.batchYear   + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Location    : ${String(W.location    + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Degree      : ${String(W.degree      + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Stream      : ${String(W.stream      + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  Salary      : ${String(W.salary      + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m║  TOTAL       : ${String(total         + "%").padEnd(29)}\x1b[0m${ok}`);
  console.log(`\x1b[33m╠══════════════════════════════════════════════╣\x1b[0m`);
  console.log(`\x1b[33m║  THRESHOLD   : ${String(threshold.value + "%").padEnd(29)}\x1b[0m║`);
  console.log(`\x1b[33m╚══════════════════════════════════════════════╝\x1b[0m\n`);
};

// ─── Structured per-dimension logger ─────────────────────────────────────────
//
//  Each section prints:
//    • what raw values were read from job / student
//    • what they looked like after normalisation
//    • the match outcome and the resulting score
//
const DIM = {
  SKILLS:     "\x1b[35m[SKILLS    ]\x1b[0m",
  ROLES:      "\x1b[34m[ROLES     ]\x1b[0m",
  EXP:        "\x1b[33m[EXPERIENCE]\x1b[0m",
  CGPA:       "\x1b[36m[CGPA      ]\x1b[0m",
  BATCH:      "\x1b[32m[BATCH YEAR]\x1b[0m",
  LOC:        "\x1b[34m[LOCATION  ]\x1b[0m",
  DEGREE:     "\x1b[33m[DEGREE    ]\x1b[0m",
  STREAM:     "\x1b[35m[STREAM    ]\x1b[0m",
  SALARY:     "\x1b[36m[SALARY    ]\x1b[0m",
};

const pad  = (s, n = 18) => String(s).padEnd(n);
const score = (got, max) =>
  got === max
    ? `\x1b[32m${got}/${max}\x1b[0m`
    : got > 0
    ? `\x1b[33m${got}/${max}\x1b[0m`
    : `\x1b[31m${got}/${max}\x1b[0m`;

// ─── Core scoring function (shared by off-campus & referral) ─────────────────

export const scoreJob = (job, student, W, index, label = "Job") => {
  process.stdout.write(`[SCOREJOB] Called for: ${JSON.stringify(job.jobTitle)} | student: ${student?.name}\n`);
  const breakdown = {
    skills: 0, roles: 0, experience: 0,
    cgpa: 0, batchYear: 0, location: 0,
    degree: 0, stream: 0, salary: 0,
  };

  const jobReqSkills  = (job.skills || []).map(norm);
  const studentNormLocs = (student.locations || []).map(norm);

  // Referral: poster is candidatePosted (Onboarding doc)
  // Off-campus: poster is companyPosted (CompanyProfile doc)

  const posterName =
    job.candidatePosted?.name ||
    job.companyPosted?.companyDetails?.companyName ||
    "Unknown";

  // FIX: jobTitle is [String] in schema — join to a single string before norming
  const jobTitleRaw = Array.isArray(job.jobTitle)
    ? job.jobTitle.join(" ")
    : (job.jobTitle || "");
  const jobTitleNorm = normStr(jobTitleRaw);

  console.log(
    `\n\x1b[1m\x1b[36m━━━━  ${label} #${index + 1}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m`
  );
  console.log(`  Job title (raw)  : ${JSON.stringify(job.jobTitle)}`);
  console.log(`  Job title (norm) : "${jobTitleNorm}"`);
  console.log(`  Poster           : ${posterName}`);
  console.log(`  Student          : ${student?.name || "?"} | ${student?.email || "?"}`);


  const fullJobText = (
    (job.description || "") + " " + (job.eligibilityCriteria || "")
  ).toLowerCase();

  // ── 1. SKILLS ──────────────────────────────────────────────────────────────
  const jobSkillsRaw    = job.skills || [];
  const jobSkillsNorm   = jobSkillsRaw.map(normStr);
  const studentSkillsRaw  = student.skills || [];
  const studentSkillsNorm = studentSkillsRaw.map(normStr);

  console.log(`\n${DIM.SKILLS}`);
  console.log(`  Job skills (raw)     : [${jobSkillsRaw.join(", ") || "none"}]`);
  console.log(`  Job skills (norm)    : [${jobSkillsNorm.join(", ") || "none"}]`);
  console.log(`  Student skills (raw) : [${studentSkillsRaw.join(", ") || "none"}]`);
  console.log(`  Student skills (norm): [${studentSkillsNorm.join(", ") || "none"}]`);

  if (jobSkillsNorm.length === 0) {
    breakdown.skills = W.skills;
    console.log(`  Match  → Full credit (no skills listed) | ${score(breakdown.skills, W.skills)}`);
  } else {
    const matched = jobSkillsNorm.filter(
      (s) => studentSkillsNorm.includes(s) || fullJobText.includes(s)
    );
    const missed = jobSkillsNorm.filter((s) => !matched.includes(s));
    breakdown.skills = Math.round((matched.length / jobSkillsNorm.length) * W.skills);
    console.log(`  Matched: [${matched.join(", ") || "none"}]`);
    console.log(`  Missed : [${missed.join(", ") || "none"}]`);
    console.log(`  Ratio  : ${matched.length}/${jobSkillsNorm.length} → ${score(breakdown.skills, W.skills)}`);
  }

  // ── 2. JOB ROLES ───────────────────────────────────────────────────────────
  const studentRolesRaw  = student.jobRoles || [];
  const studentRolesNorm = studentRolesRaw.map(normStr);
  const jobRolesRaw      = job.jobRoles || [];
  const jobRolesNorm     = jobRolesRaw.map(normStr);

  // FIX: jobTitle was incorrectly passed as array to norm(); now uses jobTitleNorm (string)
  const allJobRoles = jobTitleNorm
    ? [...new Set([...jobRolesNorm, jobTitleNorm])]
    : jobRolesNorm;

  console.log(`\n${DIM.ROLES}`);
  console.log(`  Job jobRoles (raw)    : [${jobRolesRaw.join(", ") || "none"}]`);
  console.log(`  Job jobRoles (norm)   : [${jobRolesNorm.join(", ") || "none"}]`);
  console.log(`  Job title as role     : "${jobTitleNorm}"`);
  console.log(`  Combined job roles    : [${allJobRoles.join(", ") || "none"}]`);
  console.log(`  Student roles (raw)   : [${studentRolesRaw.join(", ") || "none"}]`);
  console.log(`  Student roles (norm)  : [${studentRolesNorm.join(", ") || "none"}]`);

  if (allJobRoles.length === 0) {
    breakdown.roles = W.jobRoles;
    console.log(`  Match → Full credit (no roles specified) | ${score(breakdown.roles, W.jobRoles)}`);
  } else {
    const matchedRoles = studentRolesNorm.filter((r) => allJobRoles.includes(r));
    if (matchedRoles.length > 0) {
      breakdown.roles = Math.min(
        Math.round((matchedRoles.length / allJobRoles.length) * W.jobRoles),
        W.jobRoles
      );
      console.log(`  Exact match: [${matchedRoles.join(", ")}]`);
      console.log(`  Ratio  : ${matchedRoles.length}/${allJobRoles.length} → ${score(breakdown.roles, W.jobRoles)}`);
    } else {
      const softMatch = studentRolesNorm.some(
        (r) => jobTitleNorm.includes(r) || fullJobText.includes(r)
      );
      if (softMatch) {
        breakdown.roles = Math.round(W.jobRoles * 0.35);
        console.log(`  No exact match — soft match via title/description found`);
        console.log(`  Score  : ${score(breakdown.roles, W.jobRoles)}`);
      } else {
        console.log(`  No match (exact or soft)`);
        console.log(`  Score  : ${score(0, W.jobRoles)}`);
      }
    }
  }

  // ── 3. EXPERIENCE ──────────────────────────────────────────────────────────
  const studentExpYears =
    parseYearsFromString(student.totalYearsOfExperience) ||
    calcExperienceYears(student.experiences || []);

  const jobMinExp = parseYearsFromString(job.minYearofExperience);
  const jobMaxExp = parseYearsFromString(job.yearsOfExperience);

  const expRegex = /([0-9]+(?:\.[0-9]+)?)\s*(?:\+\s*)?years?\s*(?:of\s*)?(?:experience|exp)/i;
  const effectiveMin =
    jobMinExp > 0
      ? jobMinExp
      : (() => { const m = fullJobText.match(expRegex); return m ? parseFloat(m[1]) : 0; })();
  const effectiveMax = jobMaxExp > 0 ? jobMaxExp : 0;

  console.log(`\n${DIM.EXP}`);
  console.log(`  Student totalYearsOfExperience (raw) : "${student.totalYearsOfExperience}"`);
  console.log(`  Student exp from experiences[]       : ${calcExperienceYears(student.experiences || []).toFixed(2)} yrs`);
  console.log(`  Student exp used                     : ${studentExpYears.toFixed(2)} yrs`);
  console.log(`  Job minYearofExperience (raw)        : "${job.minYearofExperience}" → parsed: ${jobMinExp}`);
  console.log(`  Job yearsOfExperience (raw)          : "${job.yearsOfExperience}" → parsed: ${jobMaxExp}`);
  console.log(`  Effective min (field or description) : ${effectiveMin} yrs`);
  console.log(`  Effective max                        : ${effectiveMax > 0 ? effectiveMax + " yrs" : "not set"}`);

  // FIX: check max-only first, before the "no requirement" branch
if (effectiveMin === 0 && effectiveMax === 0) {
    // No requirement at all
    breakdown.experience = W.experience;
    console.log(`  Branch : No requirement → Full credit | ${score(breakdown.experience, W.experience)}`);
} else if (effectiveMax > 0 && studentExpYears > effectiveMax) {
    // Overqualified
    const ratio = effectiveMax / studentExpYears;
    breakdown.experience = Math.round(W.experience * Math.max(ratio, 0));
    console.log(`  Branch : Overqualified (${studentExpYears.toFixed(1)}y > max ${effectiveMax}y) | ratio=${ratio.toFixed(2)} | ${score(breakdown.experience, W.experience)}`);
} else if (effectiveMin === 0 && effectiveMax > 0 && studentExpYears <= effectiveMax) {
    // No minimum, student is within max — full credit
    breakdown.experience = W.experience;
    console.log(`  Branch : In range (no min, ${studentExpYears.toFixed(1)}y ≤ max ${effectiveMax}y) | ${score(breakdown.experience, W.experience)}`);
} else if (effectiveMin > 0 && studentExpYears >= effectiveMin) {
    // Meets minimum
    breakdown.experience = W.experience;
    console.log(`  Branch : In range (${studentExpYears.toFixed(1)}y ≥ min ${effectiveMin}y) | ${score(breakdown.experience, W.experience)}`);
} else if (effectiveMin > 0 && studentExpYears >= effectiveMin * 0.7) {
    // Close to minimum
    const ratio = studentExpYears / effectiveMin;
    breakdown.experience = Math.round(W.experience * ratio);
    console.log(`  Branch : Partial (${studentExpYears.toFixed(1)}y = ${Math.round(ratio * 100)}% of min ${effectiveMin}y) | ${score(breakdown.experience, W.experience)}`);
} else {
    breakdown.experience = 0;
    console.log(`  Branch : Fail (${studentExpYears.toFixed(1)}y < 70% of min ${effectiveMin}y) | ${score(0, W.experience)}`);
}

  // ── 4. DEGREE ──────────────────────────────────────────────────────────────
  const studentDegreeRaw  = student.degree || "";
  const studentDegreeNorm = normStr(studentDegreeRaw);
  const jobDegreesRaw     = job.degree || [];
  const jobDegreesNorm    = jobDegreesRaw.map(normStr);
  const degreeKeywords    = ["btech","be","bsc","mtech","mca","mba","bca","bcom","ba","bba"];

  console.log(`\n${DIM.DEGREE}`);
  console.log(`  Student degree (raw)  : "${studentDegreeRaw}"`);
  console.log(`  Student degree (norm) : "${studentDegreeNorm}"`);
  console.log(`  Job degree[] (raw)    : [${jobDegreesRaw.join(", ") || "none"}]`);
  console.log(`  Job degree[] (norm)   : [${jobDegreesNorm.join(", ") || "none"}]`);

  if (jobDegreesNorm.length === 0) {
    const anyDegreeInText = degreeKeywords.some((d) => fullJobText.includes(d));
    if (!anyDegreeInText) {
      breakdown.degree = W.degree;
      console.log(`  No degree field + no degree keywords in description → Full credit | ${score(breakdown.degree, W.degree)}`);
    } else if (studentDegreeNorm && fullJobText.includes(studentDegreeNorm)) {
      breakdown.degree = W.degree;
      console.log(`  Found "${studentDegreeNorm}" in job description → Full credit | ${score(breakdown.degree, W.degree)}`);
    } else {
      breakdown.degree = Math.round(W.degree * 0.4);
      console.log(`  Degree keywords in description but no match for student → Partial | ${score(breakdown.degree, W.degree)}`);
    }
  } else if (studentDegreeNorm && jobDegreesNorm.includes(studentDegreeNorm)) {
    breakdown.degree = W.degree;
    console.log(`  Exact match ("${studentDegreeNorm}" in [${jobDegreesNorm.join(", ")}]) | ${score(breakdown.degree, W.degree)}`);
  } else {
    const partial = jobDegreesNorm.some(
      (d) => d.includes(studentDegreeNorm) || studentDegreeNorm.includes(d)
    );
    breakdown.degree = partial ? Math.round(W.degree * 0.5) : 0;
    console.log(`  ${partial ? "Partial substring match" : "No match"} | ${score(breakdown.degree, W.degree)}`);
  }

  // ── 5. STREAM ──────────────────────────────────────────────────────────────
  const studentStreamRaw  = student.specialization || "";
  const studentStreamNorm = normStr(studentStreamRaw);
  const jobStreamsRaw      = job.studentStreams || [];
  const jobStreamsNorm     = jobStreamsRaw.map(normStr);
  const relatedGroups = [
    ["cs","cse","it","computerscience","informationtechnology","computerapplication","bca"],
    ["ece","eee","ee","electronics","electricalengineering","electrical"],
    ["me","mechanicalengineering","mechanical"],
    ["ce","civilengineering","civil"],
    ["mba","businessadministration","management","bba"],
    ["ds","datascience","ai","artificialintelligence","ml","machinelearning"],
  ];

  console.log(`\n${DIM.STREAM}`);
  console.log(`  Student specialization (raw)  : "${studentStreamRaw}"`);
  console.log(`  Student specialization (norm) : "${studentStreamNorm}"`);
  console.log(`  Job studentStreams (raw)       : [${jobStreamsRaw.join(", ") || "none"}]`);
  console.log(`  Job studentStreams (norm)      : [${jobStreamsNorm.join(", ") || "none"}]`);

  if (jobStreamsNorm.length === 0) {
    breakdown.stream = W.stream;
    console.log(`  No stream requirement → Full credit | ${score(breakdown.stream, W.stream)}`);
  } else if (studentStreamNorm && jobStreamsNorm.includes(studentStreamNorm)) {
    breakdown.stream = W.stream;
    console.log(`  Exact match ("${studentStreamNorm}") | ${score(breakdown.stream, W.stream)}`);
  } else {
    const studentGroup = relatedGroups.find((g) => g.includes(studentStreamNorm));
    const relatedMatch = studentGroup && jobStreamsNorm.some((s) => studentGroup.includes(s));
    breakdown.stream = relatedMatch ? Math.round(W.stream * 0.57) : 0;
    if (studentGroup) {
      console.log(`  Student group  : [${studentGroup.join(", ")}]`);
      console.log(`  Related match in job streams: ${relatedMatch}`);
    } else {
      console.log(`  Student stream "${studentStreamNorm}" not in any related group`);
    }
    console.log(`  Score : ${score(breakdown.stream, W.stream)}`);
  }

  // ── 6. CGPA ────────────────────────────────────────────────────────────────
  const studentCGPARaw = student.cgpa;
  const sCGPA          = parseFloat(studentCGPARaw) || 0;
  const requiredCGPA   = parseFloat(job.cgpa) || 0;
  // Tightened regex: requires decimal or explicit 10-scale to avoid "min 3 rounds" false positive
  const cgpaRegex = /(?:cgpa|cut-off|cutoff|minimum\s+cgpa|min\s+cgpa)\s*[:>=]*\s*([0-9](?:\.[0-9]{1,2})?)\b/i;
  const effectiveCGPA =
    requiredCGPA > 0
      ? requiredCGPA
      : (() => { const m = fullJobText.match(cgpaRegex); return m ? parseFloat(m[1]) : 0; })();

  console.log(`\n${DIM.CGPA}`);
  console.log(`  Student cgpa (raw)         : "${studentCGPARaw}" → parsed: ${sCGPA}`);
  console.log(`  Job cgpa field             : ${job.cgpa} (Number)`);
  console.log(`  CGPA from description regex: ${effectiveCGPA > 0 && requiredCGPA === 0 ? effectiveCGPA : "N/A (using field)"}`);
  console.log(`  Effective required CGPA    : ${effectiveCGPA}`);

  if (effectiveCGPA === 0) {
    breakdown.cgpa = W.cgpa;
    console.log(`  No CGPA requirement → Full credit | ${score(breakdown.cgpa, W.cgpa)}`);
  } else if (sCGPA >= effectiveCGPA) {
    breakdown.cgpa = W.cgpa;
    console.log(`  ${sCGPA} ≥ ${effectiveCGPA} → Full credit | ${score(breakdown.cgpa, W.cgpa)}`);
  } else {
    breakdown.cgpa = 0;
    console.log(`  ${sCGPA} < ${effectiveCGPA} → Fail | ${score(0, W.cgpa)}`);
  }

  // ── 7. BATCH YEAR ──────────────────────────────────────────────────────────
  const studentYearRaw  = student.yearOfGraduation || "";
  const studentYearNorm = normStr(studentYearRaw);
  const yearRegex       = /\b(202[0-9]|2030)\b/g;
  const yearMatches     = [...fullJobText.matchAll(yearRegex)].map((m) => m[1]);

  console.log(`\n${DIM.BATCH}`);
  console.log(`  Student yearOfGraduation (raw)  : "${studentYearRaw}"`);
  console.log(`  Student yearOfGraduation (norm) : "${studentYearNorm}"`);
  console.log(`  Years found in job description  : [${yearMatches.join(", ") || "none"}]`);

  if (yearMatches.length === 0) {
    breakdown.batchYear = W.batchYear;
    console.log(`  No batch year in description → Full credit | ${score(breakdown.batchYear, W.batchYear)}`);
  } else if (studentYearNorm && fullJobText.includes(studentYearNorm)) {
    breakdown.batchYear = W.batchYear;
    console.log(`  "${studentYearNorm}" found in description → Full credit | ${score(breakdown.batchYear, W.batchYear)}`);
  } else {
    breakdown.batchYear = 0;
    console.log(`  Student year "${studentYearNorm}" not in [${yearMatches.join(", ")}] → Fail | ${score(0, W.batchYear)}`);
  }

  // ── 8. LOCATION ────────────────────────────────────────────────────────────
  const studentLocsRaw  = student.locations || [];
  const studentLocsNorm = studentLocsRaw.map(normStr);
  const jobWorkLocsRaw  = job.workLocation || [];
  const jobLocsRaw      = job.location || [];         // required field
  const jobWorkLocsNorm = jobWorkLocsRaw.map(normStr);
  const jobLocsNorm     = jobLocsRaw.map(normStr);
  const allJobLocsNorm  = [...new Set([...jobWorkLocsNorm, ...jobLocsNorm])];
  const isRemote        = (job.workMode || []).some((m) => normStr(m).includes("remote"));

  console.log(`\n${DIM.LOC}`);
  console.log(`  Student locations (raw)       : [${studentLocsRaw.join(", ") || "none"}]`);
  console.log(`  Student locations (norm)      : [${studentLocsNorm.join(", ") || "none"}]`);
  console.log(`  Job location[] (raw)          : [${jobLocsRaw.join(", ") || "none"}]`);
  console.log(`  Job workLocation[] (raw)      : [${jobWorkLocsRaw.join(", ") || "none"}]`);
  console.log(`  Combined job locations (norm) : [${allJobLocsNorm.join(", ") || "none"}]`);
  console.log(`  Job city                      : "${job.city || ""}"`);
  console.log(`  Job venue                     : "${job.venue || ""}"`);
  console.log(`  Job workMode                  : [${(job.workMode || []).join(", ")}]  → isRemote: ${isRemote}`);

  if (isRemote) {
    breakdown.location = W.location;
    console.log(`  Remote role → Full credit | ${score(breakdown.location, W.location)}`);
  } else if (allJobLocsNorm.length === 0 && !job.city && !job.venue) {
    breakdown.location = W.location;
    console.log(`  No location specified → Full credit | ${score(breakdown.location, W.location)}`);
  } else {
    const matchedLocs = studentLocsNorm.filter(
      (l) =>
        allJobLocsNorm.includes(l) ||
        normStr(job.city) === l ||
        normStr(job.venue || "").includes(l)
    );
    breakdown.location = matchedLocs.length > 0 ? W.location : 0;
    if (matchedLocs.length > 0) {
      console.log(`  Matched: [${matchedLocs.join(", ")}] | ${score(breakdown.location, W.location)}`);
    } else {
      console.log(`  No overlap between student [${studentLocsNorm.join(", ")}] and job [${allJobLocsNorm.join(", ")}] | ${score(0, W.location)}`);
    }
  }

  // ── 9. SALARY ──────────────────────────────────────────────────────────────
  const sExpSalaryRaw = student.expectedSalaryAmount;
  const sExpSalary    = Number(sExpSalaryRaw) || 0;
  const jSalary       = Number(job.packageDetails?.totalCTC) || 0;

  console.log(`\n${DIM.SALARY}`);
  console.log(`  Student expectedSalaryAmount (raw) : "${sExpSalaryRaw}" → parsed: ${sExpSalary}`);
  console.log(`  Job packageDetails.totalCTC        : ${jSalary}`);

  if (sExpSalary === 0 || jSalary === 0) {
    breakdown.salary = W.salary;
    console.log(`  Missing salary data → Full credit | ${score(breakdown.salary, W.salary)}`);
  } else if (jSalary >= sExpSalary) {
    breakdown.salary = W.salary;
    console.log(`  ${jSalary} ≥ ${sExpSalary} → Full credit | ${score(breakdown.salary, W.salary)}`);
  } else if (jSalary >= sExpSalary * 0.85) {
    breakdown.salary = Math.round(W.salary * 0.67);
    console.log(`  ${jSalary} is ≥85% of ${sExpSalary} → Near match | ${score(breakdown.salary, W.salary)}`);
  } else {
    breakdown.salary = 0;
    console.log(`  ${jSalary} < 85% of ${sExpSalary} → Fail | ${score(0, W.salary)}`);
  }

  // ── TOTAL ──────────────────────────────────────────────────────────────────
  const rawTotal =
    breakdown.skills + breakdown.roles + breakdown.experience +
    breakdown.cgpa + breakdown.batchYear + breakdown.location +
    breakdown.degree + breakdown.stream + breakdown.salary;
  const totalScore = Math.min(rawTotal, 100);

  console.log(`\n\x1b[1m  ┌─────────────────────────────────────────────────┐`);
  console.log(`  │  SCORE BREAKDOWN                                 │`);
  console.log(`  │  Skills     ${pad(breakdown.skills + "/" + W.skills)}  Roles      ${pad(breakdown.roles + "/" + W.jobRoles)} │`);
  console.log(`  │  Experience ${pad(breakdown.experience + "/" + W.experience)}  CGPA       ${pad(breakdown.cgpa + "/" + W.cgpa)} │`);
  console.log(`  │  Batch Year ${pad(breakdown.batchYear + "/" + W.batchYear)}  Location   ${pad(breakdown.location + "/" + W.location)} │`);
  console.log(`  │  Degree     ${pad(breakdown.degree + "/" + W.degree)}  Stream     ${pad(breakdown.stream + "/" + W.stream)} │`);
  console.log(`  │  Salary     ${pad(breakdown.salary + "/" + W.salary)}                     │`);
  console.log(`  │                                                  │`);
  console.log(`  │  RAW TOTAL  : ${rawTotal}${rawTotal !== totalScore ? " → capped at 100" : ""}`.padEnd(51) + "│");
  console.log(`  │  FINAL SCORE: ${totalScore}%`.padEnd(51) + "│");
  console.log(`  └─────────────────────────────────────────────────┘\x1b[0m\n`);

  return {
    ...job,
    matchScore:  totalScore,
    companyName: posterName,
  };
};