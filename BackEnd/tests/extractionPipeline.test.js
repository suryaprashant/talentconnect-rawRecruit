import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildExtractionCacheKey,
  extractJobFromUrl,
} from "../src/services/extractionPipeline.js";
import { createExtractionHandler } from "../src/controllers/jobUrlExtractionController.js";
import {
  buildGeminiPrompt,
  parseJsonResponse,
} from "../src/services/extractors/geminiExtractor.js";
import { assertPublicUrlShape } from "../src/services/extractors/urlSafety.js";

const JOB_URL =
  "https://www.google.com/about/careers/applications/jobs/results/73305472681026246-senior-ios-developer-search-app";
const EMPTY_HTML =
  "<!doctype html><html><head></head><body><main>Loading...</main></body></html>";
const finalJob = (overrides = {}) => ({
  title: "Platform Engineer",
  company: "Example Corp",
  location: { state: "CA", city: "San Francisco" },
  employmentType: "full_time",
  workMode: "hybrid",
  experienceRequired: "3+ years",
  applicationDeadline: null,
  requiredSkills: ["Node.js"],
  degree: [],
  certifications: [],
  benefits: [],
  eligibilityCriteria: null,
  description: "Build reliable systems.",
  salary: null,
  confidence: 0.9,
  ...overrides,
});

const jsonLdHtml = (job) =>
  `<html><head><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "JobPosting", ...job })}</script></head><body><main>Hiring now</main></body></html>`;
const ogHtml = (title, description) =>
  `<html><head><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"></head><body></body></html>`;

async function runExtraction({
  staticHtml = EMPTY_HTML,
  staticError,
  rendered = EMPTY_HTML,
  renderError,
  geminiResult = { data: finalJob(), confidence: 0.9, isJobPosting: true },
  geminiError,
} = {}) {
  let staticCalls = 0;
  let renderCalls = 0;
  let geminiInput;
  let trace;
  const originalLog = console.log;
  console.log = (line, ...rest) => {
    if (typeof line === "string") {
      try {
        const parsed = JSON.parse(line);
        if (parsed.event === "job_extraction_trace") trace = parsed;
      } catch {
        // Ignore logs that are not the structured extraction trace.
      }
    }
  };

  try {
    const result = await extractJobFromUrl(JOB_URL, {
      getStaticHtml: async () => {
        staticCalls += 1;
        if (staticError) throw staticError;
        return typeof staticHtml === "function" ? staticHtml() : staticHtml;
      },
      render: async () => {
        renderCalls += 1;
        if (renderError) throw renderError;
        return typeof rendered === "function" ? rendered() : rendered;
      },
      gemini: async (input) => {
        geminiInput = input;
        if (geminiError) throw geminiError;
        return geminiResult;
      },
    });
    return { result, trace, geminiInput, staticCalls, renderCalls };
  } catch (error) {
    return { error, trace, geminiInput, staticCalls, renderCalls };
  } finally {
    console.log = originalLog;
  }
}

