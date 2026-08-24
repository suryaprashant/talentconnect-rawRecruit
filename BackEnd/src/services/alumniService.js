import Onboarding from "../models/studentonboardingModel.js";
import { resolveCompany } from "../services/normalizationService.js";
import {
  buildCollegeAlumniQuery,
  buildCompanyAlumniQuery,
} from "../services/entityQueryService.js";
import {
  fetchProfessionalReferralMetrics,
} from "../services/adminService.js";
import { paginatedResponse } from "../utils/paginate.js";
import { JobPostingTable} from "../models/jobPostingsModel.js"

import {getCompanyFuse} from "./fuseIndexService.js"
import Application from "../models/applicationModel.js";

const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const isMatched = (regex, value) => {
  return value && regex.test(String(value));
};

const getCompanyValuesFromProfile = (profile = {}) => {
  const companies = [];

  if (profile.currentCompany) companies.push(profile.currentCompany);
  if (profile.currentCompany_display)
    companies.push(profile.currentCompany_display);
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

const formatAlumniUser = ({
  person,
  canonicalCompanyId,
  companyName,
  sourceType,
}) => {
  const isCurrentEmployee =
    person.currentCompany_canonical_id === canonicalCompanyId ||
    person.experiences?.some(
      (exp) =>
        exp.company_canonical_id === canonicalCompanyId &&
        (exp.isCurrent === true || !exp.endDate),
    );

  const isAlumni =
    sourceType === "network" &&
    person.experiences?.some(
      (exp) =>
        exp.company_canonical_id === canonicalCompanyId &&
        (exp.isCurrent === false || Boolean(exp.endDate)),
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
  postedByUser,
  company,
  page = 1,
  limit = Number.MAX_SAFE_INTEGER,
}) => {
  console.log("===== START: getAlumniByCompanyForCandidate =====");
  console.log("Input params:", {
    userId,
    postedByUser,
    company,
    page,
    limit: limit === Number.MAX_SAFE_INTEGER ? "MAX" : limit,
  });

  if (!userId) {
    console.error("❌ USER_ID_MISSING");
    throw {
      status: 401,
      errorCode: "USER_ID_MISSING",
      message: "userId not found in token. Please re-login.",
    };
  }

  if (!company) {
    console.error("❌ COMPANY_PARAM_MISSING");
    throw {
      status: 400,
      errorCode: "COMPANY_PARAM_MISSING",
      message: "Company name is required in params.",
    };
  }

  // =====================================================
  // STEP 0: RESOLVE COMPANY  ("Resolve Company" in flow)
  // =====================================================

  const targetCompany = await resolveCompany(company);
  console.log(
    "Resolved targetCompany:",
    JSON.stringify(targetCompany, null, 2),
  );

  const targetCanonicalId = targetCompany?.canonicalId || null;
  console.log("Target canonicalId:", targetCanonicalId);

  if (!targetCanonicalId) {
    console.error(
      "❌ COMPANY_NOT_NORMALIZED - Company not found in normalization database",
    );
    throw {
      status: 404,
      errorCode: "COMPANY_NOT_NORMALIZED",
      message: "Company not found in normalization database.",
    };
  }

  const skip = (page - 1) * limit;
  console.log("Pagination - skip:", skip, "limit:", limit);

  // =====================================================
  // STEP 1: FETCH MY PROFILE
  // =====================================================

  console.log("📌 STEP 1: Fetching my profile...");
  const myProfile = await Onboarding.findOne({ userId });
  console.log(
    "My profile found:",
    myProfile ? `✅ (${myProfile.userId})` : "❌ Not found",
  );

  if (!myProfile) {
    console.error("❌ PROFILE_NOT_FOUND");
    throw {
      status: 404,
      errorCode: "PROFILE_NOT_FOUND",
      message: "Your profile does not exist. Please complete onboarding.",
    };
  }

  console.log("User profile details:", {
    userId: myProfile.userId,
    college: myProfile.college_canonical_id,
    currentCompany: myProfile.currentCompany,
    currentCompanyCanonicalId: myProfile.currentCompany_canonical_id,
    experiencesCount: myProfile.experiences?.length || 0,
    educationsCount: myProfile.educations?.length || 0,
  });

  let collegeAlumni = [];
  let companyAlumni = [];

  // =====================================================
  // STEP 2: BUILD EXCLUDED IDS
  // =====================================================

  console.log("📌 STEP 2: Building excluded IDs...");
  const excludedUserIds = [userId];

  if (postedByUser) {
    excludedUserIds.push(postedByUser);
  }
  console.log("Excluded user IDs:", excludedUserIds);

  // =====================================================
  // STEP 3: FETCH COLLEGE ALUMNI  ("Search Network" part 1)
  // =====================================================

  console.log("📌 STEP 3: Fetching college alumni...");
  const collegeQuery = buildCollegeAlumniQuery(myProfile, userId);
  console.log("College query:", JSON.stringify(collegeQuery, null, 2));

  const colleges = [
    ...new Set(
      (myProfile.educations || [])
        .map((edu) => edu.college_canonical_id || edu.college)
        .filter(Boolean),
    ),
  ];
  console.log("User's colleges:", colleges);

  if (collegeQuery) {
    console.log("🔍 Executing college alumni query...");
    collegeAlumni = await Onboarding.find({
      ...collegeQuery,
      userId: {
        $nin: excludedUserIds,
      },
    }).lean();
    console.log(`✅ Found ${collegeAlumni.length} college alumni`);
    if (collegeAlumni.length > 0) {
      console.log(
        "College alumni sample (first 3):",
        collegeAlumni.slice(0, 3).map((p) => ({
          userId: p.userId,
          college: p.college_canonical_id,
          currentCompany: p.currentCompany,
        })),
      );
    }
  } else {
    console.log(
      "⚠️ No college query generated, skipping college alumni search",
    );
  }

  // =====================================================
  // STEP 4: FETCH COMPANY ALUMNI  ("Search Network" part 2)
  // =====================================================

  console.log("📌 STEP 4: Fetching company alumni...");
  const companyQuery = buildCompanyAlumniQuery(myProfile, userId);
  console.log("Company query:", JSON.stringify(companyQuery, null, 2));

  const uniqueCompanies = [
    ...new Set(
      [
        myProfile.currentCompany_canonical_id || myProfile.currentCompany,
        ...(myProfile.experiences || []).map(
          (exp) => exp.company_canonical_id || exp.company,
        ),
      ].filter(Boolean),
    ),
  ];
  console.log("User's companies (unique):", uniqueCompanies);

  if (companyQuery) {
    console.log("🔍 Executing company alumni query...");
    companyAlumni = await Onboarding.find({
      ...companyQuery,
      userId: {
        $nin: excludedUserIds,
      },
    }).lean();
    console.log(`✅ Found ${companyAlumni.length} company alumni`);
    if (companyAlumni.length > 0) {
      console.log(
        "Company alumni sample (first 3):",
        companyAlumni.slice(0, 3).map((p) => ({
          userId: p.userId,
          currentCompany: p.currentCompany,
          experiences: p.experiences?.length || 0,
        })),
      );
    }
  } else {
    console.log(
      "⚠️ No company query generated, skipping company alumni search",
    );
  }

  // =====================================================
  // STEP 5: MERGE + REMOVE DUPLICATES
  // =====================================================

  console.log("📌 STEP 5: Merging alumni and removing duplicates...");
  console.log(
    `College alumni: ${collegeAlumni.length}, Company alumni: ${companyAlumni.length}`,
  );

  const mergedAlumni = [...collegeAlumni, ...companyAlumni];
  console.log(`Total merged alumni before dedup: ${mergedAlumni.length}`);

  const uniqueAlumniMap = new Map();
  mergedAlumni.forEach((person) => {
    const key = person.userId?.toString();
    if (!uniqueAlumniMap.has(key)) {
      uniqueAlumniMap.set(key, person);
    }
  });

  const uniqueAlumni = Array.from(uniqueAlumniMap.values());
  console.log(`✅ After dedup: ${uniqueAlumni.length} unique alumni`);

  // =====================================================
  // STEP 6: BUILD SEARCH TERMS
  // =====================================================

  console.log("📌 STEP 6: Building search terms...");
  const searchTerms = new Set();
  searchTerms.add(company.toLowerCase());

  if (targetCompany.displayName) {
    searchTerms.add(targetCompany.displayName.toLowerCase());
  }

  (targetCompany.aliases || []).forEach((alias) =>
    searchTerms.add(alias.toLowerCase()),
  );

  console.log("Search terms:", Array.from(searchTerms));

  // =====================================================
  // STEP 7: FILTER NETWORK ALUMNI BY TARGET COMPANY
  // ("Found?" check #1 in flow — if yes, Return)
  // =====================================================

  console.log("📌 STEP 7: Filtering network alumni by target company...");
  console.log(`Target canonicalId: "${targetCanonicalId}"`);
  console.log(`Target company name: "${company}"`);

  let alumni = uniqueAlumni.filter((person) => {
    const currentCompany = (person.currentCompany || "").toLowerCase().trim();
    const displayCompany = (person.currentCompany_display || "").toLowerCase().trim();

    // Check if current company matches search terms
    const matchesText = searchTerms.has(currentCompany) || searchTerms.has(displayCompany);

    // Check if canonical ID matches
    const matchesCanonical = person.currentCompany_canonical_id === targetCanonicalId;

    return matchesText || matchesCanonical;
  });

  let source = "network";
  console.log(`✅ Network filter: ${alumni.length} alumni match target company`);

  // =====================================================
  // STEP 8: PLATFORM SEARCH — only if network gave 0 results
  // ("No" branch -> Search Entire Platform)
  // =====================================================

  if (alumni.length === 0) {
    console.log("📌 STEP 8: No network alumni found. Searching entire platform...");
    source = "platform";

    const orConditions = [];

    // Add text search conditions
    Array.from(searchTerms).forEach((term) => {
      orConditions.push({
        currentCompany: {
          $regex: `^${escapeRegex(term)}$`,
          $options: "i",
        },
      });

      orConditions.push({
        currentCompany_display: {
          $regex: `^${escapeRegex(term)}$`,
          $options: "i",
        },
      });
    });

    // Add canonical ID search
    orConditions.push({
      currentCompany_canonical_id: targetCanonicalId,
    });

    console.log("Platform search conditions:", JSON.stringify(orConditions, null, 2));

    alumni = await Onboarding.find({
      userId: {
        $nin: excludedUserIds,
      },
      $or: orConditions,
    }).lean();

    console.log(`✅ Platform search: ${alumni.length} alumni found`);
  }

  // =====================================================
  // STEP 9: FUZZY COMPANY SEARCH — only if platform gave 0 results
  // ("No" branch -> Perform Fuzzy Company Search -> Return Matches)
  //
  // FIX: previously this query had BOTH
  //   currentCompany_canonical_id: { $in: similarCanonicalIds }
  //   currentCompany:              { $in: similarCanonicalIds }
  // in the same object, which Mongo treats as AND. The second
  // condition compared a company NAME field against a list of
  // CANONICAL IDS — that can never match, so this branch always
  // returned 0 results. Removed the incorrect clause; canonical ID
  // is the only reliable field to filter fuzzy matches on, since
  // similarCanonicalIds contains canonical ids, not display names.
  // =====================================================

  if (alumni.length === 0) {
    console.log("📌 STEP 9: No alumni found. Trying Fuse fuzzy search...");

    const similarCanonicalIds = new Set();
    similarCanonicalIds.add(targetCompany.canonicalId);

    const fuse = getCompanyFuse();

    if (fuse) {
      console.log("🔍 Executing Fuse search...");
      const fuseResults = fuse.search(company);
      console.log(`Fuse found ${fuseResults.length} results`);

      for (const result of fuseResults) {
        const confidence = Math.round((1 - result.score) * 100);
        console.log(`  - ${result.item.display_name}: ${confidence}% confidence`);

        // Change threshold to 85 or 80 if needed
        if (confidence >= 80) {
          similarCanonicalIds.add(result.item.canonical_id);
          console.log(`    ✅ Added ${result.item.canonical_id} to similar IDs`);
        }
      }
    }

    console.log("Similar canonical IDs:", Array.from(similarCanonicalIds));

    alumni = await Onboarding.find({
      userId: {
        $nin: excludedUserIds,
      },
      currentCompany_canonical_id: {
        $in: Array.from(similarCanonicalIds),
      },
    }).lean();

    console.log(`✅ Fuse fallback: ${alumni.length} alumni found`);
    source = "platform_fallback";
  }

  // =====================================================
  // STEP 10: APPLY PAGINATION
  // =====================================================

  console.log("📌 STEP 10: Applying pagination...");
  const total = alumni.length;
  console.log(`Total alumni before pagination: ${total}`);

  const paginatedAlumni = alumni.slice(skip, skip + limit);
  console.log(`Paginated alumni: ${paginatedAlumni.length} (from ${skip} to ${skip + limit})`);

  // =====================================================
  // STEP 11: EMPTY RESPONSE CHECK
  // =====================================================

  if (paginatedAlumni.length === 0) {
    console.log("📤 No professionals found, returning empty response");
    console.log("===== END: getAlumniByCompanyForCandidate =====");
    return {
      success: true,
      errorCode: null,
      message: "No professionals found for this company.",
      company,
      source,
      collegesChecked: colleges,
      companiesChecked: uniqueCompanies,
      ...paginatedResponse([], total, { page, limit }),
    };
  }

  // =====================================================
  // STEP 12: FETCH METRICS + JOBS
  // =====================================================

  console.log("📌 STEP 12: Fetching metrics and jobs for alumni...");
  console.log(`Processing ${paginatedAlumni.length} alumni...`);

  const alumniWithMetrics = await Promise.all(
    paginatedAlumni.map(async (person, index) => {
      console.log(
        `  Processing alumni ${index + 1}/${paginatedAlumni.length}: ${person.userId}`,
      );

      let metrics = null;
      let referralJobs = [];

      const currentlyWorking =
        targetCanonicalId &&
        person.currentCompany_canonical_id === targetCanonicalId;

      const previouslyWorked = person.experiences?.some(
        (exp) => exp.company_canonical_id === targetCanonicalId,
      );

      console.log(`    - currentlyWorking: ${currentlyWorking}`);
      console.log(`    - previouslyWorked: ${previouslyWorked}`);

      try {
        console.log(`    - Fetching referral metrics for ${person.userId}...`);
        [metrics, referralJobs] = await Promise.all([
          fetchProfessionalReferralMetrics(person._id),
          JobPostingTable.find({
            candidatePosted: person._id,
            jobType: "Referral",
            approvalStatus: "Approved",
            inactive: false,
          })
            .sort({ createdAt: -1 })
            .lean(),
        ]);
        console.log(
          `    - ✅ Metrics: ${metrics ? "found" : "none"}, Jobs: ${referralJobs.length}`,
        );
      } catch (innerError) {
        console.error(
          `    - ❌ Error processing professional ${person._id}:`,
          innerError,
        );
      }

      return {
        ...person,
        currentlyWorking,
        previouslyWorked,
        referralMetrics: metrics,
        referralJobs,
        isHiring: referralJobs.length > 0,
      };
    }),
  );

  console.log(`✅ All ${alumniWithMetrics.length} alumni processed`);

  // =====================================================
  // STEP 13: BUILD RESPONSE
  // =====================================================

  console.log("📌 STEP 13: Building response...");
  const pagination = paginatedResponse(alumniWithMetrics, total, {
    page,
    limit,
  });

  console.log("✅ Success response prepared");
  console.log(`Total: ${total}, Returned: ${alumniWithMetrics.length}`);
  console.log(`Source: ${source}`);
  console.log("===== END: getAlumniByCompanyForCandidate =====");

  return {
    success: true,
    errorCode: null,
    message: "Professionals fetched successfully.",
    company,
    source,
    collegesChecked: colleges,
    companiesChecked: uniqueCompanies,
    ...pagination,
  };
};

export const getAllAlumni = async(myProfile,userId)=>{
  const collegeQuery =
        buildCollegeAlumniQuery(
          myProfile,
          userId
        );
  
      const companyQuery =
        buildCompanyAlumniQuery(
          myProfile,
          userId
        );
  
      let collegeAlumni = [];
      let companyAlumni = [];
  
      if (collegeQuery) {
        collegeAlumni =
          await Onboarding.find(
            collegeQuery
          ).lean();
      }
  
      if (companyQuery) {
        companyAlumni =
          await Onboarding.find(
            companyQuery
          ).lean();
      }
  
      // =====================================================
      // STEP 5: MERGE + REMOVE DUPLICATES
      // =====================================================
  
      const mergedAlumni = [
        ...collegeAlumni,
        ...companyAlumni,
      ];
  
      const uniqueAlumniMap = new Map();
  
      mergedAlumni.forEach((person) => {
        const key =
          person.userId?.toString();
  
        if (!uniqueAlumniMap.has(key)) {
          uniqueAlumniMap.set(key, person);
        }
      });
  
      const uniqueAlumni = Array.from(
        uniqueAlumniMap.values()
      );
      return uniqueAlumni;
}

export const getAlumniReferredService = async (myProfile, userId) => {
  try {
    // Get all alumni related to current user
    const alumniList = await getAllAlumni(
      myProfile,
      userId
    );

    if (!alumniList.length) {
      return [];
    }

    // Application.applicant contains Onboarding._id
    const alumniIds = alumniList
      .map((alumni) => alumni._id)
      .filter(Boolean);

    const referredStatuses = [
      "Referred To Company",
      "Shortlisted",
      "Interview Scheduled",
      "Offer Extended",
      "Accepted",
      "Rejected",
      "Offer Accepted",
      "Offer Rejected",
      "Joined the Company",
    ];

    // Find applications belonging to alumni
    const applications = await Application.find({
      applicant: { $in: alumniIds },
      currentStatus: {
        $in: referredStatuses,
      },
    })
      .populate("job")
      .lean();

    // Map using Onboarding._id
    const alumniMap = new Map(
      alumniList.map((alumni) => [
        alumni._id.toString(),
        alumni,
      ])
    );

    const result = applications
      .map((application) => {
        const alumni = alumniMap.get(
          application.applicant?.toString()
        );

        if (!alumni || !application.job) {
          return null;
        }

        const job = application.job;

        // =====================================================
        // FIND COMMON COLLEGE
        // =====================================================

        let organization = null;

        const myColleges = (myProfile.educations || [])
          .map(
            (edu) =>
              edu.college_canonical_id ||
              edu.college
          )
          .filter(Boolean);

        const alumniColleges = (
          alumni.educations || []
        )
          .map(
            (edu) =>
              edu.college_canonical_id ||
              edu.college
          )
          .filter(Boolean);

        const commonCollege = myColleges.find(
          (college) =>
            alumniColleges.includes(college)
        );

        if (commonCollege) {
          organization =
            myProfile.educations?.find(
              (edu) =>
                (edu.college_canonical_id ||
                  edu.college) === commonCollege
            )?.college_display ||
            alumni.educations?.find(
              (edu) =>
                (edu.college_canonical_id ||
                  edu.college) === commonCollege
            )?.college_display ||
            commonCollege;
        }

        // =====================================================
        // IF NO COMMON COLLEGE, FIND COMMON COMPANY
        // =====================================================

        if (!organization) {
          const myCompanies = [
            myProfile.currentCompany_canonical_id ||
              myProfile.currentCompany,

            ...(myProfile.experiences || []).map(
              (exp) =>
                exp.company_canonical_id ||
                exp.company
            ),
          ].filter(Boolean);

          const alumniCompanies = [
            alumni.currentCompany_canonical_id ||
              alumni.currentCompany,

            ...(alumni.experiences || []).map(
              (exp) =>
                exp.company_canonical_id ||
                exp.company
            ),
          ].filter(Boolean);

          const commonCompany = myCompanies.find(
            (company) =>
              alumniCompanies.includes(company)
          );

          if (commonCompany) {
            organization =
              alumni.currentCompany_display ||
              alumni.currentCompany ||
              alumni.experiences?.find(
                (exp) =>
                  (exp.company_canonical_id ||
                    exp.company) === commonCompany
              )?.company_display ||
              commonCompany;
          }
        }

        if (!organization) {
          organization = "Alumni";
        }

        // =====================================================
        // JOB ROLE
        // =====================================================

        const jobRole =
          job.jobRoles?.length > 0
            ? job.jobRoles.join(", ")
            : job.jobTitle?.length > 0
              ? job.jobTitle.join(", ")
              : "a job";

        // =====================================================
        // COMPANY NAME
        // =====================================================

        const companyName =
          job.companyName ||
          "the company";

        const alumniName =
          alumni.name ||
          "An alumnus";

        return {
          alumniId: alumni._id,
          jobId: job._id,
          currentStatus: application.currentStatus,
          message: `${alumniName} (${organization}) got referred to ${jobRole} @${companyName}`,
        };
      })
      .filter(Boolean);

    return result;
  } catch (error) {
    console.error(
      "Error fetching referred alumni:",
      error
    );

    throw error;
  }
};