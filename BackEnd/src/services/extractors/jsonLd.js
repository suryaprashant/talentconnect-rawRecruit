import * as cheerio from "cheerio";
import { htmlToText } from "./text.js";
import { normalizeJob, normalizeEmployment, salaryFromRange } from "./normalizeJob.js";

const text = (v) => {
  if (v == null) return null;
  if (typeof v === "string") return htmlToText(v) || null;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(text).filter(Boolean).join(", ") || null;
  if (typeof v === "object") return text(v.name ?? v.value ?? v.description ?? v.addressLocality ?? v.addressRegion);
  return null;
};
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(text).filter(Boolean);

function isJobPosting(obj) {
  const types = Array.isArray(obj?.["@type"]) ? obj["@type"] : [obj?.["@type"]];
  return types.some((t) => typeof t === "string" && t.toLowerCase() === "jobposting");
}

function findJobs(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach((x) => findJobs(x, out));
    return out;
  }
  if (isJobPosting(node)) out.push(node);
  for (const key of ["@graph", "itemListElement", "mainEntity", "item"]) {
    if (node[key]) findJobs(node[key], out);
  }
  return out;
}

function salaryOf(v) {
  if (!v || typeof v !== "object") return null;
  const val = v.value && typeof v.value === "object" ? v.value : v;
  return salaryFromRange({
    min: val.minValue,
    max: val.maxValue ?? val.value,
    currency: v.currency || v.currencyCode,
    interval: val.unitText,
  });
}

function workModeOf(job) {
  if (/telecommute/i.test(String(job.jobLocationType || ""))) return "remote";
  const s = String(job.description || "").toLowerCase();
  if (/fully remote|100% remote|work from home/.test(s)) return "remote";
  if (/\bhybrid\b/.test(s)) return "hybrid";
  return null;
}

/** Returns { data, confidence, source, raw } or null. `raw` is the JobPosting node. */
export function extractJsonLd(html) {
  const $ = cheerio.load(html || "");
  const jobs = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      jobs.push(...findJobs(JSON.parse($(el).contents().text())));
    } catch {
      /* malformed structured data is ignored */
    }
  });
  // Prefer the richest posting when a page lists several.
  const job = jobs.sort((a, b) => String(b.description || "").length - String(a.description || "").length)[0];
  if (!job) return null;

  const org = job.hiringOrganization;
  const locs = Array.isArray(job.jobLocation) ? job.jobLocation : job.jobLocation ? [job.jobLocation] : [];
  const address = locs.map((x) => x?.address).find(Boolean) || {};
  const city = text(address.addressLocality);
  const state = text(address.addressRegion);
  const exp =
    job.experienceRequirements && typeof job.experienceRequirements === "object"
      ? job.experienceRequirements.monthsOfExperience
        ? `${Math.round(Number(job.experienceRequirements.monthsOfExperience) / 12)} years`
        : text(job.experienceRequirements)
      : text(job.experienceRequirements);
  const eligibility =
    [text(job.qualifications), text(job.educationRequirements), exp].filter(Boolean).join("\n") || null;

  const data = normalizeJob(
    {
      title: text(job.title || job.name),
      company: text(org?.name),
      location: city || state ? { city, state } : null,
      employmentType: normalizeEmployment(Array.isArray(job.employmentType) ? job.employmentType.join(" ") : job.employmentType),
      workMode: workModeOf(job),
      experienceRequired: exp,
      applicationDeadline: job.validThrough || null,
      requiredSkills: list(job.skills || job.skillRequirements),
      degree: list(job.educationRequirements),
      certifications: list(job.certifications),
      benefits: list(job.jobBenefits),
      eligibilityCriteria: eligibility,
      description: text(job.description),
      salary: salaryOf(job.baseSalary),
      confidence: 0.88,
    },
    "jsonld",
  );
  return { data, confidence: 0.88, source: "jsonld", raw: job };
}
