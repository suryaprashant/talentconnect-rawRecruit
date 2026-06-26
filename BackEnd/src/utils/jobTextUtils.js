import dns from "dns/promises";
import net from "net";
import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import DiscoveredCompany from "../models/DiscoveredCompany.js";

const KNOWN_JOB_DOMAINS = [
  "linkedin.com",
  "indeed.com",
  "in.indeed.com",
  "naukri.com",
  "unstop.com",
  "dare2compete.com",
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
  "viewjob",
];

const GENERIC_COMPANY_NAMES = [
  "linkedin",
  "indeed",
  "naukri",
  "unstop",
  "dare2compete",
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

export const cleanText = (value = "") =>
  String(value || "").replace(/\s+/g, " ").trim();

export const normalizeInputUrl = (url = "") => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export const normalizeCompanyName = (companyName = "") =>
  String(companyName || "")
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

const isGenericCompany = (value = "") =>
  GENERIC_COMPANY_NAMES.includes(normalizeCompanyName(value));

const cleanCompanyName = (value = "") => {
  const cleaned = cleanText(value)
    .replace(/\|.*$/g, "")
    .replace(/\s*-\s*(LinkedIn|Naukri|Indeed|Unstop|Wellfound|Glassdoor).*$/gi, "")
    .replace(/\s*-\s*Jobs.*$/gi, "")
    .replace(/\s*(Careers|Hiring|Openings|Job).*$/gi, "")
    .replace(/\s*reviews?.*$/gi, "")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length < 2 || cleaned.length > 80) return "";
  if (isGenericCompany(cleaned)) return "";

  return cleaned;
};

const getHost = (urlOrParsed) => {
  try {
    const parsed =
      typeof urlOrParsed === "string" ? new URL(urlOrParsed) : urlOrParsed;

    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const isKnownJobPlatform = (hostname = "") =>
  KNOWN_JOB_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

const isPrivateIp = (ip = "") => {
  if (!net.isIP(ip)) return true;

  if (["0.0.0.0", "::1"].includes(ip)) return true;

  if (
    ip.startsWith("10.") ||
    ip.startsWith("127.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80")
  ) {
    return true;
  }

  const parts = ip.split(".").map(Number);
  return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
};

const normalizeUrlForCompare = (url = "") => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
      .toLowerCase()
      .replace(/\/$/, "");
  } catch {
    return "";
  }
};

const hasJobKeywordInUrl = (parsed) => {
  const value = `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();
  return CAREER_KEYWORDS.some((keyword) => value.includes(keyword));
};

const isPlainCompanyHomepage = (parsed) => {
  const pathname = parsed.pathname.replace(/\/+/g, "/");
  const hasSearch = parsed.search && parsed.search.length > 1;

  if (pathname === "/" && !hasSearch) return true;

  const pathParts = pathname.split("/").filter(Boolean);

  return (
    pathParts.length <= 1 &&
    !hasSearch &&
    !CAREER_KEYWORDS.some((keyword) =>
      String(pathParts[0] || "").toLowerCase().includes(keyword)
    )
  );
};

const getLinkedInPublicJobUrl = (jobUrl = "") => {
  try {
    const url = new URL(jobUrl);

    if (!url.hostname.includes("linkedin.com")) return jobUrl;

    const currentJobId = url.searchParams.get("currentJobId");

    return currentJobId
      ? `https://www.linkedin.com/jobs/view/${currentJobId}`
      : jobUrl;
  } catch {
    return jobUrl;
  }
};

