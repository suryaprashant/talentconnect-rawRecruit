// scripts/dedupe-head.mjs  ← rename to .mjs to avoid module issues
import fs from "fs";
import path from "path";

const distPath = "./dist";

function cleanHead(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");
  const seen = new Set();

  html = html.replace(/<(title|meta|link)[^>]*>/gi, (tag) => {
    let key = "";

    if (tag.startsWith("<title")) {
      key = "title";
    } else if (tag.includes('name="description"')) {
      key = "description";
    } else if (tag.includes('property="og:')) {
      key = tag.match(/property="([^"]+)"/)?.[1];
    } else if (tag.includes('name="twitter:')) {
      key = tag.match(/name="([^"]+)"/)?.[1];
    } else if (tag.includes('rel="canonical"')) {
      key = "canonical";
    }

    if (!key) return tag;
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