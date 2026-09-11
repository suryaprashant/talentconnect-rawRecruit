import {
  escapeRegex,
  normalize,
  stripHtml,
  uniqueStrings,
} from "../utils/jobTextUtils.js";

const TECH_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Redux",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "MongoDB",
  "Mongoose",
  "MySQL",
  "PostgreSQL",
  "SQL",
  "Redis",
  "Java",
  "Spring Boot",
  "Python",
  "Django",
  "Flask",
  "FastAPI",
  "C",
  "C++",
  "C#",
  "Go",
  "Golang",
  "Kotlin",
  "Scala",
  "PHP",
  "Laravel",
  "Ruby",
  "Rails",
  "REST API",
  "GraphQL",
  "API",
  "Microservices",
  "System Design",
  "Data Structures",
  "Algorithms",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Git",
  "GitHub",
  "GitLab",
  "Jenkins",
  "Linux",
  "DevOps",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "AI",
  "ML",
  "NLP",
  "LLM",
  "RAG",
  "Retrieval",
  "Ranking",
  "Search",
  "Data Pipeline",
  "Data Pipelines",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "PyTorch",
  "Spark",
  "Kafka",
  "Hadoop",
  "Power BI",
  "Tableau",
  "Excel",
  "Figma",
  "UI/UX",
  "Agile",
  "Scrum",
];

const BUSINESS_SKILLS = [
  "Sales",
  "Account Management",
  "Business Development",
  "Lead Generation",
  "Negotiation",
  "Communication",
  "Analytical Skills",
  "Customer Success",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Project Management",
  "Product Management",
];

const ALL_SKILLS = [...TECH_SKILLS, ...BUSINESS_SKILLS];

const skillAliases = {
  "Node.js": ["node", "nodejs", "node.js"],
  "Express.js": ["express", "expressjs", "express.js"],
  "Next.js": ["next", "nextjs", "next.js"],
  React: ["react", "reactjs", "react.js"],
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  "REST API": ["rest api", "restful api", "apis", "api"],
  "Artificial Intelligence": ["artificial intelligence", "ai", "ai-powered"],
  "Machine Learning": ["machine learning", "ml"],
  RAG: ["rag", "retrieval augmented generation"],
  "Data Pipeline": ["data pipeline", "data pipelines"],
  "System Design": ["system design", "large scale systems", "large-scale systems"],
};

export const extractRequiredSkills = (job = {}) => {
  const text = normalize(
    `${job.title || ""} ${job.department || ""} ${job.jdSnippet || ""} ${
      job.description || ""
    } ${stripHtml(job.content || "")}`
  );

  const extracted = [];

  for (const skill of ALL_SKILLS) {
    const aliases = skillAliases[skill] || [skill];

    const isMatched = aliases.some((alias) => {
      const normalizedAlias = normalize(alias);

      if (!normalizedAlias) return false;

      const regex = new RegExp(
        `(^|[^a-z0-9+#.])${escapeRegex(normalizedAlias)}([^a-z0-9+#.]|$)`,
        "i"
      );

      return regex.test(text);
    });

    if (isMatched) {
      extracted.push(skill);
    }
  }

  return uniqueStrings(extracted);
};

export const getMatchedSkills = (requiredSkills = [], candidateSkills = []) => {
  const normalizedCandidateSkills = candidateSkills.map(normalize);

  return requiredSkills.filter((skill) => {
    const normalizedRequiredSkill = normalize(skill);

    return normalizedCandidateSkills.some((candidateSkill) => {
      return (
        candidateSkill === normalizedRequiredSkill ||
        candidateSkill.includes(normalizedRequiredSkill) ||
        normalizedRequiredSkill.includes(candidateSkill)
      );
    });
  });
};

export const getMissingSkills = (requiredSkills = [], matchedSkills = []) => {
  const normalizedMatchedSkills = matchedSkills.map(normalize);

  return requiredSkills.filter(
    (skill) => !normalizedMatchedSkills.includes(normalize(skill))
  );
};