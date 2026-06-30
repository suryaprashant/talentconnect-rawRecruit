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
  "details",
  "internship",
  "internships",
  "search-results",
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
  "workday",
  "workdayjobs",
  "myworkdayjobs",
  "ashbyhq",
  "smartrecruiters",
  "breezy",
  "recruitee",
  "workable",
  "jobvite",
  "jobs",
  "careers",
  "hiring",
];

const LEGAL_ENTITY_HINTS = [
  "s. de r.l",
  "s de rl",
  "c.v",
  "cv",
  "private limited",
  "pvt ltd",
  "pvt. ltd",
  "limited",
  "ltd",
  "llc",
  "llp",
  "inc",
  "corp",
  "corporation",
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
    .replace(/\bllc\b/g, "")
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

const isLegalEntityName = (value = "") => {
  const text = String(value || "").toLowerCase();
  return LEGAL_ENTITY_HINTS.some((hint) => text.includes(hint));
};

const isWorkdayUrl = (hostname = "") =>
  hostname.includes("myworkdayjobs.com") || hostname.includes("workdayjobs.com");

const cleanCompanyName = (value = "") => {
  const cleaned = cleanText(value)
    .replace(/\|.*$/g, "")
    .replace(
      /\s*-\s*(LinkedIn|Naukri|Indeed|Unstop|Wellfound|Glassdoor|Internshala|Foundit|Monster|Cutshort).*$/gi,
      "",
    )
    .replace(/\s*-\s*Jobs.*$/gi, "")
    .replace(
      /\s*(Careers|Hiring|Openings|Opening|Job|Jobs|Internship|Internships|Reviews).*$/gi,
      "",
    )
    .replace(/\s*reviews?.*$/gi, "")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length < 2 || cleaned.length > 160) return "";
  if (isGenericCompany(cleaned)) return "";

  return cleaned;
};

