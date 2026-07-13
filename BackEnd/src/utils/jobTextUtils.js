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
  "search-results",
];

const GENERIC_COMPANY_NAMES = new Set([
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
]);

const BLOCKED_PAGE_VALUES = [
  "access denied",
  "permission denied",
  "forbidden",
  "request blocked",
  "temporarily blocked",
  "security check",
  "verify you are human",
  "verify that you are human",
  "captcha",
  "attention required",
  "not authorized",
  "unauthorized",
  "service unavailable",
  "page unavailable",
  "page not found",
  "robot check",
  "bot detection",
];

const PLATFORM_MARKETING_PATTERNS = [
  /^unstop\s*[-:|–—]/i,
  /^dare2compete\s*[-:|–—]/i,
  /competitions?,\s*quizzes?,\s*hackathons?/i,
  /scholarships?\s+and\s+internships?\s+for\s+students?/i,
];

const COMPANY_BRAND_ALIASES = new Map([
  ["barclays", "Barclays"],
  ["barclaysbank", "Barclays"],
  ["barclaysbankplc", "Barclays"],
  ["barclayssharedservices", "Barclays"],
  ["barclaysglobalservices", "Barclays"],
  ["barclaysglobalservcent", "Barclays"],
  ["visa", "Visa"],
]);

const COMPANY_BRAND_MATCHERS = [
  {
    pattern: /\bbarclays\b/i,
    companyName: "Barclays",
  },
];

const OPERATIONAL_SUFFIX_PATTERNS = [
  /\s+shared\s+services\s*$/i,
  /\s+global\s+business\s+services\s*$/i,
  /\s+business\s+services\s*$/i,
  /\s+technology\s+services\s*$/i,
  /\s+service\s+centre\s*$/i,
  /\s+service\s+center\s*$/i,
  /\s+development\s+centre\s*$/i,
  /\s+development\s+center\s*$/i,
];

const LEGAL_SUFFIX_PATTERN =
  /\s+(?:private\s+limited|pvt\.?\s*ltd\.?|pvt\.?\s+limited|limited|ltd\.?|llp|llc|opc|inc\.?|corp\.?|corporation|plc)\s*$/i;

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
  "technician",
  "trainee",
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

export const cleanText = (value = "") =>
  String(value ?? "").replace(/\s+/g, " ").trim();

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

const isBlockedValue = (value = "") => {
  const normalized = cleanText(value).toLowerCase();

  return Boolean(
    normalized &&
      BLOCKED_PAGE_VALUES.some((blocked) =>
        normalized.includes(blocked),
      ),
  );
};

const isPlatformMarketingText = (value = "") => {
  const text = cleanText(value);

  return Boolean(
    text &&
      PLATFORM_MARKETING_PATTERNS.some((pattern) =>
        pattern.test(text),
      ),
  );
};

const stripCompanySuffixes = (value = "") => {
  let result = cleanText(value);
  let previous = "";

  while (result && result !== previous) {
    previous = result;

    result = result.replace(LEGAL_SUFFIX_PATTERN, "").trim();

    for (const pattern of OPERATIONAL_SUFFIX_PATTERNS) {
      result = result.replace(pattern, "").trim();
    }
  }

  return result;
};

export const canonicalizeCompanyBrand = (value = "") => {
  const cleaned = cleanText(value);

  if (
    !cleaned ||
    isBlockedValue(cleaned) ||
    isPlatformMarketingText(cleaned)
  ) {
    return "";
  }

  const normalized = normalizeCompanyName(cleaned);

  const exactAlias =
    COMPANY_BRAND_ALIASES.get(normalized);

  if (exactAlias) {
    return exactAlias;
  }

  const matchedBrand = COMPANY_BRAND_MATCHERS.find(
    ({ pattern }) => pattern.test(cleaned),
  );

  if (matchedBrand) {
    return matchedBrand.companyName;
  }

  const reduced = stripCompanySuffixes(cleaned);

  if (!reduced) {
    return "";
  }

  return (
    COMPANY_BRAND_ALIASES.get(
      normalizeCompanyName(reduced),
    ) || reduced
  );
};

