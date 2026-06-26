import dns from "dns/promises";
import net from "net";
import axios from "axios";
import * as cheerio from "cheerio";
import DiscoveredCompany from "../models/DiscoveredCompany.js";

const KNOWN_JOB_DOMAINS = [
  "linkedin.com",
  "naukri.com",
  "unstop.com",
  "indeed.com",
  "wellfound.com",
  "angel.co",
  "internshala.com",
  "glassdoor.com",
  "monster.com",
  "foundit.in",
  "cutshort.io",
  "greenhouse.io",
  "lever.co",
  "workdayjobs.com",
  "myworkdayjobs.com",
  "ashbyhq.com",
  "smartrecruiters.com",
  "breezy.hr",
  "recruitee.com",
  "workable.com",
  "jobvite.com",
];

const CAREER_KEYWORDS = [
  "career",
  "careers",
  "job",
  "jobs",
  "position",
  "positions",
  "opening",
  "openings",
  "apply",
  "hiring",
  "recruiting",
  "opportunity",
  "opportunities",
  "join-us",
  "work-with-us",
];

const GENERIC_COMPANY_NAMES = [
  "linkedin",
  "naukri",
  "unstop",
  "indeed",
  "wellfound",
  "angel",
  "internshala",
  "glassdoor",
  "monster",
  "foundit",
  "cutshort",
  "greenhouse",
  "lever",
  "workdayjobs",
  "myworkdayjobs",
  "ashbyhq",
  "smartrecruiters",
  "breezy",
  "recruitee",
  "workable",
  "jobvite",
];

const cleanText = (value = "") => {
  return String(value || "").replace(/\s+/g, " ").trim();
};

export const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const normalizeCompanyName = (companyName = "") => {
  return String(companyName || "")
    .toLowerCase()
    .trim()
    .replace(/\bprivate\s+limited\b/g, "")
    .replace(/\bpvt\.?\s*ltd\.?\b/g, "")
    .replace(/\bpvt\.?\s*limited\b/g, "")
    .replace(/\blimited\b/g, "")
    .replace(/\bltd\.?\b/g, "")
    .replace(/\bllp\b/g, "")
    .replace(/\bopc\b/g, "")
    .replace(/\binc\.?\b/g, "")
    .replace(/\bcorp\.?\b/g, "")
    .replace(/\bcorporation\b/g, "")
    .replace(/\bcompany\b/g, "")
    .replace(/\bco\.?\b/g, "")
    .replace(/\bindia\b/g, "")
    .replace(/\bglobal\b/g, "")
    .replace(/[^a-z0-9]/g, "");
};

const cleanCompanyName = (value = "") => {
  return cleanText(value)
    .replace(/\|.*$/g, "")
    .replace(/\s*-\s*LinkedIn.*$/gi, "")
    .replace(/\s*-\s*Naukri.*$/gi, "")
    .replace(/\s*-\s*Indeed.*$/gi, "")
    .replace(/\s*-\s*Unstop.*$/gi, "")
    .replace(/\s*-\s*Wellfound.*$/gi, "")
    .replace(/\s*-\s*Glassdoor.*$/gi, "")
    .replace(/\s*-\s*Jobs.*$/gi, "")
    .replace(/\s*Careers.*$/gi, "")
    .replace(/\s*Hiring.*$/gi, "")
    .replace(/\s*Openings.*$/gi, "")
    .replace(/\s*Job.*$/gi, "")
    .trim();
};

const isGenericCompany = (value = "") => {
  return GENERIC_COMPANY_NAMES.includes(normalizeCompanyName(value));
};

const isPrivateIp = (ip) => {
  if (!net.isIP(ip)) return true;

  if (ip === "0.0.0.0" || ip === "::1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("127.")) return true;
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true;
  if (ip.startsWith("fe80")) return true;

  const parts = ip.split(".").map(Number);

  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  return false;
};

const normalizeUrlForCompare = (url = "") => {
  try {
    const parsed = new URL(String(url).trim());

    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
      .toLowerCase()
      .replace(/\/$/, "");
  } catch {
    return "";
  }
};

const getHostname = (url = "") => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isKnownJobPlatform = (hostname = "") => {
  return KNOWN_JOB_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
};

const hasJobKeywordInUrl = (parsed) => {
  const fullUrl = `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  return CAREER_KEYWORDS.some((keyword) => fullUrl.includes(keyword));
};

const isPlainCompanyHomepage = (parsed) => {
  const pathname = parsed.pathname.replace(/\/+/g, "/");
  const hasSearch = parsed.search && parsed.search.length > 1;

  if (pathname === "/" && !hasSearch) return true;

  const pathParts = pathname.split("/").filter(Boolean);

  if (pathParts.length === 0 && !hasSearch) return true;

  if (
    pathParts.length === 1 &&
    !hasSearch &&
    !CAREER_KEYWORDS.some((keyword) => pathParts[0].toLowerCase().includes(keyword))
  ) {
    return true;
  }

  return false;
};

const getLinkedInPublicJobUrl = (jobUrl = "") => {
  try {
    const url = new URL(jobUrl);

    if (!url.hostname.includes("linkedin.com")) return jobUrl;

    const currentJobId = url.searchParams.get("currentJobId");

    if (currentJobId) {
      return `https://www.linkedin.com/jobs/view/${currentJobId}`;
    }

    return jobUrl;
  } catch {
    return jobUrl;
  }
};

