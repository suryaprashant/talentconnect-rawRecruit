import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse'; 
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check route for debugging
router.get('/health', (req, res) => {
    res.status(200).json({ 
        message: "Upload routes are working", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Configure multer for file uploads - use memory storage for production compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Normalize text for better processing
const normalizeText = (text) => {
    return text
        .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
        .replace(/([A-Z])\s*\n\s*([A-Z])/g, '$1$2') // Fix split headings
        .replace(/\s+/g, ' ') // Normalize spaces
        .toUpperCase();
};

// Extract section by keywords
// A more robust function to find a section of text
const extractSection = (text, startKeywords, endKeywords) => {
  const normalizedText = normalizeText(text);
  let startIndex = -1;
  let startKeywordUsed = '';

  // Find the first occurrence of a start keyword
  for (const keyword of startKeywords) {
    const index = normalizedText.indexOf(keyword.toUpperCase());
    if (index !== -1) {
      startIndex = index;
      startKeywordUsed = keyword.toUpperCase();
      break;
    }
  }

  if (startIndex === -1) return "";

  // Search for the end keyword ONLY in the text that comes AFTER the start keyword
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

  // Calculate the absolute end index
  const endIndex = relativeEndIndex !== -1 
    ? startIndex + startKeywordUsed.length + relativeEndIndex 
    : text.length;

  return text.substring(startIndex, endIndex).trim();
};

// Extract Name
const extractName = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2).slice(0, 5);
    const namePattern = /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/;
    for (const line of lines) {
        if (namePattern.test(line) && !line.includes('@') && !line.includes('http') && line.length < 30) {
            return line;
        }
    }
    return lines[0] || "Name Not Found";
};

// Extract Email
const extractEmail = (text) => (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [])[0] || "Email Not Found";

// Extract Phone
const extractPhone = (text) => {
    const match = text.match(/(?:\+\d{1,3}[\s-]?)?(?:\d[\s-]?){8,12}\d/);
    return match ? match[0].replace(/[\s-]/g, "") : null;
};

// Extract Education
// Extract Education
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


// Extract Experience
const extractExperience = (text) => {
    const section = extractSection(text, ['EXPERIENCE', 'WORK EXPERIENCE'], ['EDUCATION', 'PROJECTS', 'SKILLS', 'TECHNICAL SKILLS']);
    if (!section) return [];
    const segments = section.split(/\n\s*\n/).filter(seg => seg.trim().length > 10);
    return segments.map(segment => {
        const lines = segment.split('\n').map(l => l.trim());
        const title = lines[0] || "Not Found";
        const company = lines[1] ? lines[1].split('|')[0].trim() : "Not Found";
        const durationMatch = segment.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Present|\w+\s+\d{4})\b/i);
        return { title, company, duration: durationMatch ? durationMatch[0] : "Not Found" };
    });
};

// ✅ Improved Skills Extraction
// An improved function to extract skills
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

// Certifications Extraction
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


// Main route for resume parsing
router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        console.log("Resume upload request received");
        console.log("File details: ", req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : "No file");
        
        if (!req.file) {
            return res.status(400).json({ message: "No resume file was uploaded." });
        }

        // Use buffer directly from memory storage
        const dataBuffer = req.file.buffer;
        console.log("Parsing PDF buffer...");
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;

        console.log("✅ 3. PDF parsed. Extracting data...");

        const extractedData = {
            name: extractName(resumeText),
            email: extractEmail(resumeText),
            phone: extractPhone(resumeText),
            education: extractEducation(resumeText),
            experience: extractExperience(resumeText),
            skills: extractSkills(resumeText),
            linkedin: extractLinkedIn(resumeText),
            github: extractGitHub(resumeText),
            certifications: extractCertifications(resumeText)
        };

        console.log("Resume parsed successfully, extracted data:", {
            name: extractedData.name,
            email: extractedData.email,
            phone: extractedData.phone,
            educationCount: extractedData.education.length,
            experienceCount: extractedData.experience.length,
            skillsCount: extractedData.skills.length
        });

        console.log("Data extraction complete. Sending response.");
        res.status(200).json(extractedData);

    } catch (error) {
        console.error("Error in resume parsing route:", error);
        console.error("Error stack:", error.stack);
        
        // More specific error messages for debugging
        if (error.message.includes('Only PDF files are allowed')) {
            return res.status(400).json({ message: "Only PDF files are allowed." });
        }
        
        if (error.message.includes('File too large')) {
            return res.status(400).json({ message: "File size too large. Maximum 5MB allowed." });
        }
        
        res.status(500).json({ 
            message: "Server error during resume parsing.",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

export default router;