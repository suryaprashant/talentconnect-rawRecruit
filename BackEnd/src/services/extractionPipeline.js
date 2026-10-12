
import { createHash } from "node:crypto";

import { extractViaATS, getStaticHtml } from "./extractors/atsApi.js";
import { extractJsonLd } from "./extractors/jsonLd.js";
import { extractOpenGraph } from "./extractors/openGraph.js";
import { extractWithGemini } from "./extractors/geminiExtractor.js";

import {
  EMPTY_JOB,
  mergeJob,
  normalizeJob,
  usefulFieldCount,
} from "./extractors/normalizeJob.js";

const threshold = Number(
  process.env.JOB_EXTRACT_CONFIDENCE_THRESHOLD || 0.8,
);

const enough = (result) =>
  result &&
  result.confidence >= threshold &&
  usefulFieldCount(result.data) >= 2;

export function normalizeJobExtraction(input, source) {
  return normalizeJob(input, source);
}

export function buildExtractionCacheKey(url) {
  const normalizedUrl = String(url || "").trim();

  return `job-extract:v2:${createHash("sha256")
    .update(normalizedUrl)
    .digest("hex")}`;
}

// Gemini ki verified values ko preference do,
// lekin Gemini ke empty/null fields se existing data erase mat karo.
function mergeGeminiData(existing = {}, ai = {}) {
  const merged = { ...existing };

  for (const [key, value] of Object.entries(ai)) {
    if (key === "location") {
      const oldLocation = existing.location || {};
      const newLocation = value || {};

      merged.location = {
        ...oldLocation,
        ...Object.fromEntries(
          Object.entries(newLocation).filter(
            ([, item]) =>
              item !== null &&
              item !== undefined &&
              item !== "",
          ),
        ),
      };

      continue;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        merged[key] = value;
      }

      continue;
    }

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      merged[key] = value;
    }
  }

  return merged;
}

function hasUsefulContent(html) {
  return (
    typeof html === "string" &&
    html.replace(/<[^>]*>/g, " ").trim().length >= 300
  );
}

export async function extractJobFromUrl(url) {
  let result = {
    data: normalizeJob(EMPTY_JOB),
    confidence: 0,
    source: "ats_api",
  };

  let html = "";

  try {
    // 1. ATS API extraction.
    const ats = await extractViaATS(url).catch(() => null);

    if (ats?.data) {
      result = {
        ...ats,
        data: normalizeJob(ats.data, ats.source),
      };
    }

    // 2. Fetch HTML even when ATS confidence is high.
    // Gemini needs source content to verify existing values.
    html = await getStaticHtml(url).catch(() => "");

    // 3. JSON-LD extraction.
    if (html) {
      const jsonld = extractJsonLd(html);

      if (jsonld?.data) {
        result.data = mergeJob(result.data, jsonld.data);

        result.confidence = Math.max(
          result.confidence || 0,
          jsonld.confidence || 0,
        );

        if (!result.source && jsonld.source) {
          result.source = jsonld.source;
        }
      }

      // 4. OpenGraph extraction.
      const og = extractOpenGraph(html);

      if (og?.data) {
        result.data = mergeJob(result.data, og.data);

        result.confidence = Math.max(
          result.confidence || 0,
          og.confidence || 0,
        );
      }
    }

    // 5. Render the page if static HTML is unavailable/too short
    // or the existing extraction is insufficient.
    if (!hasUsefulContent(html) || !enough(result)) {
      try {
        const { renderThroughQueue } =
          await import("../queue/playwrightRenderClient.js");

        const renderResult = await renderThroughQueue(url);

        const rendered =
          typeof renderResult === "string"
            ? renderResult
            : renderResult?.html || "";

        if (rendered) {
          if (!hasUsefulContent(html)) {
            html = rendered;
          }

          const jsonld = extractJsonLd(rendered);

          if (jsonld?.data) {
            result.data = mergeJob(result.data, jsonld.data);

            result.confidence = Math.max(
              result.confidence || 0,
              jsonld.confidence || 0,
            );
          }

          const og = extractOpenGraph(rendered);

          if (og?.data) {
            result.data = mergeJob(result.data, og.data);

            result.confidence = Math.max(
              result.confidence || 0,
              og.confidence || 0,
            );
          }
        }
      } catch (error) {
        console.warn(
          "Playwright rendering unavailable:",
          error.message,
        );
      }
    }

    // 6. Gemini verification/enrichment.
    // This does NOT depend only on the confidence threshold.
    const sourceContent =
      html || result.data?.description || "";

    if (String(sourceContent).trim().length >= 50) {
      try {
        const gemini = await extractWithGemini(
          sourceContent,
          result.data,
        );

        if (gemini?.data) {
          result.data = mergeGeminiData(
            result.data,
            gemini.data,
          );

          result.confidence = Math.max(
            result.confidence || 0,
            gemini.confidence || 0,
          );

          result.source = "gemini";
        }
      } catch (error) {
        // If Gemini fails, preserve the best existing extraction.
        console.error(
          "Gemini enrichment failed:",
          error.message,
        );
      }
    }
  } catch (error) {
    console.error(
      "Job extraction pipeline failed:",
      error.message,
    );
  }

  // 7. Normalize the final response to preserve the existing schema.
  const finalData = normalizeJob(
    {
      ...result.data,
      confidence: result.confidence || 0,
      source: result.source || "ats_api",
    },
    result.source,
  );

  if (
    !finalData.title &&
    !finalData.description &&
    !finalData.company
  ) {
    const error = new Error(
      "Couldn't auto-extract job details — please fill the form manually.",
    );

    error.code = "EXTRACTION_INSUFFICIENT";

    throw error;
  }

  return finalData;
}

export default extractJobFromUrl;