const extractCompanyNameFromPlatformUrl = (jobUrl = "") => {
  try {
    const url = new URL(jobUrl);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (hostname.includes("greenhouse.io")) {
      if (hostname === "boards.greenhouse.io" || hostname === "job-boards.greenhouse.io") {
        return cleanCompanyName(pathParts[0] || "");
      }

      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("lever.co")) {
      if (hostname === "jobs.lever.co") {
        return cleanCompanyName(pathParts[0] || "");
      }

      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("ashbyhq.com")) {
      if (hostname === "jobs.ashbyhq.com") {
        return cleanCompanyName(pathParts[0] || "");
      }
    }

    if (hostname.includes("myworkdayjobs.com")) {
      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("workdayjobs.com")) {
      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("smartrecruiters.com")) {
      const company = pathParts[0];
      if (company) return cleanCompanyName(company);
    }

    if (hostname.includes("breezy.hr")) {
      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("recruitee.com")) {
      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    if (hostname.includes("workable.com")) {
      const subdomain = hostname.split(".")[0];
      if (!isGenericCompany(subdomain)) return cleanCompanyName(subdomain);
    }

    return "";
  } catch {
    return "";
  }
};

export const extractCompanyNameFromCareerUrl = (careerPageUrl = "") => {
  try {
    let urlValue = String(careerPageUrl).trim();

    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      urlValue = `https://${urlValue}`;
    }

    const platformCompany = extractCompanyNameFromPlatformUrl(urlValue);
    if (platformCompany && !isGenericCompany(platformCompany)) return platformCompany;

    const url = new URL(urlValue);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const parts = host.split(".").filter(Boolean);

    if (parts.length < 2) return "";

    const ignoredSubdomains = [
      "career",
      "careers",
      "job",
      "jobs",
      "hiring",
      "work",
      "apply",
      "boards",
    ];

    if (ignoredSubdomains.includes(parts[0])) {
      return parts[1] || "";
    }

    return parts[0] || "";
  } catch {
    return "";
  }
};

