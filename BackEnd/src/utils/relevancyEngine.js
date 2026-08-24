// ═════════════════════════════════════════════════════════════════════════════
//  scoreHelpers.js  —  Match-Score Engine  v5
//
//  KEY CHANGE (v5):  Weights are now fetched from the database instead of
//  the hardcoded WEIGHTS_PROFESSIONAL / WEIGHTS_STUDENT objects.
//
//  • fetchWeights(profileType)  accepts "professional" or "student" (default)
//    and queries the matching Mongo collection.
//  • If the DB has no document yet, it falls back to the hardcoded defaults
//    below — so the engine never breaks on a fresh deployment.
//  • scoreJob() now receives W as the THIRD argument (same signature as
//    before) — the caller must await fetchWeights(student.profileType) and
//    pass the result in.  The internal weight-map selection block has been
//    removed; W is used directly.
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
//  FALLBACK WEIGHT CONFIGURATION  (used only when DB has no document yet)
//  Keep these in sync with your Mongoose model defaults.
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_PROFESSIONAL = {
  skills: 40,
  jobRoles: 13,
  experience: 9,
  noticePeriod: 4,
  noticePeriodDays: 3,
  cgpa: 0,
  batchYear: 0,
  location: 4,
  degree: 9,
  stream: 13,
  salary: 5,
};

const FALLBACK_STUDENT = {
  skills: 38,
  jobRoles: 7,
  experience: 4,
  noticePeriod: 2,
  noticePeriodDays: 2,
  cgpa: 6,
  batchYear: 5,
  location: 4,
  degree: 13,
  stream: 16,
  salary: 3,
};

// Keys that are valid weight fields (excludes Mongo internals like _id, __v, etc.)
const WEIGHT_KEYS = [
  "skills",
  "jobRoles",
  "experience",
  "noticePeriod",
  "noticePeriodDays",
  "cgpa",
  "batchYear",
  "location",
  "degree",
  "stream",
  "salary",
];

// ─────────────────────────────────────────────────────────────────────────────
//  PARTIAL CREDIT MULTIPLIERS  — change freely, logic never needs touching
// ─────────────────────────────────────────────────────────────────────────────

const PARTIAL = {
  streamRelated: 0.5,
  degreeRelated: 0.5,
  roleNoSkillMatch: 0.5,
  rolesSoftMatch: 0.35,
  degreeInTextOnly: 0.4,
};

// ─────────────────────────────────────────────────────────────────────────────
//  RELATED GROUPS
// ─────────────────────────────────────────────────────────────────────────────

const STREAM_GROUPS = [
  [
    "cs",
    "cse",
    "it",
    "computerscience",
    "informationtechnology",
    "computerapplications",
    "computerapplication",
    "bca",
    "mca",
    "mastersincomputerapplications",
  ],
  [
    "ds",
    "datascience",
    "ai",
    "artificialintelligence",
    "ml",
    "machinelearning",
    "aids",
    "aiml",
    "aiandml",
    "dataanalytics",
    "statistics",
    "appliedmathematics",
    "cse",
    "cs",
    "it",
    "computerscience",
    "informationtechnology",
  ],
  [
    "ece",
    "eee",
    "ee",
    "electronics",
    "electricalengineering",
    "electrical",
    "vlsi",
    "embeddedsystems",
    "instrumentation",
  ],
  [
    "me",
    "mechanicalengineering",
    "mechanical",
    "manufacturing",
    "industrialengineering",
    "productiontechnology",
  ],
  [
    "ce",
    "civilengineering",
    "civil",
    "structural",
    "construction",
    "environmentalengineering",
  ],
  [
    "mba",
    "businessadministration",
    "management",
    "bba",
    "commerce",
    "marketing",
    "finance",
    "hr",
    "humanresources",
    "bbm",
    "bcom",
  ],
  [
    "chem",
    "chemicalengineering",
    "chemistry",
    "biotechnology",
    "biotech",
    "bioinformatics",
    "biochemistry",
  ],
  ["pharmacy", "pharmaceuticalsciences", "pharma", "pharmacology"],
  ["law", "llb", "legalstudy", "legalstudies", "llm"],
  ["architecture", "arch", "urbanplanning", "interiordesign", "bdes", "mdes"],
];

const DEGREE_GROUPS = [
  [
    "btech",
    "be",
    "bscit",
    "bsccs",
    "bca",
    "bsccomputerscience",
    "bscis",
    "bscelectronics",
  ],
  [
    "mtech",
    "me",
    "mscit",
    "msccs",
    "mca",
    "msccomputerscience",
    "mscelectronics",
  ],
  ["mba", "pgdm", "mms", "mba(dual)", "executivemba"],
  ["bba", "bcom", "bbm", "bbs", "bba(honors)"],
  [
    "bsc",
    "bscphysics",
    "bscchemistry",
    "bscmaths",
    "bscbiology",
    "bscstatistics",
  ],
  [
    "msc",
    "mscphysics",
    "mscchemistry",
    "mscmaths",
    "mscbiology",
    "mscstatistics",
  ],
  ["bpharm", "mpharm", "pharmd", "dpharma"],
  ["llb", "ballb", "llm", "blegalstudy"],
  ["ba", "bfa", "bdes", "bvoc"],
  ["ma", "mfa", "mdes", "mvoc"],
];

// ═════════════════════════════════════════════════════════════════════════════
//  UTILITY HELPERS
// ═════════════════════════════════════════════════════════════════════════════