const cleanCompanyName = (value = "") => {
  const raw = cleanText(value);

  if (
    !raw ||
    isBlockedValue(raw) ||
    isPlatformMarketingText(raw)
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
    .replace(/\s*reviews?.*$/gi, "")
    .trim();

  if (
    !cleaned ||
    cleaned.length < 2 ||
    cleaned.length > 160 ||
    isBlockedValue(cleaned) ||
    isPlatformMarketingText(cleaned)
  ) {
    return "";
  }

  if (
    GENERIC_COMPANY_NAMES.has(
      normalizeCompanyName(cleaned),
    )
  ) {
    return "";
  }

  const canonical =
    canonicalizeCompanyBrand(cleaned);

  if (
    !canonical ||
    isBlockedValue(canonical) ||
    GENERIC_COMPANY_NAMES.has(
      normalizeCompanyName(canonical),
    )
  ) {
    return "";
  }

  return canonical;
};

const cleanJobTitle = (value = "") => {
  const raw = cleanText(value);

  if (
    !raw ||
    isBlockedValue(raw) ||
    isPlatformMarketingText(raw)
  ) {
    return "";
  }

  const cleaned = raw
    .replace(/\|.*$/g, "")
    .replace(/\s*[-–—]\s*Workday.*$/gi, "")
    .replace(/\s*[-–—]\s*Careers.*$/gi, "")
    .replace(/\s*[-–—]\s*Jobs.*$/gi, "")
    .replace(/\s*[-–—]\s*Naukri.*$/gi, "")
    .trim();

  if (
    !cleaned ||
    cleaned.length < 2 ||
    cleaned.length > 180 ||
    isBlockedValue(cleaned)
  ) {
    return "";
  }

  return cleaned;
};

const getHost = (urlOrParsed) => {
  try {
    const parsed =
      typeof urlOrParsed === "string"
        ? new URL(normalizeInputUrl(urlOrParsed))
        : urlOrParsed;

    return parsed.hostname
      .replace(/^www\./, "")
      .toLowerCase();
  } catch {
    return "";
  }
};

const isNaukriHost = (host = "") =>
  host === "naukri.com" ||
  host.endsWith(".naukri.com");

const isUnstopHost = (host = "") =>
  host === "unstop.com" ||
  host.endsWith(".unstop.com") ||
  host === "dare2compete.com" ||
  host.endsWith(".dare2compete.com");

const isWorkdayHost = (host = "") =>
  host.includes("myworkdayjobs.com") ||
  host.includes("workdayjobs.com");

const isKnownJobPlatform = (host = "") =>
  KNOWN_JOB_DOMAINS.some(
    (domain) =>
      host === domain ||
      host.endsWith(`.${domain}`),
  );

const isSameCompanyAndTitle = (
  companyName = "",
  jobTitle = "",
) => {
  const company =
    normalizeCompanyName(companyName);

  const title =
    normalizeCompanyName(jobTitle);

  return Boolean(
    company &&
      title &&
      (company === title ||
        company.includes(title) ||
        title.includes(company)),
  );
};

const isPrivateIp = (ip = "") => {
  if (!net.isIP(ip)) {
    return true;
  }

  if (["0.0.0.0", "::1"].includes(ip)) {
    return true;
  }

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

  return (
    parts.length === 4 &&
    parts[0] === 172 &&
    parts[1] >= 16 &&
    parts[1] <= 31
  );
};

const normalizeUrlForCompare = (value = "") => {
  try {
    const parsed = new URL(
      normalizeInputUrl(value),
    );

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

  return CAREER_KEYWORDS.some((keyword) =>
    text.includes(keyword),
  );
};

const isPlainCompanyHomepage = (parsed) => {
  const pathname =
    parsed.pathname.replace(/\/+/g, "/");

  const hasSearch = Boolean(
    parsed.search &&
      parsed.search.length > 1,
  );

  if (pathname === "/" && !hasSearch) {
    return true;
  }

  const parts =
    pathname.split("/").filter(Boolean);

  return (
    parts.length <= 1 &&
    !hasSearch &&
    !CAREER_KEYWORDS.some((keyword) =>
      String(parts[0] || "")
        .toLowerCase()
        .includes(keyword),
    )
  );
};

const toTitleCase = (value = "") =>
  cleanText(value)
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();

      if (ACRONYMS.has(lower)) {
        return lower.toUpperCase();
      }

      return lower
        ? `${lower[0].toUpperCase()}${lower.slice(1)}`
        : "";
    })
    .join(" ");

const getLinkedInPublicJobUrl = (
  jobUrl = "",
) => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    if (
      !parsed.hostname.includes("linkedin.com")
    ) {
      return jobUrl;
    }

    const currentJobId =
      parsed.searchParams.get("currentJobId");

    return currentJobId
      ? `https://www.linkedin.com/jobs/view/${currentJobId}`
      : jobUrl;
  } catch {
    return jobUrl;
  }
};

