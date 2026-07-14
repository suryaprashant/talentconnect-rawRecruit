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

// export const buildCompanyAlumniQuery = (
//   profile,
//   userId
// ) => {

//   const canonicalIds =
//     new Set();

//   if (
//     profile.currentCompany_canonical_id
//   ) {
//     canonicalIds.add(
//       profile.currentCompany_canonical_id
//     );
//   }

//   (profile.experiences || [])
//     .forEach((exp) => {

//       if (
//         exp.company_canonical_id
//       ) {
//         canonicalIds.add(
//           exp.company_canonical_id
//         );
//       }
//     });

//   const ids =
//     Array.from(canonicalIds);

//   if (!ids.length) {
//     return null;
//   }

//   return {
//     userId: { $ne: userId },

//     $or: [
//       {
//         currentCompany_canonical_id:
//           {
//             $in: ids,
//           },
//       },

//       {
//         "experiences.company_canonical_id":
//           {
//             $in: ids,
//           },
//       },
//     ],
//   };
// };


export const buildCompanyAlumniQuery = (
  profile,
  userId
) => {
  const ids = [];
  const names = [];

  // Handle current company
  if (profile.currentCompany_canonical_id) {
    ids.push(profile.currentCompany_canonical_id);
  } else if (profile.currentCompany) {
    // Fallback to company name if no canonical ID
    names.push(profile.currentCompany.trim());
  }

  // Handle experiences
  (profile.experiences || []).forEach((exp) => {
    if (exp.company_canonical_id) {
      ids.push(exp.company_canonical_id);
    } else if (exp.company) {
      // Fallback to company name if no canonical ID
      names.push(exp.company.trim());
    }
  });

  // Remove duplicates
  const uniqueIds = [...new Set(ids)];
  const uniqueNames = [...new Set(names)];

  // If no criteria found, return null
  if (!uniqueIds.length && !uniqueNames.length) {
    return null;
  }

  // Build the query
  const query = {
    userId: { $ne: userId },
    $or: []
  };

  // Add canonical ID conditions
  if (uniqueIds.length) {
    query.$or.push(
      {
        currentCompany_canonical_id: {
          $in: uniqueIds,
        },
      },
      {
        "experiences.company_canonical_id": {
          $in: uniqueIds,
        },
      }
    );
  }

  // Add case-insensitive company name conditions (fallback)
  if (uniqueNames.length) {
    // Escape special regex characters
    const regexPatterns = uniqueNames.map(name => 
      new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
    );

    query.$or.push({
      currentCompany: { $in: regexPatterns }
    });

    query.$or.push({
      "experiences.company": { $in: regexPatterns }
    });
  }

  return query;
};