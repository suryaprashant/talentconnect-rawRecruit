import axios from "axios";
import { extractRequiredSkills } from "../skillExtractionService.js";
import { stripHtml, uniqueStrings } from "../../utils/jobTextUtils.js";

const extractWorkMode = (job = {}, description = "") => {
  const metadata = Array.isArray(job.metadata) ? job.metadata : [];

  const workplace = metadata.find(
    (item) => String(item.name || "").toLowerCase() === "workplace type"
  );

  if (workplace?.value) return workplace.value;

  const text = `${job.title || ""} ${job.location?.name || ""} ${description}`
    .toLowerCase()
    .trim();

  if (text.includes("remote")) return "Remote";
  if (text.includes("hybrid")) return "Hybrid";

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

const getDepartment = (job = {}) => {
  if (Array.isArray(job.departments) && job.departments.length > 0) {
    return uniqueStrings(job.departments.map((department) => department.name))
      .filter(Boolean)
      .join(", ");
  }

  return "";
};

export const fetchGreenhouseJobs = async (companySlug, companyName = "") => {
  const url = `https://boards-api.greenhouse.io/v1/boards/${companySlug}/jobs?content=true`;

  const { data } = await axios.get(url, {
    timeout: 15000,
  });

  const jobs = Array.isArray(data?.jobs) ? data.jobs : [];

  return jobs.map((job) => {
    const description = stripHtml(job.content || "");

    const normalizedJob = {
      jobId: String(job.id || ""),
      title: job.title || "",
      department: getDepartment(job),
      location: job.location?.name || "",
      workMode: extractWorkMode(job, description),
      jobUrl: job.absolute_url || "",
      applyUrl: job.absolute_url || "",
      jdSnippet: description.slice(0, 400),
      description,
      requiredSkills: [],
      experienceRequired: extractExperience(description),
      salaryRange: "",
      postedDate: job.first_published || job.updated_at || null,
      atsSource: "Greenhouse",
      companyName: job.company_name || companyName,
    };

    return {
      ...normalizedJob,
      requiredSkills: extractRequiredSkills(normalizedJob),
    };
  });
};