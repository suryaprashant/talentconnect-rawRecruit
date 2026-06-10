export const normalize = (value = "") => {
  return String(value || "")
    .toLowerCase()
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Used for ATS slug/search.
 * Example:
 * Razorpay Private Limited -> razorpay
 * Razorpay Software Private Limited -> razorpay
 */
const removeCompanySuffixesForSlug = (companyName = "") => {
  return String(companyName || "")
    .toLowerCase()
    .trim()

    // Indian legal suffixes
    .replace(/\bprivate\s+limited\b/g, "")
    .replace(/\bpvt\.?\s*ltd\.?\b/g, "")
    .replace(/\bpvt\.?\s*limited\b/g, "")
    .replace(/\blimited\b/g, "")
    .replace(/\bltd\.?\b/g, "")
    .replace(/\bllp\b/g, "")
    .replace(/\bopc\b/g, "")

    // Global legal suffixes
    .replace(/\binc\.?\b/g, "")
    .replace(/\bcorp\.?\b/g, "")
    .replace(/\bcorporation\b/g, "")
    .replace(/\bcompany\b/g, "")
    .replace(/\bco\.?\b/g, "")

    // Common extra words for ATS search only
    .replace(/\btechnologies\b/g, "")
    .replace(/\btechnology\b/g, "")
    .replace(/\bsolutions\b/g, "")
    .replace(/\bservices\b/g, "")
    .replace(/\bsoftware\b/g, "")
    .replace(/\bsystems\b/g, "")
    .replace(/\bindia\b/g, "")
    .replace(/\bglobal\b/g, "")

    .replace(/\s+/g, " ")
    .trim();
};

export const createCompanySlug = (companyName = "") => {
  return removeCompanySuffixesForSlug(companyName).replace(/[^a-z0-9]/g, "");
};

/**
 * Used for exact/raw slug attempts.
 * Example:
 * Razorpay Software Private Limited -> razorpaysoftwareprivatelimited
 */
export const createRawCompanySlug = (companyName = "") => {
  return String(companyName || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
};

/**
 * Used for alumni/currentCompany matching.
 * Keep this stricter.
 * Do NOT remove software / technologies / services here,
 * because that can create wrong alumni matches.
 */
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