export const norm = (v) => {
  if (Array.isArray(v)) return v.map((s) => norm(s));
  return v
    ? String(v)
      .toLowerCase()
      .replace(/[\s.\-_]/g, "")
      .trim()
    : "";
};

export const normStr = (v) =>
  v
    ? String(v)
      .toLowerCase()
      .replace(/[\s.\-_]/g, "")
      .trim()
    : "";

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

export const parseExpRange = (str) => {
  if (!str) return { min: 0, max: 0 };
  const s = String(str).trim();
  const rangeMatch = s.match(
    /([0-9]+(?:\.[0-9]+)?)\s*(?:-|to)\s*([0-9]+(?:\.[0-9]+)?)/i,
  );
  if (rangeMatch)
    return { min: parseFloat(rangeMatch[1]), max: parseFloat(rangeMatch[2]) };
  const plusMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*\+/);
  if (plusMatch) return { min: parseFloat(plusMatch[1]), max: 0 };
  const plain = s.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (plain) return { min: parseFloat(plain[1]), max: 0 };
  return { min: 0, max: 0 };
};

const parseNoticeDays = (str) => {
  if (!str) return null;
  const s = str.toLowerCase().trim();
  if (s === "immediate" || s === "0" || s === "no notice" || s === "0 days")
    return 0;
  const monthMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*month/);
  if (monthMatch) return Math.round(parseFloat(monthMatch[1]) * 30);
  const dayMatch = s.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:day|d)?/);
  return dayMatch ? Math.round(parseFloat(dayMatch[1])) : null;
};

const calcRemainingDays = (startDateStr, totalDays) => {
  if (!startDateStr || totalDays === null) return totalDays;
  const start = new Date(startDateStr);
  if (isNaN(start)) return totalDays;
  const elapsed = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, totalDays - elapsed);
};

const findGroup = (normValue, groups) =>
  groups.find((g) => g.includes(normValue)) ?? null;

const sameGroup = (studentNorm, jobNorms, groups) => {
  const grp = findGroup(studentNorm, groups);
  return !!grp && jobNorms.some((j) => grp.includes(j));
};

// ═════════════════════════════════════════════════════════════════════════════
//  LOGGING HELPERS
// ═════════════════════════════════════════════════════════════════════════════

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
};

const DIM = {
  SKILLS: `${C.magenta}[SKILLS    ]${C.reset}`,
  ROLES: `${C.blue}[ROLES     ]${C.reset}`,
  EXP: `${C.yellow}[EXPERIENCE]${C.reset}`,
  CGPA: `${C.cyan}[CGPA      ]${C.reset}`,
  BATCH: `${C.green}[BATCH YEAR]${C.reset}`,
  LOC: `${C.blue}[LOCATION  ]${C.reset}`,
  DEGREE: `${C.yellow}[DEGREE    ]${C.reset}`,
  STREAM: `${C.magenta}[STREAM    ]${C.reset}`,
  SALARY: `${C.cyan}[SALARY    ]${C.reset}`,
  NOTICE: `${C.green}[NOTICE    ]${C.reset}`,
  GATE: `${C.red}[SKILL GATE]${C.reset}`,
};

const ss = (got, max) => {
  const col = got === max ? C.green : got > 0 ? C.yellow : C.red;
  return `${col}${got}/${max}${C.reset}`;
};

const pad = (s, n = 20) => String(s).padEnd(n);

const printSummary = (
  bd,
  W,
  rawTotal,
  totalScore,
  profileTag,
  gateMultiplier,
) => {
  const capped = rawTotal !== totalScore ? ` → capped 100` : "";
  console.log(
    `\n${C.bold}  ┌──────────────────────────────────────────────────────────┐`,
  );
  console.log(`  │  SCORE BREAKDOWN  [${profileTag}]`);
  console.log(`  ├──────────────────────────────────────────────────────────┤`);
  console.log(
    `  │  Skills     ${pad(bd.skills + "/" + W.skills)}   Roles      ${pad(bd.roles + "/" + W.jobRoles)}`,
  );
  console.log(
    `  │  Stream     ${pad(bd.stream + "/" + W.stream)}   Degree     ${pad(bd.degree + "/" + W.degree)}`,
  );
  console.log(
    `  │  Experience ${pad(bd.experience + "/" + W.experience)}   CGPA       ${pad(bd.cgpa + "/" + W.cgpa)}`,
  );
  console.log(
    `  │  Batch Year ${pad(bd.batchYear + "/" + W.batchYear)}   Location   ${pad(bd.location + "/" + W.location)}`,
  );
  console.log(
    `  │  Salary     ${pad(bd.salary + "/" + W.salary)}   Notice     ${pad(bd.noticePeriod + "/" + (W.noticePeriod ?? 0))}`,
  );
  console.log(
    `  │  NotcDays   ${pad(bd.noticePeriodDays + "/" + (W.noticePeriodDays ?? 0))}   GateMult   x${gateMultiplier}`,
  );
  console.log(`  ├──────────────────────────────────────────────────────────┤`);
  console.log(`  │  RAW TOTAL : ${rawTotal}${capped}`);
  console.log(`  │  FINAL     : ${totalScore}%`);
  console.log(
    `  └──────────────────────────────────────────────────────────┘${C.reset}\n`,
  );
};

// ═════════════════════════════════════════════════════════════════════════════
//  DB HELPERS
// ═════════════════════════════════════════════════════════════════════════════

import Auth from "../models/authModel.js";
import RelevancyWeights from "../models/Relevancyweightsmodel.js";
import RelevancyWeightsProfessional from "../models/RelevancyweightsProfessionalmodel.js";

