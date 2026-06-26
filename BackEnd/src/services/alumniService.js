import Onboarding from "../models/studentonboardingModel.js";

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isMatched = (regex, value) => {
  return value && regex.test(String(value));
};

const getCompanyValuesFromProfile = (profile = {}) => {
  const companies = [];

  if (profile.currentCompany) companies.push(profile.currentCompany);
  if (profile.currentCompany_display) companies.push(profile.currentCompany_display);
  if (profile.currentCompany_canonical_id) {
    companies.push(profile.currentCompany_canonical_id);
  }

  if (Array.isArray(profile.experiences)) {
    profile.experiences.forEach((exp) => {
      if (exp.company) companies.push(exp.company);
      if (exp.company_display) companies.push(exp.company_display);
      if (exp.company_canonical_id) companies.push(exp.company_canonical_id);
    });
  }

  return [
    ...new Map(
      companies
        .filter(Boolean)
        .map((company) => [String(company).toLowerCase(), company]),
    ).values(),
  ];
};

const personMatchesCompany = (person, companyRegex) => {
  const topLevelMatched =
    isMatched(companyRegex, person.currentCompany) ||
    isMatched(companyRegex, person.currentCompany_display) ||
    isMatched(companyRegex, person.currentCompany_canonical_id);

  const experienceMatched = Array.isArray(person.experiences)
    ? person.experiences.some((exp) => {
        return (
          isMatched(companyRegex, exp.company) ||
          isMatched(companyRegex, exp.company_display) ||
          isMatched(companyRegex, exp.company_canonical_id)
        );
      })
    : false;

  return topLevelMatched || experienceMatched;
};

const isCurrentEmployeeOfCompany = (person, companyRegex) => {
  const topLevelMatched =
    isMatched(companyRegex, person.currentCompany) ||
    isMatched(companyRegex, person.currentCompany_display) ||
    isMatched(companyRegex, person.currentCompany_canonical_id);

  const currentExperienceMatched = Array.isArray(person.experiences)
    ? person.experiences.some((exp) => {
        const matched =
          isMatched(companyRegex, exp.company) ||
          isMatched(companyRegex, exp.company_display) ||
          isMatched(companyRegex, exp.company_canonical_id);

        return matched && (exp.isCurrent === true || !exp.endDate);
      })
    : false;

  return Boolean(topLevelMatched || currentExperienceMatched);
};

const isPastEmployeeOfCompany = (person, companyRegex) => {
  return Array.isArray(person.experiences)
    ? person.experiences.some((exp) => {
        const matched =
          isMatched(companyRegex, exp.company) ||
          isMatched(companyRegex, exp.company_display) ||
          isMatched(companyRegex, exp.company_canonical_id);

        return matched && (exp.isCurrent === false || Boolean(exp.endDate));
      })
    : false;
};

const formatAlumniUser = ({ person, canonicalCompanyId, companyName, sourceType }) => {
  const isCurrentEmployee =
    person.currentCompany_canonical_id ===
      canonicalCompanyId ||

    person.experiences?.some(
      (exp) =>
        exp.company_canonical_id ===
        canonicalCompanyId &&
        (exp.isCurrent === true ||
          !exp.endDate)
    );

  const isAlumni =
    sourceType === "network" &&
    person.experiences?.some(
      (exp) =>
        exp.company_canonical_id ===
        canonicalCompanyId &&
        (exp.isCurrent === false ||
          Boolean(exp.endDate))
    );

  return {
    _id: person._id,
    userId: person.userId,

    name: person.name ?? person.fullName ?? null,
    email: person.email ?? null,
    phone: person.phone ?? null,

    profileImage: person.profileImage ?? null,
    backgroundImage: person.backgroundImage ?? null,

    college: person.college ?? null,

    currentCompany: person.currentCompany ?? null,
    currentCompany_display: person.currentCompany_display ?? null,
    currentCompany_canonical_id: person.currentCompany_canonical_id ?? null,
    currentCompany_master_id: person.currentCompany_master_id ?? null,

    totalYearsOfExperience: person.totalYearsOfExperience ?? null,
    jobRoles: person.jobRoles ?? [],

    linkedin: person.linkedin ?? null,
    github: person.github ?? null,
    portfolio: person.portfolio ?? null,
    about: person.about ?? null,

    educations: person.educations ?? [],
    experiences: person.experiences ?? [],

    isAlumni,
    isCurrentEmployee,

    companyName,
  };
};

