const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500", methods: ["POST"] }));

const upload = multer({ dest: "uploads/" });

// ================== Utility Functions ==================

const matchRegex = (text, regex) => {
  const match = text.match(regex);
  return match ? match[0].trim() : "";
};

const extractSection = (text, header, nextHeaders = []) => {
  const pattern = new RegExp(
    `${header}[\\s\\S]*?(${nextHeaders.join("|")}|$)`,
    "i"
  );
  const match = text.match(pattern);
  if (match) {
    return match[0]
      .replace(new RegExp(header, "i"), "")
      .replace(/\n{2,}/g, "\n")
      .replace(/\n/g, " ")
      .trim();
  }
  return "";
};

const extractLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 4)
    .slice(0, 5);

// ================== Field Extractors ==================

const extractName = (text) => {
  const lines = extractLines(text);
  for (const line of lines) {
    if (!line.toLowerCase().includes("email") && !line.includes("@"))
      return line;
  }
  return "";
};

const extractEmail = (text) =>
  matchRegex(text, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);

const extractPhone = (text) => matchRegex(text, /(\+91[\-\s]?)?[6-9]\d{9}/);

const extractLinkedIn = (text) =>
  matchRegex(text, /https?:\/\/(www\.)?linkedin\.com\/[a-zA-Z0-9\-_/]+/i);

const extractGitHub = (text) =>
  matchRegex(text, /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9\-_/]+/i);

const extractSkills = (text) =>
  extractSection(text, "skills", [
    "education",
    "experience",
    "projects",
    "certifications",
    "achievements",
  ]);

const extractCertifications = (text) =>
  extractSection(text, "certifications", [
    "projects",
    "skills",
    "experience",
    "achievements",
  ]);

const extractProjects = (text) =>
  extractSection(text, "projects", ["certifications", "experience", "skills"]);

const extractAchievements = (text) =>
  extractSection(text, "achievements", [
    "certifications",
    "projects",
    "experience",
  ]);

const extractLanguages = (text) => {
  const match = text.match(/languages[:\s]*([a-zA-Z,\s]+)/i);
  return match ? match[1].trim() : "";
};

const extractEducation = (text) =>
  extractSection(text, "education", ["experience", "projects", "skills"]);

const extractCollegeName = (text) => {
  const lines = text.split("\n");
  const keywords = [
    "institute",
    "university",
    "college",
    "iit",
    "nit",
    "engineering",
    "technology",
  ];
  for (let line of lines) {
    line = line.trim();
    if (keywords.some((k) => line.toLowerCase().includes(k))) {
      return line
        .split(/20\d{2}|B\.?Tech|M\.?Tech|Bachelor|Master|CGPA/i)[0]
        .replace(/[,.;\-]+$/, "")
        .trim();
    }
  }
  return "";
};

const extractCGPA = (text) => {
  const match = text.match(/(CGPA|CPI)[^\d]*(\d+(\.\d+)?)/i);
  return match ? match[2] : "";
};

const extractExperience = (text) =>
  extractSection(text, "experience", ["projects", "skills", "education"]);

// ================== Upload Endpoint ==================

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(buffer);
    const text = parsed.text;

    // Extract fields...
    const data = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      linkedin: extractLinkedIn(text),
      github: extractGitHub(text),
      skills: extractSkills(text),
      certifications: extractCertifications(text),
      projects: extractProjects(text),
      achievements: extractAchievements(text),
      languages: extractLanguages(text),
      education: extractCollegeName(text),
      cgpa: extractCGPA(text),
      experience: extractExperience(text),
    };

    fs.unlinkSync(req.file.path); // cleanup
    res.json(data);
  } catch (err) {
    console.error("❌ Error during resume parsing:", err); // ⬅️ More descriptive
    res
      .status(500)
      .json({ message: "Failed to parse resume", error: err.message });
  }
});

app.listen(3001, () =>
  console.log("✅ Server running on http://localhost:3001")
);
