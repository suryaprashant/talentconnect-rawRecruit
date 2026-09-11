import dns from "dns/promises";
import net from "net";
import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import DiscoveredCompany from "../models/DiscoveredCompany.js";

/* ============================================================================
 * LOGGER
 * ========================================================================== */

const logger = {
  error(message, error) {
    console.error(message, error?.message || error || "");
  },
};

const debugLog = (label, data = {}) => {
  console.log(`\n[COMPANY-DEBUG] ${label}`, data);
};

/* ============================================================================
 * PLATFORMS
 * ========================================================================== */

export const JOB_PLATFORMS = Object.freeze({
  LINKEDIN: "linkedin",
  NAUKRI: "naukri",
  UNSTOP: "unstop",
  INDEED: "indeed",
  WELLFOUND: "wellfound",
  GREENHOUSE: "greenhouse",
  LEVER: "lever",
  WORKDAY: "workday",
  ASHBY: "ashby",
  UNKNOWN: "unknown",
});

// Platforms whose URLs we intentionally do NOT scrape/extract from.
// Indeed is aggressively bot-protected (Cloudflare/interstitial pages),
// which made every Indeed URL fall through the slow Playwright path only
// to return empty results most of the time. We now reject these up front
// - before any DNS lookup, HTTP request, or browser launch - so the
// response is immediate instead of paying a multi-second timeout for a
// result that was going to fail anyway.
export const UNSUPPORTED_JOB_PLATFORMS = Object.freeze(
  new Set([JOB_PLATFORMS.INDEED]),
);

export const isUnsupportedPlatform = (platform) =>
  UNSUPPORTED_JOB_PLATFORMS.has(platform);

const UNSUPPORTED_PLATFORM_MESSAGE =
  "Please use a job URL from LinkedIn, Naukri, Unstop, Wellfound, Greenhouse, Lever, Workday, or Ashby instead.";

const unsupportedPlatformResult = (platform) => ({
  jobTitle: "",
  companyName: "",
  searchCompanyName: "",
  unsupported: true,
  supported: false,
  platform,
  reason: "PLATFORM_NOT_SUPPORTED",
  message: UNSUPPORTED_PLATFORM_MESSAGE,
});

/* ============================================================================
 * CONSTANTS
 * ========================================================================== */

const KNOWN_JOB_DOMAINS = [
  "linkedin.com",
  "indeed.com",
  "naukri.com",
  "unstop.com",
  "dare2compete.com",
  "wellfound.com",
  "angel.co",
  "greenhouse.io",
  "lever.co",
  "workdayjobs.com",
  "myworkdayjobs.com",
  "ashbyhq.com",
];

const BLOCKED_PAGE_VALUES = [
  "access denied",
  "permission denied",
  "forbidden",
  "request blocked",
  "temporarily blocked",
  "security check",
  "verify you are human",
  "verify that you are human",
  "additional verification required",
  "captcha",
  "attention required",
  "not authorized",
  "unauthorized",
  "service unavailable",
  "page unavailable",
  "page not found",
  "robot check",
  "bot detection",
  // Auth / bot-check interstitials (Cloudflare-style "Authenticating..."
  // redirect-to-login pages, etc). These pages return a 200/401 but
  // contain no real job data, so they must be treated as blocked rather
  // than scraped for company info.
  "authenticating",
  "ready to take the next step",
  "redirecting to login",
  "sign in to continue",
  "just a moment",
  "checking your browser",
  "verifying you are human",
  "enable javascript and cookies",
  "one more step",
  "let's confirm you are human",
  "confirm you are human",
];

const PLATFORM_MARKETING_PATTERNS = [
  /^unstop\s*[-:|–—]/i,
  /^dare2compete\s*[-:|–—]/i,
  /competitions?,\s*quizzes?,\s*hackathons?/i,
];

const GENERIC_COMPANY_NAMES = new Set([
  "linkedin",
  "indeed",
  "naukri",
  "unstop",
  "dare2compete",
  "wellfound",
  "angel",
  "greenhouse",
  "lever",
  "workday",
  "workdayjobs",
  "myworkdayjobs",
  "ashbyhq",
  "jobs",
  "careers",
  "career",
  "company",
  "employer",
  "organization",
  "organisation",
  "hiring",
  "opening",
  "openings",
  "remote",
  "india",
]);

// Values that are technically valid strings (length, characters, etc.) but
// are clearly not real company names. These typically leak in from
// attributes that are used as boolean/status flags by unrelated widgets on
// a page (e.g. <div data-company-name="true"> used by an A/B test or
// loading-state component), rather than actually holding a company name.
const JUNK_COMPANY_VALUES = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "none",
  "n/a",
  "na",
  "nan",
  "yes",
  "no",
  "unknown",
  "test",
  "todo",
  "loading",
  "pending",
  "error",
  "null undefined",
  "-",
  "--",
  "n.a",
  "n.a.",
]);

const JUNK_COMPANY_PATTERN =
  /^(true|false|null|undefined|none|n\/?\.?a\.?|yes|no|loading|pending|unknown|error)$/i;

const CAREER_KEYWORDS = [
  "career",
  "careers",
  "job",
  "jobs",
  "job-listing",
  "job-listings",
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
];

const ROLE_WORDS = new Set([
  "accountant",
  "administrator",
  "advisor",
  "analyst",
  "architect",
  "associate",
  "consultant",
  "controller",
  "coordinator",
  "developer",
  "director",
  "engineer",
  "executive",
  "expert",
  "head",
  "intern",
  "lead",
  "leader",
  "manager",
  "officer",
  "operator",
  "partner",
  "programmer",
  "recruiter",
  "representative",
  "scientist",
  "specialist",
  "supervisor",
  "support",
  "technician",
  "trainee",
]);

const JOB_CONTEXT_WORDS = new Set([
  ...ROLE_WORDS,
  "business",
  "risk",
  "domain",
  "senior",
  "junior",
  "sr",
  "jr",
  "assistant",
  "principal",
  "staff",
  "remote",
  "hybrid",
  "fulltime",
  "full-time",
  "parttime",
  "part-time",
  "contract",
  "walkin",
  "urgent",
  "hiring",
  "recruiting",
  "requirement",
  "immediate",
  "opening",
]);

const COMPANY_SUFFIX_WORDS = new Set([
  "services",
  "solutions",
  "technologies",
  "technology",
  "systems",
  "consultancy",
  "consulting",
  "software",
  "labs",
  "laboratories",
  "group",
  "industries",
  "enterprises",
  "ventures",
  "capital",
  "bank",
  "motors",
  "pharma",
  "pharmaceuticals",
  "foods",
  "retail",
  "infra",
  "infrastructure",
  "logistics",
  "networks",
  "communications",
  "telecom",
  "energy",
  "power",
  "finance",
  "financial",
  "insurance",
  "media",
  "ltd",
  "limited",
  "pvt",
  "private",
  "inc",
  "llp",
  "llc",
  "corp",
  "corporation",
  "plc",
]);

const ACTION_WORDS = new Set([
  "apply",
  "click",
  "learn",
  "view",
  "see",
  "search",
  "find",
  "start",
  "get",
  "take",
  "join",
  "sign",
  "continue",
  "discover",
  "explore",
  "submit",
]);