const cleanJobTitle = (value = "") => {
  const cleaned = cleanText(value)
    .replace(/\|.*$/g, "")
    .replace(/\s*-\s*Workday.*$/gi, "")
    .replace(/\s*-\s*Careers.*$/gi, "")
    .replace(/\s*-\s*Jobs.*$/gi, "")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length < 2 || cleaned.length > 180) return "";
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
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
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
  const value =
    `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

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
      String(pathParts[0] || "").toLowerCase().includes(keyword),
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

const titleFromUrlPath = (jobUrl = "") => {
  try {
    const url = new URL(normalizeInputUrl(jobUrl));
    const parts = url.pathname.split("/").filter(Boolean);
    const detailsIndex = parts.findIndex((p) => p.toLowerCase() === "details");

    if (detailsIndex !== -1 && parts[detailsIndex + 1]) {
      return cleanJobTitle(
        decodeURIComponent(parts[detailsIndex + 1])
          .replace(/_[A-Z]{1,8}-?\d+.*/i, "")
          .replace(/[-_]+/g, " "),
      );
    }

    return "";
  } catch {
    return "";
  }
};

const extractCompanyNameFromPlatformUrl = (jobUrl = "") => {
  try {
    const url = new URL(normalizeInputUrl(jobUrl));
    const hostname = getHost(url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (
      hostname === "boards.greenhouse.io" ||
      hostname === "job-boards.greenhouse.io"
    ) {
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

    if (isWorkdayUrl(hostname)) {
      const pathSegments = url.pathname.split("/").filter(Boolean);

      const localeIndex = pathSegments.findIndex((seg) =>
        /^[a-z]{2}-[A-Z]{2}$/.test(seg),
      );

      if (localeIndex !== -1 && pathSegments.length > localeIndex + 1) {
        return cleanCompanyName(pathSegments[localeIndex + 1]);
      }

      return "";
    }

    if (hostname === "jobs.ashbyhq.com") {
      return cleanCompanyName(pathParts[0]);
    }

    if (hostname.endsWith(".ashbyhq.com")) {
      return cleanCompanyName(hostname.split(".")[0]);
    }

    if (hostname.includes("smartrecruiters.com")) {
      return cleanCompanyName(pathParts[0]);
    }

    if (hostname === "wellfound.com" || hostname === "angel.co") {
      const companyIndex = pathParts.indexOf("company");
      if (companyIndex !== -1 && pathParts.length > companyIndex + 1) {
        return cleanCompanyName(pathParts[companyIndex + 1]);
      }
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

const findDeepValue = (obj, keys = [], depth = 0) => {
  if (!obj || depth > 12) return "";

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findDeepValue(item, keys, depth + 1);
      if (found) return found;
    }
    return "";
  }

  if (typeof obj !== "object") return "";

  for (const key of keys) {
    const value = obj[key];

    if (typeof value === "string") return value;

    if (value && typeof value === "object") {
      const nested = value.name || value.displayName || value.title;
      if (typeof nested === "string") return nested;
    }
  }

  for (const value of Object.values(obj)) {
    const found = findDeepValue(value, keys, depth + 1);
    if (found) return found;
  }

  return "";
};

const extractJobInfoFromJson = (json) => {
  const titleKeys = [
    "title",
    "jobTitle",
    "job_title",
    "postingTitle",
    "jobPostingTitle",
  ];

  const companyKeys = [
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
    "siteName",
    "tenantDisplayName",
  ];

  return {
    jobTitle: cleanJobTitle(findDeepValue(json, titleKeys)),
    companyName: cleanCompanyName(findDeepValue(json, companyKeys)),
  };
};

const extractJobInfoFromTitle = (title = "") => {
  const text = cleanText(title);

  return {
    jobTitle: cleanJobTitle(
      text
        .replace(/\s*-\s*Workday.*$/i, "")
        .replace(/\s*\|\s*.*$/i, ""),
    ),
    companyName: "",
  };
};

const extractJobInfoFromHtml = (html = "") => {
  const $ = cheerio.load(html);

  const titleSelectors = [
    '[data-automation-id="jobPostingHeader"]',
    '[data-automation-id="jobPostingTitle"]',
    '[data-automation-id="job-title"]',
    '[data-testid="job-title"]',
    ".topcard__title",
    ".jobsearch-JobInfoHeader-title",
    ".heading_4_5",
    "h1",
  ];

  const companySelectors = [
    ".topcard__org-name-link",
    ".topcard__flavor",
    '[data-tracking-control-name="public_jobs_topcard-org-name"]',
    '[data-testid="company-name"]',
    '[data-testid="inlineHeader-companyName"]',
    '[data-testid="jobsearch-CompanyInfoContainer"]',
    ".jobsearch-InlineCompanyRating-companyHeader",
    ".jobsearch-CompanyInfoContainer a",
    ".styles_jd-header-comp-name__MvqAI",
    ".jd-header-comp-name",
    ".company_name",
    ".company-name",
    ".heading_6.company_name",
    ".internship_meta .company",
    ".individual_internship .company",
    "#company_name",
    '[data-automation-id="jobPostingCompany"]',
    '[data-automation-id="company"]',
    '[data-automation-id="companyName"]',
    '[data-automation-id="jobCompany"]',
    '[data-testid="job-company"]',
    ".comp-name",
    ".organisation-name",
    ".organization-name",
    ".opp-company-name",
    ".employer-name",
    ".job-company",
    ".posting-company",
    ".job-detail-company",
    "[class*=companyName]",
    "[class*=company-name]",
    "[class*=employerName]",
    "[class*=employer-name]",
  ];

  let jobTitle = "";
  let companyName = "";

  for (const selector of titleSelectors) {
    jobTitle = cleanJobTitle($(selector).first().text());
    if (jobTitle) break;
  }

  for (const selector of companySelectors) {
    companyName = cleanCompanyName($(selector).first().text());
    if (companyName) break;
  }

  for (const script of $('script[type="application/ld+json"]').toArray()) {
    try {
      const info = extractJobInfoFromJson(JSON.parse($(script).contents().text()));
      if (!jobTitle && info.jobTitle) jobTitle = info.jobTitle;
      if (!companyName && info.companyName) companyName = info.companyName;
    } catch {}
  }

  const nextData = $("#__NEXT_DATA__").text();

  if (nextData) {
    try {
      const info = extractJobInfoFromJson(JSON.parse(nextData));
      if (!jobTitle && info.jobTitle) jobTitle = info.jobTitle;
      if (!companyName && info.companyName) companyName = info.companyName;
    } catch {}
  }

  for (const script of $("script").toArray()) {
    const scriptText = $(script).contents().text();
    if (!scriptText || scriptText.length > 900000) continue;

    const titleMatches = [
      scriptText.match(/"jobTitle"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"job_title"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"title"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"postingTitle"\s*:\s*"([^"]+)"/i)?.[1],
    ];

    const companyMatches = [
      scriptText.match(/"companyName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"company_name"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"employerName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"employer_name"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"siteName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"tenantDisplayName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"organizationName"\s*:\s*"([^"]+)"/i)?.[1],
      scriptText.match(/"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i)?.[1],
    ];

    if (!jobTitle) {
      for (const match of titleMatches) {
        const cleaned = cleanJobTitle(match);
        if (cleaned) {
          jobTitle = cleaned;
          break;
        }
      }
    }

    if (!companyName) {
      for (const match of companyMatches) {
        const cleaned = cleanCompanyName(match);
        if (cleaned) {
          companyName = cleaned;
          break;
        }
      }
    }

    if (jobTitle && companyName) break;
  }

  const metaTitle =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $('meta[property="twitter:title"]').attr("content") ||
    $("title").text();

  if (!jobTitle && metaTitle) {
    jobTitle = extractJobInfoFromTitle(metaTitle).jobTitle;
  }

  return {
    jobTitle,
    companyName,
  };
};

const scrapeJobInfoWithPlaywright = async (url) => {
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
      timeout: 45000,
    });

    await page.waitForTimeout(7000);

    const htmlInfo = extractJobInfoFromHtml(await page.content());

    const visibleInfo = await page.evaluate(() => {
      const clean = (v) => String(v || "").replace(/\s+/g, " ").trim();

      const pick = (selectors) => {
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          const text = clean(el?.textContent);
          if (text) return text;
        }
        return "";
      };

      return {
        jobTitle: pick([
          '[data-automation-id="jobPostingHeader"]',
          '[data-automation-id="jobPostingTitle"]',
          '[data-automation-id="job-title"]',
          '[data-testid="job-title"]',
          ".topcard__title",
          ".jobsearch-JobInfoHeader-title",
          "h1",
        ]),
        companyName: pick([
          ".topcard__org-name-link",
          ".topcard__flavor",
          '[data-testid="inlineHeader-companyName"]',
          '[data-testid="company-name"]',
          '[data-automation-id="jobPostingCompany"]',
          '[data-automation-id="company"]',
          '[data-automation-id="companyName"]',
          ".company_name",
          ".company-name",
          ".jd-header-comp-name",
        ]),
      };
    });

    return {
      jobTitle: htmlInfo.jobTitle || cleanJobTitle(visibleInfo.jobTitle),
      companyName: htmlInfo.companyName || cleanCompanyName(visibleInfo.companyName),
    };
  } catch (error) {
    console.log("Playwright scraping failed:", error.message);
    return {
      jobTitle: "",
      companyName: "",
    };
  } finally {
    if (browser) await browser.close();
  }
};

const scrapeJobInfoFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 22000,
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

    const info = extractJobInfoFromHtml(response.data);
    if (info.jobTitle || info.companyName) return info;
  } catch (error) {
    console.log("Axios scraping failed:", error.message);
  }

  return await scrapeJobInfoWithPlaywright(url);
};

export const resolveJobInfoFromCareerUrl = async (careerPageUrl = "") => {
  try {
    const normalizedUrl = normalizeInputUrl(careerPageUrl);
    const parsed = new URL(normalizedUrl);
    const hostname = getHost(parsed);

    const isLinkedIn = hostname.includes("linkedin.com");
    const isWorkday = isWorkdayUrl(hostname);

    const finalUrl = isLinkedIn
      ? getLinkedInPublicJobUrl(normalizedUrl)
      : normalizedUrl;

    const scraped = await scrapeJobInfoFromUrl(finalUrl);

    const urlCompany = extractCompanyNameFromPlatformUrl(normalizedUrl);
    const fallbackCompany = extractCompanyNameFromCareerUrl(normalizedUrl);
    const fallbackTitle = titleFromUrlPath(normalizedUrl);

    const jobTitle = scraped.jobTitle || fallbackTitle;
    const companyName = scraped.companyName || urlCompany || fallbackCompany;

    const shouldUseTitleForWorkday =
      isWorkday && jobTitle && (!companyName || isLegalEntityName(companyName));

    return {
      jobTitle,
      companyName,
      searchCompanyName: shouldUseTitleForWorkday
        ? jobTitle
        : companyName || jobTitle,
    };
  } catch {
    return {
      jobTitle: "",
      companyName: "",
      searchCompanyName: "",
    };
  }
};

export const resolveCompanyNameFromCareerUrl = async (careerPageUrl = "") => {
  const info = await resolveJobInfoFromCareerUrl(careerPageUrl);
  return info.searchCompanyName;
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
      normalizeUrlForCompare(company.careerPageUrl) === normalizedInputUrl,
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

  const jobInfo = await resolveJobInfoFromCareerUrl(trimmedUrl);

  if (!jobInfo.searchCompanyName) {
    return {
      valid: false,
      message: "Unable to extract company name from this job URL.",
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
    companyName: jobInfo.searchCompanyName,
    actualCompanyName: jobInfo.companyName,
    jobTitle: jobInfo.jobTitle,
  };
};