/**
 * fetchWeights(profileType?)
 *
 * Fetches weights from the correct collection based on profile type.
 * Falls back to hardcoded defaults if no DB document exists yet.
 *
 * @param {"professional" | "student" | string} profileType
 * @returns {Promise<Record<string, number>>}
 */
// just for checking
export const fetchWeights = async (profileType = "student") => {
  const isProfessional = normStr(profileType) === "professional";
  const Model = isProfessional
    ? RelevancyWeightsProfessional
    : RelevancyWeights;
  const fallback = isProfessional ? FALLBACK_PROFESSIONAL : FALLBACK_STUDENT;
  const tag = isProfessional ? "professional" : "student";

  try {
    const doc = await Model.findOne().lean();

    if (!doc) {
      console.warn(
        `[fetchWeights] No ${tag} weights doc in DB — using hardcoded fallback.`,
      );
      return { ...fallback, _source: `fallback-${tag}` };
    }

    // Pick only the valid weight keys to keep the object clean
    const weights = {};
    for (const key of WEIGHT_KEYS) {
      weights[key] = doc[key] ?? fallback[key];
    }

    console.log(`[fetchWeights] Loaded ${tag} weights from DB (id=${doc._id})`);
    return { ...weights, _source: `db-${tag}` };
  } catch (err) {
    console.error(
      `[fetchWeights] DB error for ${tag}, falling back:`,
      err.message,
    );
    return { ...fallback, _source: `fallback-error-${tag}` };
  }
};

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

export const fetchTrendingThreshold = async () => {
  try {
    const adminDoc = await Auth.findOne({ userType: "admin" })
      .select("trendingJobThreshold email")
      .lean();
    if (adminDoc) {
      return {
        value: adminDoc.trendingJobThreshold ?? {
          applicants: 0,
          daysCount: 1,
        },
        adminEmail: adminDoc.email || "unknown",
        _source: "database",
      };
    }
  } catch (err) {
    console.error("[THRESHOLD] DB fetch failed, defaulting to 0:", err.message);
  }
  return {
    value: {
      applicants: 0,
      daysCount: 1,
    }, adminEmail: "N/A", _source: "hardcoded-default"
  };
};

export const logConfig = (W, threshold, label = "RELEVANCY ENGINE") => {
  const total = Object.entries(W)
    .filter(([k]) => k !== "_source")
    .reduce((s, [, v]) => s + (Number(v) || 0), 0);
  const ok =
    total === 100
      ? `${C.green}OK 100${C.reset}`
      : `${C.red}NOT 100 (got ${total})${C.reset}`;

  const rows = [
    ["Skills", W.skills],
    ["Stream", W.stream],
    ["Degree", W.degree],
    ["Job Roles", W.jobRoles],
    ["Experience", W.experience],
    ["CGPA", W.cgpa],
    ["Batch Year", W.batchYear],
    ["Location", W.location],
    ["Salary", W.salary],
    ["Notice Per", W.noticePeriod ?? 0],
    ["Notice Days", W.noticePeriodDays ?? 0],
  ];

  console.log(
    `\n${C.yellow}=====================================================${C.reset}`,
  );
  console.log(`${C.yellow}  ${label}  [source: ${W._source ?? "?"}]${C.reset}`);
  console.log(
    `${C.yellow}=====================================================${C.reset}`,
  );
  for (const [name, val] of rows) {
    console.log(
      `${C.yellow}  ${name.padEnd(14)}: ${String(val + "%").padEnd(10)}${C.reset}`,
    );
  }
  console.log(
    `${C.yellow}  TOTAL       : ${String(total + "%").padEnd(10)}${C.reset} ${ok}`,
  );
  console.log(`${C.yellow}  THRESHOLD   : ${threshold.value}%${C.reset}`);
  console.log(
    `${C.yellow}=====================================================${C.reset}\n`,
  );
};

// ═════════════════════════════════════════════════════════════════════════════
//  scoreJob  —  MAIN SCORING FUNCTION  (v5)
//
//  W is now passed in by the caller (already fetched from DB).
//  The internal profile-type detection is kept only to:
//    • label logs correctly  (PROFESSIONAL / STUDENT)
//    • skip cgpa / batchYear for professionals (enforced by W values being 0)
// ═════════════════════════════════════════════════════════════════════════════