const NAUKRI_LOCATIONS = [
  "mumbai-all-areas",
  "hyderabad-secunderabad",
  "delhi-ncr",
  "greater-noida",
  "navi-mumbai",
  "new-delhi",
  "bengaluru",
  "bangalore",
  "hyderabad",
  "gurugram",
  "gurgaon",
  "faridabad",
  "ghaziabad",
  "chandigarh",
  "bhubaneswar",
  "ahmedabad",
  "vadodara",
  "visakhapatnam",
  "coimbatore",
  "thiruvananthapuram",
  "noida",
  "delhi",
  "pune",
  "mumbai",
  "chennai",
  "kolkata",
  "jaipur",
  "indore",
  "kochi",
  "cochin",
  "lucknow",
  "mohali",
  "nagpur",
  "surat",
  "thane",
  "remote",
  "india",
];

const ACRONYMS = new Set([
  "ai",
  "api",
  "aws",
  "bi",
  "bpo",
  "ca",
  "cfo",
  "cto",
  "devops",
  "hr",
  "it",
  "qa",
  "seo",
  "ui",
  "ux",
]);

const LEGAL_SUFFIX_PATTERN =
  /\s+(?:private\s+limited|pvt\.?\s*ltd\.?|pvt\.?\s+limited|limited|ltd\.?|llp|llc|opc|inc\.?|corp\.?|corporation|plc)\s*$/i;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/* ============================================================================
 * BASIC HELPERS
 * ========================================================================== */

export const cleanText = (value = "") =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeInputUrl = (value = "") => {
  const url = cleanText(value);

  if (!url) {
    return "";
  }

  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export const normalizeCompanyName = (value = "") =>
  cleanText(value)
    .toLowerCase()
    .replace(/\bprivate\s+limited\b/g, "")
    .replace(/\bpvt\.?\s*ltd\.?\b/g, "")
    .replace(/\bpvt\.?\s+limited\b/g, "")
    .replace(/\blimited\b/g, "")
    .replace(/\bltd\.?\b/g, "")
    .replace(/\bllp\b/g, "")
    .replace(/\bllc\b/g, "")
    .replace(/\bopc\b/g, "")
    .replace(/\binc\.?\b/g, "")
    .replace(/\bcorp\.?\b/g, "")
    .replace(/\bcorporation\b/g, "")
    .replace(/\bplc\b/g, "")
    .replace(/\bcompany\b/g, "")
    .replace(/\bco\.?\b/g, "")
    .replace(/\bindia\b/g, "")
    .replace(/\bglobal\b/g, "")
    .replace(/[^a-z0-9]/g, "");

const normalizePhrase = (value = "") =>
  cleanText(value)
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const toTitleCase = (value = "") =>
  cleanText(value)
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();

      if (ACRONYMS.has(lower)) {
        return lower.toUpperCase();
      }

      return lower ? `${lower[0].toUpperCase()}${lower.slice(1)}` : "";
    })
    .join(" ");

const slugToCompanyName = (value = "") =>
  toTitleCase(
    decodeURIComponent(String(value || ""))
      .replace(/[_-]+/g, " ")
      .trim(),
  );

const getHost = (urlOrParsed) => {
  try {
    const parsed =
      typeof urlOrParsed === "string"
        ? new URL(normalizeInputUrl(urlOrParsed))
        : urlOrParsed;

    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

/* ============================================================================
 * CLEANERS
 * ========================================================================== */

const isBlockedValue = (value = "") => {
  const normalized = cleanText(value).toLowerCase();

  return BLOCKED_PAGE_VALUES.some((blocked) => normalized.includes(blocked));
};

const isPlatformMarketingText = (value = "") =>
  PLATFORM_MARKETING_PATTERNS.some((pattern) => pattern.test(cleanText(value)));

const isGenericCompanyValue = (value = "") =>
  GENERIC_COMPANY_NAMES.has(normalizeCompanyName(value));

// Guards against boolean/status-flag style values ("true", "false", "null",
// "N/A", pure numbers, punctuation-only strings, ...) that pass every other
// structural check but are clearly not company names. This is the fix for
// values like `data-company-name="true"` (a feature flag on an unrelated
// element) being mistaken for a real company.
const isJunkCompanyValue = (value = "") => {
  const normalized = cleanText(value).toLowerCase();

  if (!normalized) {
    return true;
  }

  if (JUNK_COMPANY_VALUES.has(normalized)) {
    return true;
  }

  if (JUNK_COMPANY_PATTERN.test(normalized)) {
    return true;
  }

  // Purely numeric (e.g. "123", "0", "3.5") is never a company name.
  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return true;
  }

  // No alphanumeric characters at all (e.g. "-", "--", "...").
  if (!/[a-z0-9]/i.test(normalized)) {
    return true;
  }

  return false;
};

export const cleanCompanyName = (value = "") => {
  const raw = cleanText(value);

  if (
    !raw ||
    isBlockedValue(raw) ||
    isPlatformMarketingText(raw) ||
    isJunkCompanyValue(raw)
  ) {
    return "";
  }

  const cleaned = raw
    .replace(/^\d+\s+/, "")
    .replace(/\|.*$/g, "")
    .replace(
      /\s*[-–—]\s*(LinkedIn|Naukri|Indeed|Unstop|Dare2Compete|Wellfound|Glassdoor|Internshala|Foundit|Monster|Cutshort).*$/gi,
      "",
    )
    .replace(/\s*[-–—]\s*Jobs.*$/gi, "")
    .replace(
      /\s+(Careers|Hiring|Openings|Opening|Job|Jobs|Internship|Internships|Reviews)\s*$/gi,
      "",
    )
    .trim();

  if (
    cleaned.length < 2 ||
    cleaned.length > 160 ||
    isBlockedValue(cleaned) ||
    isPlatformMarketingText(cleaned) ||
    isGenericCompanyValue(cleaned) ||
    isJunkCompanyValue(cleaned)
  ) {
    return "";
  }

  return cleaned;
};

const cleanJobTitle = (value = "") => {
  const raw = cleanText(value);

  if (!raw || isBlockedValue(raw) || isPlatformMarketingText(raw)) {
    return "";
  }

  return raw
    .replace(/\|.*$/g, "")
    .replace(
      /\s*[-–—]\s*(Workday|Careers|Jobs|Naukri|LinkedIn|Indeed).*$/gi,
      "",
    )
    .trim();
};

export const canonicalizeCompanyBrand = (value = "") => cleanCompanyName(value);

/* ============================================================================
 * CANDIDATE VALIDATION
 * ========================================================================== */

const isValidCompanyCandidate = (value = "", context = {}) => {
  const text = cleanText(value);

  if (!text || text.length < 2 || text.length > 160) {
    return false;
  }

  // Reject boolean/status-flag style junk ("true", "false", "null", "N/A",
  // pure numbers, etc.) before anything else. This is the single
  // gatekeeper used by every extraction path (structured-html, JSON-LD,
  // platform-dom, labeled-dom, embedded-state, metadata), so fixing it
  // here fixes the bug everywhere at once.
  if (isJunkCompanyValue(text)) {
    return false;
  }

  if (
    isBlockedValue(text) ||
    isPlatformMarketingText(text) ||
    isGenericCompanyValue(text)
  ) {
    return false;
  }

  if (/[!?]/.test(text)) {
    return false;
  }

  const words = normalizePhrase(text).split(" ").filter(Boolean);

  if (words.length > 8) {
    return false;
  }

  const actionCount = words.filter((word) => ACTION_WORDS.has(word)).length;

  if (words.length <= 6 && actionCount >= 2) {
    return false;
  }

  const jobContextCount = words.filter((word) =>
    JOB_CONTEXT_WORDS.has(word),
  ).length;

  if (words.length <= 5 && jobContextCount >= Math.ceil(words.length / 2)) {
    return false;
  }

  const elementName = String(context.elementName || "").toLowerCase();

  if (elementName === "button" || elementName === "input") {
    return false;
  }

  if (context.requiredJobRelation && !context.hasJobRelation) {
    return false;
  }

  return true;
};

const isSameCompanyAndTitle = (companyName = "", jobTitle = "") => {
  const company = normalizeCompanyName(companyName);

  const title = normalizeCompanyName(jobTitle);

  if (!company || !title) {
    return false;
  }

  return (
    company === title || company.includes(title) || title.includes(company)
  );
};

/* ============================================================================
 * PLATFORM DETECTION
 * ========================================================================== */

const isLinkedInHost = (host = "") =>
  host === "linkedin.com" || host.endsWith(".linkedin.com");

const isNaukriHost = (host = "") =>
  host === "naukri.com" || host.endsWith(".naukri.com");

const isUnstopHost = (host = "") =>
  host === "unstop.com" ||
  host.endsWith(".unstop.com") ||
  host === "dare2compete.com" ||
  host.endsWith(".dare2compete.com");

const isIndeedHost = (host = "") =>
  host === "indeed.com" || host.endsWith(".indeed.com");

const isWellfoundHost = (host = "") =>
  host === "wellfound.com" || host === "angel.co" || host.endsWith(".angel.co");

const isGreenhouseHost = (host = "") =>
  host === "boards.greenhouse.io" ||
  host === "job-boards.greenhouse.io" ||
  host.endsWith(".greenhouse.io");

const isLeverHost = (host = "") =>
  host === "jobs.lever.co" || host.endsWith(".lever.co");

const isWorkdayHost = (host = "") =>
  host.includes("workdayjobs.com") || host.includes("myworkdayjobs.com");

const isAshbyHost = (host = "") =>
  host === "jobs.ashbyhq.com" || host.endsWith(".ashbyhq.com");

export const detectJobPlatform = (jobUrl = "") => {
  const host = getHost(jobUrl);

  if (isLinkedInHost(host)) return JOB_PLATFORMS.LINKEDIN;

  if (isNaukriHost(host)) return JOB_PLATFORMS.NAUKRI;

  if (isUnstopHost(host)) return JOB_PLATFORMS.UNSTOP;

  if (isIndeedHost(host)) return JOB_PLATFORMS.INDEED;

  if (isWellfoundHost(host)) return JOB_PLATFORMS.WELLFOUND;

  if (isGreenhouseHost(host)) return JOB_PLATFORMS.GREENHOUSE;

  if (isLeverHost(host)) return JOB_PLATFORMS.LEVER;

  if (isWorkdayHost(host)) return JOB_PLATFORMS.WORKDAY;

  if (isAshbyHost(host)) return JOB_PLATFORMS.ASHBY;

  return JOB_PLATFORMS.UNKNOWN;
};

const isKnownJobPlatform = (host = "") =>
  KNOWN_JOB_DOMAINS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );

/* ============================================================================
 * URL HELPERS
 * ========================================================================== */

const normalizeUrlForCompare = (value = "") => {
  try {
    const parsed = new URL(normalizeInputUrl(value));

    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`
      .toLowerCase()
      .replace(/\/$/, "");
  } catch {
    return "";
  }
};

const hasJobKeywordInUrl = (parsed) => {
  const text =
    `${parsed.hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  return CAREER_KEYWORDS.some((keyword) => text.includes(keyword));
};

const isPlainCompanyHomepage = (parsed) => {
  const pathname = parsed.pathname.replace(/\/+/g, "/");

  if (pathname === "/" && !parsed.search) {
    return true;
  }

  const parts = pathname.split("/").filter(Boolean);

  return parts.length <= 1 && !parsed.search && !hasJobKeywordInUrl(parsed);
};

/* ============================================================================
 * SECURITY
 * ========================================================================== */

const isPrivateIp = (ip = "") => {
  const family = net.isIP(ip);

  if (!family) {
    return true;
  }

  if (["0.0.0.0", "::", "::1"].includes(ip)) {
    return true;
  }

  if (family === 4) {
    const parts = ip.split(".").map(Number);

    if (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    ) {
      return true;
    }

    return false;
  }

  const normalized = ip.toLowerCase();

  return (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80")
  );
};

const assertSafePublicUrl = async (rawUrl) => {
  const normalized = normalizeInputUrl(rawUrl);

  const parsed = new URL(normalized);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Unsupported URL protocol");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (!hostname || hostname === "localhost" || hostname.endsWith(".local")) {
    throw new Error("Unsafe URL hostname");
  }

  if (net.isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("Private IP is not allowed");
  }

  const addresses = await dns.lookup(hostname, {
    all: true,
  });

  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateIp(address))
  ) {
    throw new Error("Private or internal destination");
  }

  return parsed;
};

/* ============================================================================
 * PLATFORM URL FALLBACKS
 * ========================================================================== */

