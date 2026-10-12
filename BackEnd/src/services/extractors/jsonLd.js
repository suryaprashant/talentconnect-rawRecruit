import * as cheerio from "cheerio";
import { normalizeJob } from "./normalizeJob.js";

const text = v => {
  if (v == null) return null;
  if (typeof v === "string") return v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || null;
  if (Array.isArray(v)) return v.map(text).filter(Boolean).join(", ") || null;
  if (typeof v === "object") return text(v.name || v.value || v.description || v.addressLocality || v.addressRegion);
  return null;
};
const list = v => (Array.isArray(v) ? v : v ? [v] : []).map(text).filter(Boolean);
function isJobPosting(obj) {
  const types = Array.isArray(obj?.["@type"]) ? obj["@type"] : [obj?.["@type"]];
  return types.some(t => typeof t === "string" && t.toLowerCase() === "jobposting");
}
function findJobs(node, out=[]) {
  if (!node) return out;
  if (Array.isArray(node)) node.forEach(x => findJobs(x,out));
  else if (typeof node === "object") {
    if (isJobPosting(node)) out.push(node);
    if (node["@graph"]) findJobs(node["@graph"],out);
    if (node.itemListElement) findJobs(node.itemListElement,out);
    if (node.mainEntity) findJobs(node.mainEntity,out);
  }
  return out;
}
function salaryOf(v) {
  if (!v || typeof v !== "object") return null;
  const val = v.value || v;
  const number = x => Number.isFinite(Number(x)) && x !== "" ? Number(x) : null;
  const min = number(val.minValue), max = number(val.maxValue ?? val.value);
  if (min == null && max == null) return null;
  return { currency: v.currency || v.currencyCode || null, totalCTC: max, fixedPay: min, variablePay: null };
}
function employment(v) {
  const s = (Array.isArray(v) ? v.join(" ") : String(v || "")).toLowerCase();
  if (/intern/.test(s)) return "internship"; if (/part.?time/.test(s)) return "part_time";
  if (/contract|temporary/.test(s)) return "contract"; if (/full.?time|permanent/.test(s)) return "full_time";
  return null;
}
function workMode(job) {
  const s = `${job.jobLocationType || ""} ${job.description || ""}`.toLowerCase();
  if (/telecommute|fully remote|100% remote|work from home/.test(s)) return "remote";
  if (/hybrid/.test(s)) return "hybrid";
  if (/on.?site position|onsite position/.test(s)) return "onsite";
  return null;
}
export function extractJsonLd(html) {
  const $ = cheerio.load(html || "");
  const jobs = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try { jobs.push(...findJobs(JSON.parse($(el).contents().text()))); } catch { /* malformed structured data is ignored */ }
  });
  const job = jobs[0];
  if (!job) return null;
  const org = job.hiringOrganization;
  const locs = Array.isArray(job.jobLocation) ? job.jobLocation : job.jobLocation ? [job.jobLocation] : [];
  const address = locs.map(x => x?.address).find(Boolean) || {};
  const city = text(address.addressLocality);
  const state = text(address.addressRegion);
  const eligibility = [text(job.qualifications), text(job.educationRequirements), text(job.experienceRequirements)]
    .filter(Boolean).join("\n") || null;
  const base = normalizeJob({
    title: text(job.title || job.name), company: text(org?.name),
    location: city || state ? { city, state } : null,
    employmentType: employment(job.employmentType), workMode: workMode(job),
    experienceRequired: text(job.experienceRequirements), applicationDeadline: job.validThrough || null,
    requiredSkills: list(job.skills || job.skillRequirements), degree: list(job.educationRequirements),
    certifications: list(job.certifications), benefits: list(job.jobBenefits),
    eligibilityCriteria: eligibility, description: text(job.description),
    salary: salaryOf(job.baseSalary), confidence: 0.88, source: "jsonld"
  }, "jsonld");
  return { data: base, confidence: 0.88, source: "jsonld" };
}
