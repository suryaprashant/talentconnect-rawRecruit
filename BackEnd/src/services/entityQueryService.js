// export const buildCollegeAlumniQuery = (
//   profile,
//   userId
// ) => {

//   const canonicalIds = [
//     ...new Set(
//       (profile.educations || [])
//         .map(
//           edu =>
//             edu.college_canonical_id
//         )
//         .filter(Boolean)
//     ),
//   ];

//   if (!canonicalIds.length) {
//     return null;
//   }

//   return {
//     userId: { $ne: userId },

//     "educations.college_canonical_id":
//       {
//         $in: canonicalIds,
//       },
//   };
// };

export const buildCollegeAlumniQuery = (
  profile,
  userId
) => {
  const canonicalIds = new Set();
  const collegeNames = new Set();

  // 2. Colleges from education array
  (profile.educations || []).forEach((edu) => {
    // Canonical ID
    if (edu.college_canonical_id) {
      canonicalIds.add(edu.college_canonical_id);
    }
    // College name (fallback)
    if (edu.college) {
      collegeNames.add(edu.college);
    }
    // College display name (fallback)
    if (edu.college_display) {
      collegeNames.add(edu.college_display);
    }
  });

  const ids = Array.from(canonicalIds);
  const names = Array.from(collegeNames);

  // If no colleges found, return null
  if (ids.length === 0 && names.length === 0) {
    return null;
  }

  // Build OR conditions
  const orConditions = [];

  // 1. Match by canonical IDs
  if (ids.length > 0) {
    orConditions.push({
      "educations.college_canonical_id": {
        $in: ids
      }
    });
  }

  // 2. Match by college names (fallback)
  if (names.length > 0) {
    // Case-insensitive matching using regex
    const nameRegexes = names.map(name => new RegExp(`^${name}$`, 'i'));
    
    orConditions.push({
      "educations.college": { $in: nameRegexes }
    });
    orConditions.push({
      "educations.college_display": { $in: nameRegexes }
    });
  }

  return {
    userId: { $ne: userId },
    $or: orConditions
  };
};

export const buildCompanyAlumniQuery = (
  profile,
  userId
) => {
  const canonicalIds = new Set();
  const companyNames = new Set();

  // 1. Current company
  if (profile.currentCompany_canonical_id) {
    canonicalIds.add(profile.currentCompany_canonical_id);
  }
  if (profile.currentCompany) {
    companyNames.add(profile.currentCompany);
  }
  if (profile.currentCompany_display) {
    companyNames.add(profile.currentCompany_display);
  }

  // 2. Companies from experiences
  (profile.experiences || []).forEach((exp) => {
    if (exp.company_canonical_id) {
      canonicalIds.add(exp.company_canonical_id);
    }
    if (exp.company) {
      companyNames.add(exp.company);
    }
    if (exp.company_display) {
      companyNames.add(exp.company_display);
    }
  });

  const ids = Array.from(canonicalIds);
  const names = Array.from(companyNames);

  // If no companies found, return null
  if (ids.length === 0 && names.length === 0) {
    return null;
  }

  // Build OR conditions
  const orConditions = [];

  // 1. Match by canonical IDs (case-insensitive using regex)
  if (ids.length > 0) {
    const idRegexes = ids.map(id => new RegExp(`^${id}$`, 'i'));
    
    orConditions.push({
      currentCompany_canonical_id: { $in: idRegexes }
    });
    orConditions.push({
      "experiences.company_canonical_id": { $in: idRegexes }
    });
  }

  // 2. Match by company names (case-insensitive)
  if (names.length > 0) {
    const nameRegexes = names.map(name => new RegExp(`^${name}$`, 'i'));
    
    orConditions.push({
      currentCompany: { $in: nameRegexes }
    });
    orConditions.push({
      currentCompany_display: { $in: nameRegexes }
    });
    orConditions.push({
      "experiences.company": { $in: nameRegexes }
    });
    orConditions.push({
      "experiences.company_display": { $in: nameRegexes }
    });
  }

  return {
    userId: { $ne: userId },
    $or: orConditions
  };
};