const extractNaukriJobInfoFromUrl = (url) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    const host = getHost(parsed);

    if (!isNaukriHost(host)) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const path = decodeURIComponent(parsed.pathname).replace(/^\/+|\/+$/g, "");

    if (!/^job-listings(?:-|\/)/i.test(path)) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    let slug = path
      .replace(/^job-listings(?:-|\/)/i, "")
      .replace(/\//g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .replace(/-\d{8,20}$/i, "")
      .replace(/-\d+-to-\d+-years?$/i, "")
      .replace(/-\d+-\d+-years?$/i, "")
      .replace(/-\d+\+?-years?$/i, "");

    for (const location of [...NAUKRI_LOCATIONS].sort(
      (a, b) => b.length - a.length,
    )) {
      if (slug.endsWith(`-${location}`)) {
        slug = slug.slice(0, -location.length - 1);
        break;
      }
    }

    const tokens = slug
      .split("-")
      .filter(Boolean)
      .map((x) => x.toLowerCase());

    let best = null;

    for (
      let companySize = 1;
      companySize <= Math.min(5, tokens.length - 1);
      companySize += 1
    ) {
      const start = tokens.length - companySize;

      const companyTokens = tokens.slice(start);

      const titleTokens = tokens.slice(0, start);

      const company = cleanCompanyName(toTitleCase(companyTokens.join(" ")));

      if (!company || !isValidCompanyCandidate(company)) {
        continue;
      }

      let score = companySize === 2 ? 12 : companySize === 1 ? 6 : 4;

      const lastToken = companyTokens.at(-1);

      if (COMPANY_SUFFIX_WORDS.has(lastToken)) {
        score += 20;
      }

      if (companyTokens.some((token) => JOB_CONTEXT_WORDS.has(token))) {
        score -= 15;
      }

      const roleCount = titleTokens.filter((token) =>
        ROLE_WORDS.has(token),
      ).length;

      score += roleCount * 7;

      if (!best || score > best.score) {
        best = {
          company,
          titleTokens,
          score,
        };
      }
    }

    return {
      jobTitle: cleanJobTitle(toTitleCase(best?.titleTokens?.join(" ") || "")),
      companyName: best?.company || "",
    };
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const extractUnstopJobInfoFromUrl = (url) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    const parts = decodeURIComponent(parsed.pathname)
      .split("/")
      .filter(Boolean);

    const index = parts.findIndex((part) =>
      ["job", "jobs", "internship", "internships"].includes(part.toLowerCase()),
    );

    if (index === -1 || !parts[index + 1]) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const slug = parts[index + 1].replace(/-\d{4,20}$/i, "");

    const tokens = slug.split("-").filter(Boolean);

    for (let size = 1; size <= Math.min(4, tokens.length - 1); size += 1) {
      const start = tokens.length - size;

      const company = cleanCompanyName(
        toTitleCase(tokens.slice(start).join(" ")),
      );

      if (isValidCompanyCandidate(company)) {
        return {
          jobTitle: cleanJobTitle(
            toTitleCase(tokens.slice(0, start).join(" ")),
          ),
          companyName: company,
        };
      }
    }

    return {
      jobTitle: "",
      companyName: "",
    };
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const extractWorkdayJobInfoFromUrl = (url) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    const host = getHost(parsed);

    if (!isWorkdayHost(host)) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const hostParts = host.split(".").filter(Boolean);

    const wdIndex = hostParts.findIndex((part) => /^wd\d+$/i.test(part));

    const tenant = wdIndex > 0 ? hostParts[wdIndex - 1] : "";

    const pathParts = parsed.pathname.split("/").filter(Boolean);

    const localeIndex = pathParts.findIndex((part) =>
      /^[a-z]{2}-[a-z]{2}$/i.test(part),
    );

    const site = localeIndex !== -1 ? pathParts[localeIndex + 1] : "";

    const jobSlug = pathParts.at(-1) || "";

    return {
      jobTitle: cleanJobTitle(
        jobSlug
          .replace(/_(?:JR|REF|R|REQ|JOB)[-_]?\d.*$/i, "")
          .replace(/[-_]+/g, " "),
      ),

      companyName: cleanCompanyName(slugToCompanyName(tenant || site)),
    };
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const extractCompanyFromPlatformUrl = (url) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    const host = getHost(parsed);

    const parts = parsed.pathname.split("/").filter(Boolean);

    if (isNaukriHost(host)) {
      return extractNaukriJobInfoFromUrl(url).companyName;
    }

    if (isUnstopHost(host)) {
      return extractUnstopJobInfoFromUrl(url).companyName;
    }

    if (isWorkdayHost(host)) {
      return extractWorkdayJobInfoFromUrl(url).companyName;
    }

    if (isGreenhouseHost(host)) {
      const slug =
        host === "boards.greenhouse.io" || host === "job-boards.greenhouse.io"
          ? parts[0]
          : host.split(".")[0];

      return cleanCompanyName(slugToCompanyName(slug));
    }

    if (isLeverHost(host)) {
      const slug = host === "jobs.lever.co" ? parts[0] : host.split(".")[0];

      return cleanCompanyName(slugToCompanyName(slug));
    }

    if (isAshbyHost(host)) {
      const slug = host === "jobs.ashbyhq.com" ? parts[0] : host.split(".")[0];

      return cleanCompanyName(slugToCompanyName(slug));
    }

    if (isWellfoundHost(host)) {
      const companyIndex = parts.findIndex(
        (part) => part.toLowerCase() === "company",
      );

      if (companyIndex !== -1 && parts[companyIndex + 1]) {
        return cleanCompanyName(slugToCompanyName(parts[companyIndex + 1]));
      }

      const jobsIndex = parts.findIndex(
        (part) => part.toLowerCase() === "jobs",
      );

      if (jobsIndex > 0) {
        return cleanCompanyName(slugToCompanyName(parts[jobsIndex - 1]));
      }
    }

    return "";
  } catch {
    return "";
  }
};

const extractDeterministicCompanyFromPlatformUrl = (url, platform) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));
    const host = getHost(parsed);
    const parts = parsed.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => decodeURIComponent(part));

    let slug = "";

    if (
      platform === JOB_PLATFORMS.LEVER &&
      host === "jobs.lever.co" &&
      parts.length >= 2
    ) {
      slug = parts[0];
    } else if (
      platform === JOB_PLATFORMS.GREENHOUSE &&
      ["boards.greenhouse.io", "job-boards.greenhouse.io"].includes(host) &&
      parts.length >= 2
    ) {
      slug = parts[0];
    } else if (
      platform === JOB_PLATFORMS.ASHBY &&
      host === "jobs.ashbyhq.com" &&
      parts.length >= 2
    ) {
      slug = parts[0];
    } else if (
      platform === JOB_PLATFORMS.WELLFOUND &&
      parts[0]?.toLowerCase() === "company" &&
      parts[1]
    ) {
      slug = parts[1];
    } else if (
      platform === JOB_PLATFORMS.LINKEDIN &&
      parts[0]?.toLowerCase() === "company" &&
      parts[1]
    ) {
      slug = parts[1];
    }

    const company = cleanCompanyName(slugToCompanyName(slug));

    return isValidCompanyCandidate(company) ? company : "";
  } catch {
    return "";
  }
};

export const extractCompanyNameFromCareerUrl = (url = "") => {
  const platformCompany = extractCompanyFromPlatformUrl(url);

  if (platformCompany) {
    return platformCompany;
  }

  try {
    const parsed = new URL(normalizeInputUrl(url));

    const host = getHost(parsed);

    if (isKnownJobPlatform(host)) {
      return "";
    }

    const parts = host.split(".").filter(Boolean);

    if (parts.length < 2) {
      return "";
    }

    const ignored = new Set([
      "www",
      "career",
      "careers",
      "job",
      "jobs",
      "hiring",
      "work",
      "apply",
      "boards",
    ]);

    const companyPart = ignored.has(parts[0]) ? parts[1] : parts[0];

    return cleanCompanyName(slugToCompanyName(companyPart));
  } catch {
    return "";
  }
};

/* ============================================================================
 * JSON-LD
 * ========================================================================== */

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getJsonType = (value) => {
  if (!value || typeof value !== "object") {
    return [];
  }

  const type = value["@type"];

  return Array.isArray(type)
    ? type.map((x) => String(x).toLowerCase())
    : typeof type === "string"
      ? [type.toLowerCase()]
      : [];
};

const extractOrganizationName = (value) => {
  if (!value || typeof value !== "object") {
    return "";
  }

  const org = value.hiringOrganization;

  if (typeof org === "string") {
    return cleanCompanyName(org);
  }

  if (org && typeof org === "object") {
    return cleanCompanyName(org.name || org.legalName || org.alternateName);
  }

  return cleanCompanyName(
    value.jobCompanyName ||
      value.jobCompany ||
      value.companyName ||
      value.company_name ||
      value.employerName ||
      value.employer_name ||
      value.organizationName ||
      value.organisationName,
  );
};

const extractJobPostingObjects = (value, result = [], depth = 0) => {
  if (!value || depth > 15) {
    return result;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      extractJobPostingObjects(item, result, depth + 1);
    }

    return result;
  }

  if (typeof value !== "object") {
    return result;
  }

  const types = getJsonType(value);

  if (types.some((type) => type.endsWith("jobposting"))) {
    const jobTitle = cleanJobTitle(
      value.jobTitle || value.title || value.postingTitle,
    );

    const companyName = extractOrganizationName(value);

    if (jobTitle || companyName) {
      result.push({
        jobTitle,
        companyName,
      });
    }
  }

  for (const child of Object.values(value)) {
    extractJobPostingObjects(child, result, depth + 1);
  }

  return result;
};

const extractJsonLdCandidates = ($) => {
  const result = [];

  $('script[type="application/ld+json"]').each((_, script) => {
    const raw = $(script).text();

    if (!raw || raw.length > 1_000_000) {
      return;
    }

    const parsed = safeJsonParse(raw);

    if (!parsed) {
      return;
    }

    extractJobPostingObjects(parsed, result);
  });

  return result;
};

/* ============================================================================
 * EMBEDDED STATE
 * ========================================================================== */