const titleFromUrlPath = (jobUrl = "") => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    const parts =
      parsed.pathname.split("/").filter(Boolean);

    const detailsIndex = parts.findIndex(
      (part) =>
        part.toLowerCase() === "details",
    );

    if (
      detailsIndex !== -1 &&
      parts[detailsIndex + 1]
    ) {
      return cleanJobTitle(
        decodeURIComponent(
          parts[detailsIndex + 1],
        )
          .replace(
            /_[A-Z]{1,8}-?\d+.*/i,
            "",
          )
          .replace(/[-_]+/g, " "),
      );
    }

    return "";
  } catch {
    return "";
  }
};

const splitTitleAndCompany = (tokens) => {
  let titleEndIndex = -1;

  for (
    let index = 0;
    index < tokens.length - 1;
    index += 1
  ) {
    if (ROLE_WORDS.has(tokens[index])) {
      titleEndIndex = index;
    }
  }

  if (
    titleEndIndex === -1 ||
    titleEndIndex >= tokens.length - 1
  ) {
    return {
      jobTitle: cleanJobTitle(
        toTitleCase(tokens.join(" ")),
      ),
      companyName: "",
    };
  }

  return {
    jobTitle: cleanJobTitle(
      toTitleCase(
        tokens
          .slice(0, titleEndIndex + 1)
          .join(" "),
      ),
    ),
    companyName: cleanCompanyName(
      toTitleCase(
        tokens
          .slice(titleEndIndex + 1)
          .join(" "),
      ),
    ),
  };
};

const removeNaukriLocationSuffix = (
  slug = "",
) => {
  let result = slug;
  let changed = true;

  const locations = [
    ...NAUKRI_LOCATIONS,
  ].sort(
    (first, second) =>
      second.length - first.length,
  );

  while (result && changed) {
    changed = false;

    for (const location of locations) {
      if (result === location) {
        return "";
      }

      if (
        result.endsWith(`-${location}`)
      ) {
        result = result.slice(
          0,
          -(location.length + 1),
        );

        changed = true;
        break;
      }
    }
  }

  return result;
};

const extractNaukriJobInfoFromUrl = (
  jobUrl = "",
) => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    if (!isNaukriHost(getHost(parsed))) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const path = decodeURIComponent(
      parsed.pathname,
    )
      .replace(/^\/+|\/+$/g, "")
      .trim();

    if (
      !/^job-listings(?:-|\/)/i.test(path)
    ) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    let slug = path
      .replace(
        /^job-listings(?:-|\/)/i,
        "",
      )
      .replace(/\//g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .replace(/-\d{8,20}$/i, "")
      .replace(
        /-\d+-to-\d+-years?$/i,
        "",
      )
      .replace(
        /-\d+-\d+-years?$/i,
        "",
      )
      .replace(
        /-\d+\+?-years?$/i,
        "",
      );

    slug =
      removeNaukriLocationSuffix(slug);

    const tokens = slug
      .split("-")
      .map((token) =>
        token.trim().toLowerCase(),
      )
      .filter(Boolean);

    if (tokens.length < 2) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    return splitTitleAndCompany(tokens);
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const extractUnstopJobInfoFromUrl = (
  jobUrl = "",
) => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    if (!isUnstopHost(getHost(parsed))) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const parts = decodeURIComponent(
      parsed.pathname,
    )
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

    const sectionIndex = parts.findIndex(
      (part) =>
        [
          "jobs",
          "job",
          "internships",
          "internship",
        ].includes(part.toLowerCase()),
    );

    if (
      sectionIndex === -1 ||
      !parts[sectionIndex + 1]
    ) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const slug = parts[sectionIndex + 1]
      .replace(/-\d{4,20}$/i, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const tokens = slug
      .split("-")
      .map((token) =>
        token.trim().toLowerCase(),
      )
      .filter(Boolean);

    if (tokens.length < 2) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    return splitTitleAndCompany(tokens);
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const cleanWorkdayTenantName = (
  value = "",
) =>
  cleanCompanyName(
    cleanText(
      decodeURIComponent(
        String(value || ""),
      )
        .replace(/[_-]+/g, " ")
        .replace(/\bexternal\b/gi, "")
        .replace(/\binternal\b/gi, "")
        .replace(/\bcareer\b/gi, "")
        .replace(/\bcareers\b/gi, "")
        .replace(/\bsite\b/gi, "")
        .replace(/\bjobs?\b/gi, "")
        .replace(/\bportal\b/gi, ""),
    ),
  );

const extractWorkdayJobInfoFromUrl = (
  jobUrl = "",
) => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    const host = getHost(parsed);

    if (!isWorkdayHost(host)) {
      return {
        jobTitle: "",
        companyName: "",
      };
    }

    const hostParts =
      host.split(".").filter(Boolean);

    const workdayIndex =
      hostParts.findIndex((part) =>
        /^wd\d+$/i.test(part),
      );

    let tenantSlug =
      workdayIndex > 0
        ? hostParts[workdayIndex - 1]
        : hostParts[0] || "";

    if (
      [
        "www",
        "jobs",
        "careers",
        "career",
      ].includes(tenantSlug)
    ) {
      tenantSlug = "";
    }

    const pathParts = parsed.pathname
      .split("/")
      .map((part) =>
        decodeURIComponent(part).trim(),
      )
      .filter(Boolean);

    const localeIndex =
      pathParts.findIndex((part) =>
        /^[a-z]{2}-[a-z]{2}$/i.test(
          part,
        ),
      );

    const siteSlug =
      localeIndex !== -1 &&
      pathParts[localeIndex + 1]
        ? pathParts[localeIndex + 1]
        : "";

    const jobIndex =
      pathParts.findIndex(
        (part) =>
          part.toLowerCase() === "job",
      );

    const jobSlug =
      jobIndex !== -1 &&
      pathParts[jobIndex + 1]
        ? pathParts[jobIndex + 1]
        : "";

    const jobTitle = cleanJobTitle(
      jobSlug
        .replace(
          /_(?:JR|REF|R|REQ|JOB)[-_]?\d.*$/i,
          "",
        )
        .replace(/[-_]+/g, " "),
    );

    return {
      jobTitle,
      companyName: cleanCompanyName(
        cleanWorkdayTenantName(
          tenantSlug,
        ) ||
          cleanWorkdayTenantName(
            siteSlug,
          ),
      ),
    };
  } catch {
    return {
      jobTitle: "",
      companyName: "",
    };
  }
};

