import dns from "dns/promises";
import net from "net";



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

const isPrivateIp = (ip) => {
  if (!net.isIP(ip)) return true;

  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("127.")) return true;
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("192.168.")) return true;

  const parts = ip.split(".").map(Number);

  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }

  if (ip === "0.0.0.0") return true;

  return false;
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

    const hasPrivateIp = addresses.some((item) =>
      isPrivateIp(item.address)
    );

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
    (domain) =>
      hostname === domain || hostname.endsWith(`.${domain}`)
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

// export const normalize = (value = "") => {
//   return String(value || "")
//     .toLowerCase()
//     .replace(/&nbsp;/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// };





export const extractCompanyNameFromCareerUrl = (careerpageUrl = "") => {
  try {
    let urlValue = String(careerpageUrl).trim();

    if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
      urlValue = `https://${urlValue}`;
    }

    const url = new URL(urlValue);

    const host = url.hostname
      .replace(/^www\./, "")
      .toLowerCase();

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
      return parts[1];
    }

    // Example: company.in.something.com => company
    return parts[0];
  } catch (error) {
    return "";
  }
};



export const normalizeCompanyName = (companyName = "") => {
  return String(companyName || "")
    .toLowerCase()
    .trim()

    // Indian legal suffixes only
    .replace(/\bprivate\s+limited\b/g, "")
    .replace(/\bpvt\.?\s*ltd\.?\b/g, "")
    .replace(/\bpvt\.?\s*limited\b/g, "")
    .replace(/\blimited\b/g, "")
    .replace(/\bltd\.?\b/g, "")
    .replace(/\bllp\b/g, "")
    .replace(/\bopc\b/g, "")

    // Global legal suffixes only
    .replace(/\binc\.?\b/g, "")
    .replace(/\bcorp\.?\b/g, "")
    .replace(/\bcorporation\b/g, "")
    .replace(/\bcompany\b/g, "")
    .replace(/\bco\.?\b/g, "")

    // Location suffixes are okay to remove
    .replace(/\bindia\b/g, "")
    .replace(/\bglobal\b/g, "")

    .replace(/[^a-z0-9]/g, "");
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


export const cleanText = (value = "") => {
  return String(value).replace(/\s+/g, " ").trim();
};