export const scoreJob = (job, student, W, index, label = "Job") => {
  const isProfessional = normStr(student?.profileType) === "professional";
  const profileTag = isProfessional ? "PROFESSIONAL" : "STUDENT/FRESHER";
  console.log(profileTag);

  // Runtime guard
  const weightTotal = Object.entries(W)
    .filter(([k]) => k !== "_source")
    .reduce((sum, [, v]) => sum + (Number(v) || 0), 0);
  if (weightTotal !== 100) {
    console.warn(
      `[WARN] Weight map for ${profileTag} sums to ${weightTotal}, not 100. ` +
      `Scores will be proportionally off.`,
    );
  }

  const breakdown = {
    skills: 0,
    roles: 0,
    experience: 0,
    cgpa: 0,
    batchYear: 0,
    location: 0,
    degree: 0,
    stream: 0,
    salary: 0,
    noticePeriod: 0,
    noticePeriodDays: 0,
  };

  const primaryEdu =
    (student.educations || []).find(
      (e) => e.educationType === "bachelors" || e.educationType === "masters",
    ) ||
    student.educations?.[0] ||
    {};

  const posterName =
    job.candidatePosted?.name ||
    job.companyPosted?.companyDetails?.companyName ||
    "Unknown";

  const jobTitleRaw = Array.isArray(job.jobTitle)
    ? job.jobTitle.join(" ")
    : job.jobTitle || "";
  const jobTitleNorm = normStr(jobTitleRaw);

  const fullJobText = (
    (job.description || "") +
    " " +
    (job.eligibilityCriteria || "")
  ).toLowerCase();

  process.stdout.write(
    `[SCOREJOB] #${index + 1} | title="${jobTitleRaw}" | student="${student?.name}" | type=${profileTag} | weights_source=${W._source ?? "?"}\n`,
  );
  console.log(
    `\n${C.bold}${C.cyan}----  ${label} #${index + 1}  [${profileTag}]  ` +
    `------------------------------------${C.reset}`,
  );
  console.log(`  Title     : ${JSON.stringify(job.jobTitle)}`);
  console.log(`  Poster    : ${posterName}`);
  console.log(
    `  Student   : ${student?.name || "?"} <${student?.email || "?"}>`,
  );
  console.log(`  Profile   : ${profileTag}  [weights: ${W._source ?? "?"}]`);
  console.log(
    `  Edu       : degree="${primaryEdu.degree}"  spec="${primaryEdu.specialization}"` +
    `  cgpa=${primaryEdu.cgpa}  grad=${primaryEdu.yearOfGraduation}`,
  );
  console.log(
    `  Weights   : skills=${W.skills} stream=${W.stream} degree=${W.degree}` +
    ` roles=${W.jobRoles} exp=${W.experience} cgpa=${W.cgpa} batch=${W.batchYear}` +
    ` salary=${W.salary} location=${W.location}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  1. SKILLS  +  GATE
  // ══════════════════════════════════════════════════════════════════════════
  const jobSkillsRaw = job.skills || [];
  const jobSkillsNorm = jobSkillsRaw.map(normStr);
  const studentSkillsNorm = (student.skills || []).map(normStr);

  console.log(`\n${DIM.SKILLS}`);
  console.log(
    `  Job skills     (${jobSkillsNorm.length})  : [${jobSkillsRaw.join(", ") || "none"}]`,
  );
  console.log(
    `  Student skills (${studentSkillsNorm.length}) : [${(student.skills || []).join(", ") || "none"}]`,
  );

  let skillMatchPct = 100;
  let skillScore = W.skills;

  if (jobSkillsNorm.length > 0) {
    const matched = jobSkillsNorm.filter((s) => studentSkillsNorm.includes(s));
    const softMatched = jobSkillsNorm.filter(
      (s) =>
        !matched.includes(s) &&
        studentSkillsNorm.some(
          (studentSkill) =>
            studentSkill.includes(s) || s.includes(studentSkill),
        ),
    );
    const allMatched = [...matched, ...softMatched];
    const missed = jobSkillsNorm.filter((s) => !allMatched.includes(s));

    skillMatchPct = (allMatched.length / jobSkillsNorm.length) * 100;
    skillScore = Math.round(
      (allMatched.length / jobSkillsNorm.length) * W.skills,
    );

    console.log(`  Direct match   : [${matched.join(", ") || "none"}]`);
    console.log(`  Soft match     : [${softMatched.join(", ") || "none"}]`);
    console.log(`  Missed         : [${missed.join(", ") || "none"}]`);
    console.log(`  Match %        : ${skillMatchPct.toFixed(1)} %`);
  } else {
    console.log(`  No skills listed on job → 100 % match by default`);
  }

  console.log(`\n${DIM.GATE}`);
  let gateMultiplier;

  if (jobSkillsNorm.length > 0 && skillMatchPct < 30) {
    console.log(
      `  ${C.red}HARD REJECT: skill match ${skillMatchPct.toFixed(1)}% < 30% → final score = 0${C.reset}`,
    );
    printSummary(breakdown, W, 0, 0, profileTag, 0);
    return {
      ...job,
      matchScore: 0,
      companyName: posterName,
      _scoreBreakdown: { ...breakdown },
      _profileType: profileTag,
      _gateMultiplier: 0,
      _skillMatchPct: parseFloat(skillMatchPct.toFixed(1)),
    };
  } else if (jobSkillsNorm.length > 0 && skillMatchPct < 50) {
    gateMultiplier = 0.5;
    console.log(
      `  ${C.yellow}PENALTY: skill match ${skillMatchPct.toFixed(1)}% in [30, 50) → all dimensions x0.50${C.reset}`,
    );
  } else {
    gateMultiplier = 1.0;
    console.log(
      `  ${C.green}PASS: skill match ${skillMatchPct.toFixed(1)}%` +
      (jobSkillsNorm.length === 0 ? " (no skills listed)" : " >= 50%") +
      ` → normal scoring${C.reset}`,
    );
  }

  breakdown.skills = skillScore;
  console.log(`  Skills score   : ${ss(breakdown.skills, W.skills)}`);

  // ══════════════════════════════════════════════════════════════════════════
  //  2. STREAM
  // ══════════════════════════════════════════════════════════════════════════
  const studentStreamNorm = normStr(
    primaryEdu.specialization || student.specialization || "",
  );
  const jobStreamsNorm = (job.studentStreams || []).map(normStr);

  console.log(`\n${DIM.STREAM}`);
  console.log(`  Student stream : "${studentStreamNorm}"`);
  console.log(`  Job streams    : [${jobStreamsNorm.join(", ") || "none"}]`);

  let rawStreamScore = 0;
  let streamNote = "";

  if (jobStreamsNorm.length === 0) {
    rawStreamScore = W.stream;
    streamNote = "no requirement → full credit";
  } else if (studentStreamNorm && jobStreamsNorm.includes(studentStreamNorm)) {
    rawStreamScore = W.stream;
    streamNote = `exact match "${studentStreamNorm}"`;
  } else if (
    studentStreamNorm &&
    sameGroup(studentStreamNorm, jobStreamsNorm, STREAM_GROUPS)
  ) {
    rawStreamScore = Math.round(W.stream * PARTIAL.streamRelated);
    const grp = findGroup(studentStreamNorm, STREAM_GROUPS);
    streamNote =
      `related group → ${PARTIAL.streamRelated * 100}% of ${W.stream}` +
      ` (e.g. [${grp?.slice(0, 5).join(", ")}...])`;
  } else {
    rawStreamScore = 0;
    streamNote = "no match";
  }

  breakdown.stream = Math.round(rawStreamScore * gateMultiplier);
  console.log(`  ${streamNote}`);
  console.log(
    `  Stream score (x${gateMultiplier}) : ${ss(breakdown.stream, W.stream)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  3. DEGREE
  // ══════════════════════════════════════════════════════════════════════════
  const studentDegreeNorm = normStr(primaryEdu.degree || student.degree || "");
  const jobDegreesNorm = (job.degree || []).map(normStr);
  const degreeKeywords = [
    "btech",
    "be",
    "bsc",
    "mtech",
    "mca",
    "mba",
    "bca",
    "bcom",
    "ba",
    "bba",
    "pgdm",
  ];

  console.log(`\n${DIM.DEGREE}`);
  console.log(`  Student degree : "${studentDegreeNorm}"`);
  console.log(`  Job degrees    : [${jobDegreesNorm.join(", ") || "none"}]`);

  let rawDegreeScore = 0;
  let degreeNote = "";

  if (jobDegreesNorm.length === 0) {
    const anyInText = degreeKeywords.some((d) => fullJobText.includes(d));
    if (!anyInText) {
      rawDegreeScore = W.degree;
      degreeNote = "no degree field + no keywords in JD → full credit";
    } else if (studentDegreeNorm && fullJobText.includes(studentDegreeNorm)) {
      rawDegreeScore = W.degree;
      degreeNote = `"${studentDegreeNorm}" found in JD → full credit`;
    } else {
      rawDegreeScore = Math.round(W.degree * PARTIAL.degreeInTextOnly);
      degreeNote = `degree keywords in JD but student not matched → ${PARTIAL.degreeInTextOnly * 100}% of ${W.degree}`;
    }
  } else if (studentDegreeNorm && jobDegreesNorm.includes(studentDegreeNorm)) {
    rawDegreeScore = W.degree;
    degreeNote = "exact match";
  } else if (
    studentDegreeNorm &&
    sameGroup(studentDegreeNorm, jobDegreesNorm, DEGREE_GROUPS)
  ) {
    rawDegreeScore = Math.round(W.degree * PARTIAL.degreeRelated);
    const grp = findGroup(studentDegreeNorm, DEGREE_GROUPS);
    degreeNote =
      `related degree group → ${PARTIAL.degreeRelated * 100}% of ${W.degree}` +
      ` (e.g. [${grp?.slice(0, 5).join(", ")}...])`;
  } else {
    rawDegreeScore = 0;
    degreeNote = "no match";
  }

  breakdown.degree = Math.round(rawDegreeScore * gateMultiplier);
  console.log(`  ${degreeNote}`);
  console.log(
    `  Degree score (x${gateMultiplier}) : ${ss(breakdown.degree, W.degree)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  4. JOB ROLES
  // ══════════════════════════════════════════════════════════════════════════
  const studentRolesNorm = (student.jobRoles || []).map(normStr);
  const jobRolesNorm = (job.jobRoles || []).map(normStr);
  const allJobRoles = jobTitleNorm
    ? [...new Set([...jobRolesNorm, jobTitleNorm])]
    : jobRolesNorm;

  console.log(`\n${DIM.ROLES}`);
  console.log(`  Job roles+title : [${allJobRoles.join(", ") || "none"}]`);
  console.log(`  Student roles   : [${studentRolesNorm.join(", ") || "none"}]`);

  let rawRoleScore = 0;

  if (allJobRoles.length === 0) {
    rawRoleScore = W.jobRoles;
    console.log(`  No roles requirement → full credit`);
  } else {
    const exactMatched = studentRolesNorm.filter((r) =>
      allJobRoles.includes(r),
    );

    if (exactMatched.length > 0) {
      rawRoleScore = Math.min(
        Math.round((exactMatched.length / allJobRoles.length) * W.jobRoles),
        W.jobRoles,
      );
      console.log(
        `  Exact match [${exactMatched.join(", ")}]  ${exactMatched.length}/${allJobRoles.length}`,
      );
    } else if (gateMultiplier === 1.0) {
      rawRoleScore = Math.round(W.jobRoles * PARTIAL.roleNoSkillMatch);
      console.log(
        `  No role match but skills >= 50% → ${PARTIAL.roleNoSkillMatch * 100}% of role weight (${rawRoleScore}/${W.jobRoles})`,
      );
    } else {
      const softMatch = studentRolesNorm.some(
        (r) => jobTitleNorm.includes(r) || fullJobText.includes(r),
      );
      rawRoleScore = softMatch
        ? Math.round(W.jobRoles * PARTIAL.rolesSoftMatch)
        : 0;
      console.log(
        `  Penalty zone — soft match: ${softMatch}  raw=${rawRoleScore}`,
      );
    }
  }

  breakdown.roles = Math.round(rawRoleScore * gateMultiplier);
  console.log(
    `  Roles score (x${gateMultiplier}) : ${ss(breakdown.roles, W.jobRoles)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  5. EXPERIENCE
  // ══════════════════════════════════════════════════════════════════════════
  const studentExpYears =
    parseYearsFromString(student.totalYearsOfExperience) ||
    calcExperienceYears(student.experiences || []);

  const expRangeRaw = job.yearsOfExperience || "";
  let { min: expMin, max: expMax } = parseExpRange(expRangeRaw);

  if (expMin === 0 && expMax === 0) {
    const rangeInText = fullJobText.match(
      /([0-9]+(?:\.[0-9]+)?)\s*(?:-|to)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:years?|yrs?)/i,
    );
    if (rangeInText) {
      expMin = parseFloat(rangeInText[1]);
      expMax = parseFloat(rangeInText[2]);
    } else {
      const minInText = fullJobText.match(
        /([0-9]+(?:\.[0-9]+)?)\s*(?:\+\s*)?years?\s*(?:of\s*)?(?:experience|exp)/i,
      );
      if (minInText) expMin = parseFloat(minInText[1]);
    }
  }

  console.log(`\n${DIM.EXP}`);
  console.log(`  Student exp    : ${studentExpYears.toFixed(2)} yrs`);
  console.log(
    `  Job range      : "${expRangeRaw}" → min=${expMin}  max=${expMax > 0 ? expMax : "open"}`,
  );

  let rawExpScore = 0;
  let expNote = "";

  if (expMin === 0 && expMax === 0) {
    rawExpScore = W.experience;
    expNote = "no experience requirement → full credit";
  } else if (expMax > 0) {
    if (studentExpYears >= expMin && studentExpYears <= expMax) {
      rawExpScore = W.experience;
      expNote = `within range [${expMin}-${expMax}] → 100%`;
    } else if (studentExpYears > expMax) {
      const overPct = ((studentExpYears - expMax) / expMax) * 100;
      if (overPct <= 20) {
        rawExpScore = Math.round(W.experience * 0.75);
        expNote = `above max ${expMax} by ${overPct.toFixed(1)}% (<=20%) → 75%`;
      } else {
        rawExpScore = Math.round(W.experience * 0.15);
        expNote = `above max ${expMax} by ${overPct.toFixed(1)}% (>20%) → 15%`;
      }
    } else {
      const underPct = ((expMin - studentExpYears) / expMin) * 100;
      if (underPct <= 20) {
        rawExpScore = Math.round(W.experience * 0.75);
        expNote = `below min ${expMin} by ${underPct.toFixed(1)}% (<=20%) → 75%`;
      } else {
        rawExpScore = Math.round(W.experience * 0.15);
        expNote = `below min ${expMin} by ${underPct.toFixed(1)}% (>20%) → 15%`;
      }
    }
  } else {
    if (studentExpYears >= expMin) {
      rawExpScore = W.experience;
      expNote = `meets open-ended min ${expMin} → 100%`;
    } else {
      const underPct =
        expMin > 0 ? ((expMin - studentExpYears) / expMin) * 100 : 0;
      if (underPct <= 20) {
        rawExpScore = Math.round(W.experience * 0.75);
        expNote = `below open min ${expMin} by ${underPct.toFixed(1)}% (<=20%) → 75%`;
      } else {
        rawExpScore = Math.round(W.experience * 0.15);
        expNote = `below open min ${expMin} by ${underPct.toFixed(1)}% (>20%) → 15%`;
      }
    }
  }

  breakdown.experience = Math.round(rawExpScore * gateMultiplier);
  console.log(`  ${expNote}`);
  console.log(
    `  Exp score (x${gateMultiplier}) : ${ss(breakdown.experience, W.experience)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  6. SALARY
  // ══════════════════════════════════════════════════════════════════════════
  const sExpSalary = Number(student.expectedSalaryAmount) || 0;
  const jSalary = Number(job.packageDetails?.totalCTC) || 0;

  console.log(`\n${DIM.SALARY}`);
  console.log(`  Student expected : ${sExpSalary || "not set"}`);
  console.log(`  Job CTC          : ${jSalary || "not set"}`);

  let rawSalaryScore = 0;
  let salaryNote = "";

  if (sExpSalary === 0 || jSalary === 0) {
    rawSalaryScore = W.salary;
    salaryNote = "missing salary data → full credit";
  } else if (jSalary >= sExpSalary) {
    rawSalaryScore = W.salary;
    salaryNote = `job CTC ${jSalary} >= expected ${sExpSalary} → full credit`;
  } else {
    const ratio = jSalary / sExpSalary;
    rawSalaryScore = Math.round(W.salary * ratio);
    salaryNote = `job CTC ${jSalary} < expected ${sExpSalary}  ratio=${ratio.toFixed(2)} → proportional`;
  }

  breakdown.salary = Math.round(rawSalaryScore * gateMultiplier);
  console.log(`  ${salaryNote}`);
  console.log(
    `  Salary score (x${gateMultiplier}) : ${ss(breakdown.salary, W.salary)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  7. LOCATION
  // ══════════════════════════════════════════════════════════════════════════
  const studentLocsNorm = (student.locations || []).map(normStr);
  const allJobLocsNorm = [...(job.workLocation || []), ...(job.location || [])]
    .map(normStr)
    .filter((v, i, a) => a.indexOf(v) === i);
  const isRemote = (job.workMode || []).some((m) =>
    normStr(m).includes("remote"),
  );

  console.log(`\n${DIM.LOC}`);
  console.log(`  Student locs : [${studentLocsNorm.join(", ") || "none"}]`);
  console.log(
    `  Job locs     : [${allJobLocsNorm.join(", ") || "none"}]  isRemote=${isRemote}`,
  );

  let rawLocScore = 0;
  let locNote = "";

  if (isRemote) {
    rawLocScore = W.location;
    locNote = "remote role → full credit";
  } else if (allJobLocsNorm.length === 0 && !job.city && !job.venue) {
    rawLocScore = W.location;
    locNote = "no location specified → full credit";
  } else {
    const matchedLocs = studentLocsNorm.filter(
      (l) =>
        allJobLocsNorm.includes(l) ||
        normStr(job.city || "") === l ||
        normStr(job.venue || "").includes(l),
    );
    rawLocScore = matchedLocs.length > 0 ? W.location : 0;
    locNote =
      matchedLocs.length > 0
        ? `matched [${matchedLocs.join(", ")}]`
        : `no overlap`;
  }

  breakdown.location = Math.round(rawLocScore * gateMultiplier);
  console.log(`  ${locNote}`);
  console.log(
    `  Location score (x${gateMultiplier}) : ${ss(breakdown.location, W.location)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  8. CGPA  — weight is 0 for professionals (enforced in DB/fallback map)
  // ══════════════════════════════════════════════════════════════════════════
  console.log(`\n${DIM.CGPA}`);

  if (isProfessional || W.cgpa === 0) {
    breakdown.cgpa = 0;
    console.log(`  Skipped — professional profile or W.cgpa = 0`);
  } else {
    const sCGPA = parseFloat(primaryEdu.cgpa || student.cgpa) || 0;
    const requiredCGPA = parseFloat(job.cgpa) || 0;
    const cgpaRegex =
      /(?:cgpa|cut-off|cutoff|minimum\s+cgpa|min\s+cgpa)\s*[:>=]*\s*([0-9](?:\.[0-9]{1,2})?)\b/i;
    const effectiveCGPA =
      requiredCGPA > 0
        ? requiredCGPA
        : (() => {
          const m = fullJobText.match(cgpaRegex);
          return m ? parseFloat(m[1]) : 0;
        })();

    console.log(
      `  Student CGPA : ${sCGPA}  |  Required : ${effectiveCGPA || "none"}`,
    );

    let rawCgpaScore = 0;
    if (effectiveCGPA === 0) {
      rawCgpaScore = W.cgpa;
      console.log(`  No CGPA requirement → full credit`);
    } else if (sCGPA >= effectiveCGPA) {
      rawCgpaScore = W.cgpa;
      console.log(`  ${sCGPA} >= ${effectiveCGPA} → full credit`);
    } else {
      rawCgpaScore = 0;
      console.log(`  ${sCGPA} < ${effectiveCGPA} → fail (0)`);
    }
    breakdown.cgpa = Math.round(rawCgpaScore * gateMultiplier);
    console.log(
      `  CGPA score (x${gateMultiplier}) : ${ss(breakdown.cgpa, W.cgpa)}`,
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  9. BATCH YEAR  — weight is 0 for professionals
  // ══════════════════════════════════════════════════════════════════════════
  console.log(`\n${DIM.BATCH}`);

  if (isProfessional || W.batchYear === 0) {
    breakdown.batchYear = 0;
    console.log(`  Skipped — professional profile or W.batchYear = 0`);
  } else {
    const studentYearNorm = normStr(
      primaryEdu.yearOfGraduation || student.yearOfGraduation || "",
    );
    const yearRegex = /\b(20[12][0-9]|2030)\b/g;
    const yearMatches = [...fullJobText.matchAll(yearRegex)].map((m) => m[1]);

    console.log(`  Student grad year : "${studentYearNorm}"`);
    console.log(`  Years in JD       : [${yearMatches.join(", ") || "none"}]`);

    let rawBatchScore = 0;
    if (yearMatches.length === 0) {
      rawBatchScore = W.batchYear;
      console.log(`  No batch requirement in JD → full credit`);
    } else if (studentYearNorm && yearMatches.includes(studentYearNorm)) {
      rawBatchScore = W.batchYear;
      console.log(`  "${studentYearNorm}" matched in JD → full credit`);
    } else {
      rawBatchScore = 0;
      console.log(
        `  "${studentYearNorm}" not in [${yearMatches.join(", ")}] → fail`,
      );
    }
    breakdown.batchYear = Math.round(rawBatchScore * gateMultiplier);
    console.log(
      `  Batch score (x${gateMultiplier}) : ${ss(breakdown.batchYear, W.batchYear)}`,
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  10. NOTICE PERIOD
  // ══════════════════════════════════════════════════════════════════════════
  const studentNoticePeriodRaw = student.noticePeriod || "";
  const isServingNotice = student.servingNoticePeriod === true;
  const noticePeriodStartDateRaw = student.noticePeriodStartDate || "";

  const totalNoticeDays = parseNoticeDays(studentNoticePeriodRaw);
  const effectiveNoticeDays = isServingNotice
    ? calcRemainingDays(noticePeriodStartDateRaw, totalNoticeDays)
    : totalNoticeDays;

  const immediateRegex =
    /\b(immediate\s*joiner|immediate\s*joining|join\s*immediately)\b/i;
  const maxNoticeRegex =
    /(?:max(?:imum)?|within|up\s*to)\s*([0-9]+)\s*(?:day|d)\b/i;
  const noticeFieldRegex = /notice\s*period[:\s]*([0-9]+)\s*(?:day|d)\b/i;
  const jobRequiresImmediate = immediateRegex.test(fullJobText);
  const maxNoticeMatch =
    fullJobText.match(maxNoticeRegex) || fullJobText.match(noticeFieldRegex);
  const jobMaxNoticeDays = maxNoticeMatch
    ? parseInt(maxNoticeMatch[1], 10)
    : null;

  console.log(`\n${DIM.NOTICE}`);
  console.log(
    `  Student notice : "${studentNoticePeriodRaw}"  serving=${isServingNotice}` +
    `  effectiveDays=${effectiveNoticeDays ?? "N/A"}`,
  );
  console.log(
    `  Job immediate  : ${jobRequiresImmediate}  jobMaxDays=${jobMaxNoticeDays ?? "not specified"}`,
  );

  let rawNoticeScore = 0;

  if ((W.noticePeriod ?? 0) === 0) {
    rawNoticeScore = 0;
    console.log(`  Notice weight = 0 (disabled) — skipped`);
  } else if (isServingNotice) {
    rawNoticeScore = W.noticePeriod;
    console.log(`  Serving notice → full credit`);
  } else if (jobRequiresImmediate) {
    if (
      effectiveNoticeDays === 0 ||
      (effectiveNoticeDays === null && !studentNoticePeriodRaw)
    ) {
      rawNoticeScore = W.noticePeriod;
      console.log(`  Immediate match (0 days / no notice)`);
    } else if (effectiveNoticeDays !== null && effectiveNoticeDays <= 15) {
      rawNoticeScore = Math.round(W.noticePeriod * 0.5);
      console.log(`  Near-immediate (${effectiveNoticeDays}d <= 15) → 50%`);
    } else {
      rawNoticeScore = 0;
      console.log(
        `  Fails immediate requirement (${effectiveNoticeDays ?? "unknown"} days)`,
      );
    }
  } else if (jobMaxNoticeDays !== null) {
    if (effectiveNoticeDays === null) {
      rawNoticeScore = Math.round(W.noticePeriod * 0.5);
      console.log(`  Days unknown → 50% partial`);
    } else if (effectiveNoticeDays <= jobMaxNoticeDays) {
      rawNoticeScore = W.noticePeriod;
      console.log(
        `  ${effectiveNoticeDays}d <= max ${jobMaxNoticeDays}d → full credit`,
      );
    } else {
      const ratio = jobMaxNoticeDays / effectiveNoticeDays;
      rawNoticeScore = Math.round(W.noticePeriod * ratio);
      console.log(
        `  ${effectiveNoticeDays}d > max ${jobMaxNoticeDays}d  ratio=${ratio.toFixed(2)}`,
      );
    }
  } else {
    rawNoticeScore = W.noticePeriod;
    console.log(`  No requirement → full credit`);
  }

  breakdown.noticePeriod = Math.round(rawNoticeScore * gateMultiplier);
  console.log(
    `  Notice score (x${gateMultiplier}) : ${ss(breakdown.noticePeriod, W.noticePeriod ?? 0)}`,
  );

  let rawNoticeDaysScore = 0;
  let noticeDaysTier = "weight=0, skipped";

  if ((W.noticePeriodDays ?? 0) > 0) {
    if (effectiveNoticeDays === null) {
      rawNoticeDaysScore = Math.round((W.noticePeriodDays ?? 0) * 0.5);
      noticeDaysTier = "unknown → 50%";
    } else if (effectiveNoticeDays <= 15) {
      rawNoticeDaysScore = W.noticePeriodDays ?? 0;
      noticeDaysTier = `0-15d (${effectiveNoticeDays}d) → 100%`;
    } else if (effectiveNoticeDays <= 30) {
      rawNoticeDaysScore = Math.round((W.noticePeriodDays ?? 0) * 0.75);
      noticeDaysTier = `16-30d (${effectiveNoticeDays}d) → 75%`;
    } else if (effectiveNoticeDays <= 45) {
      rawNoticeDaysScore = Math.round((W.noticePeriodDays ?? 0) * 0.5);
      noticeDaysTier = `31-45d (${effectiveNoticeDays}d) → 50%`;
    } else if (effectiveNoticeDays <= 90) {
      rawNoticeDaysScore = Math.round((W.noticePeriodDays ?? 0) * 0.25);
      noticeDaysTier = `46-90d (${effectiveNoticeDays}d) → 25%`;
    } else {
      rawNoticeDaysScore = 0;
      noticeDaysTier = `>90d (${effectiveNoticeDays}d) → 0%`;
    }
  }

  breakdown.noticePeriodDays = Math.round(rawNoticeDaysScore * gateMultiplier);
  console.log(
    `  NoticeDays : ${noticeDaysTier}  ` +
    `${ss(breakdown.noticePeriodDays, W.noticePeriodDays ?? 0)}`,
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  FINAL TOTAL
  // ══════════════════════════════════════════════════════════════════════════
  const rawTotal =
    breakdown.skills +
    breakdown.roles +
    breakdown.experience +
    breakdown.cgpa +
    breakdown.batchYear +
    breakdown.location +
    breakdown.degree +
    breakdown.stream +
    breakdown.salary +
    breakdown.noticePeriod +
    breakdown.noticePeriodDays;

  const totalScore = Math.min(rawTotal, 100);

  printSummary(breakdown, W, rawTotal, totalScore, profileTag, gateMultiplier);

  return {
    ...job,
    matchScore: totalScore,
    companyName: posterName,
    _scoreBreakdown: breakdown,
    _profileType: profileTag,
    _gateMultiplier: gateMultiplier,
    _skillMatchPct: parseFloat(skillMatchPct.toFixed(1)),
  };
};