const extractCompanyNameFromHtml = (html = "") => {
  const $ = cheerio.load(html);

  const directSelectors = [
    ".topcard__org-name-link",
    ".topcard__flavor",
    '[data-tracking-control-name="public_jobs_topcard-org-name"]',
    '[data-testid="company-name"]',
    '[data-testid="inlineHeader-companyName"]',
    ".jobsearch-InlineCompanyRating-companyHeader",
    ".jobsearch-CompanyInfoContainer a",
    ".styles_jd-header-comp-name__MvqAI",
    ".company-name",
    ".employer-name",
    ".job-company",
    ".posting-company",
    ".job-detail-company",
  ];

  for (const selector of directSelectors) {
    const value = cleanCompanyName($(selector).first().text());
    if (value && !isGenericCompany(value)) return value;
  }

  const jsonLdScripts = $('script[type="application/ld+json"]').toArray();

  for (const script of jsonLdScripts) {
    try {
      const raw = $(script).contents().text();
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        const company =
          item?.hiringOrganization?.name ||
          item?.organization?.name ||
          item?.company?.name;

        if (company && !isGenericCompany(company)) {
          return cleanCompanyName(company);
        }
      }
    } catch {}
  }

  const candidates = [
    $('meta[property="og:title"]').attr("content"),
    $('meta[name="title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    $('meta[property="twitter:title"]').attr("content"),
    $('meta[property="og:site_name"]').attr("content"),
    $("title").text(),
  ]
    .filter(Boolean)
    .map(cleanText);

  for (const text of candidates) {
    let match = text.match(/^(.+?)\s+hiring\s+/i);
    if (match?.[1] && !isGenericCompany(match[1])) {
      return cleanCompanyName(match[1]);
    }

    match = text.match(/\bat\s+(.+?)(?:\s+\||\s+-|$)/i);
    if (match?.[1] && !isGenericCompany(match[1])) {
      return cleanCompanyName(match[1]);
    }

    match = text.match(/^(.+?)\s+jobs/i);
    if (match?.[1] && !isGenericCompany(match[1])) {
      return cleanCompanyName(match[1]);
    }

    match = text.match(/job\s+at\s+(.+?)(?:\s+\||\s+-|$)/i);
    if (match?.[1] && !isGenericCompany(match[1])) {
      return cleanCompanyName(match[1]);
    }
  }

  const bodyText = cleanText($("body").text());

  let match = bodyText.match(/([A-Za-z0-9&.,' -]{2,80})\s+hiring\s+/i);
  if (match?.[1] && !isGenericCompany(match[1])) {
    return cleanCompanyName(match[1]);
  }

  match = bodyText.match(/\bat\s+([A-Za-z0-9&.,' -]{2,80})/i);
  if (match?.[1] && !isGenericCompany(match[1])) {
    return cleanCompanyName(match[1]);
  }

  return null;
};

const scrapeCompanyNameFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    return extractCompanyNameFromHtml(response.data);
  } catch (error) {
    console.log("Company scraping failed:", error.message);
    return null;
  }
};

export const resolveCompanyNameFromCareerUrl = async (careerPageUrl) => {
  const parsed = new URL(careerPageUrl);
  const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

  const platformCompany = extractCompanyNameFromPlatformUrl(careerPageUrl);

  if (platformCompany && !isGenericCompany(platformCompany)) {
    return platformCompany;
  }

  if (hostname.includes("linkedin.com")) {
    const publicLinkedInUrl = getLinkedInPublicJobUrl(careerPageUrl);
    const scrapedCompanyName = await scrapeCompanyNameFromUrl(publicLinkedInUrl);

    if (scrapedCompanyName && !isGenericCompany(scrapedCompanyName)) {
      return scrapedCompanyName;
    }

    return "";
  }

  if (isKnownJobPlatform(hostname)) {
    const scrapedCompanyName = await scrapeCompanyNameFromUrl(careerPageUrl);

    if (scrapedCompanyName && !isGenericCompany(scrapedCompanyName)) {
      return scrapedCompanyName;
    }

    return "";
  }

  const companyFromUrl = extractCompanyNameFromCareerUrl(careerPageUrl);

  if (companyFromUrl && !isGenericCompany(companyFromUrl)) {
    return companyFromUrl;
  }

  const scrapedCompanyName = await scrapeCompanyNameFromUrl(careerPageUrl);

  if (scrapedCompanyName && !isGenericCompany(scrapedCompanyName)) {
    return scrapedCompanyName;
  }

  return "";
};

export const validateCareerPageUrl = async (careerPageUrl = "") => {
  if (!careerPageUrl || typeof careerPageUrl !== "string") {
    return {
      valid: false,
      message: "careerPageUrl is required",
    };
  }

  let trimmedUrl = careerPageUrl.trim();

  if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
    trimmedUrl = `https://${trimmedUrl}`;
  }

  let parsed;

  try {
    parsed = new URL(trimmedUrl);
  } catch {
    return {
      valid: false,
      message: "Please enter a valid URL",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      valid: false,
      message: "Only HTTP and HTTPS URLs are allowed",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.includes("..")
  ) {
    return {
      valid: false,
      message: "Invalid or unsafe URL",
    };
  }

  if (isPlainCompanyHomepage(parsed)) {
    return {
      valid: false,
      message: "Please enter a specific job URL, not a company homepage URL.",
    };
  }

  const normalizedInputUrl = normalizeUrlForCompare(trimmedUrl);

  const allCompanies = await DiscoveredCompany.find({
    careerPageUrl: {
      $exists: true,
      $ne: "",
    },
  }).lean();

  const matchedCompany = allCompanies.find(
    (company) =>
      normalizeUrlForCompare(company.careerPageUrl) === normalizedInputUrl
  );

  if (matchedCompany) {
    return {
      valid: false,
      alreadyExists: true,
      message:
        "This is the company career page URL. Please enter a specific job URL, not the main career page URL.",
      data: {
        companyName: matchedCompany.companyName,
        careerPageUrl: matchedCompany.careerPageUrl,
      },
    };
  }

  try {
    const addresses = await dns.lookup(hostname, {
      all: true,
    });

    const hasPrivateIp = addresses.some((item) => isPrivateIp(item.address));

    if (hasPrivateIp) {
      return {
        valid: false,
        message: "Private or internal URLs are not allowed",
      };
    }
  } catch {
    return {
      valid: false,
      message: "Unable to verify this URL",
    };
  }

  const knownJobPlatform = isKnownJobPlatform(hostname);
  const hasJobKeyword = hasJobKeywordInUrl(parsed);

  if (!knownJobPlatform && !hasJobKeyword) {
    return {
      valid: false,
      message: "Please enter a valid job posting URL.",
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
  };
};