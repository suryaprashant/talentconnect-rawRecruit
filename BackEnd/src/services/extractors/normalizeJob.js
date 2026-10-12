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
  source: "ats_api",
});

const scalar = (v) =>
  typeof v === "string" && v.trim()
    ? v
        .replace(/\u0000/g, "")
        .trim()
        .slice(0, 30000)
    : null;
const arr = (v) =>
  Array.isArray(v)
    ? [
        ...new Set(
          v
            .filter((x) => typeof x === "string" && x.trim())
            .map((x) => x.trim().slice(0, 300))
            .slice(0, 100),
        ),
      ]
    : [];
const enumEmployment = (v) =>
  ["full_time", "part_time", "contract", "internship"].includes(v) ? v : null;
const enumMode = (v) => (["remote", "onsite", "hybrid"].includes(v) ? v : null);
const date = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
};
const num = (v) => {
  if (typeof v === "number") return Number.isFinite(v) && v >= 0 ? v : null;
  if (
    typeof v === "string" &&
    v.trim() &&
    Number.isFinite(Number(v)) &&
    Number(v) >= 0
  )
    return v.trim();
  return null;
};

export function normalizeJob(input = {}, source) {
  const rawLoc = input.location;
  const location =
    rawLoc && typeof rawLoc === "object"
      ? { state: scalar(rawLoc.state), city: scalar(rawLoc.city) }
      : typeof rawLoc === "string" && rawLoc.trim()
        ? { state: null, city: scalar(rawLoc) }
        : null;
  const rawSalary =
    input.salary && typeof input.salary === "object" ? input.salary : null;
  const salary = rawSalary
    ? {
        currency: scalar(rawSalary.currency),
        totalCTC: num(rawSalary.totalCTC),
        fixedPay: num(rawSalary.fixedPay),
        variablePay: num(rawSalary.variablePay),
      }
    : null;
  const allowedSource = ["ats_api", "jsonld", "opengraph", "gemini"].includes(
    source || input.source,
  )
    ? source || input.source
    : "ats_api";
  return {
    title: scalar(input.title),
    company: scalar(input.company),
    location,
    employmentType: enumEmployment(input.employmentType),
    workMode: enumMode(input.workMode),
    experienceRequired: scalar(input.experienceRequired),
    applicationDeadline: date(input.applicationDeadline),
    requiredSkills: arr(input.requiredSkills),
    degree: arr(input.degree),
    certifications: arr(input.certifications),
    benefits: arr(input.benefits),
    eligibilityCriteria: scalar(input.eligibilityCriteria),
    description: scalar(input.description),
    salary,
    confidence: Math.max(
      0,
      Math.min(
        1,
        Number.isFinite(Number(input.confidence))
          ? Number(input.confidence)
          : 0,
      ),
    ),
    source: allowedSource,
  };
}
export function mergeJob(base, next) {
  const out = { ...base };
  for (const key of Object.keys(out)) {
    if (key === "confidence" || key === "source") continue;
    const current = out[key],
      incoming = next?.[key];
    const empty =
      current == null ||
      current === "" ||
      (Array.isArray(current) && !current.length);
    if (!empty) continue;
    if (
      incoming == null ||
      incoming === "" ||
      (Array.isArray(incoming) && !incoming.length)
    )
      continue;
    out[key] = incoming;
  }
  out.confidence = Math.max(base.confidence || 0, next?.confidence || 0);
  if (next?.confidence > (base.confidence || 0))
    out.source = next.source || base.source;
  return out;
}
export function usefulFieldCount(job) {
  return (
    [
      "title",
      "company",
      "description",
      "eligibilityCriteria",
      "experienceRequired",
      "employmentType",
      "workMode",
      "applicationDeadline",
    ].filter((k) => Boolean(job[k])).length +
    ["requiredSkills", "degree", "certifications", "benefits"].filter(
      (k) => job[k]?.length,
    ).length
  );
}
