import * as cheerio from "cheerio";
import { normalizeJob } from "./normalizeJob.js";
export function extractOpenGraph(html) {
  const $ = cheerio.load(html || "");
  const meta = key => $(`meta[property="${key}"],meta[name="${key}"]`).first().attr("content")?.trim() || null;
  const title = meta("og:title") || $("title").first().text().trim() || null;
  const description = meta("og:description") || meta("description");
  if (!title && !description) return null;
  const data = normalizeJob({ title, description, company: meta("og:site_name"), confidence: title && description ? 0.52 : 0.38, source: "opengraph" }, "opengraph");
  return { data, confidence: data.confidence, source: "opengraph" };
}
