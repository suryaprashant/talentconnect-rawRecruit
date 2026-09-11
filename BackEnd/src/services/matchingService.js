export const calculateDeepMatchScore = (student, job) => {
  let score = 0;
  const weights = { skills: 25, degree: 25, specialization: 25, salary: 25 };
  
  // Normalization helper (removes spaces/dots/hyphens for better matching)
  const norm = (v) => v ? String(v).toLowerCase().replace(/[\s.-]/g, "").trim() : "";

  // 1. SKILLS (25%)
  const sSkills = (student.skills || []).map(norm);
  const jSkills = (job.skills || []).map(norm);
  if (jSkills.length > 0) {
    const matched = jSkills.filter(s => sSkills.includes(s));
    score += (matched.length / jSkills.length) * weights.skills;
  } else { score += weights.skills; } // Auto-pass if no skills listed

  // 2. DEGREE (25%)
  const sDegree = norm(student.degree);
  const jDegrees = (job.degree || []).map(norm);
  if (jDegrees.includes(sDegree)) score += weights.degree;

  // 3. SPECIALIZATION (25%) - Matches student.specialization against job.studentStreams
  const sSpec = norm(student.specialization);
  const jStreams = (job.studentStreams || []).map(norm);
  if (jStreams.includes(sSpec)) score += weights.specialization;

  // 4. SALARY (25%)
  const sSalary = Number(student.expectedSalaryAmount) || 0;
  const jSalary = Number(job.packageDetails?.totalCTC) || Number(job.salary) || 0;
  if (sSalary === 0 || jSalary >= sSalary) score += weights.salary;

  return {
    total: Math.round(score),
    isMatch: Math.round(score) >= 50
  };
};