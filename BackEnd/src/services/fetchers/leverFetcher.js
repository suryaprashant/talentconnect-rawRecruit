import axios from "axios";
import { extractRequiredSkills } from "../skillExtractionService.js";

const buildLeverDescription = (job = {}) => {
  const listContent = Array.isArray(job.lists)
    ? job.lists.map((list) => list.content || "").join(" ")
    : "";

  return [
    job.descriptionPlain || "",
    listContent,
    job.additionalPlain || "",
    job.additional || "",
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
};

const mapLeverWorkplace = (type = "") => {
  const value = String(type || "").toLowerCase();

  if (value.includes("remote")) return "Remote";
  if (value.includes("hybrid")) return "Hybrid";

  return "In-Office";
};

const extractExperience = (description = "") => {
  const text = String(description || "").toLowerCase();

  if (
    text.includes("fresher") ||
    text.includes("entry level") ||
    text.includes("graduate") ||
    text.includes("intern") ||
    text.includes("0-1") ||
    text.includes("0 to 1")
  ) {
    return "0-1";
  }

  const match = text.match(/(\d+)\+?\s*(?:-|to|–)?\s*(\d+)?\s*years?/i);

  if (!match) return "";

  const min = Number(match[1]);

  if (min <= 1) return "0-1";
  if (min <= 3) return "1-3";
  if (min <= 5) return "3-5";
  if (min <= 10) return "5-10";

  return "10+";
};

export const fetchLeverJobs = async (companySlug, companyName = "") => {
  const url = `https://api.lever.co/v0/postings/${companySlug}?mode=json`;

  const { data } = await axios.get(url, {
    timeout: 15000,
  });

  if (!Array.isArray(data)) return [];

  return data.map((job) => {
    const description = buildLeverDescription(job);

    const normalizedJob = {
      jobId: String(job.id || ""),
      title: job.text || "",
      department: job.categories?.department || "",
      location: job.categories?.location || job.workplaceType || "",
      workMode: mapLeverWorkplace(job.workplaceType),
      jobUrl: job.hostedUrl || "",
      applyUrl: job.applyUrl || job.hostedUrl || "",
      jdSnippet: description.slice(0, 400),
      description,
      requiredSkills: [],
      experienceRequired: extractExperience(description),
      salaryRange: "",
      postedDate: job.createdAt ? new Date(job.createdAt) : null,
      atsSource: "Lever",
      companyName,
    };

    return {
      ...normalizedJob,
      requiredSkills: extractRequiredSkills(normalizedJob),
    };
  });
};