const extractCompanyNameFromPlatformUrl = (jobUrl = "") => {
  try {
    const url = new URL(normalizeInputUrl(jobUrl));
    const hostname = getHost(url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (hostname === "boards.greenhouse.io" || hostname === "job-boards.greenhouse.io") {
      return cleanCompanyName(pathParts[0]);
    }

    if (hostname.endsWith(".greenhouse.io")) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    if (hostname === "jobs.lever.co") {
      return cleanCompanyName(pathParts[0]);
    }

    if (hostname.endsWith(".lever.co")) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    if (hostname === "jobs.ashbyhq.com") {
      return cleanCompanyName(pathParts[0]);
    }

    if (hostname.endsWith(".ashbyhq.com")) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    if (hostname.includes("myworkdayjobs.com") || hostname.includes("workdayjobs.com")) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    if (hostname.includes("smartrecruiters.com")) {
      return cleanCompanyName(pathParts[0]);
    }

    if (
      hostname.includes("breezy.hr") ||
      hostname.includes("recruitee.com") ||
      hostname.includes("workable.com") ||
      hostname.includes("jobvite.com")
    ) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    return "";
  } catch {
    return "";
  }
};

export const extractCompanyNameFromCareerUrl = (careerPageUrl = "") => {
  try {
    const urlValue = normalizeInputUrl(careerPageUrl);

    const platformCompany = extractCompanyNameFromPlatformUrl(urlValue);
    if (platformCompany) return platformCompany;

    const url = new URL(urlValue);
    const hostname = getHost(url);

    if (isKnownJobPlatform(hostname)) return "";

    const parts = hostname.split(".").filter(Boolean);

    if (parts.length < 2) return "";

    const ignoredSubdomains = [
      "www",
      "career",
      "careers",
      "job",
      "jobs",
      "hiring",
      "work",
      "apply",
      "boards",
    ];

    const companyPart = ignoredSubdomains.includes(parts[0])
      ? parts[1]
      : parts[0];

    return cleanCompanyName(companyPart);
  } catch {
    return "";
  }
};

const findCompanyNameDeep = (obj, depth = 0) => {
  if (!obj || depth > 10) return "";

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findCompanyNameDeep(item, depth + 1);
      if (found) return found;
    }

    return "";
  }

  if (typeof obj !== "object") return "";

  const possibleKeys = [
    "companyName",
    "company_name",
    "employerName",
    "employer_name",
    "organizationName",
    "organisationName",
    "hiringOrganization",
    "company",
    "employer",
    "organization",
    "organisation",
  ];

  for (const key of possibleKeys) {
    const value = obj[key];

    if (typeof value === "string") {
      const cleaned = cleanCompanyName(value);
      if (cleaned) return cleaned;
    }

    if (value && typeof value === "object") {
      const nestedName = cleanCompanyName(
        value.name || value.displayName || value.title
      );

      if (nestedName) return nestedName;
    }
  }

  for (const value of Object.values(obj)) {
    const found = findCompanyNameDeep(value, depth + 1);
    if (found) return found;
  }

  return "";
};

const extractJsonCompany = (json) => {
  if (!json) return "";

  const items = Array.isArray(json) ? json : [json];

  for (const item of items) {
    const company =
      item?.hiringOrganization?.name ||
      item?.organization?.name ||
      item?.company?.name ||
      item?.companyName ||
      item?.employer?.name ||
      item?.employerName;

    const cleaned = cleanCompanyName(company);
    if (cleaned) return cleaned;

    if (item?.["@graph"]) {
      const found = extractJsonCompany(item["@graph"]);
      if (found) return found;
    }

    const deepFound = findCompanyNameDeep(item);
    if (deepFound) return deepFound;
  }

  return "";
};

const extractCompanyFromTitle = (title = "") => {
  const text = cleanText(title);
  if (!text) return "";

  const patterns = [
    /\bat\s+(.+?)(?:\s+\||\s+-|\s+–|\s+—|$)/i,
    /job\s+at\s+(.+?)(?:\s+\||\s+-|\s+–|\s+—|$)/i,
    /career\s+at\s+(.+?)(?:\s+\||\s+-|\s+–|\s+—|$)/i,
    /^(.+?)\s+is\s+hiring/i,
    /^(.+?)\s+hiring/i,
    /^(.+?)\s+jobs/i,
    /^(.+?)\s+careers/i,
  ];

  for (const pattern of patterns) {
    const matched = text.match(pattern)?.[1];
    const cleaned = cleanCompanyName(matched);
    if (cleaned) return cleaned;
  }

  return "";
};

