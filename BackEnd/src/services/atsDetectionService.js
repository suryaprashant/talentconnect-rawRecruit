import axios from "axios";
import * as cheerio from "cheerio";
import CompanyATS from "../models/companyAts.js";

import {
  createCompanySlug,
  createRawCompanySlug,
} from "../utils/jobTextUtils.js";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const COMPANY_SUFFIX_WORDS = [
  "private",
  "limited",
  "pvt",
  "ltd",
  "llp",
  "opc",
  "inc",
  "corp",
  "corporation",
  "company",
  "co",
  "technologies",
  "technology",
  "solutions",
  "services",
  "software",
  "systems",
  "india",
  "global",
];

const normalizeWords = (value = "") => {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const createSlug = (value = "") => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
};

const removeSuffixWords = (companyName = "") => {
  const words = normalizeWords(companyName).split(" ").filter(Boolean);

  return words
    .filter((word) => !COMPANY_SUFFIX_WORDS.includes(word))
    .join(" ");
};

const createPossibleCompanySlugs = (companyName = "") => {
  const originalWords = normalizeWords(companyName);
  const withoutSuffixWords = removeSuffixWords(companyName);
  const words = originalWords.split(" ").filter(Boolean);

  const possibleValues = [
    companyName,
    originalWords,
    withoutSuffixWords,
    words[0],
    words.slice(0, 2).join(" "),
    createCompanySlug(companyName),
    createRawCompanySlug(companyName),
  ];

  const slugs = possibleValues.map(createSlug).filter(Boolean);

  return [...new Set(slugs)];
};

