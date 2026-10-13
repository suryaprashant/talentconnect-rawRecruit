import { createHash } from "node:crypto";

import { getStaticHtml } from "./extractors/staticHtml.js";
import { extractJsonLd } from "./extractors/jsonLd.js";
import { extractOpenGraph } from "./extractors/openGraph.js";
import { extractWithGemini } from "./extractors/geminiExtractor.js";

import { compactForLlm, pageToText } from "./extractors/text.js";

import {
  canonicalizeUrl,
  assertPublicUrlShape,
} from "./extractors/urlSafety.js";

import {
  EMPTY_JOB,
  isEmptyValue,
  mergeJob,
  normalizeJob,
  usefulFieldCount,
} from "./extractors/normalizeJob.js";

const CACHE_VERSION = "v6";

const JOB_FIELDS = [
  "title",
  "company",
  "location",
  "employmentType",
  "workMode",
  "experienceRequired",
  "applicationDeadline",
  "requiredSkills",
  "degree",
  "certifications",
  "benefits",
  "eligibilityCriteria",
  "description",
  "salary",
];

export class ExtractionError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ExtractionError";
    this.code = code;
  }
}

export const SAFE_ERROR_MESSAGE =
  "Couldn't auto-extract job details — please fill the form manually.";

export function normalizeJobExtraction(input, source) {
  return normalizeJob(input, source);
}

/**
 * Shared cache key for controller and worker.
 */
export function buildExtractionCacheKey(url) {
  let normalized = String(url || "").trim();

  try {
    normalized = canonicalizeUrl(new URL(normalized)).toString();
  } catch {
    // Keep original input if URL parsing fails.
  }

  return `job-extract:${CACHE_VERSION}:${createHash("sha256")
    .update(normalized)
    .digest("hex")}`;
}

const getMissingFields = (data = {}) =>
  JOB_FIELDS.filter((field) => isEmptyValue(data[field]));

const safeError = (error) =>
  String(error?.message || error || "Unknown error")
    .replace(/((?:api[\_-]?key|key)=)[^\s&]+/gi, "$1[redacted]")
    .replace(/AIza[\w-]{20,}/g, "[redacted]")
    .slice(0, 500);

/**
 * Never print URL credentials or sensitive query parameters.
 */