const collectStateCandidates = (value, result = [], depth = 0) => {
  if (!value || depth > 14) {
    return result;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStateCandidates(item, result, depth + 1);
    }

    return result;
  }

  if (typeof value !== "object") {
    return result;
  }

  const jobTitle = cleanJobTitle(
    value.jobTitle ||
      value.job_title ||
      value.postingTitle ||
      value.jobPostingTitle,
  );

  const companyName = extractOrganizationName(value);

  if (jobTitle && companyName && isValidCompanyCandidate(companyName)) {
    result.push({
      jobTitle,
      companyName,
    });
  }

  for (const child of Object.values(value)) {
    collectStateCandidates(child, result, depth + 1);
  }

  return result;
};

const extractStateCandidates = ($) => {
  const result = [];

  $('#__NEXT_DATA__,script#__NEXT_DATA__,script[type="application/json"]').each(
    (_, script) => {
      const raw = $(script).text();

      if (!raw || raw.length > 1_000_000) {
        return;
      }

      const parsed = safeJsonParse(raw);

      if (parsed) {
        collectStateCandidates(parsed, result);
      }
    },
  );

  return result;
};

/* ============================================================================
 * DOM
 * ========================================================================== */

const PLATFORM_DOM_SELECTORS = {
  [JOB_PLATFORMS.LINKEDIN]: {
    company: [
      ".topcard__org-name-link",
      '[data-tracking-control-name="public_jobs_topcard-org-name"]',
      ".topcard__flavor",
    ],
    title: [".topcard__title", "h1"],
  },

  [JOB_PLATFORMS.NAUKRI]: {
    company: [
      '[data-automation-id="jobPostingCompany"]',
      '[data-automation-id="companyName"]',
      ".jd-header-comp-name",
      '[class*="jd-header-comp-name"]',
    ],
    title: [
      '[data-automation-id="jobPostingHeader"]',
      '[data-automation-id="jobPostingTitle"]',
      ".jd-header-title",
      "h1",
    ],
  },

  [JOB_PLATFORMS.UNSTOP]: {
    company: [
      '[data-testid="company-name"]',
      "[data-company-name]",
      "[data-employer-name]",
    ],
    title: ['[data-testid="job-title"]', "h1"],
  },

  [JOB_PLATFORMS.WELLFOUND]: {
    company: [
      '[data-testid="company-name"]',
      "[data-company-name]",
      '[itemprop="name"]',
    ],
    title: ['[data-testid="job-title"]', "h1"],
  },

  [JOB_PLATFORMS.GREENHOUSE]: {
    company: [
      '[data-qa="company-name"]',
      '[data-testid="company-name"]',
      '[itemprop="name"]',
    ],
    title: ['[data-qa="job-title"]', "h1"],
  },

  [JOB_PLATFORMS.LEVER]: {
    company: [
      '[data-qa="posting-company"]',
      '[data-testid="company-name"]',
      '[itemprop="name"]',
    ],
    title: ['[data-qa="posting-name"]', '[data-testid="job-title"]', "h1"],
  },

  [JOB_PLATFORMS.WORKDAY]: {
    company: [
      '[data-automation-id="jobPostingCompany"]',
      '[data-automation-id="company"]',
      '[itemprop="hiringOrganization"] [itemprop="name"]',
      '[itemprop="hiringOrganization"]',
    ],
    title: [
      '[data-automation-id="jobPostingHeader"]',
      '[data-automation-id="jobPostingTitle"]',
      "h1",
    ],
  },

  [JOB_PLATFORMS.ASHBY]: {
    company: [
      '[data-testid="company-name"]',
      "[data-company-name]",
      '[itemprop="name"]',
    ],
    title: ['[data-testid="job-title"]', "h1"],
  },
};

const getElementCandidate = ($, node) => {
  const elementName = node[0]?.name || "";

  const values = [
    node.attr("content"),
    node.attr("data-company-name"),
    node.attr("data-employer-name"),
    node.attr("title"),
    node.text(),
  ];

  for (const value of values) {
    const company = cleanCompanyName(value);

    if (
      isValidCompanyCandidate(company, {
        elementName,
      })
    ) {
      return company;
    }
  }

  return "";
};

const extractPlatformDomCandidate = ($, platform, kind) => {
  const selectors = PLATFORM_DOM_SELECTORS[platform]?.[kind] || [];

  for (const selector of selectors) {
    const node = $(selector).first();

    if (!node.length) {
      continue;
    }

    if (kind === "company") {
      const company = getElementCandidate($, node);

      if (company) {
        return company;
      }
    } else {
      const title = cleanJobTitle(node.attr("content") || node.text());

      if (title) {
        return title;
      }
    }
  }

  return "";
};

const extractLabeledCompanyValue = ($) => {
  const labels =
    /^(company|employer|organization|organisation|hiring organization|hiring organisation)$/i;

  let result = "";

  $("dt,dt + dd,label,span,div,p").each((_, element) => {
    if (result) {
      return;
    }

    const label = cleanText($(element).text());

    if (!labels.test(label)) {
      return;
    }

    const parent = $(element).parent();

    const values = [
      parent.find("dd").first().text(),
      parent.find("a").first().text(),
      $(element).next().text(),
    ];

    for (const value of values) {
      const company = cleanCompanyName(value);

      if (isValidCompanyCandidate(company)) {
        result = company;
        break;
      }
    }
  });

  return result;
};

/* ============================================================================
 * BLOCK PAGE DETECTION
 * ========================================================================== */

const isBlockedHtmlPage = (html = "") => {
  if (!html) {
    return false;
  }

  const $ = cheerio.load(html);

  const title = cleanText($("title").text()).toLowerCase();

  const h1 = cleanText($("h1").first().text()).toLowerCase();

  const body = cleanText($("body").text()).slice(0, 3000).toLowerCase();

  return BLOCKED_PAGE_VALUES.some(
    (blocked) =>
      title.includes(blocked) ||
      h1.includes(blocked) ||
      body.startsWith(blocked) ||
      body.includes(` ${blocked} `),
  );
};

/* ============================================================================
 * META
 * ========================================================================== */

const extractCompanyFromMetaText = (value = "") => {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  const patterns = [
    /\bjob\s+at\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
    /\bhiring\s+(?:at|for)\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
    /\bcareers?\s+(?:at|for)\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
  ];

  for (const pattern of patterns) {
    const company = cleanCompanyName(text.match(pattern)?.[1]);

    if (isValidCompanyCandidate(company)) {
      return company;
    }
  }

  return "";
};

/* ============================================================================
 * HTML EXTRACTOR
 * ========================================================================== */