const extractGreenhouseSlugFromUrl = (url = "") => {
  const match = String(url).match(
    /(?:boards\.greenhouse\.io|job-boards\.greenhouse\.io)\/([^/?#]+)/
  );

  return match?.[1] || "";
};

const extractLeverSlugFromUrl = (url = "") => {
  const match = String(url).match(/jobs\.lever\.co\/([^/?#]+)/);

  return match?.[1] || "";
};

const probeSingleATS = async (probe) => {
  try {
    const response = await axios.get(probe.apiUrl, {
      timeout: 8000,
      validateStatus: () => true,
    });

    const isValidGreenhouse =
      probe.atsType === "greenhouse" && Array.isArray(response.data?.jobs);

    const isValidLever =
      probe.atsType === "lever" && Array.isArray(response.data);

    if (response.status === 200 && (isValidGreenhouse || isValidLever)) {
      return {
        atsType: probe.atsType,
        apiUrl: probe.apiUrl,
        careersPageUrl: probe.url,
        greenhouseSlug: probe.greenhouseSlug || "",
        leverSlug: probe.leverSlug || "",
        detectedSlug: probe.slug,
      };
    }

    return null;
  } catch {
    return null;
  }
};

const probeKnownATS = async (slugs = []) => {
  for (const slug of slugs) {
    const probes = [
      {
        slug,
        atsType: "greenhouse",
        url: `https://job-boards.greenhouse.io/${slug}`,
        apiUrl: `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`,
        greenhouseSlug: slug,
      },
      {
        slug,
        atsType: "lever",
        url: `https://jobs.lever.co/${slug}`,
        apiUrl: `https://api.lever.co/v0/postings/${slug}?mode=json`,
        leverSlug: slug,
      },
    ];

    for (const probe of probes) {
      const result = await probeSingleATS(probe);

      if (result) {
        return result;
      }
    }
  }

  return null;
};

const findCompanyCareerLinksFromSearch = async (companyName = "") => {
  try {
    const query = encodeURIComponent(
      `${companyName} Greenhouse Lever careers jobs`
    );

    const searchUrl = `https://www.google.com/search?q=${query}`;

    const { data } = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const links = [];

    $("a").each((_, element) => {
      const href = $(element).attr("href");

      if (!href) return;

      const decodedHref = decodeURIComponent(href);

      const urlMatch = decodedHref.match(/https?:\/\/[^&]+/);

      if (!urlMatch) return;

      const url = urlMatch[0];

      if (
        url.includes("greenhouse.io") ||
        url.includes("job-boards.greenhouse.io") ||
        url.includes("jobs.lever.co")
      ) {
        links.push(url);
      }
    });

    return [...new Set(links)];
  } catch (error) {
    console.log("Career link fallback failed:", error.message);
    return [];
  }
};

const detectATSFromCareerLinks = async (companyName = "") => {
  const links = await findCompanyCareerLinksFromSearch(companyName);

  console.log("Fallback career links:", links);

  for (const link of links) {
    const greenhouseSlug = extractGreenhouseSlugFromUrl(link);

    if (greenhouseSlug) {
      const greenhouseResult = await probeKnownATS([greenhouseSlug]);

      if (greenhouseResult) {
        return greenhouseResult;
      }
    }

    const leverSlug = extractLeverSlugFromUrl(link);

    if (leverSlug) {
      const leverResult = await probeKnownATS([leverSlug]);

      if (leverResult) {
        return leverResult;
      }
    }
  }

  return null;
};

const findCachedCompanyATS = async (companyName = "", slugs = []) => {
  const normalizedText = normalizeWords(companyName);
  const firstWord = normalizedText.split(" ")[0];

  const orConditions = [
    { companySlug: { $in: slugs } },
    { greenhouseSlug: { $in: slugs } },
    { leverSlug: { $in: slugs } },
  ];

  if (firstWord) {
    orConditions.push({
      companyName: {
        $regex: firstWord,
        $options: "i",
      },
    });
  }

  const cached = await CompanyATS.findOne({
    isActive: true,
    $or: orConditions,
  });

  if (
    cached &&
    cached.lastVerifiedAt &&
    cached.lastVerifiedAt > new Date(Date.now() - THIRTY_DAYS)
  ) {
    return cached;
  }

  return null;
};

const upsertCompanyATS = async (slug, companyName, data) => {
  return CompanyATS.findOneAndUpdate(
    {
      companySlug: slug,
    },
    {
      companyName,
      companySlug: slug,
      companyNormalized: `${slug.toUpperCase()}_CANONICAL`,

      atsType: data.atsType || "unknown",
      apiUrl: data.apiUrl || "",
      careersPageUrl: data.careersPageUrl || "",
      greenhouseSlug: data.greenhouseSlug || "",
      leverSlug: data.leverSlug || "",

      lastVerifiedAt: new Date(),
      isActive: true,
    },
    {
      upsert: true,
      new: true,
    }
  );
};

export const detectATS = async (companyName = "") => {
  if (!companyName || !companyName.trim()) {
    throw new Error("Company name is required");
  }

  const possibleSlugs = createPossibleCompanySlugs(companyName);

  console.log("Company searched:", companyName);
  console.log("Possible company slugs:", possibleSlugs);

  if (!possibleSlugs.length) {
    throw new Error("Company slug could not be created");
  }

  const cached = await findCachedCompanyATS(companyName, possibleSlugs);

  if (cached) {
    console.log("ATS found from cache:", {
      atsType: cached.atsType,
      companySlug: cached.companySlug,
      greenhouseSlug: cached.greenhouseSlug,
      leverSlug: cached.leverSlug,
    });

    return cached;
  }

  let probeResult = await probeKnownATS(possibleSlugs);

  if (!probeResult) {
    console.log("Direct ATS probe failed. Trying career-link fallback...");
    probeResult = await detectATSFromCareerLinks(companyName);
  }

  if (probeResult) {
    const finalSlug =
      probeResult.greenhouseSlug ||
      probeResult.leverSlug ||
      probeResult.detectedSlug ||
      possibleSlugs[0];

    console.log("ATS detected:", {
      atsType: probeResult.atsType,
      finalSlug,
    });

    return upsertCompanyATS(finalSlug, companyName, probeResult);
  }

  const fallbackSlug = possibleSlugs[0];

  console.log("ATS not detected. Saving as unknown:", fallbackSlug);

  return upsertCompanyATS(fallbackSlug, companyName, {
    atsType: "unknown",
    apiUrl: "",
    careersPageUrl: "",
    greenhouseSlug: "",
    leverSlug: "",
  });
};