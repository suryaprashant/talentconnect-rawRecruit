import pdfParse from 'pdf-parse';

// --- All of your parsing helper functions belong in this file ---

const normalizeText = (text) => {
    return text
        .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
        .replace(/([A-Z])\s*\n\s*([A-Z])/g, '$1$2') // Fix split headings
        .replace(/\s+/g, ' ') // Normalize spaces
        .toUpperCase();
};

const extractSection = (text, startKeywords, endKeywords) => {
  const normalizedText = normalizeText(text);
  let startIndex = -1;
  let startKeywordUsed = '';

  for (const keyword of startKeywords) {
    const index = normalizedText.indexOf(keyword.toUpperCase());
    if (index !== -1) {
      startIndex = index;
      startKeywordUsed = keyword.toUpperCase();
      break;
    }
  }

  if (startIndex === -1) return "";

  const textAfterStart = normalizedText.substring(startIndex + startKeywordUsed.length);
  let relativeEndIndex = -1;

  for (const keyword of endKeywords) {
    const index = textAfterStart.indexOf(keyword.toUpperCase());
    if (index !== -1) {
      if (relativeEndIndex === -1 || index < relativeEndIndex) {
        relativeEndIndex = index;
      }
    }
  }

  const endIndex = relativeEndIndex !== -1 
    ? startIndex + startKeywordUsed.length + relativeEndIndex 
    : text.length;

  return text.substring(startIndex, endIndex).trim();
};

const extractName = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    // Regex for Title Case names (e.g., John Doe)
    const titleCasePattern = /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/;
    // Regex for ALL CAPS names (e.g., JOHN DOE), allows only letters and spaces.
    const allCapsPattern = /^[A-Z\s]+$/;

    // Search the first 10 lines for a plausible name
    for (const line of lines.slice(0, 10)) {
        // Basic sanity checks for a name line
        if (line.length > 50 || line.includes('@') || line.includes('http') || /\d{5,}/.test(line)) {
            continue; // Skip lines that are too long, are emails/links, or have long numbers
        }

        // Check against our patterns
        if (titleCasePattern.test(line) || allCapsPattern.test(line.trim())) {
            // Further filter out common non-name headings
            const upperLine = line.toUpperCase();
            if (!upperLine.includes('SKILLS') && !upperLine.includes('OBJECTIVE') && !upperLine.includes('EDUCATION')) {
                 return line.trim(); // We found a good match
            }
        }
    }

    // If no pattern matches, fallback to the very first non-empty line as a last resort
    return lines[0] || "Name Not Found";
};

const extractEmail = (text) => {
  // Find the first potential email match in the text
  const initialMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  
  if (!initialMatch) {
    return ""; // Return empty string if no email is found at all
  }

  let email = initialMatch[0];
  let localPart = email.split('@')[0];
  const domainPart = email.split('@')[1];

  // Check if the part before the @ sign starts with a long string of numbers (e.g., a roll number)
  const leadingNumberMatch = localPart.match(/^(\d{4,})/); // Looks for 4 or more digits at the start

  if (leadingNumberMatch) {
    // If we find a long number string, find the first letter that comes after it
    const firstLetterIndex = localPart.search(/[a-zA-Z]/);
    if (firstLetterIndex > -1) {
      // Trim the local part to start from that first letter
      localPart = localPart.substring(firstLetterIndex);
      // Re-assemble the cleaned email
      email = `${localPart}@${domainPart}`;
    }
  }
  
  return email;
};
const extractPhone = (text) => {
    const match = text.match(/(?:\+\d{1,3}[\s-]?)?(?:\d[\s-]?){8,12}\d/);
    return match ? match[0].replace(/[\s-]/g, "") : null;
};
// Extract LinkedIn
const extractLinkedIn = (text) => {
  // Handles LinkedIn followed by GitHub on same line
  const match = text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+?(?=(github|$|\s))/i);
  if (match) return match[0].trim();

  const usernameMatch = text.match(/LinkedIn\s*[:\-]?\s*([a-z0-9\-]+)/i);
  if (usernameMatch) return `https://www.linkedin.com/in/${usernameMatch[1]}`;

  return "";
};

// Extract GitHub
const extractGitHub = (text) => {
  // Handles GitHub followed by LinkedIn on same line
  const match = text.match(/(https?:\/\/)?(www\.)?github\.com\/[^\s]+?(?=(linkedin|$|\s))/i);
  if (match) return match[0].trim();

  const usernameMatch = text.match(/GitHub\s*[:\-]?\s*([a-z0-9\-]+)/i);
  if (usernameMatch) return `https://github.com/${usernameMatch[1]}`;

  return "";
};