const extractJobInfoFromHtml = (
  html = "",
  platform = JOB_PLATFORMS.UNKNOWN,
) => {
  if (!html) {
    return {
      jobTitle: "",
      companyName: "",
      companySource: "",
      companyConfidence: 0,
    };
  }

  if (isBlockedHtmlPage(html)) {
    debugLog("BLOCKED_HTML", {
      platform,
    });

    return {
      jobTitle: "",
      companyName: "",
      companySource: "",
      companyConfidence: 0,
    };
  }

  const $ = cheerio.load(html);

  debugLog("CHEERIO_START", {
    platform,
    htmlLength: html.length,
    title: cleanText($("title").text()),
    h1: cleanText($("h1").first().text()),
    jsonLdCount: $('script[type="application/ld+json"]').length,
  });

  let jobTitle = "";
  let companyName = "";
  let companySource = "";
  let companyConfidence = 0;

  /* ------------------------------------------------------------------------
   * 1. Structured HTML
   * ---------------------------------------------------------------------- */

  const structuredCompany = (() => {
    const selectors = [
      "[data-company-name]",
      "[data-employer-name]",
      '[itemprop="hiringOrganization"] [itemprop="name"]',
      '[itemprop="hiringOrganization"]',
    ];

    for (const selector of selectors) {
      const node = $(selector).first();

      if (!node.length) {
        continue;
      }

      const candidate = getElementCandidate($, node);

      if (candidate) {
        return candidate;
      }
    }

    return "";
  })();

  debugLog("STRUCTURED_HTML", {
    company: structuredCompany || "<empty>",
  });

  if (structuredCompany) {
    companyName = structuredCompany;

    companySource = "structured-html";

    companyConfidence = 0.97;
  }

  /* ------------------------------------------------------------------------
   * 2. JSON-LD
   * ---------------------------------------------------------------------- */

  const jsonLdCandidates = extractJsonLdCandidates($);

  debugLog("JSON_LD", {
    candidates: jsonLdCandidates,
  });

  for (const candidate of jsonLdCandidates) {
    if (!jobTitle && candidate.jobTitle) {
      jobTitle = candidate.jobTitle;
    }

    if (
      !companyName &&
      candidate.companyName &&
      isValidCompanyCandidate(candidate.companyName)
    ) {
      companyName = candidate.companyName;

      companySource = "json-ld";

      companyConfidence = 0.995;
    }

    if (jobTitle && companyName) {
      break;
    }
  }

  /* ------------------------------------------------------------------------
   * 3. Platform DOM
   * ---------------------------------------------------------------------- */

  if (!jobTitle) {
    jobTitle = extractPlatformDomCandidate($, platform, "title");
  }

  if (!companyName) {
    const candidate = extractPlatformDomCandidate($, platform, "company");

    debugLog("PLATFORM_DOM", {
      platform,
      company: candidate || "<empty>",
    });

    if (candidate) {
      companyName = candidate;

      companySource = "platform-dom";

      companyConfidence = 0.92;
    }
  }

  /* ------------------------------------------------------------------------
   * 4. Label/value DOM
   * ---------------------------------------------------------------------- */

  if (!companyName) {
    const candidate = extractLabeledCompanyValue($);

    debugLog("LABELED_DOM", {
      company: candidate || "<empty>",
    });

    if (candidate) {
      companyName = candidate;

      companySource = "labeled-dom";

      companyConfidence = 0.89;
    }
  }

  /* ------------------------------------------------------------------------
   * 5. Embedded app state
   * ---------------------------------------------------------------------- */

  const stateCandidates = extractStateCandidates($);

  debugLog("EMBEDDED_STATE", {
    candidates: stateCandidates,
  });

  for (const candidate of stateCandidates) {
    if (!jobTitle && candidate.jobTitle) {
      jobTitle = candidate.jobTitle;
    }

    if (!companyName && candidate.companyName) {
      companyName = candidate.companyName;

      companySource = "embedded-state";

      companyConfidence = 0.94;
    }

    if (jobTitle && companyName) {
      break;
    }
  }

  /* ------------------------------------------------------------------------
   * 6. Metadata
   * ---------------------------------------------------------------------- */

  if (!companyName) {
    const metadata = [
      $('meta[property="og:title"]').attr("content"),

      $('meta[name="twitter:title"]').attr("content"),

      $('meta[name="description"]').attr("content"),

      $('meta[property="og:description"]').attr("content"),
    ];

    debugLog("METADATA", {
      values: metadata,
    });

    for (const value of metadata) {
      const candidate = extractCompanyFromMetaText(value);

      if (candidate) {
        companyName = candidate;

        companySource = "metadata";

        companyConfidence = 0.72;

        break;
      }
    }
  }

  /* ------------------------------------------------------------------------
   * 7. Title fallback
   * ---------------------------------------------------------------------- */

  if (!jobTitle) {
    const title = cleanJobTitle(
      $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        $("h1").first().text(),
    );

    jobTitle = title || "";
  }

  jobTitle = cleanJobTitle(jobTitle);

  companyName = cleanCompanyName(companyName);

  /* ------------------------------------------------------------------------
   * 8. Final safety checks
   * ---------------------------------------------------------------------- */

  if (!isValidCompanyCandidate(companyName)) {
    companyName = "";
    companySource = "";
    companyConfidence = 0;
  }

  if (isSameCompanyAndTitle(companyName, jobTitle)) {
    companyName = "";
    companySource = "";
    companyConfidence = 0;
  }

  debugLog("HTML_FINAL", {
    platform,
    jobTitle,
    companyName,
    companySource,
    companyConfidence,
  });

  return {
    jobTitle,
    companyName,
    companySource,
    companyConfidence,
  };
};

/* ============================================================================
 * AXIOS
 * ========================================================================== */

const fetchHtmlSafely = async (url) => {
  let currentUrl = normalizeInputUrl(url);

  const MAX_REDIRECTS = 5;

  for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
    const redirectPlatform = detectJobPlatform(currentUrl);

    if (
      redirectPlatform === JOB_PLATFORMS.UNKNOWN ||
      isUnsupportedPlatform(redirectPlatform)
    ) {
      throw new Error("Redirected to an unsupported platform");
    }

    const safeUrl = await assertSafePublicUrl(currentUrl);

    const response = await axios.get(safeUrl.toString(), {
      timeout: 5000,
      maxRedirects: 0,
      maxContentLength: 5 * 1024 * 1024,
      maxBodyLength: 5 * 1024 * 1024,
      responseType: "text",

      validateStatus: (status) => status >= 200 && status < 400,

      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    debugLog("AXIOS_RESPONSE", {
      url: safeUrl.toString(),
      status: response.status,
      contentType: response.headers?.["content-type"] || "",
    });

    if (response.status >= 200 && response.status < 300) {
      return {
        html:
          typeof response.data === "string"
            ? response.data
            : String(response.data || ""),

        finalUrl: safeUrl.toString(),
      };
    }

    const location = response.headers?.location;

    if (!location || i === MAX_REDIRECTS) {
      throw new Error("Too many or invalid redirects");
    }

    currentUrl = new URL(location, safeUrl).toString();
  }

  throw new Error("Redirect limit exceeded");
};

const isNonRetryableHttpStatus = (status) =>
  [401, 403, 404, 408, 429, 500, 502, 503].includes(status);

/* ============================================================================
 * PLAYWRIGHT
 * ========================================================================== */

let browserPromise = null;
let browserIdleTimer = null;

// Tracks how many scrapes are currently using the shared browser instance.
// The idle-shutdown timer must never fire while this is > 0 - otherwise a
// slow scrape (e.g. stuck behind a bot-detection redirect) can have its
// browser/context closed out from under it by an unrelated timer, producing
// errors like "Target page, context or browser has been closed".
let activeBrowserUsers = 0;

const BROWSER_IDLE_MS = 60_000;

const clearBrowserIdleTimer = () => {
  if (browserIdleTimer) {
    clearTimeout(browserIdleTimer);
    browserIdleTimer = null;
  }
};

const scheduleBrowserShutdown = () => {
  clearBrowserIdleTimer();

  // Don't arm the shutdown timer while a scrape is actively running.
  if (activeBrowserUsers > 0) {
    return;
  }

  browserIdleTimer = setTimeout(async () => {
    // Re-check in case a new scrape started while we were waiting.
    if (activeBrowserUsers > 0) {
      return;
    }

    const current = browserPromise;

    browserPromise = null;

    try {
      const browser = await current;

      await browser?.close();
    } catch {
      // Best effort.
    }
  }, BROWSER_IDLE_MS);

  browserIdleTimer.unref?.();
};

const launchBrowser = () =>
  chromium
    .launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    })
    .catch((error) => {
      browserPromise = null;
      throw error;
    });

