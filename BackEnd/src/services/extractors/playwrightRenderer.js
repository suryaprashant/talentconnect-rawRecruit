import { chromium } from "playwright";

export async function renderJobPage(url) {
  const browser = await chromium.launch({ headless: true });
  let context;
  try {
    context = await browser.newContext({ javaScriptEnabled: true, acceptDownloads: false });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(Number(process.env.PLAYWRIGHT_NAV_TIMEOUT_MS || 12000));
    await page.route("**/*", async route => {
      const req = route.request();
      const type = req.resourceType();
      if (["image","font","media"].includes(type)) return route.abort();
      try {
        const u = new URL(req.url());
        if (!["http:","https:"].includes(u.protocol) || u.username || u.password) return route.abort();
        // Block localhost and common private IPv4 literals. DNS rebinding defenses should also be
        // enforced at the outbound proxy/network layer in production.
        if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(u.hostname)) return route.abort();
        return route.continue();
      } catch { return route.abort(); }
    });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: Number(process.env.PLAYWRIGHT_NAV_TIMEOUT_MS || 12000) });
    await page.waitForTimeout(1000);
    return await page.content();
  } finally {
    if (context) await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
