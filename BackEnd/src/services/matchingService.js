/**
 * Utility to extract numerical requirements from unstructured text
 */
const extractFromText = (text) => {
  const data = { minCgpa: 0, minExp: 0, minLpa: 0 };
  if (!text) return data;

  // Regex for CGPA (e.g., "7.5 CGPA", "8+ GPA")
  const cgpaMatch = text.match(/(\d\.?\d?)\s*(CGPA|GPA)/i);
  if (cgpaMatch) data.minCgpa = parseFloat(cgpaMatch[1]);

  // Regex for Experience (e.g., "2 years", "3+ yrs")
  const expMatch = text.match(/(\d+)\s*(year|yr|yrs)/i);
  if (expMatch) data.minExp = parseInt(expMatch[1]);

  // Regex for Salary (e.g., "6 LPA", "10 Lakhs")
  const salMatch = text.match(/(\d+)\s*(LPA|Lakh)/i);
  if (salMatch) data.minLpa = parseInt(salMatch[1]);

  return data;
};

export const calculateDeepMatchScore = (student, job) => {
  let score = 0;
  const jobText = `${job.description} ${job.eligibilityCriteria}`.toLowerCase();
  const parsedReqs = extractFromText(jobText);

  // 1. Core Skills & Roles (40 pts)
  const studentSkills = (student.skills || []).map(s => s.toLowerCase());
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  if (jobSkills.length > 0) {
    const matches = jobSkills.filter(s => studentSkills.includes(s));
    score += (matches.length / jobSkills.length) * 40;
  }

  // 2. Tools & Platforms (15 pts)
  const studentTools = (student.toolsAndPlatforms || []).map(t => t.toLowerCase());
  const jobTools = (job.tags || []).map(t => t.toLowerCase()); // or specific tools field
  const toolMatches = studentTools.filter(t => jobText.includes(t));
  if (studentTools.length > 0) score += (toolMatches.length > 0 ? 15 : 0);

  // 3. Location & Work Mode (15 pts)
  const studentLocs = (student.locations || []).map(l => l.toLowerCase());
  const jobLocs = (job.location || []).map(l => l.toLowerCase());
  const isRemote = (job.workMode || []).some(m => m.toLowerCase() === 'remote');
  if (isRemote || jobLocs.some(l => studentLocs.includes(l))) score += 15;

  // 4. CGPA Match (10 pts)
  const studentCgpa = parseFloat(student.cgpa) || 0;
  if (studentCgpa >= parsedReqs.minCgpa) score += 10;

  // 5. Experience Match (10 pts)
  const studentExp = parseInt(student.totalYearsOfExperience) || 0;
  if (studentExp >= parsedReqs.minExp) score += 10;

  // 6. Salary Expectation (10 pts)
  const studentExpSalary = parseInt(student.expectedSalaryAmount) || 0;
  const jobActualSalary = job.packageDetails?.totalCTC || parsedReqs.minLpa;
  if (jobActualSalary >= studentExpSalary) score += 10;

  return {
    total: Math.round(score),
    details: { parsedReqs, studentCgpa, studentExp }
  };
};