function safeTraceUrl(input) {
  try {
    const url = new URL(String(input));

    url.username = "";
    url.password = "";

    for (const key of [...url.searchParams.keys()]) {
      if (
        /^(?:api[\_-]?key|key|token|access_token|auth|secret|client_secret)$/i.test(
          key,
        )
      ) {
        url.searchParams.set(key, "[redacted]");
      }
    }

    return url.toString();
  } catch {
    return String(input || "")
      .replace(/:\/\/[^/@\s]+@/g, "://[redacted]@")
      .replace(
        /((?:api[\_-]?key|key|token|access_token|auth|secret)=)[^\s&#]+/gi,
        "$1[redacted]",
      );
  }
}

/**
 * Structured logs make it easier to debug production extraction.
 */
function logInfo(stage, details = {}) {
  console.log(
    JSON.stringify({
      event: "job_extraction",
      level: "info",
      stage,
      timestamp: new Date().toISOString(),
      ...details,
    }),
  );
}

function logError(stage, error, details = {}) {
  console.error(
    JSON.stringify({
      event: "job_extraction",
      level: "error",
      stage,
      timestamp: new Date().toISOString(),
      error: safeError(error),
      ...details,
    }),
  );
}

function makeTrace(inputUrl) {
  return {
    url: safeTraceUrl(inputUrl).slice(0, 2048),
    host: null,

    static: {
      attempted: false,
      ok: false,
      status: null,
      htmlChars: 0,
      pageTextChars: 0,
      error: null,
    },

    jsonLd: {
      found: false,
      chars: 0,
      error: null,
    },

    openGraph: {
      found: false,
      error: null,
    },

    render: {
      attempted: false,
      ok: false,
      htmlChars: 0,
      pageTextChars: 0,
      graphqlPayloads: 0,
      graphqlChars: 0,
      error: null,
    },

    gemini: {
      called: false,
      ok: false,
      ms: 0,
      attempts: 0,
      sentChars: {
        jsonLd: 0,
        meta: 0,
        pageText: 0,
        staticPageText: 0,
        renderedPageText: 0,
        graphql: 0,
        sourceJobs: 0,
        hints: 0,
      },
      isJobPosting: null,
      error: null,
      finishReason: null,
    },

    result: {
      source: null,
      confidence: 0,
      missingFields: [...JOB_FIELDS],
    },

    durationMs: 0,
  };
}

const defaultRender = async (url) => {
  const { renderJobPage } = await import("./extractors/playwrightRenderer.js");

  return renderJobPage(url);
};

const defaultDeps = {
  getStaticHtml,
  render: defaultRender,
  gemini: extractWithGemini,
};

/**
 * Normalize each source independently.
 */
function normalizeSource(data, source) {
  if (!data || typeof data !== "object") {
    return null;
  }

  try {
    return normalizeJob(data, source);
  } catch (error) {
    logError("source_normalization", error, { source });
    return null;
  }
}

/**
 * Extract JSON-LD, OpenGraph and visible text from HTML.
 */
function extractHtmlEvidence(html, sourceName) {
  const result = {
    jsonLdRaw: null,
    jsonLdData: null,
    metaRaw: null,
    metaData: null,
    pageText: "",
  };

  if (typeof html !== "string" || !html.trim()) {
    logInfo("html_empty", { source: sourceName });

    return result;
  }

  logInfo("html_processing_started", {
    source: sourceName,
    htmlChars: html.length,
  });

  // JSON-LD
  try {
    const ld = extractJsonLd(html);

    if (ld) {
      result.jsonLdRaw = compactForLlm(ld.raw, 20000);

      result.jsonLdData = normalizeSource(ld.data, `jsonld_${sourceName}`);

      logInfo("jsonld_found", {
        source: sourceName,
        rawChars: result.jsonLdRaw.length,
        normalized: Boolean(result.jsonLdData),
        fields: result.jsonLdData ? usefulFieldCount(result.jsonLdData) : 0,
      });
    } else {
      logInfo("jsonld_not_found", {
        source: sourceName,
      });
    }
  } catch (error) {
    logError("jsonld_extraction", error, {
      source: sourceName,
    });
  }

  // OpenGraph
  try {
    const og = extractOpenGraph(html);

    if (og) {
      result.metaRaw = compactForLlm(og.raw, 3000);

      result.metaData = normalizeSource(og.data, `opengraph_${sourceName}`);

      logInfo("opengraph_found", {
        source: sourceName,
        rawChars: result.metaRaw.length,
        normalized: Boolean(result.metaData),
      });
    } else {
      logInfo("opengraph_not_found", {
        source: sourceName,
      });
    }
  } catch (error) {
    logError("opengraph_extraction", error, {
      source: sourceName,
    });
  }

  // Visible text
  try {
    result.pageText = pageToText(html, 30000) || "";

    logInfo("page_text_extracted", {
      source: sourceName,
      chars: result.pageText.length,
    });
  } catch (error) {
    logError("page_text_extraction", error, {
      source: sourceName,
    });
  }

  return result;
}

/**
 * Main pipeline:
 *
 * 1. Fetch static HTML.
 * 2. Extract JSON-LD and OpenGraph.
 * 3. Render the URL using Chromium/Playwright.
 * 4. Collect available GraphQL/network data.
 * 5. Normalize and aggregate evidence.
 * 6. Send all available evidence to Gemini.
 * 7. Return Gemini's normalized result.
 *
 * ATS extraction is intentionally not used.
 */
async function extractJobCore(inputUrl, deps) {
  const url = canonicalizeUrl(assertPublicUrlShape(inputUrl)).toString();

  const startedAt = Date.now();

  logInfo("extraction_started", {
    url: safeTraceUrl(url),
    atsEnabled: false,
  });

  const evidence = {
    jsonLd: false,
    openGraph: false,
    staticHtml: false,
    renderedHtml: false,
    graphql: false,
    staticFailed: false,
    renderFailed: false,
  };

  const context = {
    jsonLd: "",
    meta: "",
    pageText: "",
    staticPageText: "",
    renderedPageText: "",
    graphql: "",
    sourceJobs: [],
    deterministicHints: {},
    evidence,
    diagnostics: {},
    noContent: false,
  };

  const sourceJobs = [];

  let deterministic = normalizeJob(EMPTY_JOB, null);

  /**
   * Save normalized source data for Gemini.
   */
  function addSourceJob(data, source) {
    const normalized = normalizeSource(data, source);

    if (!normalized) {
      logInfo("source_data_skipped", { source });
      return;
    }

    sourceJobs.push({
      source,
      data: normalized,
    });

    deterministic = mergeJob(deterministic, normalized);

    logInfo("source_data_added", {
      source,
      usefulFields: usefulFieldCount(normalized),
      totalSources: sourceJobs.length,
    });
  }

  /**
   * Process static or rendered HTML.
   */
  function absorbHtml(html, sourceName) {
    const extracted = extractHtmlEvidence(html, sourceName);

    if (extracted.jsonLdRaw) {
      evidence.jsonLd = true;

      context.jsonLd = [
        context.jsonLd,
        `SOURCE: ${sourceName}\n${extracted.jsonLdRaw}`,
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 40000);
    }

    if (extracted.jsonLdData) {
      addSourceJob(extracted.jsonLdData, `jsonld_${sourceName}`);
    }

    if (extracted.metaRaw) {
      evidence.openGraph = true;

      context.meta = [
        context.meta,
        `SOURCE: ${sourceName}\n${extracted.metaRaw}`,
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 6000);
    }

    if (extracted.metaData) {
      addSourceJob(extracted.metaData, `opengraph_${sourceName}`);
    }

    if (sourceName === "static") {
      context.staticPageText = extracted.pageText;
    }

    if (sourceName === "rendered") {
      context.renderedPageText = extracted.pageText;
    }

    // Keep both versions instead of silently discarding one.
    context.pageText = [
      context.staticPageText && `SOURCE: static\n${context.staticPageText}`,

      context.renderedPageText &&
        `SOURCE: rendered\n${context.renderedPageText}`,
    ]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 50000);

    logInfo("html_evidence_absorbed", {
      source: sourceName,
      jsonLdFound: Boolean(extracted.jsonLdRaw),
      openGraphFound: Boolean(extracted.metaRaw),
      pageTextChars: extracted.pageText.length,
      totalSources: sourceJobs.length,
    });
  }

  // -------------------------------------------------------
  // 1. Static HTML: always attempt.
  // -------------------------------------------------------

  logInfo("static_fetch_started", {
    url: safeTraceUrl(url),
  });

  try {
    const html = (await deps.getStaticHtml(url)) || "";

    evidence.staticHtml = Boolean(html);

    logInfo("static_fetch_completed", {
      success: Boolean(html),
      htmlChars: html.length,
    });

    if (html) {
      absorbHtml(html, "static");
    }
  } catch (error) {
    evidence.staticFailed = true;

    logError("static_fetch_failed", error, {
      url: safeTraceUrl(url),
    });
  }

  // -------------------------------------------------------
  // 2. Chromium / Playwright: always attempt.
  // -------------------------------------------------------

  logInfo("playwright_started", {
    url: safeTraceUrl(url),
  });

  let graphqlPayloadCount = 0;

  try {
    const rendered = await deps.render(url);

    const renderedHtml =
      typeof rendered === "string" ? rendered : rendered?.html || "";

    evidence.renderedHtml = Boolean(renderedHtml);

    logInfo("playwright_completed", {
      htmlAvailable: Boolean(renderedHtml),
      htmlChars: renderedHtml.length,
      responseType: typeof rendered === "string" ? "string" : typeof rendered,
    });

    if (renderedHtml) {
      absorbHtml(renderedHtml, "rendered");
    }

    /*
     * The Playwright worker must explicitly capture and return
     * GraphQL/fetch/XHR responses for this section to receive them.
     *
     * Supported shapes:
     *   "rendered HTML"
     *   { html: "..." }
     *   { html: "...", graphqlData: [...] }
     *   { html: "...", networkData: [...] }
     *   { html: "...", graphql: [...] }
     */
    const networkData =
      rendered && typeof rendered === "object"
        ? (rendered.graphqlData ??
          rendered.networkData ??
          rendered.graphql ??
          [])
        : [];

    let payloads = [];

    if (Array.isArray(networkData)) {
      payloads = networkData;
    } else if (networkData != null) {
      payloads = [networkData];
    }

    const compactPayloads = [];

    for (const payload of payloads) {
      if (payload == null) {
        continue;
      }

      const compact = compactForLlm(payload, 10000);

      if (compact) {
        compactPayloads.push(compact);
      }

      // Limit the number of payloads sent to Gemini.
      if (compactPayloads.length >= 12) {
        break;
      }
    }

    graphqlPayloadCount = compactPayloads.length;

    context.graphql = compactPayloads.join("\n\n").slice(0, 50000);

    evidence.graphql = Boolean(context.graphql);

    logInfo("graphql_collection_completed", {
      payloadCount: graphqlPayloadCount,
      payloadChars: context.graphql.length,
      found: evidence.graphql,
    });
  } catch (error) {
    evidence.renderFailed = true;

    logError("playwright_failed", error, {
      url: safeTraceUrl(url),
    });
  }

  // -------------------------------------------------------
  // 3. Prepare normalized source data and combined hints.
  // -------------------------------------------------------

  context.sourceJobs = sourceJobs.map(({ source, data }) => ({
    source,
    data,
  }));

  context.deterministicHints = Object.fromEntries(
    Object.entries(deterministic || {}).filter(
      ([key, value]) =>
        !["confidence", "source"].includes(key) && !isEmptyValue(value),
    ),
  );

  context.noContent = !(
    context.jsonLd ||
    context.meta ||
    context.pageText ||
    context.graphql
  );

  context.diagnostics = {
    ...evidence,
    sourceCount: sourceJobs.length,
    graphqlPayloads: graphqlPayloadCount,
    graphqlChars: context.graphql.length,
    jsonLdChars: context.jsonLd.length,
    metaChars: context.meta.length,
    pageTextChars: context.pageText.length,
    hintsFields: usefulFieldCount(context.deterministicHints),
    noContent: context.noContent,
  };

  logInfo("evidence_aggregation_completed", {
    ...context.diagnostics,
  });

  // -------------------------------------------------------
  // 4. Gemini: receives all available evidence.
  // -------------------------------------------------------

  logInfo("gemini_started", {
    noContent: context.noContent,
    contextChars: {
      jsonLd: context.jsonLd.length,
      meta: context.meta.length,
      pageText: context.pageText.length,
      staticPageText: context.staticPageText.length,
      renderedPageText: context.renderedPageText.length,
      graphql: context.graphql.length,
      sourceJobs: JSON.stringify(context.sourceJobs).length,
      hints: JSON.stringify(context.deterministicHints).length,
    },
  });

  const geminiStartedAt = Date.now();

  let gemini;

  try {
    gemini = await deps.gemini({
      url,
      context,
      hints: context.deterministicHints,
    });

    logInfo("gemini_response_received", {
      elapsedMs: Date.now() - geminiStartedAt,
      hasData: Boolean(gemini?.data),
      isJobPosting: gemini?.isJobPosting ?? null,
      attempts: gemini?.attempts || 1,
      finishReason: gemini?.finishReason || null,
    });
  } catch (error) {
    logError("gemini_failed", error, {
      elapsedMs: Date.now() - geminiStartedAt,
      attempts: error?.attempts || 1,
    });

    throw error;
  }

  if (gemini?.isJobPosting === false) {
    logInfo("gemini_rejected_non_job_page", {
      url: safeTraceUrl(url),
    });

    throw new ExtractionError(
      "Page is not a single job posting.",
      "EXTRACTION_INSUFFICIENT",
    );
  }

  if (
    !gemini?.data ||
    typeof gemini.data !== "object" ||
    Array.isArray(gemini.data)
  ) {
    logError(
      "gemini_invalid_output",
      "Gemini returned no valid structured job object.",
    );

    throw new ExtractionError(SAFE_ERROR_MESSAGE, "EXTRACTION_INSUFFICIENT");
  }

  // Gemini owns the final field values.
  // Deterministic source values do not overwrite Gemini's response.
  const final = normalizeJob(gemini.data, "gemini");

  final.source = "gemini";

  final.confidence = scoreConfidence(gemini.confidence, evidence, final);

  if (!final.title && !final.description) {
    logError(
      "final_validation_failed",
      "Gemini result contains neither a title nor a description.",
      {
        missingFields: getMissingFields(final),
      },
    );

    throw new ExtractionError(SAFE_ERROR_MESSAGE, "EXTRACTION_INSUFFICIENT");
  }

  logInfo("extraction_completed", {
    elapsedMs: Date.now() - startedAt,
    source: final.source,
    confidence: final.confidence,
    usefulFields: usefulFieldCount(final),
    missingFields: getMissingFields(final),
    descriptionChars: final.description?.length || 0,
  });

  return final;
}