const extractCompanyFromPlatformUrl = (
  jobUrl = "",
) => {
  try {
    const parsed = new URL(
      normalizeInputUrl(jobUrl),
    );

    const host = getHost(parsed);

    const pathParts =
      parsed.pathname
        .split("/")
        .filter(Boolean);

    if (isNaukriHost(host)) {
      return extractNaukriJobInfoFromUrl(
        jobUrl,
      ).companyName;
    }

    if (isUnstopHost(host)) {
      return extractUnstopJobInfoFromUrl(
        jobUrl,
      ).companyName;
    }

    if (isWorkdayHost(host)) {
      return extractWorkdayJobInfoFromUrl(
        jobUrl,
      ).companyName;
    }

    if (
      host === "boards.greenhouse.io" ||
      host ===
        "job-boards.greenhouse.io"
    ) {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    if (
      host.endsWith(".greenhouse.io")
    ) {
      return cleanCompanyName(
        host.split(".")[0],
      );
    }

    if (host === "jobs.lever.co") {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    if (host.endsWith(".lever.co")) {
      return cleanCompanyName(
        host.split(".")[0],
      );
    }

    if (
      host === "jobs.ashbyhq.com"
    ) {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    if (
      host.endsWith(".ashbyhq.com")
    ) {
      return cleanCompanyName(
        host.split(".")[0],
      );
    }

    if (
      host.includes(
        "smartrecruiters.com",
      )
    ) {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    if (
      host === "wellfound.com" ||
      host === "angel.co"
    ) {
      const companyIndex =
        pathParts.indexOf("company");

      if (
        companyIndex !== -1 &&
        pathParts[companyIndex + 1]
      ) {
        return cleanCompanyName(
          pathParts[
            companyIndex + 1
          ],
        );
      }
    }

    if (
      host.includes("breezy.hr") ||
      host.includes("recruitee.com")
    ) {
      return cleanCompanyName(
        host.split(".")[0],
      );
    }

    if (
      host === "apply.workable.com" &&
      pathParts[0]
    ) {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    if (
      host === "jobs.jobvite.com" &&
      pathParts[0]
    ) {
      return cleanCompanyName(
        pathParts[0],
      );
    }

    return "";
  } catch {
    return "";
  }
};

export const extractCompanyNameFromCareerUrl = (
  careerPageUrl = "",
) => {
  try {
    const normalizedUrl =
      normalizeInputUrl(careerPageUrl);

    const platformCompany =
      extractCompanyFromPlatformUrl(
        normalizedUrl,
      );

    if (platformCompany) {
      return platformCompany;
    }

    const parsed =
      new URL(normalizedUrl);

    const host = getHost(parsed);

    if (isKnownJobPlatform(host)) {
      return "";
    }

    const parts =
      host.split(".").filter(Boolean);

    if (parts.length < 2) {
      return "";
    }

    const ignoredSubdomains =
      new Set([
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

    const companyPart =
      ignoredSubdomains.has(parts[0])
        ? parts[1]
        : parts[0];

    return cleanCompanyName(
      companyPart,
    );
  } catch {
    return "";
  }
};

const findDeepValue = (
  value,
  keys,
  depth = 0,
) => {
  if (!value || depth > 12) {
    return "";
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findDeepValue(
        item,
        keys,
        depth + 1,
      );

      if (result) {
        return result;
      }
    }

    return "";
  }

  if (typeof value !== "object") {
    return "";
  }

  for (const key of keys) {
    const current = value[key];

    if (
      typeof current === "string"
    ) {
      return current;
    }

    if (
      current &&
      typeof current === "object"
    ) {
      const nested =
        current.name ||
        current.displayName ||
        current.title;

      if (
        typeof nested === "string"
      ) {
        return nested;
      }
    }
  }

  for (
    const current of Object.values(
      value,
    )
  ) {
    const result = findDeepValue(
      current,
      keys,
      depth + 1,
    );

    if (result) {
      return result;
    }
  }

  return "";
};

const extractJobInfoFromJson = (
  json,
) => ({
  jobTitle: cleanJobTitle(
    findDeepValue(json, [
      "jobTitle",
      "job_title",
      "postingTitle",
      "jobPostingTitle",
      "title",
    ]),
  ),

  companyName: cleanCompanyName(
    findDeepValue(json, [
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
    ]),
  ),
});

const isBlockedHtmlPage = (
  html = "",
) => {
  const source =
    String(html || "");

  if (!source) {
    return false;
  }

  const $ = cheerio.load(source);

  const title = cleanText(
    $("title").text(),
  ).toLowerCase();

  const heading = cleanText(
    $("h1").first().text(),
  ).toLowerCase();

  const body = cleanText(
    $("body").text(),
  )
    .slice(0, 3000)
    .toLowerCase();

  return BLOCKED_PAGE_VALUES.some(
    (blocked) =>
      title.includes(blocked) ||
      heading.includes(blocked) ||
      body.startsWith(blocked) ||
      body.includes(` ${blocked} `),
  );
};

const extractCompanyFromMetaText = (
  value = "",
) => {
  const text = cleanText(value);

  if (
    !text ||
    isPlatformMarketingText(text)
  ) {
    return "";
  }

  const patterns = [
    /\bapply\s+for\s+.+?\s+job\s+at\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
    /\bjob\s+(?:in|at)\s+.+?\s+at\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
    /\bjob\s+at\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
    /\bhiring\s+(?:at|for)\s+(.+?)(?:\s+in\s+|[|.,]|$)/i,
  ];

  for (const pattern of patterns) {
    const company = cleanCompanyName(
      text.match(pattern)?.[1],
    );

    if (company) {
      return company;
    }
  }

  return "";
};

const extractJobInfoFromHtml = (
  html = "",
) => {
  if (
    !html ||
    isBlockedHtmlPage(html)
  ) {
    return {
      jobTitle: "",
      companyName: "",
    };
  }

  const $ = cheerio.load(html);

  const titleSelectors = [
    '[data-automation-id="jobPostingHeader"]',
    '[data-automation-id="jobPostingTitle"]',
    '[data-automation-id="job-title"]',
    '[data-testid="job-title"]',
    ".topcard__title",
    ".jobsearch-JobInfoHeader-title",
    ".styles_jd-header-title__rZwM1",
    ".jd-header-title",
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
    ".styles_jd-header-comp-name__XgY5a",
    ".jd-header-comp-name",
    'a[class*="comp-name"]',
    '[class*="companyName"]',
    '[class*="company-name"]',
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
    '[class*="employerName"]',
    '[class*="employer-name"]',
  ];

  let jobTitle = "";
  let companyName = "";

  for (
    const selector of titleSelectors
  ) {
    jobTitle = cleanJobTitle(
      $(selector).first().text(),
    );

    if (jobTitle) {
      break;
    }
  }

  for (
    const selector of companySelectors
  ) {
    companyName = cleanCompanyName(
      $(selector).first().text(),
    );

    if (companyName) {
      break;
    }
  }

  if (!companyName) {
    const metaCandidates = [
      $(
        'meta[property="og:title"]',
      ).attr("content"),

      $(
        'meta[name="twitter:title"]',
      ).attr("content"),

      $(
        'meta[property="twitter:title"]',
      ).attr("content"),

      $(
        'meta[name="description"]',
      ).attr("content"),

      $(
        'meta[property="og:description"]',
      ).attr("content"),

      $(
        'meta[name="twitter:description"]',
      ).attr("content"),
    ];

    for (
      const metaText of metaCandidates
    ) {
      companyName =
        extractCompanyFromMetaText(
          metaText,
        );

      if (companyName) {
        break;
      }
    }
  }

  for (
    const script of $(
      'script[type="application/ld+json"]',
    ).toArray()
  ) {
    try {
      const raw = $(script)
        .contents()
        .text();

      if (!raw) {
        continue;
      }

      const info =
        extractJobInfoFromJson(
          JSON.parse(raw),
        );

      if (
        !jobTitle &&
        info.jobTitle
      ) {
        jobTitle = info.jobTitle;
      }

      if (
        !companyName &&
        info.companyName
      ) {
        companyName =
          info.companyName;
      }
    } catch {
      // Ignore invalid JSON-LD.
    }
  }

  const nextData =
    $("#__NEXT_DATA__").text();

  if (nextData) {
    try {
      const info =
        extractJobInfoFromJson(
          JSON.parse(nextData),
        );

      if (
        !jobTitle &&
        info.jobTitle
      ) {
        jobTitle = info.jobTitle;
      }

      if (
        !companyName &&
        info.companyName
      ) {
        companyName =
          info.companyName;
      }
    } catch {
      // Ignore invalid Next.js data.
    }
  }

  for (
    const script of $("script").toArray()
  ) {
    const scriptText = $(script)
      .contents()
      .text();

    if (
      !scriptText ||
      scriptText.length > 900000
    ) {
      continue;
    }

    if (!jobTitle) {
      const titleMatches = [
        scriptText.match(
          /"jobTitle"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"job_title"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"postingTitle"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"jobPostingTitle"\s*:\s*"([^"]+)"/i,
        )?.[1],
      ];

      for (
        const match of titleMatches
      ) {
        jobTitle =
          cleanJobTitle(match);

        if (jobTitle) {
          break;
        }
      }
    }

    if (!companyName) {
      const companyMatches = [
        scriptText.match(
          /"companyName"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"company_name"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"employerName"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"employer_name"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"organizationName"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"organisationName"\s*:\s*"([^"]+)"/i,
        )?.[1],

        scriptText.match(
          /"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i,
        )?.[1],
      ];

      for (
        const match of companyMatches
      ) {
        companyName =
          cleanCompanyName(match);

        if (companyName) {
          break;
        }
      }
    }

    if (
      jobTitle &&
      companyName
    ) {
      break;
    }
  }

  if (!jobTitle) {
    const metaTitle =
      $(
        'meta[property="og:title"]',
      ).attr("content") ||
      $(
        'meta[name="title"]',
      ).attr("content") ||
      $(
        'meta[name="twitter:title"]',
      ).attr("content") ||
      $(
        'meta[property="twitter:title"]',
      ).attr("content") ||
      $("title").text();

    jobTitle = cleanJobTitle(
      cleanText(metaTitle)
        .replace(
          /\s*[-–—]\s*Workday.*$/i,
          "",
        )
        .replace(
          /\s*\|\s*.*$/i,
          "",
        ),
    );
  }

  jobTitle =
    cleanJobTitle(jobTitle);

  companyName =
    cleanCompanyName(companyName);

  if (
    isSameCompanyAndTitle(
      companyName,
      jobTitle,
    )
  ) {
    companyName = "";
  }

  return {
    jobTitle,
    companyName,
  };
};

const scrapeJobInfoWithPlaywright =
  async (url) => {
    let browser;

    try {
      browser =
        await chromium.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
          ],
        });

      const page =
        await browser.newPage({
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",

          viewport: {
            width: 1366,
            height: 768,
          },

          locale: "en-IN",
        });

      await page.route(
        "**/*",
        async (route) => {
          const resourceType =
            route
              .request()
              .resourceType();

          if (
            [
              "image",
              "media",
              "font",
            ].includes(resourceType)
          ) {
            await route.abort();
            return;
          }

          await route.continue();
        },
      );

      await page.goto(url, {
        waitUntil:
          "domcontentloaded",
        timeout: 45000,
      });

      await page.waitForTimeout(
        3500,
      );

      const html =
        await page.content();

      if (
        isBlockedHtmlPage(html)
      ) {
        return {
          jobTitle: "",
          companyName: "",
        };
      }

      return extractJobInfoFromHtml(
        html,
      );
    } catch (error) {
      console.log(
        "Playwright scraping failed:",
        error?.message || error,
      );

      return {
        jobTitle: "",
        companyName: "",
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  };

const scrapeJobInfoFromUrl = async (
  url,
  {
    allowPlaywrightFallback = true,
  } = {},
) => {
  try {
    const response = await axios.get(
      url,
      {
        timeout: 22000,
        maxRedirects: 5,
        maxContentLength:
          5 * 1024 * 1024,
        maxBodyLength:
          5 * 1024 * 1024,
        responseType: "text",

        validateStatus: (status) =>
          status >= 200 &&
          status < 400,

        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",

          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

          "Accept-Language":
            "en-IN,en;q=0.9",

          "Cache-Control":
            "no-cache",

          Pragma: "no-cache",
        },
      },
    );

    const info =
      extractJobInfoFromHtml(
        response.data,
      );

    if (
      info.jobTitle ||
      info.companyName
    ) {
      return info;
    }
  } catch (error) {
    console.log(
      "Axios scraping failed:",
      error?.message || error,
    );
  }

  if (!allowPlaywrightFallback) {
    return {
      jobTitle: "",
      companyName: "",
    };
  }

  return scrapeJobInfoWithPlaywright(
    url,
  );
};