const extractCompanyNameFromHtml = (html = "") => {
  const $ = cheerio.load(html);

  const directSelectors = [
    ".topcard__org-name-link",
    ".topcard__flavor",
    '[data-tracking-control-name="public_jobs_topcard-org-name"]',
    '[data-testid="company-name"]',
    '[data-testid="inlineHeader-companyName"]',
    '[data-testid="jobsearch-CompanyInfoContainer"] a',
    ".jobsearch-InlineCompanyRating-companyHeader",
    ".jobsearch-CompanyInfoContainer a",
    ".icl-u-lg-mr--sm",
    ".styles_jd-header-comp-name__MvqAI",
    ".jd-header-comp-name",
    ".company-name",
    ".comp-name",
    ".organisation-name",
    ".organization-name",
    ".opp-company-name",
    ".c-name",
    ".employer-name",
    ".job-company",
    ".posting-company",
    ".job-detail-company",
    "[class*=companyName]",
    "[class*=company-name]",
    "[class*=employerName]",
    "[class*=employer-name]",
  ];

  for (const selector of directSelectors) {
    const value = cleanCompanyName($(selector).first().text());
    if (value) return value;
  }

  const jsonLdScripts = $('script[type="application/ld+json"]').toArray();

  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse($(script).contents().text());
      const company = extractJsonCompany(parsed);
      if (company) return company;
    } catch {}
  }

  const nextData = $("#__NEXT_DATA__").text();

  if (nextData) {
    try {
      const company = findCompanyNameDeep(JSON.parse(nextData));
      if (company) return company;
    } catch {}
  }

  for (const script of $("script").toArray()) {
    const scriptText = $(script).contents().text();

    if (!scriptText || scriptText.length > 500000) continue;

    const matches = [
      scriptText.match(/"companyName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"employerName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"company"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i)?.[1],
    ];

    for (const match of matches) {
      const cleaned = cleanCompanyName(match);
      if (cleaned) return cleaned;
    }
  }

  const candidates = [
    $('meta[property="og:title"]').attr("content"),
    $('meta[name="title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    $('meta[property="twitter:title"]').attr("content"),
    $("title").text(),
    $("h1").first().text(),
  ].filter(Boolean);

  for (const text of candidates) {
    const company = extractCompanyFromTitle(text);
    if (company) return company;
  }

  return "";
};

const scrapeCompanyNameWithPlaywright = async (url) => {
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      viewport: { width: 1366, height: 768 },
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 35000,
    });

    await page.waitForTimeout(4000);

    const html = await page.content();

    return extractCompanyNameFromHtml(html);
  } catch (error) {
    console.log("Playwright scraping failed:", error.message);
    return "";
  } finally {
    if (browser) await browser.close();
  }
};

const scrapeCompanyNameFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 20000,
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

    const companyName = extractCompanyNameFromHtml(response.data);
    if (companyName) return companyName;
  } catch (error) {
    console.log("Axios scraping failed:", error.message);
  }

  return await scrapeCompanyNameWithPlaywright(url);
};

export const resolveCompanyNameFromCareerUrl = async (careerPageUrl = "") => {
  try {
    const normalizedUrl = normalizeInputUrl(careerPageUrl);
    const parsed = new URL(normalizedUrl);
    const hostname = getHost(parsed);

    const platformCompany = extractCompanyNameFromPlatformUrl(normalizedUrl);
    if (platformCompany) return platformCompany;

    const finalUrl = hostname.includes("linkedin.com")
      ? getLinkedInPublicJobUrl(normalizedUrl)
      : normalizedUrl;

    const scrapedCompany = await scrapeCompanyNameFromUrl(finalUrl);
    if (scrapedCompany) return scrapedCompany;

    const fallbackCompany = extractCompanyNameFromCareerUrl(normalizedUrl);
    if (fallbackCompany) return fallbackCompany;

    return "";
  } catch {
    return "";
  }
};

export const validateCareerPageUrl = async (careerPageUrl = "") => {
  if (!careerPageUrl || typeof careerPageUrl !== "string") {
    return {
      valid: false,
      message: "careerPageUrl is required",
    };
  }

  const trimmedUrl = normalizeInputUrl(careerPageUrl);

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
    const addresses = await dns.lookup(hostname, { all: true });

    if (addresses.some((item) => isPrivateIp(item.address))) {
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

  const knownJobPlatform = isKnownJobPlatform(getHost(parsed));
  const hasJobKeyword = hasJobKeywordInUrl(parsed);

  if (!knownJobPlatform && !hasJobKeyword) {
    return {
      valid: false,
      message: "Please enter a valid job posting URL.",
    };
  }

  const companyName = await resolveCompanyNameFromCareerUrl(trimmedUrl);

  if (!companyName) {
    return {
      valid: false,
      message: "Unable to extract company name from this job URL.",
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
    companyName,
  };
};