/**
 * Public extraction method with detailed tracing.
 */
export async function extractJobFromUrl(inputUrl, overrides = {}) {
  const trace = makeTrace(inputUrl);
  const startedAt = Date.now();

  const original = {
    ...defaultDeps,
    ...overrides,
  };

  logInfo("pipeline_invoked", {
    url: safeTraceUrl(inputUrl),
    atsEnabled: false,
  });

  const noteHtml = (html, source) => {
    if (!html) {
      return;
    }

    try {
      const ld = extractJsonLd(html);

      if (ld) {
        trace.jsonLd.found = true;

        trace.jsonLd.chars = Math.max(
          trace.jsonLd.chars,
          compactForLlm(ld.raw, 20000).length,
        );
      }
    } catch (error) {
      trace.jsonLd.error = safeError(error);
    }

    try {
      if (extractOpenGraph(html)) {
        trace.openGraph.found = true;
      }
    } catch (error) {
      trace.openGraph.error = safeError(error);
    }

    logInfo("trace_html_inspected", {
      source,
      htmlChars: html.length,
      jsonLdFound: trace.jsonLd.found,
      openGraphFound: trace.openGraph.found,
    });
  };

  const deps = {
    getStaticHtml: async (url) => {
      trace.static.attempted = true;

      logInfo("static_fetch_attempt", {
        url: safeTraceUrl(url),
      });

      try {
        const html = (await original.getStaticHtml(url)) || "";

        trace.static.ok = Boolean(html);
        trace.static.status = html ? 200 : null;
        trace.static.htmlChars = html.length;

        try {
          trace.static.pageTextChars = pageToText(html, 30000).length;
        } catch {
          trace.static.pageTextChars = 0;
        }

        noteHtml(html, "static");

        logInfo("static_fetch_result", {
          success: trace.static.ok,
          htmlChars: trace.static.htmlChars,
          pageTextChars: trace.static.pageTextChars,
        });

        return html;
      } catch (error) {
        trace.static.status = error?.status || null;
        trace.static.error = safeError(error);

        logError("static_fetch_error", error, {
          url: safeTraceUrl(url),
        });

        throw error;
      }
    },

    render: async (url) => {
      trace.render.attempted = true;

      logInfo("playwright_attempt", {
        url: safeTraceUrl(url),
      });

      try {
        const rendered = await original.render(url);

        const html =
          typeof rendered === "string" ? rendered : rendered?.html || "";

        const networkData =
          rendered && typeof rendered === "object"
            ? (rendered.graphqlData ??
              rendered.networkData ??
              rendered.graphql ??
              [])
            : [];

        trace.render.graphqlPayloads = Array.isArray(networkData)
          ? networkData.length
          : networkData
            ? 1
            : 0;

        trace.render.graphqlChars = compactForLlm(networkData, 50000).length;

        trace.render.ok = Boolean(html || trace.render.graphqlPayloads);

        trace.render.htmlChars = html.length;

        try {
          trace.render.pageTextChars = pageToText(html, 30000).length;
        } catch {
          trace.render.pageTextChars = 0;
        }

        noteHtml(html, "rendered");

        logInfo("playwright_result", {
          success: trace.render.ok,
          htmlChars: trace.render.htmlChars,
          pageTextChars: trace.render.pageTextChars,
          graphqlPayloads: trace.render.graphqlPayloads,
          graphqlChars: trace.render.graphqlChars,
        });

        return rendered;
      } catch (error) {
        trace.render.error = safeError(error);

        logError("playwright_error", error, {
          url: safeTraceUrl(url),
        });

        throw error;
      }
    },

    gemini: async (input) => {
      trace.gemini.called = true;

      const context = input.context || {};

      trace.gemini.sentChars = {
        jsonLd: context.jsonLd?.length || 0,
        meta: context.meta?.length || 0,
        pageText: context.pageText?.length || 0,
        staticPageText: context.staticPageText?.length || 0,
        renderedPageText: context.renderedPageText?.length || 0,
        graphql: context.graphql?.length || 0,
        sourceJobs: JSON.stringify(context.sourceJobs || []).length,
        hints: JSON.stringify(input.hints || {}).length,
      };

      logInfo("gemini_context_ready", {
        sentChars: trace.gemini.sentChars,
        noContent: context.noContent,
        evidence: context.evidence,
      });

      const geminiStartedAt = Date.now();

      try {
        const response = await original.gemini(input);

        trace.gemini.ok = Boolean(
          response &&
          (response.data || typeof response.isJobPosting === "boolean"),
        );

        trace.gemini.attempts = response?.attempts || 1;

        trace.gemini.isJobPosting = response?.isJobPosting ?? null;

        trace.gemini.finishReason = response?.finishReason || null;

        if (!trace.gemini.ok) {
          trace.gemini.error = "Gemini returned no structured job data.";
        }

        logInfo("gemini_call_completed", {
          success: trace.gemini.ok,
          elapsedMs: Date.now() - geminiStartedAt,
          attempts: trace.gemini.attempts,
          isJobPosting: trace.gemini.isJobPosting,
          finishReason: trace.gemini.finishReason,
        });

        return response;
      } catch (error) {
        trace.gemini.error = safeError(error);
        trace.gemini.attempts = error?.attempts || 1;

        logError("gemini_call_error", error, {
          elapsedMs: Date.now() - geminiStartedAt,
          attempts: trace.gemini.attempts,
        });

        throw error;
      } finally {
        trace.gemini.ms = Date.now() - geminiStartedAt;
      }
    },
  };

  try {
    const safeUrl = canonicalizeUrl(assertPublicUrlShape(inputUrl));

    trace.url = safeTraceUrl(safeUrl).slice(0, 2048);

    trace.host = safeUrl.hostname.toLowerCase();

    const result = await extractJobCore(inputUrl, deps);

    trace.result = {
      source: result.source,
      confidence: result.confidence,
      missingFields: getMissingFields(result),
    };

    logInfo("pipeline_success", {
      host: trace.host,
      source: result.source,
      confidence: result.confidence,
      missingFields: trace.result.missingFields,
    });

    return result;
  } catch (error) {
    trace.result = {
      source: null,
      confidence: 0,
      missingFields: [...JOB_FIELDS],
    };

    logError("pipeline_failed", error, {
      host: trace.host,
      code: error?.code || null,
    });

    throw error;
  } finally {
    trace.durationMs = Date.now() - startedAt;

    console.log(
      JSON.stringify({
        event: "job_extraction_trace",
        ...trace,
      }),
    );
  }
}

/**
 * Heuristic confidence only; this is not measured extraction accuracy.
 */
function scoreConfidence(base, evidence, job) {
  let confidence = Number(base) || 0.8;

  if (evidence.jsonLd) {
    confidence += 0.04;
  }

  if (evidence.openGraph) {
    confidence += 0.02;
  }

  if (evidence.renderedHtml) {
    confidence += 0.03;
  }

  if (evidence.graphql) {
    confidence += 0.03;
  }

  if (usefulFieldCount(job) < 3) {
    confidence -= 0.15;
  }

  return Math.max(0, Math.min(0.97, confidence));
}

export default extractJobFromUrl;
