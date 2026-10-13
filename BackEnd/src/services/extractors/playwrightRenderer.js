import { chromium } from "playwright";
import pLimit from "p-limit";
import { assertPublicHttpUrl } from "./urlSafety.js";

const NAV_TIMEOUT = () =>
  Number(process.env.PLAYWRIGHT_NAV_TIMEOUT_MS || 15000);
const MAX_HTML = 2_000_000;
const MAX_NETWORK_PAYLOADS = 12;
const MAX_NETWORK_PAYLOAD_CHARS = 10000;
const requestedRenderConcurrency = Number(
  process.env.PLAYWRIGHT_MAX_CONCURRENCY || 3,
);
const MAX_RENDER_CONCURRENCY = Number.isFinite(requestedRenderConcurrency)
  ? Math.max(1, Math.min(8, Math.floor(requestedRenderConcurrency)))
  : 3;
const renderLimit = pLimit(MAX_RENDER_CONCURRENCY);
const RELEVANT_NETWORK_PATH =
  /graphql|job|career|posting|position|vacan|requisition|role/i;

function sanitizeNetworkValue(value, depth = 0) {
  if (depth > 8) return null;
  if (typeof value === "string") return value.slice(0, 4000);
  if (Array.isArray(value))
    return value
      .slice(0, 100)
      .map((item) => sanitizeNetworkValue(item, depth + 1));
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          !/authorization|cookie|token|password|secret|email|phone/i.test(key),
      )
      .slice(0, 100)
      .map(([key, item]) => [key, sanitizeNetworkValue(item, depth + 1)]),
  );
}

// One shared browser per worker process; a fresh context per render.
let browserPromise = null;
function getBrowser() {
  if (!browserPromise) {
    browserPromise = chromium
      .launch({
        headless: true,
        args:
          process.env.PLAYWRIGHT_NO_SANDBOX === "true"
            ? ["--no-sandbox", "--disable-dev-shm-usage"]
            : ["--disable-dev-shm-usage"],
      })
      .then((browser) => {
        browser.on("disconnected", () => {
          browserPromise = null;
        });
        return browser;
      })
      .catch((error) => {
        browserPromise = null;
        throw error;
      });
  }
  return browserPromise;
}

export async function closeBrowser() {
  const p = browserPromise;
  browserPromise = null;
  if (p) await (await p).close().catch(() => {});
}

export async function verifyChromium() {
  await getBrowser();
  return true;
}

// Small host->verdict cache so each asset host is resolved once per render.
async function hostIsPublic(url, cache) {
  const host = new URL(url).hostname;
  if (!cache.has(host)) {
    cache.set(
      host,
      assertPublicHttpUrl(url, { resolve: true }).then(
        () => true,
        () => false,
      ),
    );
  }
  return cache.get(host);
}

async function renderJobPageInternal(url) {
  await assertPublicHttpUrl(url, { resolve: true });

  const browser = await getBrowser();
  const context = await browser.newContext({
    javaScriptEnabled: true,
    acceptDownloads: false,
    serviceWorkers: "block",
    userAgent:
      process.env.JOB_EXTRACT_USER_AGENT ||
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    locale: "en-US",
  });

  let page;
  let responseListener;
  try {
    page = await context.newPage();
    page.setDefaultNavigationTimeout(NAV_TIMEOUT());
    const hostCache = new Map();
    const graphqlData = [];
    const responseTasks = [];

    responseListener = (response) => {
      if (graphqlData.length + responseTasks.length >= MAX_NETWORK_PAYLOADS)
        return;
      const request = response.request();
      if (!["fetch", "xhr"].includes(request.resourceType()) || !response.ok())
        return;

      let responseUrl;
      try {
        responseUrl = new URL(response.url());
      } catch {
        return;
      }
      if (!RELEVANT_NETWORK_PATH.test(responseUrl.pathname)) return;

      const headers = response.headers();
      if (!/json|graphql/i.test(headers["content-type"] || "")) return;
      const contentLength = Number(headers["content-length"]);
      if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_NETWORK_PAYLOAD_CHARS
      )
        return;

      responseTasks.push(
        response
          .body()
          .then((body) => {
            if (!body || body.length > MAX_NETWORK_PAYLOAD_CHARS) return;
            const payload = JSON.parse(body.toString("utf8"));
            const data = sanitizeNetworkValue(payload);
            const serialized = JSON.stringify(data);
            if (!serialized || serialized.length > MAX_NETWORK_PAYLOAD_CHARS)
              return;
            graphqlData.push({
              endpoint: `${responseUrl.origin}${responseUrl.pathname}`.slice(
                0,
                500,
              ),
              data,
            });
          })
          .catch(() => {}),
      );
    };
    page.on("response", responseListener);

    await page.route("**/*", async (route) => {
      const req = route.request();
      if (["image", "font", "media"].includes(req.resourceType()))
        return route.abort();
      try {
        const u = new URL(req.url());
        if (!["http:", "https:"].includes(u.protocol)) return route.abort();
        if (!(await hostIsPublic(req.url(), hostCache))) return route.abort();
        return route.continue();
      } catch {
        return route.abort();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT(),
    });
    // Best effort: let client-side rendering finish, never fail because of it.
    await page
      .waitForLoadState("networkidle", { timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(500);
    let responseWaitTimer;
    await Promise.race([
      Promise.allSettled(responseTasks),
      new Promise((resolve) => {
        responseWaitTimer = setTimeout(resolve, 1000);
      }),
    ]);
    clearTimeout(responseWaitTimer);

    // Strip weight the extractor never needs, but keep JSON-LD.
    await page.evaluate(() => {
      document
        .querySelectorAll(
          "style,svg,noscript,link[rel=stylesheet],script:not([type='application/ld+json'])",
        )
        .forEach((n) => n.remove());
    });

    const html = await page.content();
    return {
      html: html.length > MAX_HTML ? html.slice(0, MAX_HTML) : html,
      graphqlData,
    };
  } finally {
    if (page && responseListener) page.off("response", responseListener);
    await context.close().catch(() => {});
  }
}

export function renderJobPage(url) {
  return renderLimit(() => renderJobPageInternal(url));
}