const getBrowser = async () => {
  clearBrowserIdleTimer();

  if (!browserPromise) {
    browserPromise = launchBrowser();
  }

  let browser = await browserPromise;

  // The cached browser may have crashed or been closed externally (e.g. a
  // race with the idle-shutdown timer, or the OS killing the process). In
  // that case transparently relaunch instead of handing back a dead
  // instance that will fail on first use.
  if (!browser || !browser.isConnected()) {
    browserPromise = launchBrowser();
    browser = await browserPromise;
  }

  return browser;
};

const isBrowserClosedError = (error) =>
  /has been closed|target closed|browser has been closed/i.test(
    error?.message || "",
  );

const scrapeWithPlaywrightOnce = async (url, platform) => {
  let context = null;

  activeBrowserUsers += 1;

  try {
    await assertSafePublicUrl(url);

    const browser = await getBrowser();

    context = await browser.newContext({
      userAgent: USER_AGENT,

      viewport: {
        width: 1366,
        height: 768,
      },

      locale: "en-IN",
    });

    const page = await context.newPage();

    await page.route("**/*", async (route) => {
      const request = route.request();

      if (request.isNavigationRequest()) {
        const requestPlatform = detectJobPlatform(request.url());

        if (
          requestPlatform === JOB_PLATFORMS.UNKNOWN ||
          isUnsupportedPlatform(requestPlatform)
        ) {
          await route.abort();
          return;
        }
      }

      const type = route.request().resourceType();

      if (["image", "media", "font"].includes(type)) {
        await route.abort();
        return;
      }

      await route.continue();
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 5000,
    });

    debugLog("PLAYWRIGHT_PAGE", {
      requestedUrl: url,

      actualUrl: page.url(),

      title: await page.title().catch(() => ""),

      h1: await page
        .locator("h1")
        .first()
        .textContent()
        .catch(() => ""),

      companyTestId: await page
        .locator('[data-testid="company-name"]')
        .first()
        .textContent()
        .catch(() => ""),

      bodyPreview: (
        await page
          .locator("body")
          .innerText()
          .catch(() => "")
      ).slice(0, 1200),
    });

    const html = await page.content();

    debugLog("PLAYWRIGHT_HTML", {
      htmlLength: html.length,

      blocked: isBlockedHtmlPage(html),
    });

    if (isBlockedHtmlPage(html)) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    return extractJobInfoFromHtml(html, platform);
  } finally {
    try {
      await context?.close();
    } catch {
      // Best effort.
    }

    activeBrowserUsers = Math.max(0, activeBrowserUsers - 1);

    scheduleBrowserShutdown();
  }
};

const scrapeWithPlaywright = async (url, platform) => {
  try {
    return await scrapeWithPlaywrightOnce(url, platform);
  } catch (error) {
    debugLog("PLAYWRIGHT_ERROR", {
      url,
      message: error?.message || "",
    });

    logger.error("Playwright scraping failed", error);

    // If the shared browser instance died mid-scrape (crash, or a race
    // with the idle-shutdown timer), force a relaunch and retry exactly
    // once instead of silently returning empty results.
    if (isBrowserClosedError(error)) {
      browserPromise = null;

      try {
        return await scrapeWithPlaywrightOnce(url, platform);
      } catch (retryError) {
        debugLog("PLAYWRIGHT_RETRY_ERROR", {
          url,
          message: retryError?.message || "",
        });

        logger.error("Playwright retry failed", retryError);
      }
    }

    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

/* ============================================================================
 * SCRAPING PIPELINE
 * ========================================================================== */

const scrapeJobInfoFromUrl = async (url, platform) => {
  /*
   * Protected platforms:
   * use browser first.
   *
   * This is particularly important because Axios commonly gets 403
   * on these platforms when hit with a plain HTTP request.
   */
  const browserFirst = [JOB_PLATFORMS.LINKEDIN, JOB_PLATFORMS.NAUKRI].includes(
    platform,
  );

  if (browserFirst) {
    debugLog("BROWSER_FIRST", {
      platform,
      url,
    });

    const browserResult = await scrapeWithPlaywright(url, platform);

    if (browserResult.companyName || browserResult.jobTitle) {
      return browserResult;
    }
  }

  try {
    const { html, finalUrl } = await fetchHtmlSafely(url);

    const result = extractJobInfoFromHtml(html, platform);

    if (result.companyName || result.jobTitle) {
      return {
        ...result,
        finalUrl,
      };
    }
  } catch (error) {
    debugLog("AXIOS_ERROR", {
      url,
      status: error?.response?.status || null,

      message: error?.message || "",

      contentType: error?.response?.headers?.["content-type"] || "",

      responsePreview:
        typeof error?.response?.data === "string"
          ? error.response.data.slice(0, 1000)
          : "",
    });

    if (isNonRetryableHttpStatus(error?.response?.status)) {
      debugLog("HTTP_BLOCKED", {
        url,
        status: error.response.status,
      });

      return {
        jobTitle: "",
        companyName: "",
      };
    }

    logger.error("Axios scraping failed", error);
  }

  return scrapeWithPlaywright(url, platform);
};

/* ============================================================================
 * CACHE
 * ========================================================================== */

const CACHE_TTL_MS = 15 * 60 * 1000;

const FAILURE_CACHE_TTL_MS = 60 * 1000;

const CACHE_MAX_ENTRIES = 500;

const cache = new Map();

const getFromCache = (key) => {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  cache.delete(key);
  cache.set(key, entry);

  return entry.value;
};

const setInCache = (key, value, ttl) => {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;

    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }

  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
};

/* ============================================================================
 * JOB TITLE URL FALLBACK
 * ========================================================================== */

const titleFromUrlPath = (url) => {
  try {
    const parsed = new URL(normalizeInputUrl(url));

    const parts = parsed.pathname.split("/").filter(Boolean);

    const detailIndex = parts.findIndex(
      (part) => part.toLowerCase() === "details",
    );

    if (detailIndex !== -1 && parts[detailIndex + 1]) {
      return cleanJobTitle(
        decodeURIComponent(parts[detailIndex + 1]).replace(/[-_]+/g, " "),
      );
    }

    return "";
  } catch {
    return "";
  }
};

/* ============================================================================
 * MAIN RESOLVER
 * ========================================================================== */

const resolveJobInfoUncached = async (careerPageUrl) => {
  const normalizedUrl = normalizeInputUrl(careerPageUrl);

  if (!normalizedUrl) {
    return {
      jobTitle: "",
      companyName: "",
      searchCompanyName: "",
    };
  }

  try {
    const parsed = new URL(normalizedUrl);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return {
        jobTitle: "",
        companyName: "",
        searchCompanyName: "",
      };
    }
  } catch {
    return {
      jobTitle: "",
      companyName: "",
      searchCompanyName: "",
    };
  }

  const platform = detectJobPlatform(normalizedUrl);

  debugLog("RESOLUTION_START", {
    inputUrl: careerPageUrl,

    normalizedUrl,
    platform,
  });

  // Unsupported and unknown platforms are rejected immediately - no DNS
  // lookup, HTTP request, Cheerio processing, or browser launch.
  if (platform === JOB_PLATFORMS.UNKNOWN || isUnsupportedPlatform(platform)) {
    debugLog("PLATFORM_NOT_SUPPORTED", {
      platform,
      normalizedUrl,
    });

    return unsupportedPlatformResult(platform);
  }

  const deterministicCompany = extractDeterministicCompanyFromPlatformUrl(
    normalizedUrl,
    platform,
  );

  if (deterministicCompany) {
    debugLog("URL_FAST_PATH", {
      platform,
      company: deterministicCompany,
      source: `url:${platform}`,
      confidence: 1,
    });

    return {
      jobTitle: "",
      companyName: deterministicCompany,
      searchCompanyName: deterministicCompany,
    };
  }

  const urlCompany = cleanCompanyName(
    extractCompanyFromPlatformUrl(normalizedUrl),
  );

  const genericCompany = cleanCompanyName(
    extractCompanyNameFromCareerUrl(normalizedUrl),
  );

  debugLog("URL_CANDIDATES", {
    platform,
    urlCompany: urlCompany || "<empty>",

    genericCompany: genericCompany || "<empty>",
  });

  let scraped = {
    jobTitle: "",
    companyName: "",
    companySource: "",
    companyConfidence: 0,
  };

  /*
   * Always try the page for protected/ambiguous platforms.
   *
   * This prevents Naukri URL guesses such as:
   *
   * business-analyst-risk-domain-infosysltd
   *
   * from automatically becoming the final answer.
   */
  const page = await scrapeJobInfoFromUrl(normalizedUrl, platform);

  scraped = page;

  let jobTitle = cleanJobTitle(
    scraped.jobTitle ||
      (platform === JOB_PLATFORMS.NAUKRI
        ? extractNaukriJobInfoFromUrl(normalizedUrl).jobTitle
        : platform === JOB_PLATFORMS.UNSTOP
          ? extractUnstopJobInfoFromUrl(normalizedUrl).jobTitle
          : platform === JOB_PLATFORMS.WORKDAY
            ? extractWorkdayJobInfoFromUrl(normalizedUrl).jobTitle
            : titleFromUrlPath(normalizedUrl)),
  );

  let companyName = cleanCompanyName(scraped.companyName);

  let source = scraped.companySource || "";

  let confidence = scraped.companyConfidence || 0;

  /*
   * URL fallbacks are used only when page extraction
   * did not produce a company.
   */
  if (!companyName) {
    const bestUrl = [
      {
        value: urlCompany,
        confidence: [
          JOB_PLATFORMS.GREENHOUSE,
          JOB_PLATFORMS.LEVER,
          JOB_PLATFORMS.ASHBY,
        ].includes(platform)
          ? 0.96
          : 0.72,
        source: "platform-url",
      },

      {
        value: genericCompany,
        confidence: 0.58,
        source: "generic-url",
      },
    ]
      .filter(
        (candidate) =>
          candidate.value && isValidCompanyCandidate(candidate.value),
      )
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (bestUrl) {
      companyName = bestUrl.value;

      source = bestUrl.source;

      confidence = bestUrl.confidence;
    }
  }

  /*
   * Final semantic safety check.
   */
  if (isSameCompanyAndTitle(companyName, jobTitle)) {
    companyName = "";
    source = "";
    confidence = 0;
  }

  if (!isValidCompanyCandidate(companyName)) {
    companyName = "";
    source = "";
    confidence = 0;
  }

  const searchCompanyName = companyName;

  debugLog("RESOLUTION_FINAL", {
    platform,
    jobTitle,
    companyName,
    searchCompanyName,
    source,
    confidence,
  });

  /*
   * Keep public response shape clean.
   */
  return {
    jobTitle,
    companyName,

    searchCompanyName: cleanCompanyName(searchCompanyName) || searchCompanyName,
  };
};

