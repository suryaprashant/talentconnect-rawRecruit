import { assertPublicUrlShape, safeDispatcher } from "./urlSafety.js";

const TIMEOUT_MS = Number(process.env.JOB_EXTRACT_HTTP_TIMEOUT_MS || 8000);
const UA =
  process.env.JOB_EXTRACT_USER_AGENT ||
  "Mozilla/5.0 (compatible; JobDetailsExtractor/2.0; +https://example.com/bot)";

export class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "UpstreamError";
    this.status = status;
  }
}

/** Fetch public HTML with DNS-rebinding protection on every redirect hop. */
export async function fetchText(
  url,
  { maxBytes = 2_000_000, redirects = 3, accept } = {},
) {
  let current = assertPublicUrlShape(url);

  for (let hop = 0; hop <= redirects; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        dispatcher: safeDispatcher,
        headers: {
          "user-agent": UA,
          "accept-language": "en-US,en;q=0.9",
          accept:
            accept ||
            "text/html,application/json,application/xml,text/xml;q=0.9,*/*;q=0.8",
        },
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        await response.body?.cancel().catch(() => {});
        if (!location || hop === redirects) {
          throw new UpstreamError("Too many or invalid redirects");
        }
        current = assertPublicUrlShape(new URL(location, current));
        continue;
      }
      if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        throw new UpstreamError(
          `Upstream returned ${response.status}`,
          response.status,
        );
      }

      const declared = Number(response.headers.get("content-length"));
      if (Number.isFinite(declared) && declared > maxBytes) {
        await response.body?.cancel().catch(() => {});
        throw new UpstreamError("Upstream response too large");
      }
      const reader = response.body?.getReader();
      if (!reader) return "";
      const chunks = [];
      let bytes = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > maxBytes) {
          await reader.cancel().catch(() => {});
          throw new UpstreamError("Upstream response too large");
        }
        chunks.push(value);
      }
      return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
    } finally {
      clearTimeout(timer);
    }
  }
  throw new UpstreamError("Redirect limit exceeded");
}

export function getStaticHtml(url) {
  return fetchText(url, { maxBytes: 2_500_000 });
}
