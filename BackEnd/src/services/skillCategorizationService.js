// import axios from "axios";
// import Onboarding from "../models/studentonboardingModel.js";

// export const categorizeSkillsService = async (userId, skills) => {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       console.warn("⚠️ Gemini API key missing");
//       return null;
//     }

//     if (!Array.isArray(skills) || skills.length === 0) {
//       return null;
//     }

//     const prompt = `
// Categorize EACH skill into ONLY ONE category:

// 1. High in Demand:
// - Highly востребित in job market
// - Frequently used in modern tech stacks
// - Examples: React, Node.js, AWS, Docker, TypeScript, Python

// 2. Growing:
// - Emerging and gaining popularity
// - Not yet mainstream but rising
// - Examples: GraphQL, Web3, AI/ML tools, Rust

// 3. Saturated:
// - Too many candidates already
// - Basic or common skills with low differentiation
// - Examples: HTML, CSS, Bootstrap, Core Java

// 4. Obsolete:
// - Outdated or rarely used
// - Replaced by modern alternatives
// - Examples: jQuery, Backbone.js, Flash

// RULES:
// - Each skill must appear in ONLY ONE category
// - Do NOT duplicate skills across categories
// - Distribute skills realistically (do NOT put everything in High in Demand)
// - Classify as many skills as possible
// - If unsure, choose the closest category
// - No duplication
// - Every skill must be categorized
// - Return ONLY JSON

// Skills:
// ${skills.join(", ")}

// Output:
// {
//   "highInDemand": [],
//   "growing": [],
//   "saturated": [],
//   "obsolete": []
// }
// `;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       },
//       {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const rawText =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!rawText) {
//       throw new Error("Invalid Gemini response");
//     }

//     // ✅ Extract JSON (same as your Python logic)
//     const match = rawText.match(/\{[\s\S]*\}/);

//     if (!match) {
//       throw new Error("No valid JSON found in response");
//     }

//     const categorizedSkills = JSON.parse(match[0]);

//     // ✅ Save in DB (OBJECT, NOT STRING)
//     await Onboarding.findOneAndUpdate(
//       { userId },
//       { $set: { categorizedSkills } },
//       { new: true }
//     );

//     return categorizedSkills;

//   } catch (error) {
//     console.error("Categorization error:", error.message);
//     return null;
//   }
// };

import axios from "axios";
import CareerInsights from "../models/careerInsightsModel.js";