export const getAlumniByCompanyForCandidate = async ({
  userId,
  companyName,
  canonicalCompanyId,
  page = 1,
  limit = 100,
  skip = 0,
}) => {
  const searchedCompany = String(companyName || "").trim();

  if (!searchedCompany) {
    return {
      alumFound: false,
      data: [],
      alumniByCompany: {},
      broadcastCandidates: [],
      sourceType: null,
      alumniUserIds: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  // const companyRegex = new RegExp(escapeRegex(searchedCompany), "i");

  const myProfile = await Onboarding.findOne({ userId }).lean();

  if (!myProfile) {
    throw new Error("Profile not found. Complete onboarding.");
  }

  // const myCompanies = getCompanyValuesFromProfile(myProfile);
  const myCompanies = [
  ...new Set([
    myProfile.currentCompany_canonical_id,

    ...(myProfile.experiences || [])
      .map(
        (exp) =>
          exp.company_canonical_id
      ),
  ].filter(Boolean)),
];

  let networkUsers = [];

  // if (myCompanies.length > 0) {
  //   const networkConditions = myCompanies.flatMap((company) => {
  //     const regex = new RegExp(escapeRegex(company), "i");

  //     return [
  //       { currentCompany: regex },
  //       { currentCompany_display: regex },
  //       { currentCompany_canonical_id: regex },
  //       { "experiences.company": regex },
  //       { "experiences.company_display": regex },
  //       { "experiences.company_canonical_id": regex },
  //     ];
  //   });

  //   networkUsers = await Onboarding.find({
  //     userId: { $ne: userId },
  //     $or: networkConditions,
  //   }).lean();
  // }
  if (myCompanies.length > 0) {

  networkUsers =
    await Onboarding.find({
      userId: {
        $ne: userId,
      },

      $or: [
        {
          currentCompany_canonical_id: {
            $in: myCompanies,
          },
        },

        // {
        //   "experiences.company_canonical_id": {
        //     $in: myCompanies,
        //   },
        // },
      ],
    }).lean();
}

  // const networkMatchedUsers = networkUsers.filter((person) =>
  //   personMatchesCompany(person, companyRegex),
  // );
const networkMatchedUsers =
  networkUsers.filter(
    (person) =>
      person.currentCompany_canonical_id ===
        canonicalCompanyId 

      // person.experiences?.some(
      //   (exp) =>
      //     exp.company_canonical_id ===
      //     canonicalCompanyId
      // )
  );

  let sourceType = "network";
  let finalUsers = networkMatchedUsers;

  if (finalUsers.length === 0) {
    sourceType = "global_current_employee";

    finalUsers =
      await Onboarding.find({
        userId: {
          $ne: userId,
        },

        $or: [
          {
            currentCompany_canonical_id:
              canonicalCompanyId,
          },

          // {
          //   "experiences.company_canonical_id":
          //     canonicalCompanyId,
          // },
        ],
      }).lean();
  }

  const uniqueUsers = [
    ...new Map(finalUsers.map((person) => [String(person._id), person])).values(),
  ];

  const total = uniqueUsers.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedUsers = uniqueUsers.slice(skip, skip + limit);

  const users = paginatedUsers.map((person) =>
    formatAlumniUser({
      person,
      canonicalCompanyId,
      companyName: searchedCompany,
      sourceType,
    }),
  );

  const alumniUserIds = users
    .map((person) => person.userId)
    .filter(Boolean)
    .map(String);

  const alumFound = alumniUserIds.length > 0;

  return {
    alumFound,
    data: users,
    sourceType,
    alumniUserIds,
    alumniByCompany: alumFound ? { [searchedCompany]: users } : {},
    broadcastCandidates:
      sourceType === "global_current_employee" && alumFound ? users : [],
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};