export const resolveJobInfoFromCareerUrl =
  async (careerPageUrl = "") => {
    try {
      const normalizedUrl =
        normalizeInputUrl(
          careerPageUrl,
        );

      const parsed =
        new URL(normalizedUrl);

      const host =
        getHost(parsed);

      const isLinkedIn =
        host.includes(
          "linkedin.com",
        );

      const isNaukri =
        isNaukriHost(host);

      const isUnstop =
        isUnstopHost(host);

      const isWorkday =
        isWorkdayHost(host);

      const finalUrl = isLinkedIn
        ? getLinkedInPublicJobUrl(
            normalizedUrl,
          )
        : normalizedUrl;

      const naukriInfo =
        isNaukri
          ? extractNaukriJobInfoFromUrl(
              normalizedUrl,
            )
          : {
              jobTitle: "",
              companyName: "",
            };

      const unstopInfo =
        isUnstop
          ? extractUnstopJobInfoFromUrl(
              normalizedUrl,
            )
          : {
              jobTitle: "",
              companyName: "",
            };

      const workdayInfo =
        isWorkday
          ? extractWorkdayJobInfoFromUrl(
              normalizedUrl,
            )
          : {
              jobTitle: "",
              companyName: "",
            };

      const scraped =
        await scrapeJobInfoFromUrl(
          finalUrl,
          {
            allowPlaywrightFallback:
              !isNaukri,
          },
        );

      const scrapedJobTitle =
        cleanJobTitle(
          scraped.jobTitle,
        );

      const scrapedCompanyName =
        cleanCompanyName(
          scraped.companyName,
        );

      const platformCompany =
        extractCompanyFromPlatformUrl(
          normalizedUrl,
        );

      const fallbackCompany =
        extractCompanyNameFromCareerUrl(
          normalizedUrl,
        );

      const fallbackTitle =
        titleFromUrlPath(
          normalizedUrl,
        );

      const jobTitle =
        cleanJobTitle(
          scrapedJobTitle ||
            workdayInfo.jobTitle ||
            naukriInfo.jobTitle ||
            unstopInfo.jobTitle ||
            fallbackTitle,
        );

      let companyName = "";

      if (isWorkday) {
        companyName =
          cleanCompanyName(
            workdayInfo.companyName ||
              platformCompany ||
              scrapedCompanyName ||
              fallbackCompany,
          );
      } else if (isUnstop) {
        companyName =
          cleanCompanyName(
            unstopInfo.companyName ||
              platformCompany ||
              scrapedCompanyName ||
              fallbackCompany,
          );
      } else if (isNaukri) {
        companyName =
          cleanCompanyName(
            naukriInfo.companyName ||
              platformCompany ||
              scrapedCompanyName ||
              fallbackCompany,
          );
      } else {
        companyName =
          cleanCompanyName(
            scrapedCompanyName ||
              platformCompany ||
              fallbackCompany,
          );
      }

      if (
        isSameCompanyAndTitle(
          companyName,
          jobTitle,
        )
      ) {
        companyName = isWorkday
          ? cleanCompanyName(
              workdayInfo.companyName,
            )
          : "";
      }

      const searchCompanyName =
        isNaukri ||
        isUnstop ||
        isWorkday
          ? companyName
          : companyName || jobTitle;

      return {
        jobTitle,
        companyName,

        searchCompanyName:
          cleanCompanyName(
            searchCompanyName,
          ) || searchCompanyName,
      };
    } catch (error) {
      console.error(
        "Failed to resolve job information:",
        error?.message || error,
      );

      return {
        jobTitle: "",
        companyName: "",
        searchCompanyName: "",
      };
    }
  };