test("pipeline does not import ATS extraction modules", async () => {
  const source = await readFile(
    new URL("../src/services/extractionPipeline.js", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /atsApi|atsRegistry|extractViaATS|findAdapter|ats_api|playwrightRenderClient|jobExtractionQueue/i,
  );
  assert.match(source, /playwrightRenderer\.js/);
  const run = await runExtraction();
  assert.equal(run.result.source, "gemini");
  assert.equal(run.trace.gemini.called, true);
});

test("Gemini prompt includes aggregated network and normalized source evidence", () => {
  const prompt = buildGeminiPrompt({
    url: JOB_URL,
    context: {
      jsonLd: "JSON-LD role",
      meta: "OpenGraph role",
      pageText: "Visible page text",
      graphql: "GraphQL role payload",
      sourceJobs: [
        { source: "jsonld_static", data: { title: "Structured role" } },
      ],
      deterministicHints: { title: "Unverified role" },
      diagnostics: { staticHtml: true, renderedHtml: true },
    },
  });
  for (const evidence of [
    "JSON-LD role",
    "OpenGraph role",
    "Visible page text",
    "GraphQL role payload",
    "Structured role",
    "Unverified role",
    "EXTRACTION_DIAGNOSTICS",
  ]) {
    assert.ok(prompt.includes(evidence), `prompt missing ${evidence}`);
  }
  assert.doesNotMatch(prompt, /ATS_API_JSON|ats_api/i);
});

test("JSON-LD and OpenGraph evidence reach Gemini; Gemini wins conflicts", async () => {
  const staticHtml = jsonLdHtml({
    title: "Structured Title",
    description: "Structured role description",
  });
  const rendered = ogHtml("Rendered Title", "Rendered metadata");
  const run = await runExtraction({
    staticHtml,
    rendered,
    geminiResult: {
      data: finalJob({ title: "Gemini Title" }),
      isJobPosting: true,
    },
  });
  assert.match(run.geminiInput.context.jsonLd, /Structured Title/);
  assert.match(run.geminiInput.context.meta, /Rendered Title/);
  assert.equal(run.result.title, "Gemini Title");
  assert.equal(run.result.source, "gemini");
  assert.equal(run.trace.gemini.called, true);
});

test("OpenGraph metadata without JSON-LD reaches Gemini", async () => {
  const run = await runExtraction({
    staticHtml: ogHtml("Role at Example", "Build platform systems"),
  });
  assert.equal(run.trace.jsonLd.found, false);
  assert.equal(run.trace.openGraph.found, true);
  assert.match(run.geminiInput.context.meta, /Build platform systems/);
  assert.equal(run.trace.gemini.called, true);
});

test("rendered JavaScript page text and GraphQL payload reach Gemini", async () => {
  const page =
    "<html><body><main><h1>Platform Engineer</h1><p>Build distributed systems</p></main></body></html>";
  const graphqlData = [
    {
      data: {
        job: { title: "Platform Engineer", description: "Own platform APIs" },
      },
    },
  ];
  const run = await runExtraction({
    staticHtml: EMPTY_HTML,
    rendered: { html: page, graphqlData },
  });
  assert.match(run.geminiInput.context.pageText, /Build distributed systems/);
  assert.match(run.geminiInput.context.staticPageText, /Loading/);
  assert.match(
    run.geminiInput.context.renderedPageText,
    /Build distributed systems/,
  );
  assert.match(run.geminiInput.context.graphql, /Own platform APIs/);
  assert.equal(run.trace.render.graphqlPayloads, 1);
  assert.equal(run.trace.gemini.called, true);
  const prompt = buildGeminiPrompt(run.geminiInput);
  assert.match(prompt, /<<<STATIC_PAGE_TEXT>>>/);
  assert.match(prompt, /<<<RENDERED_PAGE_TEXT>>>/);
});

test("network-only render is recorded as a successful Playwright stage", async () => {
  const run = await runExtraction({
    rendered: {
      html: "",
      graphqlData: [{ data: { job: { title: "Platform Engineer" } } }],
    },
  });
  assert.equal(run.trace.render.ok, true);
  assert.equal(run.trace.render.graphqlPayloads, 1);
  assert.match(run.geminiInput.context.graphql, /Platform Engineer/);
});

test("static evidence survives a Playwright failure", async () => {
  const html = jsonLdHtml({
    title: "Static Role",
    description: "Static description",
  });
  const run = await runExtraction({
    staticHtml: html,
    renderError: new Error("render failed"),
  });
  assert.match(run.geminiInput.context.jsonLd, /Static Role/);
  assert.equal(run.trace.render.ok, false);
  assert.match(run.trace.render.error, /render failed/);
  assert.equal(run.trace.gemini.called, true);
});

test("rendered evidence survives a static-fetch failure", async () => {
  const rendered =
    "<html><body><main><h1>Rendered Role</h1><p>Rendered role content</p></main></body></html>";
  const run = await runExtraction({
    staticError: new Error("fetch failed"),
    rendered,
  });
  assert.match(run.geminiInput.context.pageText, /Rendered role content/);
  assert.match(run.trace.static.error, /fetch failed/);
  assert.equal(run.trace.gemini.called, true);
});

test("Gemini is called with explicit no-content context when both fetch paths fail", async () => {
  const run = await runExtraction({
    staticError: new Error("fetch failed"),
    renderError: new Error("render failed"),
    geminiResult: { isJobPosting: false },
  });
  assert.equal(run.geminiInput.context.noContent, true);
  assert.equal(run.trace.gemini.called, true);
  assert.equal(run.error.code, "EXTRACTION_INSUFFICIENT");
});

test("visible static page text reaches Gemini without structured metadata", async () => {
  const html =
    "<html><body><nav>Navigation</nav><main><h1>Platform Engineer</h1><p>Design, build, and operate core services.</p></main></body></html>";
  const run = await runExtraction({ staticHtml: html });
  assert.match(
    run.geminiInput.context.pageText,
    /Design, build, and operate core services/,
  );
  assert.equal(run.trace.gemini.called, true);
});

test("Gemini output preserves canonical keys and null optional fields", async () => {
  const run = await runExtraction({
    geminiResult: { data: { title: "Platform Engineer" }, isJobPosting: true },
  });
  assert.deepEqual(Object.keys(run.result), [
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
    "confidence",
    "source",
  ]);
  assert.equal(run.result.title, "Platform Engineer");
  assert.equal(run.result.company, null);
  assert.deepEqual(run.result.requiredSkills, []);
  assert.equal(run.result.source, "gemini");
});

test("invalid Gemini output and non-job responses fail without source fallback", async () => {
  const invalid = await runExtraction({
    geminiResult: { data: "not an object", isJobPosting: true },
  });
  assert.equal(invalid.error.code, "EXTRACTION_INSUFFICIENT");
  assert.equal(invalid.trace.gemini.called, true);
  const notJob = await runExtraction({ geminiResult: { isJobPosting: false } });
  assert.equal(notJob.error.code, "EXTRACTION_INSUFFICIENT");
  assert.equal(notJob.trace.gemini.called, true);
});

test("Gemini failures propagate and are recorded in the trace", async () => {
  const run = await runExtraction({
    geminiError: Object.assign(new Error("Gemini timeout"), { attempts: 3 }),
  });
  assert.match(run.trace.gemini.error, /Gemini timeout/);
  assert.equal(run.trace.gemini.attempts, 3);
  assert.equal(run.trace.gemini.called, true);
});

test("Gemini parser accepts fenced JSON and rejects malformed JSON", () => {
  assert.deepEqual(parseJsonResponse('{"isJobPosting":true}'), {
    isJobPosting: true,
  });
  assert.deepEqual(parseJsonResponse('```json\n{"isJobPosting":false}\n```'), {
    isJobPosting: false,
  });
  assert.throws(() => parseJsonResponse("not json"), /invalid JSON/i);
});

test("authenticated extraction handler returns the job object directly", async () => {
  let extractionCalls = 0;
  let cacheWrite;
  const handler = createExtractionHandler({
    validateUrl: async (raw) => new URL(raw),
    readCache: async () => null,
    writeCache: async (...args) => {
      cacheWrite = args;
    },
    extract: async () => {
      extractionCalls += 1;
      return finalJob({ source: "gemini" });
    },
  });
  const res = {
    headers: {},
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await handler({ user: { id: "user-1" }, body: { url: JOB_URL } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.title, "Platform Engineer");
  assert.equal(res.body.source, "gemini");
  assert.equal("status" in res.body, false);
  assert.equal("jobId" in res.body, false);
  assert.equal(extractionCalls, 1);
  assert.equal(cacheWrite[0], buildExtractionCacheKey(JOB_URL));
});

test("cache hit returns the same direct response without extraction", async () => {
  let extractionCalls = 0;
  const cached = finalJob({ source: "gemini" });
  const handler = createExtractionHandler({
    validateUrl: async (raw) => new URL(raw),
    readCache: async () => cached,
    extract: async () => {
      extractionCalls += 1;
      return finalJob();
    },
  });
  const res = {
    set() {
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await handler({ user: { id: "user-1" }, body: { url: JOB_URL } }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, cached);
  assert.equal(extractionCalls, 0);
});

test("Redis cache timeout does not block synchronous extraction", async () => {
  const handler = createExtractionHandler({
    validateUrl: async (raw) => new URL(raw),
    readCache: () => new Promise(() => {}),
    writeCache: async () => {},
    extract: async () => finalJob({ source: "gemini" }),
  });
  const res = {
    set() {
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await handler({ user: { id: "user-1" }, body: { url: JOB_URL } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.source, "gemini");
});

test("unsafe URL rejection does not start extraction", async () => {
  let extractionCalls = 0;
  const handler = createExtractionHandler({
    validateUrl: async () => {
      throw Object.assign(new Error("Private IP addresses are not allowed."), {
        code: "UNSAFE_URL",
      });
    },
    extract: async () => {
      extractionCalls += 1;
      return finalJob();
    },
  });
  const res = {
    set() {
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await handler({ user: { id: "user-1" }, body: { url: JOB_URL } }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(extractionCalls, 0);
});

test("route and worker startup have no extraction polling or queue path", async () => {
  const [route, controller, workerIndex] = await Promise.all([
    readFile(
      new URL("../src/routes/jobUrlExtractionRoute.js", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL(
        "../src/controllers/jobUrlExtractionController.js",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../src/workers/index.js", import.meta.url), "utf8"),
  ]);
  assert.match(route, /router\.post\("\/extract-from-url",\s*secureRoute/);
  assert.doesNotMatch(route, /router\.get\(|jobId|status/i);
  assert.doesNotMatch(
    controller,
    /jobExtractionQueue|getExtractionStatus|statusKeyFor|jobId|Queue/,
  );
  assert.doesNotMatch(controller, /mongoose|\.save\(/i);
  assert.doesNotMatch(
    workerIndex,
    /startJobExtractionWorkers|jobExtractionWorker|playwrightRenderWorker/,
  );
});

test("URL canonicalization keeps cache keys consistent and SSRF checks remain active", () => {
  assert.equal(
    buildExtractionCacheKey(`${JOB_URL}?utm_source=test#section`),
    buildExtractionCacheKey(JOB_URL),
  );
  for (const unsafe of [
    "http://127.0.0.1/",
    "http://169.254.169.254/",
    "http://[::ffff:7f00:1]/",
    "http://intranet/",
    "file:///etc/passwd",
  ]) {
    assert.throws(() => assertPublicUrlShape(unsafe), { code: "UNSAFE_URL" });
  }
});