const normalizeArray = (field) => {
  if (!field) return [];

  // already array
  if (Array.isArray(field)) return field;

  // JSON string case (IMPORTANT)
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    // fallback (comma string)
    return field.split(",").map(s => s.trim());
  }

  // object like {0: "a", 1: "b"}
  if (typeof field === "object") {
    return Object.values(field);
  }

  return [];
};
const parseJSONField = (field, fallback) => {
  if (!field) return fallback;

  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return fallback;
    }
  }

  return field;
};
export const categorizeSkillsService = async (userId, onboardingData) => {
  const {
    skills = [],
    experiences = [],
    projectsHandled = {},
    degree = "",
    specialization = "",
    college = "",
    totalYearsOfExperience = "",
    toolsAndPlatforms = [],
    domainKnowledge = [],
    jobRoles = []
  } = onboardingData;

  console.log("onboarding data", onboardingData);

  const normalizedSkills = normalizeArray(skills);
  const normalizedTools = normalizeArray(toolsAndPlatforms);
  const normalizedDomain = normalizeArray(domainKnowledge);
  const normalizedJobRoles = normalizeArray(jobRoles);
  const normalizedExperiences = parseJSONField(experiences, []);
  const normalizedProjects = parseJSONField(projectsHandled, {});
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ Gemini API key missing");
      return null;
    }

    if (!normalizedSkills.length) {
      console.warn("⚠️ No skills found in onboardingData");
      return null;
    }

    const prompt = `
You are an expert AI career advisor.

Analyze the candidate profile and generate role-based career insights.

========================
INPUT DATA
========================

Skills:
${normalizedSkills.join(", ")}

Tools & Platforms:
${(normalizedTools || []).join(", ")}

Domain Knowledge:
${(normalizedDomain || []).join(", ")}

Experience:
${JSON.stringify(normalizedExperiences)}

Projects:
${JSON.stringify(normalizedProjects)}

Education:
Degree: ${degree || ""}
Specialization: ${specialization || ""}
College: ${college || ""}

Total Experience:
${totalYearsOfExperience || ""}

Target Job Roles:
${normalizedJobRoles.length ? normalizedJobRoles.join(", ") : "Not specified"}

========================
ROLE SELECTION LOGIC
========================

- If "Target Job Roles" are provided → use them as reference
- If NOT provided → infer the MOST suitable job role based on skills

Examples:
- React + Node → Full Stack Developer
- Python + ML → Machine Learning Engineer
- Java + Spring → Backend Developer

========================
SKILL CATEGORIZATION RULES
========================

Categorize EACH skill into ONLY ONE category:

1. High in Demand:
- Highly востребित in job market
- Frequently used in modern tech stacks
- Examples: React, Node.js, AWS, Docker, TypeScript, Python

2. Growing:
- Emerging and gaining popularity
- Not yet mainstream but rising
- Examples: GraphQL, Web3, AI/ML tools, Rust

3. Saturated:
- Too many candidates already
- Basic or common skills with low differentiation
- Examples: HTML, CSS, Bootstrap, Core Java

4. Obsolete:
- Outdated or rarely used
- Replaced by modern alternatives
- Tools like Vercel, Render
- Examples: jQuery, Backbone.js, Flash

RULES:
- Each skill must appear in ONLY ONE category
- Do NOT duplicate skills across categories
- Distribute skills realistically (do NOT put everything in High in Demand)
- Classify as many skills as possible
- Deployment platforms (Vercel, Render, Netlify) → Growing
- Developer tools (Postman, Git) → Saturated
- If unsure, choose the closest category
- No duplication
- Every skill must be categorized
- Return ONLY JSON

========================
TASKS
========================

1. Categorize ALL skills

2. Generate resumeScore (0–100)
- Based on how well candidate matches target job role
- Consider:
  - Skills relevance
  - Experience quality
  - Project depth

3. Identify missingSkills
- MUST be relevant to target job role
- Only include important industry skills

4. Provide 3–5 actionable suggestions
- Focus on improving job readiness

Return STRICT valid JSON only.
- Use double quotes for all strings
- Do NOT add trailing commas
- Do NOT add comments or explanations


========================
OUTPUT FORMAT (STRICT JSON ONLY)
========================

{
  "categorizedSkills": {
    "highInDemand": [],
    "growing": [],
    "saturated": [],
    "obsolete": []
  },
  "resumeScore": 0,
  "missingSkills": [],
  "suggestions": []
}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Invalid Gemini response");

    // ✅ Extract JSON (same as your Python logic)
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No valid JSON found");

    const parsed = JSON.parse(match[0]);

    // ✅ Destructure safely
    const {
      categorizedSkills = {
        highInDemand: [],
        growing: [],
        saturated: [],
        obsolete: []
      },
      resumeScore = 0,
      suggestions = [],
      missingSkills = []
    } = parsed;

    // ✅ Save into CareerInsights
    const updated = await CareerInsights.findOneAndUpdate(
      { userId },
      {
        $set: {
          categorizedSkills,
          resumeScore,
          suggestions,
          missingSkills,
          lastAnalyzedAt: new Date()
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    // ✅ RETURN FULL OBJECT (important change)
    return {
      categorizedSkills: updated.categorizedSkills,
      resumeScore: updated.resumeScore,
      suggestions: updated.suggestions,
      missingSkills: updated.missingSkills,
      lastAnalyzedAt: updated.lastAnalyzedAt
    };

  } catch (error) {
    console.error("Categorization error:", error.message);
    return null;
  }
};