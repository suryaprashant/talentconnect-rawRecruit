export const buildCollegeAlumniQuery = (
  profile,
  userId
) => {

  const canonicalIds = [
    ...new Set(
      (profile.educations || [])
        .map(
          edu =>
            edu.college_canonical_id
        )
        .filter(Boolean)
    ),
  ];

  if (!canonicalIds.length) {
    return null;
  }

  return {
    userId: { $ne: userId },

    "educations.college_canonical_id":
      {
        $in: canonicalIds,
      },
  };
};

export const buildCompanyAlumniQuery = (
  profile,
  userId
) => {

  const canonicalIds =
    new Set();

  if (
    profile.currentCompany_canonical_id
  ) {
    canonicalIds.add(
      profile.currentCompany_canonical_id
    );
  }

  (profile.experiences || [])
    .forEach((exp) => {

      if (
        exp.company_canonical_id
      ) {
        canonicalIds.add(
          exp.company_canonical_id
        );
      }
    });

  const ids =
    Array.from(canonicalIds);

  if (!ids.length) {
    return null;
  }

  return {
    userId: { $ne: userId },

    $or: [
      {
        currentCompany_canonical_id:
          {
            $in: ids,
          },
      },

      {
        "experiences.company_canonical_id":
          {
            $in: ids,
          },
      },
    ],
  };
};