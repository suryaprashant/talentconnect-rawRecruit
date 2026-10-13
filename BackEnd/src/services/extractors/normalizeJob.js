// Single source of truth for the job shape returned to the frontend.
export const SOURCES = ["jsonld", "opengraph", "gemini"];

export const EMPTY_JOB = Object.freeze({
  title: null,
  company: null,
  location: null,
  employmentType: null,
  workMode: null,
  experienceRequired: null,
  applicationDeadline: null,
  requiredSkills: [],
  degree: [],
  certifications: [],
  benefits: [],
  eligibilityCriteria: null,
  description: null,
  salary: null,
  confidence: 0,
  source: null,
});

const SCALAR_MAX = 30000;

const scalar = (v, max = SCALAR_MAX) => {
  if (typeof v === "number" && Number.isFinite(v)) v = String(v);
  if (typeof v !== "string") return null;
  const s = v.replace(/\u0000/g, "").trim();
  return s ? s.slice(0, max) : null;
};

const arr = (v) =>
  Array.isArray(v)
    ? [
        ...new Set(
          v
            .filter((x) => typeof x === "string" && x.trim())
            .map((x) => x.trim().slice(0, 300)),
        ),
      ].slice(0, 100)
    : [];

const EMPLOYMENT = ["full_time", "part_time", "contract", "internship"];
const MODES = ["remote", "onsite", "hybrid"];

const date = (v) => {
  if (!v) return null;
  const d = new Date(v);
  const t = d.getTime();
  if (!Number.isFinite(t)) return null;
  const year = d.getUTCFullYear();
  if (year < 2000 || year > new Date().getUTCFullYear() + 5) return null;
  return d.toISOString();
};

const num = (v) => {
  if (typeof v === "string" && v.trim() !== "") v = Number(v.replace(/,/g, ""));
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
};

export function normalizeEmployment(v) {
  if (EMPLOYMENT.includes(v)) return v;
  const s = String(v ?? "").toLowerCase();
  if (!s) return null;
  if (/intern|trainee|apprentice/.test(s)) return "internship";
  if (/part[\s_-]?time/.test(s)) return "part_time";
  if (/contract|temporary|temp\b|freelance|consult/.test(s)) return "contract";
  if (/full[\s_-]?time|permanent|regular/.test(s)) return "full_time";
  return null;
}

export function normalizeWorkMode(v) {
  if (MODES.includes(v)) return v;
  if (v === true) return "remote";
  const s = String(v ?? "").toLowerCase();
  if (!s) return null;
  if (/hybrid/.test(s)) return "hybrid";
  if (/remote|work from home|telecommut|wfh/.test(s)) return "remote";
  if (/on[\s_-]?site|in[\s_-]?office|office/.test(s)) return "onsite";
  return null;
}

/**
 * Salary helper used by deterministic parsers.
 * The form only has totalCTC / fixedPay / variablePay, so a plain range is
 * stored as totalCTC = upper bound (annualised). Non-annual units that cannot
 * be converted safely (hourly/daily) are dropped instead of being stored as if
 * they were yearly numbers.
 */
export function salaryFromRange({ min, max, currency, interval } = {}) {
  const unit = String(interval ?? "year").toLowerCase();
  let factor = 1;
  if (/month/.test(unit)) factor = 12;
  else if (/week|day|hour/.test(unit)) return null;
  const hi = num(max) ?? num(min);
  if (hi == null) return null;
  return {
    currency: scalar(currency, 8),
    totalCTC: Math.round(hi * factor),
    fixedPay: null,
    variablePay: null,
  };
}

export function normalizeJob(input = {}, source) {
  const rawLoc = input.location;
  let location = null;
  if (rawLoc && typeof rawLoc === "object" && !Array.isArray(rawLoc)) {
    const state = scalar(rawLoc.state, 200);
    const city = scalar(rawLoc.city, 200);
    location = state || city ? { state, city } : null;
  } else if (typeof rawLoc === "string" && rawLoc.trim()) {
    location = { state: null, city: scalar(rawLoc, 200) };
  }

  let salary = null;
  if (
    input.salary &&
    typeof input.salary === "object" &&
    !Array.isArray(input.salary)
  ) {
    const s = {
      currency: scalar(input.salary.currency, 8),
      totalCTC: num(input.salary.totalCTC),
      fixedPay: num(input.salary.fixedPay),
      variablePay: num(input.salary.variablePay),
    };
    salary =
      s.totalCTC != null || s.fixedPay != null || s.variablePay != null
        ? s
        : null;
  }

  const wanted = source || input.source;
  const conf = Number(input.confidence);

  return {
    title: scalar(input.title, 300),
    company: scalar(input.company, 300),
    location,
    employmentType: normalizeEmployment(input.employmentType),
    workMode: normalizeWorkMode(input.workMode),
    experienceRequired: scalar(input.experienceRequired, 300),
    applicationDeadline: date(input.applicationDeadline),
    requiredSkills: arr(input.requiredSkills),
    degree: arr(input.degree),
    certifications: arr(input.certifications),
    benefits: arr(input.benefits),
    eligibilityCriteria: scalar(input.eligibilityCriteria),
    description: scalar(input.description),
    salary,
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : 0,
    source: SOURCES.includes(wanted) ? wanted : null,
  };
}

export function isEmptyValue(v) {
  if (v == null || v === "") return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.values(v).every(isEmptyValue);
  return false;
}

const META = new Set(["confidence", "source"]);

function mergeValue(a, b, primaryWins) {
  const aObj = a && typeof a === "object" && !Array.isArray(a);
  const bObj = b && typeof b === "object" && !Array.isArray(b);
  if (aObj || bObj) {
    const out = { ...(bObj ? b : {}), ...(aObj ? a : {}) };
    for (const k of new Set([
      ...Object.keys(aObj ? a : {}),
      ...Object.keys(bObj ? b : {}),
    ])) {
      out[k] = mergeValue(
        aObj ? a[k] : undefined,
        bObj ? b[k] : undefined,
        primaryWins,
      );
    }
    return out;
  }
  return isEmptyValue(a) ? (b ?? a ?? null) : a;
}

/** Fill gaps in `base` from `next` (base wins when it has a value). */
export function mergeJob(base, next) {
  const out = { ...base };
  for (const key of Object.keys(out)) {
    if (META.has(key)) continue;
    out[key] = mergeValue(base?.[key], next?.[key]);
    if (out[key] === undefined) out[key] = base?.[key] ?? null;
  }
  out.confidence = Math.max(base?.confidence || 0, next?.confidence || 0);
  if ((next?.confidence || 0) > (base?.confidence || 0))
    out.source = next.source || base.source;
  return out;
}

/** Same as mergeJob but `primary` wins; `fallback` only fills what primary left empty. */
export function preferPrimary(primary, fallback) {
  const merged = mergeJob(primary, fallback);
  merged.confidence = primary?.confidence ?? merged.confidence;
  merged.source = primary?.source ?? merged.source;
  return merged;
}

const USEFUL_SCALARS = [
  "title",
  "company",
  "description",
  "eligibilityCriteria",
  "experienceRequired",
  "employmentType",
  "workMode",
  "applicationDeadline",
];
const USEFUL_ARRAYS = [
  "requiredSkills",
  "degree",
  "certifications",
  "benefits",
];

export function usefulFieldCount(job = {}) {
  return (
    USEFUL_SCALARS.filter((k) => !isEmptyValue(job[k])).length +
    USEFUL_ARRAYS.filter((k) => job[k]?.length).length
  );
}