export const resolveCompanyNameFromCareerUrl =
  async (careerPageUrl = "") => {
    const normalizedUrl =
      normalizeInputUrl(
        careerPageUrl,
      );

    const host =
      getHost(normalizedUrl);

    const info =
      await resolveJobInfoFromCareerUrl(
        normalizedUrl,
      );

    if (
      isNaukriHost(host) ||
      isUnstopHost(host) ||
      isWorkdayHost(host)
    ) {
      return cleanCompanyName(
        info.companyName,
      );
    }

    return cleanCompanyName(
      info.searchCompanyName ||
        info.companyName,
    );
  };

export const validateCareerPageUrl =
  async (careerPageUrl = "") => {
    if (
      !careerPageUrl ||
      typeof careerPageUrl !==
        "string"
    ) {
      return {
        valid: false,
        message:
          "careerPageUrl is required",
      };
    }

    const normalizedUrl =
      normalizeInputUrl(
        careerPageUrl,
      );

    let parsed;

    try {
      parsed =
        new URL(normalizedUrl);
    } catch {
      return {
        valid: false,
        message:
          "Please enter a valid URL",
      };
    }

    if (
      !["http:", "https:"].includes(
        parsed.protocol,
      )
    ) {
      return {
        valid: false,
        message:
          "Only HTTP and HTTPS URLs are allowed",
      };
    }

    const host =
      parsed.hostname.toLowerCase();

    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.includes("..")
    ) {
      return {
        valid: false,
        message:
          "Invalid or unsafe URL",
      };
    }

    if (
      isPlainCompanyHomepage(parsed)
    ) {
      return {
        valid: false,
        message:
          "Please enter a specific job URL, not a company homepage URL.",
      };
    }

    const normalizedForCompare =
      normalizeUrlForCompare(
        normalizedUrl,
      );

    const storedCompanies =
      await DiscoveredCompany.find({
        careerPageUrl: {
          $exists: true,
          $ne: "",
        },
      })
        .select(
          "companyName careerPageUrl",
        )
        .lean();

    const matchingCareerPage =
      storedCompanies.find(
        (company) =>
          normalizeUrlForCompare(
            company.careerPageUrl,
          ) ===
          normalizedForCompare,
      );

    if (matchingCareerPage) {
      return {
        valid: false,
        alreadyExists: true,

        message:
          "This is the company career page URL. Please enter a specific job URL, not the main career page URL.",

        data: {
          companyName:
            matchingCareerPage.companyName,

          careerPageUrl:
            matchingCareerPage.careerPageUrl,
        },
      };
    }

    try {
      const addresses =
        await dns.lookup(host, {
          all: true,
        });

      if (
        !addresses.length ||
        addresses.some(
          ({ address }) =>
            isPrivateIp(address),
        )
      ) {
        return {
          valid: false,
          message:
            "Private or internal URLs are not allowed",
        };
      }
    } catch {
      return {
        valid: false,
        message:
          "Unable to verify this URL",
      };
    }

    if (
      !isKnownJobPlatform(
        getHost(parsed),
      ) &&
      !hasJobKeywordInUrl(parsed)
    ) {
      return {
        valid: false,
        message:
          "Please enter a valid job posting URL.",
      };
    }

    const jobInfo =
      await resolveJobInfoFromCareerUrl(
        normalizedUrl,
      );

    if (
      !jobInfo.searchCompanyName
    ) {
      return {
        valid: false,
        message:
          "Unable to extract company name from this job URL.",
      };
    }

    return {
      valid: true,

      normalizedUrl:
        parsed.toString(),

      companyName:
        jobInfo.searchCompanyName,

      actualCompanyName:
        jobInfo.companyName,

      jobTitle:
        jobInfo.jobTitle,
    };
  };