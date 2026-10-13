import * as cheerio from "cheerio";

const BLOCK =
  "p,div,h1,h2,h3,h4,h5,h6,ul,ol,tr,section,article,table,blockquote,pre,dl,dt,dd";

function tidy(s) {
  return s
    .replace(/ /g, " ")
    .replace(/[​-‍﻿]/g, "")
    .replace(/\u0000/g, "")
    .replace(/[ \t\f\v]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function looksLikeHtml(s) {
  return (
    typeof s === "string" &&
    (/<[a-z][\s\S]*>/i.test(s) || /&lt;\/?[a-z]/i.test(s))
  );
}

/** HTML (or entity-escaped HTML) -> readable plain text. */
export function htmlToText(
  input,
  { removeSelectors = "script,style,noscript,iframe,svg,canvas,template" } = {},
) {
  let s = String(input ?? "");
  if (!s.trim()) return "";
  if (!/<[a-z][\s\S]*>/i.test(s) && /&lt;\/?[a-z]/i.test(s)) {
    s = cheerio.load(`<i>${s}</i>`).root().text();
  }
  if (!looksLikeHtml(s)) {
    return tidy(cheerio.load(`<i>${s}</i>`).root().text());
  }
  const $ = cheerio.load(s);
  $(removeSelectors).remove();
  $("br").replaceWith("\n");
  $("li").each((_, el) => {
    $(el).prepend("- ").append("\n");
  });
  $("h1,h2,h3,h4,h5,h6").each((_, el) => {
    $(el).prepend("\n");
  });
  $(BLOCK).each((_, el) => {
    $(el).append("\n");
  });
  return tidy($.root().text());
}

/** Visible text of a full page, preferring the main content region. */
export function pageToText(html, maxChars = 30000) {
  if (!html) return "";
  const $ = cheerio.load(String(html));
  $(
    "script,style,noscript,iframe,svg,canvas,template,nav,footer,form,[aria-hidden='true']",
  ).remove();
  const main = $("main,article,[role=main]").first();
  const mainHtml = main.length ? $.html(main) : "";
  const mainText = mainHtml ? htmlToText(mainHtml) : "";
  const text =
    mainText.length >= 500
      ? mainText
      : htmlToText($("body").html() || $.html());
  return text.slice(0, maxChars);
}

export function readableLength(html) {
  return pageToText(html, 100000).length;
}

const DROP_KEYS = new Set([
  "questions",
  "demographic_questions",
  "compliance",
  "data_compliance",
  "location_questions",
  "application_form",
  "applicationForm",
  "tracking",
  "metadata_questions",
  "custom_fields_meta",
]);

/** Shrink a raw API payload for the LLM: HTML->text, drop empties/noise, cap size. */
export function compactForLlm(value, maxChars = 40000) {
  const walk = (v, depth = 0) => {
    if (v == null || depth > 8) return undefined;
    if (typeof v === "string") {
      const t = looksLikeHtml(v) ? htmlToText(v) : v.trim();
      return t ? t : undefined;
    }
    if (typeof v === "number" || typeof v === "boolean") return v;
    if (Array.isArray(v)) {
      const a = v.map((x) => walk(x, depth + 1)).filter((x) => x !== undefined);
      return a.length ? a : undefined;
    }
    if (typeof v === "object") {
      const o = {};
      for (const [k, x] of Object.entries(v)) {
        if (DROP_KEYS.has(k)) continue;
        const w = walk(x, depth + 1);
        if (w !== undefined) o[k] = w;
      }
      return Object.keys(o).length ? o : undefined;
    }
    return undefined;
  };
  const out = JSON.stringify(walk(value) ?? {});
  return out.length > maxChars ? out.slice(0, maxChars) : out;
}
