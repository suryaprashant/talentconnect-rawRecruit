// scripts/dedupe-head.mjs
import fs from "fs";
import path from "path";

const distPath = "./dist";

function cleanHead(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");

  // Step 1: Deduplicate full <title>...</title> blocks — keep the LAST one
  // (Helmet injects last, so last = correct page title)
  const titleMatches = [...html.matchAll(/<title>[^<]*<\/title>/gi)];
  if (titleMatches.length > 1) {
    console.log(`  Found ${titleMatches.length} <title> tags in ${filePath}, deduplicating...`);
    let firstRemoved = false;
    html = html.replace(/<title>[^<]*<\/title>/gi, (match) => {
      if (!firstRemoved) {
        firstRemoved = true;
        return ""; // remove the first (react-snap's snapshot copy)
      }
      return match; // keep the last (Helmet's correct one)
    });
  }

  // Step 2: Deduplicate self-closing meta/link tags by semantic key
  const seen = new Set();
  html = html.replace(/<(meta|link)[^>]*\/?>/gi, (tag) => {
    let key = "";

    if (tag.includes('name="description"')) key = "description";
    else if (tag.includes('property="og:')) key = tag.match(/property="([^"]+)"/)?.[1];
    else if (tag.includes('name="twitter:')) key = tag.match(/name="([^"]+)"/)?.[1];
    else if (tag.includes('rel="canonical"')) key = "canonical";

    if (!key) return tag; // not an SEO tag, leave it alone
    if (seen.has(key)) {
      console.log(`  Removed duplicate: ${key}`);
      return "";
    }
    seen.add(key);
    return tag;
  });

  fs.writeFileSync(filePath, html);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".html")) {
      console.log(`Processing: ${fullPath}`);
      cleanHead(fullPath);
    }
  });
}

walkDir(distPath);
console.log("Head tags deduplicated successfully");