/* ============================================================================
 * PUBLIC API
 * ========================================================================== */

export const resolveJobInfoFromCareerUrl = async (careerPageUrl = "") => {
  try {
    const normalizedUrl = normalizeInputUrl(careerPageUrl);

    if (!normalizedUrl) {
      return {
        jobTitle: "",
        companyName: "",
        searchCompanyName: "",
      };
    }

    // Fast-path rejection before even touching the cache/DNS: unsupported
    // and unknown URLs always resolve the same way, so there is nothing
    // worth caching or looking up here either.
    const platform = detectJobPlatform(normalizedUrl);

    if (platform === JOB_PLATFORMS.UNKNOWN || isUnsupportedPlatform(platform)) {
      return unsupportedPlatformResult(platform);
    }

    const cacheKey = normalizeUrlForCompare(normalizedUrl) || normalizedUrl;

    const cached = getFromCache(cacheKey);

    if (cached) {
      debugLog("CACHE_HIT", {
        cacheKey,
      });

      return cached;
    }

    const result = await resolveJobInfoUncached(normalizedUrl);

    setInCache(
      cacheKey,
      result,
      result.companyName ? CACHE_TTL_MS : FAILURE_CACHE_TTL_MS,
    );

    return result;
  } catch (error) {
    logger.error("Failed to resolve job information", error);

    return {
      jobTitle: "",
      companyName: "",
      searchCompanyName: "",
    };
  }
};

export const resolveCompanyNameFromCareerUrl = async (careerPageUrl = "") => {
  const normalizedUrl = normalizeInputUrl(careerPageUrl);

  const info = await resolveJobInfoFromCareerUrl(normalizedUrl);

  return cleanCompanyName(info.companyName || info.searchCompanyName);
};

/* ============================================================================
 * VALIDATION
 * ========================================================================== */

export const validateCareerPageUrl = async (careerPageUrl = "") => {
  if (!careerPageUrl || typeof careerPageUrl !== "string") {
    return {
      valid: false,
      message: "careerPageUrl is required",
    };
  }

  const normalizedUrl = normalizeInputUrl(careerPageUrl);

  let parsed;

  try {
    parsed = new URL(normalizedUrl);
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

  // Detect the platform as early as possible. Unsupported platforms
  // (Indeed) are rejected right here - before the homepage check, the
  // DNS-safety check, and the DB lookup - so an Indeed URL fails fast
  // with a clear message instead of paying for work whose outcome is
  // already decided.
  const platform = detectJobPlatform(normalizedUrl);

  if (platform === JOB_PLATFORMS.UNKNOWN || isUnsupportedPlatform(platform)) {
    return {
      valid: false,
      unsupportedPlatform: true,
      platform,
      reason: "PLATFORM_NOT_SUPPORTED",
      message: UNSUPPORTED_PLATFORM_MESSAGE,
    };
  }

  if (isPlainCompanyHomepage(parsed)) {
    return {
      valid: false,
      message: "Please enter a specific job URL, not a company homepage URL.",
    };
  }

  try {
    await assertSafePublicUrl(normalizedUrl);
  } catch {
    return {
      valid: false,
      message: "Private or internal URLs are not allowed",
    };
  }

  const normalizedForCompare = normalizeUrlForCompare(normalizedUrl);

  try {
    const matchingCareerPage = await DiscoveredCompany.findOne({
      normalizedCareerPageUrl: normalizedForCompare,
    })
      .select("companyName careerPageUrl")
      .lean();

    if (matchingCareerPage) {
      return {
        valid: false,

        alreadyExists: true,

        message:
          "This is the company career page URL. Please enter a specific job URL, not the main career page URL.",

        data: {
          companyName: matchingCareerPage.companyName,

          careerPageUrl: matchingCareerPage.careerPageUrl,
        },
      };
    }
  } catch (error) {
    logger.error("Career page lookup failed", error);
  }

  if (!isKnownJobPlatform(getHost(parsed)) && !hasJobKeywordInUrl(parsed)) {
    return {
      valid: false,
      message: "Please enter a valid job posting URL.",
    };
  }

  const jobInfo = await resolveJobInfoFromCareerUrl(normalizedUrl);

  if (!jobInfo.companyName) {
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

    platform,
  };
};
