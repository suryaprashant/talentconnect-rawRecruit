const slug = "[^/]+";
const registry = [
  {
    name: "greenhouse",
    urlPattern:
      /^https?:\/\/(?:boards|job-boards)\.greenhouse\.io\/([^/]+)\/jobs\/([^/?#]+)/i,
    buildApiUrl: ([, company, id]) =>
      `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(company)}/jobs/${encodeURIComponent(id)}`,
    parseResponse: (j) => ({
      title: j.title,
      company: j.company?.name || j.departments?.[0]?.name || null,
      location: { city: j.location?.name || null, state: null },
      description: j.content || null,
      employmentType: null,
      applicationDeadline: j.updated_at || null,
      requiredSkills: [],
      degree: [],
      certifications: [],
      benefits: [],
      eligibilityCriteria: null,
      salary: null,
    }),
  },
  {
    name: "lever",
    urlPattern: /^https?:\/\/jobs\.lever\.co\/([^/]+)\/([^/?#]+)/i,
    buildApiUrl: ([, company, id]) =>
      `https://api.lever.co/v0/postings/${encodeURIComponent(company)}/${encodeURIComponent(id)}`,
    parseResponse: (j) => ({
      title: j.text,
      company: j.categories?.team || j.company || null,
      location: { city: j.categories?.location || null, state: null },
      description:
        [
          j.description,
          ...(j.lists || []).map(
            (x) =>
              `${x.text || ""}\n${(x.content || "").replace(/<[^>]*>/g, " ")}`,
          ),
          j.additional,
        ]
          .filter(Boolean)
          .join("\n\n") || null,
      employmentType: mapEmployment(j.categories?.commitment),
      applicationDeadline: null,
      requiredSkills: [],
      degree: [],
      certifications: [],
      benefits: [],
      eligibilityCriteria: null,
      salary: salaryFromText(j.salaryRange),
      workMode: null,
    }),
  },
  {
    name: "ashby",
    urlPattern: /^https?:\/\/jobs\.ashbyhq\.com\/([^/]+)\/([^/?#]+)/i,
    buildApiUrl: ([, company]) =>
      `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(company)}`,
    parseResponse: (j, id) => {
      const list = Array.isArray(j) ? j : j.jobs || j.jobPostings || [];
      const found = list.find(
        (x) =>
          String(x.id || x.jobId || x.jobPostingId || "").toLowerCase() ===
            String(id).toLowerCase() ||
          String(x.jobUrl || "").includes(`/${id}`),
      );
      if (!found) return null;
      return {
        title: found.title,
        company: found.companyName || found.organizationName || null,
        location: {
          city: found.location || found.locationName || null,
          state: null,
        },
        description: found.descriptionHtml || found.description || null,
        employmentType: mapEmployment(found.employmentType),
        workMode: mapWorkMode(found.workplaceType || found.workplace),
        applicationDeadline: found.applicationDeadline || null,
        requiredSkills: asArray(found.skills),
        degree: [],
        certifications: [],
        benefits: [],
        eligibilityCriteria: found.qualifications || null,
        salary: normalizeSalary(found.compensation || found.salary),
      };
    },
  },
  {
    name: "smartrecruiters",
    urlPattern: /^https?:\/\/jobs\.smartrecruiters\.com\/([^/]+)\/([^/?#]+)/i,
    buildApiUrl: ([, company, id]) =>
      `https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(company)}/postings/${encodeURIComponent(id)}`,
    parseResponse: (j) => ({
      title: j.name,
      company: j.company?.name || null,
      location: {
        city: j.location?.city || null,
        state: j.location?.region || null,
      },
      description:
        j.jobAd?.sections
          ?.map(
            (s) => `${s.title || ""}\n${stripHtml(s.text || s.content || "")}`,
          )
          .join("\n\n") || null,
      employmentType: mapEmployment(j.typeOfEmployment?.label),
      workMode: mapWorkMode(j.workplace?.label),
      applicationDeadline: j.expirationDate || null,
      requiredSkills: [],
      degree: [],
      certifications: [],
      benefits: [],
      eligibilityCriteria:
        j.jobAd?.sections
          ?.filter((s) =>
            /qualif|require|education|experience/i.test(s.title || ""),
          )
          .map((s) => stripHtml(s.text || ""))
          .join("\n") || null,
      salary: null,
    }),
  },
  {
    name: "workable",
    urlPattern:
      /^https?:\/\/(?:([^./]+)\.workable\.com\/jobs\/([^/?#]+)|apply\.workable\.com\/([^/]+)\/j\/([^/?#]+))/i,
    buildApiUrl: (m) => {
      const company = m[1] || m[3],
        id = m[2] || m[4];
      return `https://apply.workable.com/api/v3/accounts/${encodeURIComponent(company)}/jobs/${encodeURIComponent(id)}`;
    },
    parseResponse: (j) => ({
      title: j.title,
      company: j.account?.name || j.company?.name || null,
      location: {
        city: j.location?.city || j.location?.location_str || null,
        state: j.location?.region || null,
      },
      description: j.description || j.full_description || null,
      employmentType: mapEmployment(j.employment_type),
      workMode: mapWorkMode(j.workplace || j.telecommuting),
      applicationDeadline: j.application_deadline || null,
      requiredSkills: asArray(j.skills),
      degree: [],
      certifications: [],
      benefits: asArray(j.benefits),
      eligibilityCriteria: j.requirements || j.qualifications || null,
      salary: normalizeSalary(j.salary),
    }),
  },
  {
    name: "recruitee",
    urlPattern: /^https?:\/\/([^.\/]+)\.recruitee\.com\/o\/([^/?#]+)/i,
    buildApiUrl: ([, company, slug]) =>
      `https://${company}.recruitee.com/api/offers/${encodeURIComponent(slug)}`,
    parseResponse: (j) => {
      const x = j.offer || j;
      return {
        title: x.title,
        company: x.company_name || x.company?.name || null,
        location: {
          city: x.city || x.location || null,
          state: x.region || null,
        },
        description: x.description || null,
        employmentType: mapEmployment(x.employment_type),
        workMode: mapWorkMode(x.remote),
        applicationDeadline: x.expires_at || null,
        requiredSkills: asArray(x.skills),
        degree: [],
        certifications: [],
        benefits: asArray(x.benefits),
        eligibilityCriteria: x.requirements || x.education || null,
        salary: normalizeSalary(x.salary),
      };
    },
  },
  {
    name: "breezyhr",
    urlPattern: /^https?:\/\/([^.\/]+)\.breezy\.hr\/p\/([^/?#]+)/i,
    buildApiUrl: ([, company]) => `https://${company}.breezy.hr/json`,
    parseResponse: (j, id) => {
      const list = Array.isArray(j) ? j : j.positions || j.jobs || [];
      const x = list.find(
        (p) =>
          String(p.id || p._id || "").toLowerCase() ===
          String(id).toLowerCase(),
      );
      if (!x) return null;
      return {
        title: x.name || x.title,
        company: x.company?.name || null,
        location: { city: x.location || null, state: null },
        description: x.description || null,
        employmentType: mapEmployment(x.type),
        workMode: mapWorkMode(x.locationType),
        applicationDeadline: x.deadline || null,
        requiredSkills: [],
        degree: [],
        certifications: [],
        benefits: [],
        eligibilityCriteria: x.requirements || null,
        salary: normalizeSalary(x.salary),
      };
    },
  },
  {
    name: "personio",
    urlPattern: /^https?:\/\/([^.\/]+)\.jobs\.personio\.de\/job\/([^/?#]+)/i,
    buildApiUrl: ([, company]) => `https://${company}.jobs.personio.de/xml`,
    parseResponse: (xml, id) => {
      const blocks = [
        ...String(xml).matchAll(/<position\b[\s\S]*?<\/position>/gi),
      ].map((m) => m[0]);
      const block = blocks.find((b) =>
        new RegExp(`<id>\\s*${escapeRegExp(id)}\\s*<\\/id>`, "i").test(b),
      );
      if (!block) return null;
      const tag = (name) => {
        const m = block.match(
          new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"),
        );
        return m ? decodeXml(stripHtml(m[1]).trim()) : null;
      };
      return {
        title: tag("name"),
        company: tag("company"),
        location: { city: tag("office") || tag("city"), state: tag("region") },
        description: tag("jobDescription") || tag("description"),
        employmentType: mapEmployment(tag("employmentType")),
        applicationDeadline: tag("occupationEndDate"),
        requiredSkills: [],
        degree: [],
        certifications: [],
        benefits: [],
        eligibilityCriteria: tag("requirements"),
        salary: null,
      };
    },
  },
  {
    name: "teamtailor",
    urlPattern: /^https?:\/\/([^.\/]+)\.teamtailor\.com\/jobs\/([^/?#]+)/i,
    buildApiUrl: () => null,
    parseResponse: () => null,
  },
  ...["jazzhr", "icims", "workday", "sap-successfactors"].map((name) => ({
    name,
    urlPattern:
      name === "jazzhr"
        ? /^https?:\/\/[^/]*jazz\.co\/?/i
        : name === "icims"
          ? /^https?:\/\/[^/]*icims\.com\//i
          : name === "workday"
            ? /^https?:\/\/[^/]*myworkdayjobs\.com\//i
            : /^https?:\/\/[^/]*(?:successfactors|jobs\.sap)\./i,
    buildApiUrl: () => null,
    parseResponse: () => null,
    fallbackOnly: true,
  })),
];

function asArray(v) {
  if (Array.isArray(v))
    return v
      .filter((x) => typeof x === "string" && x.trim())
      .map((x) => x.trim());
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}
function stripHtml(s) {
  return String(s || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
function decodeXml(s) {
  return String(s)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function mapEmployment(v) {
  const s = String(v || "").toLowerCase();
  if (/intern/.test(s)) return "internship";
  if (/part.?time/.test(s)) return "part_time";
  if (/contract|temporary|freelance/.test(s)) return "contract";
  if (/full.?time|permanent/.test(s)) return "full_time";
  return null;
}
function mapWorkMode(v) {
  const s = String(v || "").toLowerCase();
  if (s === "true" || /remote|work from home/.test(s)) return "remote";
  if (/hybrid/.test(s)) return "hybrid";
  if (/on.?site|office/.test(s)) return "onsite";
  return null;
}
function salaryFromText(v) {
  if (!v) return null;
  const nums = String(v).match(/(?:₹|INR|USD|\$)\s?([\d,]+(?:\.\d+)?)/gi);
  if (!nums?.length) return null;
  const parse = (x) => Number(x.replace(/[^\d.]/g, "")) || null;
  return {
    currency: /₹|INR/i.test(v) ? "INR" : /USD|\$/i.test(v) ? "USD" : null,
    totalCTC: parse(nums[0]),
    fixedPay: null,
    variablePay: null,
  };
}
function normalizeSalary(v) {
  if (!v || typeof v !== "object") return null;
  const number = (x) =>
    Number.isFinite(Number(x)) && x !== "" ? Number(x) : null;
  return {
    currency: v.currency || v.currencyCode || null,
    totalCTC: number(v.totalCTC ?? v.max ?? v.maximum),
    fixedPay: number(v.fixedPay ?? v.min ?? v.minimum),
    variablePay: number(v.variablePay),
  };
}

export function matchATS(inputUrl) {
  let url;
  try {
    url = new URL(inputUrl);
  } catch {
    return null;
  }
  for (const entry of registry) {
    const match = url.href.match(entry.urlPattern);
    if (match) return { ...entry, matchedParts: match };
  }
  return null;
}

const displayNames = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  smartrecruiters: "SmartRecruiters",
};

export function getAtsMatcher(inputUrl) {
  const match = matchATS(inputUrl);
  if (!match) return null;

  const [, company, jobId, alternateCompany, alternateJobId] =
    match.matchedParts;
  return {
    ...match,
    name: displayNames[match.name] || match.name,
    matched: {
      company: company || alternateCompany,
      jobId: jobId || alternateJobId,
    },
  };
}

export const matchAtsUrl = getAtsMatcher;
export { registry as atsRegistry };