const extractEducation = (text) => {
    // Support multiple section names
    const section = extractSection(
        text,
        ['EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMIC DETAILS', 'QUALIFICATIONS'],
        ['PROJECTS', 'CERTIFICATIONS', 'SKILLS', 'EXPERIENCE', 'WORK EXPERIENCE']
    );

    let entries = [];

    if (section) {
        const segments = section.split(/•|\n/).map(s => s.trim()).filter(s => s.length > 5);

        for (const segment of segments) {
            const lines = segment.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.length < 1) continue;

            const universityMatch = segment.match(/([A-Z][A-Za-z\s&.']+(College|University|Institute|School|Vidyalaya))/i);
            const university = universityMatch ? universityMatch[0] : lines[0];
            const degreeMatch = segment.match(/\b(B\.?Tech|M\.?Tech|MBA|MCA|B\.?E|M\.?E|B\.?Sc|M\.?Sc|Ph\.?D|Bachelor|Master|Diploma|BTech)\b/i);
            const yearMatch = segment.match(/\b(20\d{2})\s*[–-]\s*(20\d{2}|Present|Current|\w+\s+\d{4})\b/i) || segment.match(/\b(20\d{2})\b/);
            const cgpaMatch = segment.match(
                    // Pattern 1: Direct CGPA formats - "CGPA:8.1", "CGPA-7.52", "CGPA 8.5"
                    segment.match(/(?:CGPA|GPA)[:=-]?(\d+\.?\d*)/i) ||
                    
                    // Pattern 2: With spaces - "CGPA : 8.1", "GPA : 3.7"
                    segment.match(/(?:CGPA|GPA)\s*[:=-]\s*(\d+\.?\d*)/i) ||
                    
                    // Pattern 3: Percentage formats - "Percentage:85", "85%"
                    segment.match(/(?:Percentage|Percent)[:=-]?(\d+\.?\d*)/i) ||
                    segment.match(/(\d+\.?\d*)%/i) ||
                    
                    // Pattern 4: Reverse format - "8.1 CGPA", "7.52 GPA"
                    segment.match(/(\d+\.?\d+)\s+(?:CGPA|GPA)/i) ||
                    
                    // Pattern 5: In parentheses - "(CGPA:8.1)", "(7.52)"
                    segment.match(/\((?:CGPA|GPA)[:=-]?(\d+\.?\d*)\)/i) ||
                    segment.match(/\((\d+\.?\d+)\)/i) ||
                    
                    // Pattern 6: With scale - "CGPA:8.1/10", "GPA:3.7/4.0"
                    segment.match(/(?:CGPA|GPA)[:=-]?(\d+\.?\d*)\/\d+/i)
                );
                const extractedCGPA = cgpaMatch ? 
                    (cgpaMatch[1] || cgpaMatch[2] || cgpaMatch[3] || cgpaMatch[4] || cgpaMatch[5] || cgpaMatch[6]) : 
                    "not found";
            entries.push({
                college: university || "Not Found",
                degree: degreeMatch ? degreeMatch[0] : "Not Found",
                year: yearMatch ? yearMatch[2] || yearMatch[1] : "Not Found",
                specialization: "Not Found",
                cgpa: cgpaMatch ? cgpaMatch[1] : "Not Found"
            });
        }
    }

    // ✅ If no education section found, fallback: scan full text for any degree
    if (entries.length === 0) {
        const lines = text.split('\n').filter(l => l.length > 5);
        for (const line of lines) {
            const degreeMatch = line.match(/\b(B\.?Tech|M\.?Tech|MBA|MCA|B\.?E|M\.?E|B\.?Sc|M\.?Sc|Ph\.?D|Bachelor|Master|Diploma)\b/i);
            if (degreeMatch) {
                entries.push({
                    college: line,
                    degree: degreeMatch[0],
                    year: "Not Found",
                    specialization: "Not Found",
                    cgpa: "Not Found"
                });
                break;
            }
        }
    }

    // Sort and return the most recent education
    
            console.log(entries)
             entries = entries.filter(entry => 
        entry.college !== "Not Found" && 
        entry.college !== "Education" &&
        entry.college !== "Ducation" &&
        entry.college !== "-B.Tech" &&
        entry.college !== "Master in Computer Apllications" &&
        entry.college !== "DUCATION" &&
        entry.college !== "Work Experience" &&
        entry.college !== "Technical" &&
        entry.college !== "BTech" &&
        !entry.college.toLowerCase().includes('backend') &&
        !entry.college.toLowerCase().includes('intern') &&
        !entry.college.toLowerCase().includes('btech') && // Filter out degree-heavy college names
        !entry.college.toLowerCase().startsWith('btech') && // College name should not start with BTech
        !entry.college.toLowerCase().startsWith('bachelor') && // College name should not start with Bachelor
        !entry.college.toLowerCase().startsWith('b.tech') && // Handle B.Tech format
        !entry.college.toLowerCase().startsWith('b tech') && 
        !entry.college.toLowerCase().startsWith('Ducation') && // Handle B Tech format
        entry.college.length < 100 // Reasonable college name length
    );
    console.log(entries)
    entries.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    return entries.length > 0 ? [entries[0]] : [];
};

const extractExperience = (text) => {
  const section = extractSection(
    text,
    ["WORK EXPERIENCE", "EXPERIENCE", "INTERNSHIPS", "PROFESSIONAL EXPERIENCE"],
    ["TECHNICAL SKILLS", "PROJECTS", "EDUCATION", "CERTIFICATIONS"]
  );
  if (!section) return [];

  const lines = section.split("\n").map((l) => l.trim()).filter(Boolean);

  const dateRegex =
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(Present|Current|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b/gi;

  const roleKeywords = [
    "intern",
    "developer",
    "engineer",
    "manager",
    "designer",
    "consultant",
    "analyst",
    "specialist",
    "lead",
  ];

  const experiences = [];
  let currentExp = null;

  lines.forEach((line) => {
    // 1. If line has a date → new experience
    if (dateRegex.test(line)) {
      if (currentExp) experiences.push(currentExp);

      const [start, end] = line.split(/-|–/).map((s) => s.trim());
      currentExp = {
        company: "Not Found",
        role: "Not Found",
        startDate: start,
        endDate: end,
        description: "",
      };
      return;
    }

    // 2. Bullet points = description
    if (line.startsWith("•") || line.startsWith("-")) {
      if (currentExp) {
        currentExp.description +=
          (currentExp.description ? "\n" : "") +
          line.replace(/^[-•]\s*/, "").trim();
      }
      return;
    }

    // 3. Assign role / company
    if (currentExp) {
      const lowered = line.toLowerCase();
      if (roleKeywords.some((k) => lowered.includes(k))) {
        currentExp.role = line;
      } else if (currentExp.company === "Not Found") {
        currentExp.company = line;
      }
    }
  });
  

  if (currentExp) experiences.push(currentExp);

  return experiences;
};

const extractSkills = (text) => {
  const section = extractSection(
    text,
    ['TECHNICAL SKILLS', 'SKILLS'],
    ['ACHIEVEMENTS', 'PROJECTS', 'EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS']
  );

  if (!section) return [];

  const cleanSection = section.replace(/^(TECHNICAL SKILLS|SKILLS)[\s:]*\n?/i, '');
  const lines = cleanSection.split('\n');
  let skills = [];

  for (const line of lines) {
    const potentialSkills = line.replace(/^•\s*/, '').split(/[,;]/);
    for (let skill of potentialSkills) {
      skill = skill.trim();
      if (skill.length > 1 && skill.length < 50) {
        // Check for categorized skills like "Languages: C++, JavaScript"
        const parts = skill.split(':');
        if (parts.length === 2) {
          skills.push(...parts[1].split(',').map(s => s.trim()));
        } else {
          skills.push(skill);
        }
      }
    }
  }
  return [...new Set(skills.filter(Boolean))];
};

const extractCertifications = (text) => {
  const section = extractSection(
    text,
    ['CERTIFICATIONS', 'CERTIFICATION'],
    ['CURRICULAR ACTIVITY', 'PROJECTS', 'EXPERIENCE', 'SKILLS', 'EDUCATION']
  );

  if (!section) return [];

  // Remove heading and extra junk (emails, links, etc.)
  let cleanSection = section
    .replace(/^(CERTIFICATIONS?|CERTIFICATION)[\s:]*\n?/i, '')
    .replace(/https?:\/\/\S+/g, '')   // remove links
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '') // remove emails
    .replace(/curricular activity.*/i, '') // cut off at "Curricular Activity"
    .trim();

  let certifications = cleanSection
    .split(/[,\n•·\-\*|]/)  // split on bullet points, commas, etc.
    .map(cert => cert.trim())
    .filter(cert => cert.length > 3 && cert.length < 120);

  // Deduplicate
  return [...new Set(certifications)];
};


// --- This is the main service function that brings it all together ---
export const parseResume = async (resumeBuffer) => {
  try {
    const data = await pdfParse(resumeBuffer);
    const resumeText = data.text;

    const extractedData = {
      name: extractName(resumeText),
      email: extractEmail(resumeText),
      phone: extractPhone(resumeText),
      education: extractEducation(resumeText),
      experience: extractExperience(resumeText),
      skills: [...new Set(extractSkills(resumeText))],
      certifications: extractCertifications(resumeText),
      linkedin: extractLinkedIn(resumeText),
      github: extractGitHub(resumeText),
    };

    return extractedData;
  } catch (error) {
    console.error("Error in resume parsing service:", error);
    throw new Error("Failed to parse PDF buffer.");
  }
};