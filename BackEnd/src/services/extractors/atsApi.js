import { matchATS } from "./atsRegistry.js";
import { extractJsonLd } from "./jsonLd.js";
import { normalizeJob } from "./normalizeJob.js";

const TIMEOUT_MS = Number(process.env.JOB_EXTRACT_HTTP_TIMEOUT_MS || 8000);
async function fetchText(url, { maxBytes = 2_000_000, redirects = 3 } = {}) {
  // Restrict outbound hosts to known public ATS/API hosts or the original public job URL.
  let current = new URL(url);
  for (let i = 0; i <= redirects; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response;
    try {
      response = await fetch(current, { redirect: "manual", signal: controller.signal, headers: { "user-agent": "JobDetailsExtractor/1.0", accept: "text/html,application/json,application/xml,text/xml,*/*" } });
    } finally { clearTimeout(timer); }
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || i === redirects) throw new Error("Too many or invalid redirects");
      const next = new URL(location, current);
      if (!["http:", "https:"].includes(next.protocol) || next.username || next.password) throw new Error("Unsafe redirect");
      current = next; continue;
    }
    if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
    const reader = response.body?.getReader();
    if (!reader) return "";
    let bytes = 0, chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new Error("Upstream response too large"); }
      chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
  }
  throw new Error("Redirect limit exceeded");
}
function looksLikeHtml(s) { return /<html|<script|<!doctype/i.test(s); }
export async function getStaticHtml(url) {
  return fetchText(url, { maxBytes: 2_000_000 });
}
export async function extractViaATS(url) {
  const match = matchATS(url);
  if (!match || match.fallbackOnly || match.name === "teamtailor") return null;
  const apiUrl = match.buildApiUrl(match.matchedParts);
  if (!apiUrl) return null;
  const body = await fetchText(apiUrl, { maxBytes: 2_000_000 });
  let json;
  if (match.name === "personio") json = body;
  else { try { json = JSON.parse(body); } catch { return null; } }
  const parsed = match.parseResponse(json, match.matchedParts[2] || match.matchedParts[4]);
  if (!parsed) return null;
  const data = normalizeJob(parsed, "ats_api");
  const fields = ["title","company","description","eligibilityCriteria","employmentType","workMode","applicationDeadline"].filter(k => data[k]).length;
  data.confidence = fields >= 3 ? 0.9 : 0.72;
  return { data, confidence: data.confidence, source: "ats_api" };
}
export { fetchText };
