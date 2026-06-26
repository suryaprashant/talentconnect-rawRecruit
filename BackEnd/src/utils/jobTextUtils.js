import dns from "dns/promises";
import net from "net";
import axios from "axios";
import * as cheerio from "cheerio";
import DiscoveredCompany from "../models/DiscoveredCompany.js";

const KNOWN_ATS_DOMAINS = [
  "greenhouse.io",
  "lever.co",
  "workdayjobs.com",
  "myworkdayjobs.com",
  "ashbyhq.com",
  "smartrecruiters.com",
  "breezy.hr",
  "recruitee.com",
  "jobs.ashbyhq.com",
  "boards.greenhouse.io",
  "jobs.lever.co",
  "linkedin.com",
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
  "work-with-us",
  "join-us",
  "opportunities",
  "recruiting",
  "hiring",
];

const GENERIC_COMPANY_NAMES = [
  "linkedin",
  "greenhouse",
  "lever",
  "workdayjobs",
  "myworkdayjobs",
  "ashbyhq",
  "smartrecruiters",
  "breezy",
  "recruitee",
];

const isPrivateIp = (ip) => {
  if (!net.isIP(ip)) return true;

  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("127.")) return true;
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("192.168.")) return true;

  const parts = ip.split(".").map(Number);

  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (ip === "0.0.0.0") return true;

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

export const cleanText = (value = "") => {
  return String(value || "").replace(/\s+/g, " ").trim();
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

export const decodeHtmlEntities = (value = "") => {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "-")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
};

export const stripHtml = (html = "") => {
  const decoded = decodeHtmlEntities(html);

  return decoded
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const uniqueStrings = (items = []) => {
  return Array.from(
    new Set(
      items
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );
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
    .replace(/\s*-\s*Jobs.*$/gi, "")
    .replace(/\s*Careers.*$/gi, "")
    .replace(/\s*Hiring.*$/gi, "")
    .replace(/\s*Job.*$/gi, "")
    .replace(/\s*Openings.*$/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const extractCompanyNameFromCareerUrl = (careerPageUrl = "") => {
  try {
    let urlValue = String(careerPageUrl).trim();

    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      urlValue = `https://${urlValue}`;
    }

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

  const candidates = [
    $('meta[property="og:title"]').attr("content"),
    $('meta[name="title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    $("title").text(),
    $('meta[property="og:site_name"]').attr("content"),
  ]
    .filter(Boolean)
    .map(cleanText);

  for (const text of candidates) {
    let match = text.match(/^(.+?)\s+hiring\s+/i);
    if (match?.[1]) return cleanCompanyName(match[1]);

    match = text.match(/\bat\s+(.+?)(?:\s+\||\s+-|$)/i);
    if (match?.[1]) return cleanCompanyName(match[1]);

    match = text.match(/^(.+?)\s+jobs/i);
    if (match?.[1]) return cleanCompanyName(match[1]);
  }

  const bodyText = cleanText($("body").text());

  let match = bodyText.match(/([A-Za-z0-9&.,' -]{2,80})\s+hiring\s+/i);
  if (match?.[1]) return cleanCompanyName(match[1]);

  match = bodyText.match(/\bat\s+([A-Za-z0-9&.,' -]{2,80})/i);
  if (match?.[1]) return cleanCompanyName(match[1]);

  return null;
};

const scrapeCompanyNameFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    return extractCompanyNameFromHtml(response.data);
  } catch (error) {
    console.log("Cheerio scraping failed:", error.message);
    return null;
  }
};

export const resolveCompanyNameFromCareerUrl = async (careerPageUrl) => {
  const parsed = new URL(careerPageUrl);
  const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

  const companyFromUrl = extractCompanyNameFromCareerUrl(careerPageUrl);
  const normalizedCompanyFromUrl = normalizeCompanyName(companyFromUrl);

  if (hostname.includes("linkedin.com")) {
    const publicLinkedInUrl = getLinkedInPublicJobUrl(careerPageUrl);

    const scrapedCompanyName = await scrapeCompanyNameFromUrl(publicLinkedInUrl);

    if (
      scrapedCompanyName &&
      normalizeCompanyName(scrapedCompanyName) !== "linkedin"
    ) {
      return scrapedCompanyName;
    }

    return "";
  }

  const shouldScrape = GENERIC_COMPANY_NAMES.includes(normalizedCompanyFromUrl);

  if (shouldScrape) {
    const scrapedCompanyName = await scrapeCompanyNameFromUrl(careerPageUrl);

    if (scrapedCompanyName) return scrapedCompanyName;
  }

  return companyFromUrl;
};

export const validateCareerPageUrl = async (careerPageUrl = "") => {
  if (!careerPageUrl || typeof careerPageUrl !== "string") {
    return {
      valid: false,
      message: "careerPageUrl is required",
    };
  }

  const trimmedUrl = careerPageUrl.trim();
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

  const isKnownAts = KNOWN_ATS_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  const fullUrl = `${hostname}${parsed.pathname}${parsed.search}`.toLowerCase();

  const hasCareerKeyword = CAREER_KEYWORDS.some((keyword) =>
    fullUrl.includes(keyword)
  );

  if (!isKnownAts && !hasCareerKeyword) {
    return {
      valid: false,
      message: "Please enter a valid company career or job page URL",
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
  };
};