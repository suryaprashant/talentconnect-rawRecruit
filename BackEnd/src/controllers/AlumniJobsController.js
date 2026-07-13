import  Onboarding  from "../models/studentonboardingModel.js";
import {JobPostingTable}  from "../models/jobPostingsModel.js";
import OpenAI from "openai";
import Application from "../models/applicationModel.js";
import mongoose from "mongoose";
import { fetchProfessionalReferralMetrics } from "../services/adminService.js"; // adjust import path
import {
  buildCollegeAlumniQuery,
  buildCompanyAlumniQuery,
} from "../services/entityQueryService.js";
import {resolveCompany} from "../services/normalizationService.js";
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Ensure this is in your .env file
  baseURL: "https://api.groq.com/openai/v1", // This tells the SDK to talk to Groq
});
import {paginatedResponse} from "../utils/paginate.js";

// export const getAlumniPostedJobs = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // 1. Get current student's college
//     const myProfile = await Onboarding.findOne({ userId });

//     if (!myProfile || !myProfile.college) {
//       return res.status(404).json({ message: "College info not found in your profile." });
//     }

//     const myCollege = myProfile.college;

//     // 2. Find jobs where the 'candidatePosted' alum is from the same college
//     // We use populate to look into the Onboarding details of the poster
//     const jobs = await JobPostingTable.find({
//         jobType: "Referral",
//         approvalStatus:"Approved",
//       candidatePosted: { $exists: true, $ne: null }
//     })
//     .populate({
//       path: 'candidatePosted',
//       match: { college: myCollege }, // Only include posters from my college
//       select: 'name college profileImage'
//     })
//     .sort({ createdAt: -1 });

//     // 3. Filter out the nulls (jobs that didn't match the college filter in populate)
//     // and exclude jobs posted by the user themselves
//     const alumniJobs = jobs.filter(job => 
//       job.candidatePosted !== null && 
//       job.postedByUser?.toString() !== userId.toString()
//     );

//     res.status(200).json({
//       success: true,
//       college: myCollege,
//       count: alumniJobs.length,
//       jobs: alumniJobs
//     });

//   } catch (error) {
//     console.error("Error fetching alumni jobs:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getAlumniPostedJobs = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { company } = req.params; // Get company from URL params

//     if (!company) {
//       return res.status(400).json({ message: "Company name is required in params." });
//     }

//     // 1. Get current user's college
//     const myProfile = await Onboarding.findOne({ userId });

//     if (!myProfile || !myProfile.college) {
//       return res.status(404).json({ message: "College info not found in your profile." });
//     }

//     const myCollege = myProfile.college;

//     // 2. Find professional alumni from same college who work at the given company
//     const alumni = await Onboarding.find({
//       college: myCollege,
//       userId: { $ne: userId },                                                          // Exclude self
//       profileType: "professional",
//       currentCompany: { $regex: new RegExp(`^${company}$`, "i") },                     // Case-insensitive company match
//     });

//     return res.status(200).json({
//       success: true,
//       college: myCollege,
//       company,
//       count: alumni.length,
//       alumni,
//     });

//   } catch (error) {
//     console.error("Error fetching alumni by company:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getAlumniPostedJobs = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { company } = req.params;

//     if (!company) {
//       return res.status(400).json({ message: "Company name is required in params." });
//     }

//     // 1. Get current user's college
//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile?.college) {
//       return res.status(404).json({ message: "College info not found in your profile." });
//     }

    
//     const alumni = await Onboarding.find({
//       college: myProfile.college,
//       userId: { $ne: userId },
//       profileType: "professional",
//       currentCompany: { $regex: new RegExp(`^${company}$`, "i") },
//     }).lean();

    
//     const alumniWithMetrics = await Promise.all(
//       alumni.map(async (person) => {
//         const metrics = await fetchProfessionalReferralMetrics(person._id);
//         return {
//           ...person,
//           referralMetrics: metrics,
//         };
//       })
//     );

//     return res.status(200).json({
//       success: true,
//       college: myProfile.college,
//       company,
//       count: alumniWithMetrics.length,
//       alumni: alumniWithMetrics,
//     });

//   } catch (error) {
//     console.error("Error fetching alumni by company:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


export const getAlumniWhoCanHelp = async (req, res) => {
  try {
    const userId = req.user?._id;

    const { company, postedByUser } = req.params;
    const targetCompany =
      await resolveCompany(company);

    const targetCanonicalId =
      targetCompany?.canonicalId || null;

    if (!targetCanonicalId) {
      return res.status(404).json({
        success: false,
        errorCode: "COMPANY_NOT_NORMALIZED",
        message:
          "Company not found in normalization database.",
      });
    }
    const { page, limit, skip } =
      req.pagination;

    if (!userId) {
      return res.status(401).json({
        success: false,
        errorCode: "USER_ID_MISSING",
        message:
          "userId not found in token. Please re-login.",

        data: null,
      });
    }

    if (!company) {
      return res.status(400).json({
        success: false,
        errorCode:
          "COMPANY_PARAM_MISSING",

        message:
          "Company name is required in params.",

        data: null,
      });
    }

    // =====================================================
    // STEP 1: FETCH MY PROFILE
    // =====================================================

    const myProfile =
      await Onboarding.findOne({
        userId,
      });

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        errorCode:
          "PROFILE_NOT_FOUND",

        message:
          "Your profile does not exist. Please complete onboarding.",

        data: null,
      });
    }
    let collegeAlumni = [];
    let companyAlumni = [];
    // =====================================================
    // STEP 2: BUILD EXCLUDED IDS + COMPANY REGEX
    // =====================================================

    
    const excludedUserIds = [userId];

    if (postedByUser) {
      excludedUserIds.push(
        postedByUser
      );
    }

    // =====================================================
    // STEP 3: FETCH COLLEGE ALUMNI
    // =====================================================

    const collegeQuery =
      buildCollegeAlumniQuery(
        myProfile,
        userId
      );

    const colleges = [
      ...new Set(
        (myProfile.educations || [])
          .map(
            (edu) =>
              edu.college_canonical_id ||
              edu.college
          )
          .filter(Boolean)
      ),
    ];

    if (collegeQuery) {

      collegeAlumni =
        await Onboarding.find({
          ...collegeQuery,

          userId: {
            $nin: excludedUserIds,
          },
        }).lean();
    }

    // =====================================================
    // STEP 4: BUILD USER COMPANIES
    // =====================================================

    const companyQuery =
    buildCompanyAlumniQuery(
      myProfile,
      userId
    );

    const uniqueCompanies = [
      ...new Set([
        myProfile.currentCompany_canonical_id ||
          myProfile.currentCompany,

        ...(myProfile.experiences || [])
          .map(
            (exp) =>
              exp.company_canonical_id ||
              exp.company
          ),
      ].filter(Boolean)),
    ];

    if (companyQuery) {

      companyAlumni =
        await Onboarding.find({
          ...companyQuery,

          userId: {
            $nin: excludedUserIds,
          },
        }).lean();
    }

    // =====================================================
    // STEP 6: MERGE + REMOVE DUPLICATES
    // =====================================================

    const mergedAlumni = [
      ...collegeAlumni,
      ...companyAlumni,
    ];

    const uniqueAlumniMap =
      new Map();

    mergedAlumni.forEach(
      (person) => {
        const key =
          person.userId?.toString();

        if (
          !uniqueAlumniMap.has(key)
        ) {
          uniqueAlumniMap.set(
            key,
            person
          );
        }
      }
    );

    const uniqueAlumni =
      Array.from(
        uniqueAlumniMap.values()
      );

    // =====================================================
    // STEP 7: FILTER ONLY TARGET COMPANY PEOPLE
    // =====================================================

    const alumni =
      uniqueAlumni.filter(
        (person) => {

          const currentlyWorking =
            targetCanonicalId &&
            person.currentCompany_canonical_id ===
              targetCanonicalId;

          const previouslyWorked =
            person.experiences?.some(
              (exp) =>
                exp.company_canonical_id ===
                targetCanonicalId
            );

          return (
            currentlyWorking ||
            previouslyWorked
          );
        }
      );
    const total = alumni.length;

    // =====================================================
    // STEP 8: APPLY PAGINATION
    // =====================================================

    const paginatedAlumni =
      alumni.slice(
        skip,
        skip + limit
      );

    // =====================================================
    // STEP 9: EMPTY RESPONSE
    // =====================================================

    if (
      paginatedAlumni.length === 0
    ) {
      return res.status(200).json({
        success: true,

        errorCode: null,

        message:
          "No professionals found for this company.",

        company,

        collegesChecked:
          colleges,

        companiesChecked:
          uniqueCompanies,

        ...paginatedResponse(
          [],
          total,
          {
            page,
            limit,
          }
        ),
      });
    }

    // =====================================================
    // STEP 10: FETCH METRICS + JOBS
    // =====================================================

    const alumniWithMetrics =
      await Promise.all(
        paginatedAlumni.map(
          async (person) => {
            let metrics = null;

            let referralJobs = [];

            const currentlyWorking =
              targetCanonicalId &&
              person.currentCompany_canonical_id ===
                targetCanonicalId;

            const previouslyWorked =
              person.experiences?.some(
                (exp) =>
                  exp.company_canonical_id ===
                  targetCanonicalId
              );

            try {
              [
                metrics,
                referralJobs,
              ] =
                await Promise.all([
                  fetchProfessionalReferralMetrics(
                    person._id
                  ),

                  JobPostingTable.find(
                    {
                      candidatePosted:
                        person._id,

                      jobType:
                        "Referral",

                      approvalStatus:
                        "Approved",

                      inactive:
                        false,
                    }
                  )
                    .sort({
                      createdAt:
                        -1,
                    })
                    .lean(),
                ]);
            } catch (innerError) {
              console.error(
                `Error processing professional ${person._id}:`,
                innerError
              );
            }

            return {
              ...person,

              currentlyWorking,

              previouslyWorked,

              referralMetrics:
                metrics,

              referralJobs,

              isHiring:
                referralJobs.length >
                0,
            };
          }
        )
      );

    // =====================================================
    // STEP 11: RESPONSE
    // =====================================================

    const pagination =
      paginatedResponse(
        alumniWithMetrics,
        total,
        {
          page,
          limit,
        }
      );

    return res.status(200).json({
      success: true,

      errorCode: null,

      message:
        "Professionals fetched successfully.",

      company,

      collegesChecked:
        colleges,

      companiesChecked:
        uniqueCompanies,

      ...pagination,
    });

  } catch (error) {
    console.error(
      "Error fetching alumni who can help:",
      error
    );

    return res.status(500).json({
      success: false,

      errorCode:
        "INTERNAL_SERVER_ERROR",

      message:
        "Something went wrong. Please try again later.",

      data: null,
    });
  }
};
// export const getAlumniWhoCanHelp = async (req, res) => {
//   const debugId = `[getAlumniPostedJobs-${Date.now()}]`;

//   try {
//     console.log(`\n${debugId} ========== REQUEST START ==========`);
//     console.log(`${debugId} Timestamp:`, new Date().toISOString());
//     console.log(`${debugId} Method:`, req.method);
//     console.log(`${debugId} URL:`, req.originalUrl);
//     console.log(`${debugId} Headers:`, JSON.stringify(req.headers, null, 2));
//     console.log(`${debugId} Cookies:`, JSON.stringify(req.cookies, null, 2));
//     console.log(`${debugId} Params:`, JSON.stringify(req.params, null, 2));
//     console.log(`${debugId} Query:`, JSON.stringify(req.query, null, 2));
//     console.log(`${debugId} req.user:`, JSON.stringify(req.user, null, 2));

//     const userId = req.user?._id;
//     const { company } = req.params;

//     console.log(`${debugId} Parsed userId:`, userId);
//     console.log(`${debugId} Parsed company param:`, company);

//     if (!userId) {
//       console.log(`${debugId} ❌ userId missing from req.user`);
//       return res.status(401).json({
//         success: false,
//         errorCode: "USER_ID_MISSING",
//         message: "userId not found in token. Please re-login.",
//         debug: { reqUser: req.user },
//         data: null,
//       });
//     }

//     if (!company) {
//       console.log(`${debugId} ❌ company param is missing`);
//       return res.status(400).json({
//         success: false,
//         errorCode: "COMPANY_PARAM_MISSING",
//         message: "Company name is required in params.",
//         debug: { params: req.params },
//         data: null,
//       });
//     }

//     // Step 1: Find own profile
//     console.log(`${debugId} 🔍 Step 1: Finding profile for userId:`, userId);
//     const myProfile = await Onboarding.findOne({ userId });
//     console.log(`${debugId} myProfile found:`, myProfile ? "YES" : "NO");

//     if (!myProfile) {
//       console.log(`${debugId} ❌ No profile found for userId:`, userId);
//       return res.status(404).json({
//         success: false,
//         errorCode: "PROFILE_NOT_FOUND",
//         message: "Your profile does not exist. Please complete onboarding.",
//         debug: { userId: userId?.toString() },
//         data: null,
//       });
//     }

//     console.log(`${debugId} myProfile._id:`, myProfile._id);
//     console.log(`${debugId} myProfile.college:`, myProfile.college);
//     console.log(`${debugId} myProfile.profileType:`, myProfile.profileType);
//     console.log(`${debugId} myProfile.currentCompany:`, myProfile.currentCompany);

//     if (!myProfile?.college) {
//       console.log(`${debugId} ❌ College field is empty on profile`);
//       return res.status(404).json({
//         success: false,
//         errorCode: "COLLEGE_NOT_FOUND",
//         message: "College info not found in your profile.",
//         debug: {
//           profileId: myProfile._id?.toString(),
//           collegeValue: myProfile.college,
//         },
//         data: null,
//       });
//     }

//     // Step 2: Build regex and find alumni
//     const companyRegex = new RegExp(`^${company}$`, "i");
//     console.log(`${debugId} 🔍 Step 2: Querying alumni...`);
//     console.log(`${debugId} Query filter:`, JSON.stringify({
//       college: myProfile.college,
//       userId: { $ne: userId },
//       profileType: "professional",
//       currentCompany: companyRegex.toString(),
//     }, null, 2));

//     const alumni = await Onboarding.find({
//       college: myProfile.college,
//       userId: { $ne: userId },
//       profileType: "professional",
//       currentCompany: { $regex: companyRegex },
//     }).lean();

//     console.log(`${debugId} Alumni found:`, alumni.length);

//     if (alumni.length > 0) {
//       console.log(`${debugId} Sample alumni (first 3):`, JSON.stringify(
//         alumni.slice(0, 3).map(a => ({
//           _id: a._id,
//           name: a.name,
//           profileType: a.profileType,
//           currentCompany: a.currentCompany,
//           college: a.college,
//         })),
//         null, 2
//       ));
//     }

//     if (alumni.length === 0) {
//       console.log(`${debugId} ⚠️ No alumni found for company:`, company, "college:", myProfile.college);
//       return res.status(200).json({
//         success: true,
//         errorCode: null,
//         message: "No alumni found from your college at this company.",
//         debug: {
//           college: myProfile.college,
//           company,
//           companyRegex: companyRegex.toString(),
//         },
//         college: myProfile.college,
//         company,
//         count: 0,
//         alumni: [],
//       });
//     }

//     // Step 3: Fetch metrics for each alumni
//     console.log(`${debugId} 🔍 Step 3: Fetching metrics for ${alumni.length} alumni...`);

//     const alumniWithMetrics = await Promise.all(
//       alumni.map(async (person, index) => {
//         console.log(`${debugId} Processing alumni [${index + 1}/${alumni.length}] _id:`, person._id, "name:", person.name);

//         let metrics = null;
//         let referralJobs = [];

//         try {
//           [metrics, referralJobs] = await Promise.all([
//             fetchProfessionalReferralMetrics(person._id),
//             JobPostingTable.find({
//               candidatePosted: person._id,
//               jobType: "Referral",
//               approvalStatus: "Approved",
//               inactive: false,
//             }).sort({ createdAt: -1 }).lean(),
//           ]);

//           console.log(`${debugId} Alumni [${index + 1}] metrics:`, JSON.stringify(metrics));
//           console.log(`${debugId} Alumni [${index + 1}] referralJobs count:`, referralJobs.length);
//         } catch (innerError) {
//           console.error(`${debugId} ❌ Error processing alumni [${index + 1}] _id:`, person._id);
//           console.error(`${debugId} Inner error message:`, innerError.message);
//           console.error(`${debugId} Inner error stack:`, innerError.stack);
//         }

//         return {
//           ...person,
//           referralMetrics: metrics,
//           referralJobs,
//           isHiring: referralJobs.length > 0,
//         };
//       })
//     );

//     console.log(`${debugId} ✅ Step 3 complete. Processed ${alumniWithMetrics.length} alumni`);
//     console.log(`${debugId} isHiring breakdown:`, {
//       hiring: alumniWithMetrics.filter(p => p.isHiring).length,
//       notHiring: alumniWithMetrics.filter(p => !p.isHiring).length,
//     });
//     console.log(`${debugId} ✅ Sending success response`);
//     console.log(`${debugId} ========== REQUEST END ==========\n`);

//     return res.status(200).json({
//       success: true,
//       errorCode: null,
//       message: "Alumni fetched successfully.",
//       debug: {
//         college: myProfile.college,
//         company,
//         companyRegex: companyRegex.toString(),
//         totalAlumniFound: alumni.length,
//       },
//       college: myProfile.college,
//       company,
//       count: alumniWithMetrics.length,
//       alumni: alumniWithMetrics,
//     });

//   } catch (error) {
//     console.error(`${debugId} ❌ UNHANDLED ERROR`);
//     console.error(`${debugId} Message:`, error.message);
//     console.error(`${debugId} Stack:`, error.stack);
//     console.error(`${debugId} req.user:`, req.user);
//     console.error(`${debugId} req.params:`, req.params);

//     return res.status(500).json({
//       success: false,
//       errorCode: "INTERNAL_SERVER_ERROR",
//       message: "Something went wrong. Please try again later.",
//       debug: {
//         error: error.message,
//         stack: error.stack, // ⚠️ remove in production
//       },
//       data: null,
//     });
//   }
// };


 export const ProfileScore = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch the full profile based on the schema provided
    const profile = await Onboarding.findOne({ userId });

    if (!profile || !profile.jobRoles?.length) {
      return res.json({ 
        success: false, 
        message: "Profile or job roles not found. Please complete your onboarding." 
      });
    }

    // Prepare a summary of the user's background for the AI
    const userContext = {
      skills: profile.skills || [],
      education: {
        degree: profile.degree,
        specialization: profile.specialization,
        cgpa: profile.cgpa
      },
      experience: profile.experiences?.map(exp => ({
        role: exp.role,
        company: exp.company,
        description: exp.description
      })) || [],
      achievements: profile.achievements?.map(a => a.title) || [],
      projects: profile.projectsHandled || {},
      tools: profile.toolsAndPlatforms || []
    };

    // We use Promise.all to evaluate all job roles in parallel
    const scorePromises = profile.jobRoles.map(async (role) => {
      const prompt = `
        You are a senior technical recruiter and career coach.
        
        Candidate Target Role: ${role}
        
        Candidate Profile Summary:
        - Skills: ${userContext.skills.join(", ")}
        - Tools/Platforms: ${userContext.tools.join(", ")}
        - Education: ${userContext.education.degree} in ${userContext.education.specialization} (CGPA: ${userContext.education.cgpa})
        - Experience: ${userContext.experience.map(e => `${e.role} at ${e.company}`).join("; ")}
        - Notable Achievements: ${userContext.achievements.join(", ")}
        
        Task:
        1. Calculate a realistic readiness score (0-100) based on the target role.
        2. Identify the top 5 missing technical or soft skills.
        3. Provide 3 specific learning recommendations to bridge the gap.
        
        Return ONLY a JSON object exactly like this:
        {
          "role": "${role}",
          "readiness": number,
          "missing_skills": [],
          "learning_recommendations": []
        }
        
        DO NOT include markdown backticks or any other text.
      `;

      try {
        const response = await openai.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a realistic career evaluator. Output raw JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2, // Lower temperature for more consistent scoring
        });

        const rawText = response.choices[0].message.content;
        const cleanJsonText = rawText.replace(/```json|```/g, "").trim();
        
        return JSON.parse(cleanJsonText);
      } catch (e) {
        console.error(`Error scoring role ${role}:`, e);
        return {
          role,
          readiness: 0,
          missing_skills: ["Evaluation failed"],
          learning_recommendations: ["Please try again later"],
          error: true
        };
      }
    });

    const results = await Promise.all(scorePromises);

    res.json({ 
      success: true, 
      scores: results 
    });

  } catch (error) {
    console.error("Profile Score API Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getNewApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get professional's onboarding profile ID
    const myProfile = await Onboarding.findOne({ userId });
    if (!myProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const count = await Application.aggregate([
      {
        $match: {
          jobType: "Referral",
          isVisited: false,
          adminApprovalStatus: "Approved",
        },
      },
      {
        $lookup: {
          from: "jobpostingtables",
          localField: "job",
          foreignField: "_id",
          as: "jobData",
        },
      },
      { $unwind: "$jobData" },
      {
        $match: {
          "jobData.candidatePosted": new mongoose.Types.ObjectId(myProfile._id), 
        },
      },
      {
        $count: "newApplications",
      },
    ]);

    return res.status(200).json({
      success: true,
      newApplications: count[0]?.newApplications || 0,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get all alumni from the same college as the logged-in user


// export const getCollegeAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile?.college) {
//       return res.status(404).json({ success: false, message: "College info not found in your profile." });
//     }

//     const alumni = await Onboarding.find({
//       college: myProfile.college,
//       userId: { $ne: userId },
//       //profileType: "professional",
//     });
//     // No .select() — full profile returned

//     // Attach referral metrics to each alumni in parallel
//     const alumniWithMetrics = await Promise.all(
//       alumni.map(async (person) => {
//         const metrics = await fetchProfessionalReferralMetrics(person._id);
//         return {
//           ...person.toObject(),
//           referralMetrics: metrics,
//         };
//       })
//     );

//     return res.status(200).json({
//       success: true,
//       college: myProfile.college,
//       count: alumniWithMetrics.length,
//       alumni: alumniWithMetrics,
//     });
//   } catch (error) {
//     console.error("Error fetching college alumni:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };



// export const getCompanyAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile?.currentCompany) {
//       return res.status(404).json({ success: false, message: "Current company not found in your profile." });
//     }

//     const companyAlumni = await Onboarding.find({
//       currentCompany: { $regex: new RegExp(`^${myProfile.currentCompany}$`, "i") },
//       userId: { $ne: userId },
//     });
//     // No .select() — full profile returned

//     return res.status(200).json({
//       success: true,
//       company: myProfile.currentCompany,
//       count: companyAlumni.length,
//       companyAlumni,
//     });
//   } catch (error) {
//     console.error("Error fetching company alumni:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getCompanyAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile) {
//       return res.status(404).json({ success: false, message: "Profile not found." });
//     }

//     // Collect all companies user has worked at (including current)
//     const allCompanies = [];

//     if (myProfile.currentCompany) {
//       allCompanies.push(myProfile.currentCompany);
//     }

//     if (myProfile.experiences?.length > 0) {
//       myProfile.experiences.forEach((exp) => {
//         if (exp.company) allCompanies.push(exp.company);
//       });
//     }

//     if (allCompanies.length === 0) {
//       return res.status(404).json({ success: false, message: "No companies found in your profile." });
//     }

//     // Deduplicate case-insensitively
//     const uniqueCompanies = [...new Map(
//       allCompanies.map((c) => [c.toLowerCase(), c])
//     ).values()];

//     // Build $or conditions — one per company for both currentCompany and experiences.company
//     const orConditions = uniqueCompanies.flatMap((company) => {
//       const regex = new RegExp(`^${company}$`, "i");
//       return [
//         { currentCompany: regex },
//         { "experiences.company": regex },
//       ];
//     });

//     const companyAlumni = await Onboarding.find({
//       userId: { $ne: userId },
//       $or: orConditions,
//     });

//     // Group alumni by which shared company they belong to
//     const alumniByCompany = {};
//     uniqueCompanies.forEach((company) => {
//       const regex = new RegExp(`^${company}$`, "i");
//       alumniByCompany[company] = companyAlumni.filter(
//         (alumni) =>
//           (alumni.currentCompany && regex.test(alumni.currentCompany)) ||
//           alumni.experiences?.some((exp) => exp.company && regex.test(exp.company))
//       );
//     });

//     return res.status(200).json({
//       success: true,
//       companiesChecked: uniqueCompanies,
//       totalUniqueAlumni: companyAlumni.length,
//       alumniByCompany,
//     });
//   } catch (error) {
//     console.error("Error fetching company alumni:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getCollegeAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile?.college) {
//       return res.status(404).json({ success: false, message: "College info not found in your profile." });
//     }

//     // Find only professional alumni from the same college
//     const alumni = await Onboarding.find({
//       college: myProfile.college,
//       userId: { $ne: userId },
//       profileType: "professional", 
//     });

    
//     const alumniWithMetrics = await Promise.all(
//       alumni.map(async (person) => {
//         const [metrics, referralJobs] = await Promise.all([
//           fetchProfessionalReferralMetrics(person._id),
          // JobPostingTable.find({
//             candidatePosted: person._id, // only hiring
//             jobType: "Referral",
//             approvalStatus: "Approved",
//             inactive: false,
//             //jobStatus: "Open", 
//           })
//             .sort({ createdAt: -1 })
//             .lean(),
//         ]);

//         return {
//           ...person.toObject(),
//           referralMetrics: metrics,
//           referralJobs,
//           isHiring: referralJobs.length > 0,
//         };
//       })
//     );

//      // Keep only alumni who are actively hiring (have at least one open referral job)
//     const hiringAlumni = alumniWithMetrics.filter((person) => person.isHiring);

//     return res.status(200).json({
//       success: true,
//       college: myProfile.college,
//       count: hiringAlumni.length,
//       alumni: hiringAlumni,
//     });
//   } catch (error) {
//     console.error("Error fetching college alumni:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getCompanyAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile) {
//       return res.status(404).json({ success: false, message: "Profile not found." });
//     }

//     const allCompanies = [];

//     if (myProfile.currentCompany) {
//       allCompanies.push(myProfile.currentCompany);
//     }

//     if (myProfile.experiences?.length > 0) {
//       myProfile.experiences.forEach((exp) => {
//         if (exp.company) allCompanies.push(exp.company);
//       });
//     }

//     if (allCompanies.length === 0) {
//       return res.status(404).json({ success: false, message: "No companies found in your profile." });
//     }

//     const uniqueCompanies = [...new Map(
//       allCompanies.map((c) => [c.toLowerCase(), c])
//     ).values()];

//     // Flexible partial match for DB query
//     const orConditions = uniqueCompanies.flatMap((company) => {
//       const regex = new RegExp(company, "i");
//       return [
//         { currentCompany: regex },
//         { "experiences.company": regex },
//       ];
//     });

//     const companyAlumni = await Onboarding.find({
//       userId: { $ne: userId },
//       profileType: "professional",
//       $or: orConditions,
//     });

//     const alumniWithMetrics = await Promise.all(
//       companyAlumni.map(async (person) => {
//         const [metrics, referralJobs] = await Promise.all([
//           fetchProfessionalReferralMetrics(person._id),
//           JobPostingTable.find({
//             candidatePosted: person._id,
//             jobType: "Referral",
//             approvalStatus: "Approved",
//             inactive: false,
//             // jobStatus removed — Approved + inactive:false is sufficient
//           })
//             .sort({ createdAt: -1 })
//             .lean(),
//         ]);

//         return {
//           ...person.toObject(),
//           referralMetrics: metrics,
//           referralJobs,
//           isHiring: referralJobs.length > 0,
//         };
//       })
//     );

//     const hiringAlumni = alumniWithMetrics.filter((person) => person.isHiring);

//     // Fixed: use same flexible regex here too (no ^ and $ anchors)
//     const alumniByCompany = {};
//     uniqueCompanies.forEach((company) => {
//       const regex = new RegExp(company, "i"); 
//       const matched = hiringAlumni.filter(
//         (alumni) =>
//           (alumni.currentCompany && regex.test(alumni.currentCompany)) ||
//           alumni.experiences?.some((exp) => exp.company && regex.test(exp.company))
//       );

//       if (matched.length > 0) {
//         alumniByCompany[company] = matched;
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       companiesChecked: uniqueCompanies,
//       totalHiringAlumni: hiringAlumni.length,
//       alumniByCompany,
//     });
//   } catch (error) {
//     console.error("Error fetching company alumni:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getCollegeAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const jobPostedOnly = req.query.jobPostedOnly === "true";

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile) {
//       return res.status(404).json({
//         success: false,
//         errorCode: "PROFILE_NOT_FOUND",
//         message: "Your profile does not exist. Please complete onboarding.",
//         data: null,
//       });
//     }

//     if (!myProfile.college) {
//       return res.status(404).json({
//         success: false,
//         errorCode: "COLLEGE_NOT_FOUND",
//         message: "College info not found in your profile. Please update your profile.",
//         data: null,
//       });
//     }

//     const alumni = await Onboarding.find({
//       college: myProfile.college,
//       userId: { $ne: userId },
//     }).lean();

//     if (!alumni || alumni.length === 0) {
//       return res.status(200).json({
//         success: true,
//         errorCode: null,
//         message: "No alumni found from your college.",
//         college: myProfile.college,
//         jobPostedOnly,
//         count: 0,
//         alumni: [],
//       });
//     }

//     const alumniWithMetrics = await Promise.all(
//       alumni.map(async (person) => {
//         const [metrics, referralJobs] = await Promise.all([
//           fetchProfessionalReferralMetrics(person._id),
//           JobPostingTable.find({
//             candidatePosted: person._id,
//             jobType: "Referral",
//             approvalStatus: "Approved",
//             inactive: false,
//           })
//             .sort({ createdAt: -1 })
//             .lean(),
//         ]);

//         return {
//           _id: person._id,
//           userId: person.userId,
//           name: person.name ?? null,
//           email: person.email ?? null,
//           phone: person.phone ?? null,
//           profileImage: person.profileImage ?? null,
//           backgroundImage: person.backgroundImage ?? null,
//           college: person.college ?? null,
//           degree: person.degree ?? null,
//           specialization: person.specialization ?? null,
//           yearOfGraduation: person.yearOfGraduation ?? null,
//           currentCompany: person.currentCompany ?? null,
//           totalYearsOfExperience: person.totalYearsOfExperience ?? null,
//           jobRoles: person.jobRoles ?? [],
//           skills: person.skills ?? [],
//           linkedin: person.linkedin ?? null,
//           github: person.github ?? null,
//           portfolio: person.portfolio ?? null,
//           about: person.about ?? null,
//           referralMetrics: metrics ?? null,
//           referralJobs: referralJobs ?? [],
//           isHiring: referralJobs.length > 0,
//         };
//       })
//     );

//     const filteredAlumni = jobPostedOnly
//       ? alumniWithMetrics.filter((person) => person.isHiring)
//       : alumniWithMetrics;

//     if (jobPostedOnly && filteredAlumni.length === 0) {
//       return res.status(200).json({
//         success: true,
//         errorCode: null,
//         message: "No alumni from your college are currently hiring.",
//         college: myProfile.college,
//         jobPostedOnly,
//         count: 0,
//         alumni: [],
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       errorCode: null,
//       message: "Alumni fetched successfully.",
//       college: myProfile.college,
//       jobPostedOnly,
//       count: filteredAlumni.length,
//       alumni: filteredAlumni,
//     });

//   } catch (error) {
//     console.error("Error fetching college alumni:", error);
//     return res.status(500).json({
//       success: false,
//       errorCode: "INTERNAL_SERVER_ERROR",
//       message: "Something went wrong. Please try again later.",
//       data: null,
//     });
//   }
// };


export const getCollegeAlumni = async (req, res) => {
  const debugId = `[getCollegeAlumni-${Date.now()}]`;

  try {
    // console.log(`\n${debugId} ========== REQUEST START ==========`);
    // console.log(`${debugId} Timestamp:`, new Date().toISOString());
    // console.log(`${debugId} Method:`, req.method);
    // console.log(`${debugId} URL:`, req.originalUrl);
    // console.log(`${debugId} Headers:`, JSON.stringify(req.headers, null, 2));
    // console.log(`${debugId} Cookies:`, JSON.stringify(req.cookies, null, 2));
    // console.log(`${debugId} Query Params:`, JSON.stringify(req.query, null, 2));
    // console.log(`${debugId} req.user:`, JSON.stringify(req.user, null, 2));

    const userId = req.user?._id;
    const jobPostedOnly = req.query.jobPostedOnly === "true";
    const { page, limit, skip } = req.pagination;
    // console.log(`${debugId} Parsed userId:`, userId);
    // console.log(`${debugId} jobPostedOnly raw value:`, req.query.jobPostedOnly);
    // console.log(`${debugId} jobPostedOnly parsed:`, jobPostedOnly);

    if (!userId) {
      console.log(`${debugId} ❌ userId is missing from req.user`);

      return res.status(401).json({
        success: false,
        errorCode: "USER_ID_MISSING",
        message: "userId not found in token. Please re-login.",
        debug: { reqUser: req.user },
        data: null,
      });
    }

    // Step 1: Find own profile

    // console.log(
    //   `${debugId} 🔍 Step 1: Finding own profile for userId:`,
    //   userId
    // );

    const myProfile = await Onboarding.findOne({ userId });

    // console.log(
    //   `${debugId} myProfile found:`,
    //   myProfile ? "YES" : "NO"
    // );

    if (!myProfile) {
      // console.log(
      //   `${debugId} ❌ Profile not found for userId:`,
      //   userId
      // );

      return res.status(404).json({
        success: false,
        errorCode: "PROFILE_NOT_FOUND",
        message:
          "Your profile does not exist. Please complete onboarding.",
        debug: {
          userId: userId?.toString(),
        },
        data: null,
      });
    }

    // =========================
    // NEW EDUCATION LOGIC
    // =========================

    const collegeQuery =
      buildCollegeAlumniQuery(
        myProfile,
        userId
      );

    const colleges = [
      ...new Set(
        (myProfile.educations || [])
          .map(
            (edu) =>
              edu.college_canonical_id ||
              edu.college
          )
          .filter(Boolean)
      ),
    ];

    // console.log(`${debugId} myProfile._id:`, myProfile._id);
    // console.log(`${debugId} myProfile.colleges:`, colleges);
    // console.log(
    //   `${debugId} myProfile.profileType:`,
    //   myProfile.profileType
    // );

    if (!collegeQuery) {
      // console.log(
      //   `${debugId} ❌ College field is empty on profile`
      // );

      return res.status(404).json({
        success: false,
        errorCode: "COLLEGE_NOT_FOUND",
        message:
          "College info not found in your profile. Please update your profile.",
        debug: {
          profileId: myProfile._id?.toString(),
          collegeValue: colleges,
        },
        data: null,
      });
    }

    // Step 2: Find alumni

    // console.log(
    //   `${debugId} 🔍 Step 2: Finding alumni for colleges:`,
    //   colleges
    // );

    const alumniQuery = collegeQuery;

    const [alumni, total] = await Promise.all([
      Onboarding.find(alumniQuery)
        .skip(skip)
        .limit(limit)
        .lean(),

      Onboarding.countDocuments(alumniQuery),
    ]);

    //console.log(`${debugId} Total alumni found:`, alumni.length);

    if (!alumni || alumni.length === 0) {
      // console.log(
      //   `${debugId} ⚠️ No alumni found for colleges:`,
      //   colleges
      // );

      return res.status(200).json({
        success: true,
        errorCode: null,
        message: "No alumni found from your college.",
        debug: {
          colleges,
          jobPostedOnly,
        },
        colleges,
        jobPostedOnly,
        count: 0,
        alumni: [],
      });
    }

    // Step 3: Fetch metrics and jobs for each alumni

    // console.log(
    //   `${debugId} 🔍 Step 3: Fetching metrics and referral jobs for ${alumni.length} alumni...`
    // );

    const alumniWithMetrics = await Promise.all(
      alumni.map(async (person, index) => {
        console.log(
          `${debugId} Processing alumni [${index + 1}/${alumni.length}] _id:`,
          person._id,
          "name:",
          person.name
        );

        let metrics = null;
        let referralJobs = [];

        try {
          [metrics, referralJobs] = await Promise.all([
            fetchProfessionalReferralMetrics(person._id),

            JobPostingTable.find({
              candidatePosted: person._id,
              jobType: "Referral",
              approvalStatus: "Approved",
              isAskForReferral: { $ne: true },
              inactive: false,
            })
              .sort({ createdAt: -1 })
              .lean(),
          ]);

          // console.log(
          //   `${debugId} Alumni [${index + 1}] metrics:`,
          //   JSON.stringify(metrics)
          // );

          // console.log(
          //   `${debugId} Alumni [${index + 1}] referralJobs count:`,
          //   referralJobs.length
          // );
        } catch (innerError) {
          console.error(
            `${debugId} ❌ Error processing alumni [${index + 1}] _id:`,
            person._id
          );

          console.error(
            `${debugId} Error:`,
            innerError.message
          );

          console.error(
            `${debugId} Stack:`,
            innerError.stack
          );
        }

        return {
          _id: person._id,

          userId: person.userId,

          name: person.name ?? null,

          email: person.email ?? null,

          phone: person.phone ?? null,

          profileImage: person.profileImage ?? null,

          backgroundImage: person.backgroundImage ?? null,

          // =========================
          // EDUCATION MAPPING
          // =========================

          colleges:
            person.educations
              ?.map((edu) => edu.college)
              .filter(Boolean) || [],

          // degrees:
          //   person.educations
          //     ?.map((edu) => edu.degree)
          //     .filter(Boolean) || [],

          // specializations:
          //   person.educations
          //     ?.map((edu) => edu.specialization)
          //     .filter(Boolean) || [],

          // yearOfGraduation:
          //   person.educations
          //     ?.map((edu) => edu.yearOfGraduation)
          //     .filter(Boolean) || [],

          educations: person.educations ?? [],

          currentCompany: person.currentCompany ?? null,

          totalYearsOfExperience:
            person.totalYearsOfExperience ?? null,

          experiences: person.experiences ?? [],

          jobRoles: person.jobRoles ?? [],

          // skills: person.skills ?? [],

          linkedin: person.linkedin ?? null,

          github: person.github ?? null,

          portfolio: person.portfolio ?? null,

          about: person.about ?? null,

          referralMetrics: metrics ?? null,

          referralJobs: referralJobs ?? [],

          isHiring: referralJobs.length > 0,
        };
      })
    );

    // console.log(
    //   `${debugId} ✅ Step 3 complete. Processed ${alumniWithMetrics.length} alumni`
    // );

    // // Step 4: Apply jobPostedOnly filter

    // console.log(
    //   `${debugId} 🔍 Step 4: Applying jobPostedOnly filter:`,
    //   jobPostedOnly
    // );

    const filteredAlumni = jobPostedOnly
      ? alumniWithMetrics.filter((person) => person.isHiring)
      : alumniWithMetrics;

    // console.log(
    //   `${debugId} After filter - alumni count:`,
    //   filteredAlumni.length
    // );

    // console.log(`${debugId} isHiring breakdown:`, {
    //   hiring: alumniWithMetrics.filter((p) => p.isHiring).length,
    //   notHiring: alumniWithMetrics.filter((p) => !p.isHiring)
    //     .length,
    // });

    if (jobPostedOnly && filteredAlumni.length === 0) {
      // console.log(
      //   `${debugId} ⚠️ jobPostedOnly=true but no alumni are hiring`
      // );

      return res.status(200).json({
        success: true,
        errorCode: null,
        message:
          "No alumni from your college are currently hiring.",
        debug: {
          colleges,
          totalAlumniFound: alumni.length,
          jobPostedOnly,
        },
        colleges,
        jobPostedOnly,
        count: 0,
        alumni: [],
      });
    }

    // console.log(
    //   `${debugId} ✅ Sending success response with ${filteredAlumni.length} alumni`
    // );

    // console.log(
    //   `${debugId} ========== REQUEST END ==========\n`
    // );

  const pagination = paginatedResponse(
    filteredAlumni,
    total,
    { page, limit }
  );

  return res.status(200).json({
    success: true,
    errorCode: null,
    message: "Alumni fetched successfully.",

    debug: {
      colleges,
      totalAlumniFound: total,
      afterFilter: filteredAlumni.length,
      jobPostedOnly,
      page,
      limit,
    },

    colleges,

    jobPostedOnly,

    ...pagination,
  });

  } catch (error) {
    console.error(`${debugId} ❌ UNHANDLED ERROR`);

    console.error(`${debugId} Message:`, error.message);

    console.error(`${debugId} Stack:`, error.stack);

    console.error(`${debugId} req.user:`, req.user);

    console.error(`${debugId} req.query:`, req.query);

    return res.status(500).json({
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message:
        "Something went wrong. Please try again later.",

      debug: {
        error: error.message,
        stack: error.stack,
      },

      data: null,
    });
  }
};

export const getCompanyAlumni = async (req, res) => {
  try {
    const userId = req.user?._id;
    const jobPostedOnly = req.query.jobPostedOnly === "true";

    const { page, limit, skip } = req.pagination;

    if (!userId) {
      return res.status(401).json({
        success: false,
        errorCode: "USER_ID_MISSING",
        message: "userId not found in token. Please re-login.",
        data: null,
      });
    }

    // Step 1: Find own profile
    const myProfile = await Onboarding.findOne({ userId });

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        errorCode: "PROFILE_NOT_FOUND",
        message: "Your profile does not exist. Please complete onboarding.",
        data: null,
      });
    }

    const companyQuery =
      buildCompanyAlumniQuery(
        myProfile,
        userId
      );

    const uniqueCompanies = [
      ...new Set([
        myProfile.currentCompany_canonical_id ||
          myProfile.currentCompany,

        ...(myProfile.experiences || [])
          .map(
            (exp) =>
              exp.company_canonical_id ||
              exp.company
          ),
      ].filter(Boolean)),
    ];

    if (!companyQuery) {
      return res.status(404).json({
        success: false,
        errorCode: "NO_COMPANIES_FOUND",
        message:
          "No company info found in your profile. Please update your work experience.",
        data: null,
      });
    }
    // Step 4: Find alumni with pagination
    const companyAlumniQuery = 
      companyQuery;

    const [companyAlumni, total] = await Promise.all([
      Onboarding.find(companyAlumniQuery)
        .skip(skip)
        .limit(limit)
        .lean(),

      Onboarding.countDocuments(companyAlumniQuery),
    ]);

    if (!companyAlumni || companyAlumni.length === 0) {
      return res.status(200).json({
        success: true,
        errorCode: null,
        message: "No alumni found from your companies.",
        companiesChecked: uniqueCompanies,
        jobPostedOnly,
        alumniByCompany: {},

        ...paginatedResponse([], 0, {
          page,
          limit,
        }),
      });
    }

    // Step 5: Fetch metrics and jobs for each alumni
    const alumniWithMetrics = await Promise.all(
      companyAlumni.map(async (person) => {
        let metrics = null;
        let referralJobs = [];

        try {
          [metrics, referralJobs] = await Promise.all([
            fetchProfessionalReferralMetrics(person._id),

            JobPostingTable.find({
              candidatePosted: person._id,
              jobType: "Referral",
              approvalStatus: "Approved",
              inactive: false,
              isAskForReferral: { $ne: true },
            })
              .sort({ createdAt: -1 })
              .lean(),
          ]);
        } catch (innerError) {
          console.error(
            `Error processing alumni ${person._id}:`,
            innerError
          );
        }

        return {
          _id: person._id,

          userId: person.userId,

          name: person.name ?? null,

          email: person.email ?? null,

          phone: person.phone ?? null,

          profileImage: person.profileImage ?? null,

          backgroundImage: person.backgroundImage ?? null,

          college: person.college ?? null,

          // degree: person.degree ?? null,

          // specialization: person.specialization ?? null,

          // yearOfGraduation: person.yearOfGraduation ?? null,

          currentCompany: person.currentCompany ?? null,
          currentCompany_canonical_id:
            person.currentCompany_canonical_id ?? null,

          currentCompany_display:
            person.currentCompany_display ?? null,
          totalYearsOfExperience:
            person.totalYearsOfExperience ?? null,

          jobRoles: person.jobRoles ?? [],

          // skills: person.skills ?? [],

          linkedin: person.linkedin ?? null,

          github: person.github ?? null,

          educations: person.educations ?? [],

          portfolio: person.portfolio ?? null,

          about: person.about ?? null,

          experiences: person.experiences ?? [],

          referralMetrics: metrics ?? null,

          referralJobs: referralJobs ?? [],

          isHiring: referralJobs.length > 0,
        };
      })
    );

    // Step 6: Apply jobPostedOnly filter
    const filteredAlumni = jobPostedOnly
      ? alumniWithMetrics.filter(
          (person) => person.isHiring
        )
      : alumniWithMetrics;

    if (jobPostedOnly && filteredAlumni.length === 0) {
      return res.status(200).json({
        success: true,
        errorCode: null,
        message:
          "No alumni from your companies are currently hiring.",

        companiesChecked: uniqueCompanies,

        jobPostedOnly,

        alumniByCompany: {},

        ...paginatedResponse([], total, {
          page,
          limit,
        }),
      });
    }

    // Step 7: Group by company
    const alumniByCompany = {};

    uniqueCompanies.forEach(
      (canonicalCompany) => {

        const matched =
          filteredAlumni.filter(
            (alumni) => {

              if (
                alumni.currentCompany_canonical_id ===
                canonicalCompany
              ) {
                return true;
              }

              return (
                alumni.experiences?.some(
                  (exp) =>
                    exp.company_canonical_id ===
                    canonicalCompany
                ) || false
              );
            }
          );

        if (matched.length > 0) {
          alumniByCompany[
            canonicalCompany
          ] = matched;
        }
      }
    );

    const flattenedAlumni = Object.values(
      alumniByCompany
    ).flat();

    const pagination = paginatedResponse(
      flattenedAlumni,
      total,
      { page, limit }
    );

    return res.status(200).json({
      success: true,
      errorCode: null,
      message: "Alumni fetched successfully.",

      companiesChecked: uniqueCompanies,

      jobPostedOnly,

      alumniByCompany,

      ...pagination,
    });

  } catch (error) {
    console.error(
      "Error fetching company alumni:",
      error
    );

    return res.status(500).json({
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message:
        "Something went wrong. Please try again later.",

      data: null,
    });
  }
};

export const getAlumniHiringNetwork = async (req, res) => {
  try {
    const userId = req.user?._id;
    const jobPostedOnly =
      req.query.jobPostedOnly === "true";

    const { page, limit, skip } =
      req.pagination;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "userId not found in token. Please re-login.",
      });
    }

    // Step 1: Get current user profile

    const myProfile = await Onboarding.findOne({
      userId,
    });

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    // =====================================================
    // STEP 2: BUILD NORMALIZED QUERIES
    // =====================================================

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

    // For response/debugging
    const colleges = [
      ...new Set(
        (myProfile.educations || [])
          .map(
            (edu) =>
              edu.college_canonical_id ||
              edu.college
          )
          .filter(Boolean)
      ),
    ];

    const uniqueCompanies = [
      ...new Set([
        myProfile.currentCompany_canonical_id ||
          myProfile.currentCompany,

        ...(myProfile.experiences || [])
          .map(
            (exp) =>
              exp.company_canonical_id ||
              exp.company
          ),
      ].filter(Boolean)),
    ];
    // =====================================================
    // STEP 4: FETCH ALL MATCHING ALUMNI
    // =====================================================

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


    // =====================================================
    // STEP 7: FETCH METRICS + JOBS
    // =====================================================

    const alumniWithMetrics =
      await Promise.all(
        uniqueAlumni.map(
          async (person) => {
            let metrics = null;

            let referralJobs = [];

            try {
              [metrics, referralJobs] =
                await Promise.all([
                  fetchProfessionalReferralMetrics(
                    person._id
                  ),

                  JobPostingTable.find({
                    candidatePosted:
                      person._id,

                    jobType: "Referral",
                    isAskForReferral: { $ne: true },
                    approvalStatus:
                      "Approved",

                    inactive: false,
                  })
                    .sort({
                      createdAt: -1,
                    })
                    .lean(),
                ]);
            } catch (err) {
              console.error(
                `Error processing alumni ${person._id}:`,
                err
              );
            }

            return {
              _id: person._id,

              userId: person.userId,

              name: person.name ?? null,

              email: person.email ?? null,

              phone: person.phone ?? null,

              profileImage:
                person.profileImage ??
                null,

              backgroundImage:
                person.backgroundImage ??
                null,

              colleges:
                person.educations
                  ?.map(
                    (edu) => edu.college
                  )
                  .filter(Boolean) || [],

              // degrees:
              //   person.educations
              //     ?.map(
              //       (edu) => edu.degree
              //     )
              //     .filter(Boolean) || [],

              // specializations:
              //   person.educations
              //     ?.map(
              //       (edu) =>
              //         edu.specialization
              //     )
              //     .filter(Boolean) || [],

              // yearOfGraduation:
              //   person.educations
              //     ?.map(
              //       (edu) =>
              //         edu.yearOfGraduation
              //     )
              //     .filter(Boolean) || [],
              locations : person.locations ?? [],
              educations:
                person.educations ??
                [],

              currentCompany:
                person.currentCompany ??
                null,

              totalYearsOfExperience:
                person.totalYearsOfExperience ??
                null,

              jobRoles:
                person.jobRoles ?? [],

              // skills:
              //   person.skills ?? [],

              linkedin:
                person.linkedin ?? null,

              github:
                person.github ?? null,

              portfolio:
                person.portfolio ??
                null,

              about:
                person.about ?? null,

              experiences:
                person.experiences ??
                [],

              referralMetrics:
                metrics ?? null,

              referralJobs:
                referralJobs ?? [],

              isHiring:
                referralJobs.length > 0,
            };
          }
        )
      );

    // =====================================================
    // STEP 8: APPLY FILTER
    // =====================================================

    const filteredAlumni =
      jobPostedOnly
        ? alumniWithMetrics.filter(
            (person) => person.isHiring
          )
        : alumniWithMetrics;

    const total = filteredAlumni.length;

    const paginatedAlumni =
      filteredAlumni.slice(
        skip,
        skip + limit
      );

    // =====================================================
    // STEP 9: PAGINATION RESPONSE
    // =====================================================

    const pagination =
      paginatedResponse(
        paginatedAlumni,
        total,
        { page, limit }
      );
    // =====================================================
    // STEP 10: RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      message:
        "Combined alumni fetched successfully.",

      colleges,

      companiesChecked:
        uniqueCompanies,

      jobPostedOnly,

      ...pagination,
    });

  } catch (error) {
    console.error(
      "Error fetching combined alumni:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Something went wrong.",

      error: error.message,
    });
  }
};



// export const getCompanyAlumni = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const jobPostedOnly = req.query.jobPostedOnly === "true";

//     const myProfile = await Onboarding.findOne({ userId });
//     if (!myProfile) {
//       return res.status(404).json({
//         success: false,
//         errorCode: "PROFILE_NOT_FOUND",
//         message: "Your profile does not exist. Please complete onboarding.",
//         data: null,
//       });
//     }

//     const allCompanies = [];
//     if (myProfile.currentCompany) allCompanies.push(myProfile.currentCompany);
//     myProfile.experiences?.forEach((exp) => {
//       if (exp.company) allCompanies.push(exp.company);
//     });

//     if (allCompanies.length === 0) {
//       return res.status(404).json({
//         success: false,
//         errorCode: "NO_COMPANIES_FOUND",
//         message: "No company info found in your profile. Please update your work experience.",
//         data: null,
//       });
//     }

//     const uniqueCompanies = [...new Map(
//       allCompanies.map((c) => [c.toLowerCase(), c])
//     ).values()];

//     const orConditions = uniqueCompanies.flatMap((company) => {
//       const regex = new RegExp(company, "i");
//       return [
//         { currentCompany: regex },
//         { "experiences.company": regex },
//       ];
//     });

//     const companyAlumni = await Onboarding.find({
//       userId: { $ne: userId },
//       profileType: "professional",
//       $or: orConditions,
//     }).lean();

//     if (!companyAlumni || companyAlumni.length === 0) {
//       return res.status(200).json({
//         success: true,
//         errorCode: null,
//         message: "No alumni found from your companies.",
//         companiesChecked: uniqueCompanies,
//         jobPostedOnly,
//         totalAlumni: 0,
//         alumniByCompany: {},
//       });
//     }

//     const alumniWithMetrics = await Promise.all(
//       companyAlumni.map(async (person) => {
//         const [metrics, referralJobs] = await Promise.all([
//           fetchProfessionalReferralMetrics(person._id),
//           JobPostingTable.find({
//             candidatePosted: person._id,
//             jobType: "Referral",
//             approvalStatus: "Approved",
//             inactive: false,
//           })
//             .sort({ createdAt: -1 })
//             .lean(),
//         ]);

//         return {
//           _id: person._id,
//           userId: person.userId,
//           name: person.name ?? null,
//           email: person.email ?? null,
//           phone: person.phone ?? null,
//           profileImage: person.profileImage ?? null,
//           backgroundImage: person.backgroundImage ?? null,
//           college: person.college ?? null,
//           degree: person.degree ?? null,
//           specialization: person.specialization ?? null,
//           yearOfGraduation: person.yearOfGraduation ?? null,
//           currentCompany: person.currentCompany ?? null,
//           totalYearsOfExperience: person.totalYearsOfExperience ?? null,
//           jobRoles: person.jobRoles ?? [],
//           skills: person.skills ?? [],
//           linkedin: person.linkedin ?? null,
//           github: person.github ?? null,
//           portfolio: person.portfolio ?? null,
//           about: person.about ?? null,
//           referralMetrics: metrics ?? null,
//           referralJobs: referralJobs ?? [],
//           isHiring: referralJobs.length > 0,
//         };
//       })
//     );

//     const filteredAlumni = jobPostedOnly
//       ? alumniWithMetrics.filter((person) => person.isHiring)
//       : alumniWithMetrics;

//     if (jobPostedOnly && filteredAlumni.length === 0) {
//       return res.status(200).json({
//         success: true,
//         errorCode: null,
//         message: "No alumni from your companies are currently hiring.",
//         companiesChecked: uniqueCompanies,
//         jobPostedOnly,
//         totalAlumni: 0,
//         alumniByCompany: {},
//       });
//     }

//     const alumniByCompany = {};
//     uniqueCompanies.forEach((company) => {
//       const regex = new RegExp(company, "i");
//       const matched = filteredAlumni.filter(
//         (alumni) =>
//           (alumni.currentCompany && regex.test(alumni.currentCompany)) ||
//           alumni.experiences?.some((exp) => exp.company && regex.test(exp.company))
//       );
//       if (matched.length > 0) {
//         alumniByCompany[company] = matched;
//       }
//     });

//     return res.status(200).json({
//       success: true,
//       errorCode: null,
//       message: "Alumni fetched successfully.",
//       companiesChecked: uniqueCompanies,
//       jobPostedOnly,
//       totalAlumni: filteredAlumni.length,
//       alumniByCompany,
//     });

//   } catch (error) {
//     console.error("Error fetching company alumni:", error);
//     return res.status(500).json({
//       success: false,
//       errorCode: "INTERNAL_SERVER_ERROR",
//       message: "Something went wrong. Please try again later.",
//       data: null,
//     });
//   }
// };

export const getNewUser = async (req, res) => {
  try {
    const counts = await Onboarding.aggregate([
      {
        $match: {
          profileType: { $in: ["student", "fresher", "professional"] },
        },
      },
      {
        $group: {
          _id: "$profileType",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { student: 0, fresher: 0, professional: 0, total: 0 };

    counts.forEach(({ _id, count }) => {
      if (_id in result) {
        result[_id] = count;
        result.total += count;
      }
    });

    return res.status(200).json({
      success: true,
      newUsers: result,
    });
  } catch (error) {
    console.error("getNewUser error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check alumni network using company career page URL
 * POST /api/company/check-alumni-by-url
 * Body: { "companyCareerPageUrl": "https://careers.zomato.com" }
 */
/**
 * Check alumni network using company career page URL
 * POST /api/company/check-alumni-by-url
 * Body: { "companyCareerPageUrl": "https://careers.zomato.com" }
 */
/**
 * Check alumni network using company career page URL
 * POST /api/company/check-alumni-by-url
 * Body: { "companyCareerPageUrl": "https://careers.zomato.com" }
 */
export const checkAlumniByCareerPageUrl = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { companyCareerPageUrl } = req.body;

    const page = Number(req.pagination?.page) || 1;
    const limit = Number(req.pagination?.limit) || 10;
    const skip = Number(req.pagination?.skip) || (page - 1) * limit;

    if (!userId) {
      return res.status(401).json({
        success: false,
        errorCode: "USER_ID_MISSING",
        message: "userId not found in token. Please re-login.",
        data: null,
      });
    }

    if (!companyCareerPageUrl) {
      return res.status(400).json({
        success: false,
        errorCode: "CAREER_URL_REQUIRED",
        message: "companyCareerPageUrl is required in request body.",
        data: null,
      });
    }

    const extractedCompanyName = extractCompanyNameFromUrl(companyCareerPageUrl);

    if (!extractedCompanyName) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_CAREER_URL",
        message: "Could not extract company name from the provided URL.",
        data: null,
      });
    }

    const myProfile = await Onboarding.findOne({ userId }).lean();

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        errorCode: "PROFILE_NOT_FOUND",
        message: "Your profile does not exist. Please complete onboarding.",
        data: null,
      });
    }

    const escapedCompanyName = escapeRegex(extractedCompanyName);
    const companyRegex = new RegExp(escapedCompanyName, "i");

    const allEmployeesQuery = {
      userId: { $ne: userId },
      $or: [
        { currentCompany: companyRegex },
        { "experiences.company": companyRegex },
        { "experiences.company_display": companyRegex },
        { "experiences.company_canonical_id": companyRegex },
      ],
    };

    const allEmployees = await Onboarding.find(allEmployeesQuery).lean();

    const alumniUsers = [];
    const currentEmployees = [];

    for (const person of allEmployees) {
      const experiences = Array.isArray(person.experiences)
        ? person.experiences
        : [];

      const currentCompanyMatched =
        person.currentCompany && companyRegex.test(person.currentCompany);

      const currentExperienceMatched = experiences.some((exp) => {
        const companyMatched =
          (exp.company && companyRegex.test(exp.company)) ||
          (exp.company_display && companyRegex.test(exp.company_display)) ||
          (exp.company_canonical_id &&
            companyRegex.test(exp.company_canonical_id));

        if (!companyMatched) return false;

        return exp.isCurrent === true || !exp.endDate;
      });

      const pastExperienceMatched = experiences.some((exp) => {
        const companyMatched =
          (exp.company && companyRegex.test(exp.company)) ||
          (exp.company_display && companyRegex.test(exp.company_display)) ||
          (exp.company_canonical_id &&
            companyRegex.test(exp.company_canonical_id));

        if (!companyMatched) return false;

        return exp.isCurrent === false || Boolean(exp.endDate);
      });

      const isCurrentEmployee =
        Boolean(currentCompanyMatched) || Boolean(currentExperienceMatched);

      const isAlumni = Boolean(pastExperienceMatched) && !isCurrentEmployee;

      if (isAlumni) {
        alumniUsers.push(person);
      } else if (isCurrentEmployee) {
        currentEmployees.push(person);
      }
    }

    const uniqueUsersMap = new Map();

    for (const user of [...alumniUsers, ...currentEmployees]) {
      uniqueUsersMap.set(String(user._id), user);
    }

    const finalUsers = Array.from(uniqueUsersMap.values());

    let message = "";

    if (alumniUsers.length > 0 && currentEmployees.length > 0) {
      message = `Alumni and current employees from ${extractedCompanyName} fetched successfully.`;
    } else if (alumniUsers.length > 0) {
      message = `Alumni from ${extractedCompanyName} fetched successfully.`;
    } else if (currentEmployees.length > 0) {
      message = `No alumni found for ${extractedCompanyName}. Showing current employees for broadcast.`;
    } else {
      return res.status(200).json({
        success: true,
        errorCode: null,
        message: `No employees found for ${extractedCompanyName}.`,
        companyCareerPageUrl,
        companiesChecked: [extractedCompanyName],
        alumniByCompany: {},
        data: [],
        broadcastCandidates: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    const paginatedUsers = finalUsers.slice(skip, skip + limit);

    const usersWithDetails = await Promise.all(
      paginatedUsers.map(async (person) => {
        let metrics = null;
        let referralJobs = [];

        try {
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
        } catch (innerError) {
          console.error(`Error processing user ${person._id}:`, innerError);
        }

        const isCurrentEmployee =
          currentEmployees.some(
            (employee) => String(employee._id) === String(person._id),
          );

        const isAlumni =
          alumniUsers.some(
            (alumni) => String(alumni._id) === String(person._id),
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
          totalYearsOfExperience: person.totalYearsOfExperience ?? null,
          jobRoles: person.jobRoles ?? [],
          linkedin: person.linkedin ?? null,
          github: person.github ?? null,
          educations: person.educations ?? [],
          portfolio: person.portfolio ?? null,
          about: person.about ?? null,
          experiences: person.experiences ?? [],
          referralMetrics: metrics ?? null,
          referralJobs: referralJobs ?? [],
          isHiring: referralJobs.length > 0,

          // useful for frontend
          isAlumni,
          isCurrentEmployee,
          companyCareerPageUrl,
        };
      }),
    );

    const alumniByCompany = {
      [extractedCompanyName]: usersWithDetails,
    };

    const total = finalUsers.length;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      errorCode: null,
      message,
      companyCareerPageUrl,
      companiesChecked: [extractedCompanyName],
      jobPostedOnly: false,
      alumniByCompany,
      data: usersWithDetails,

      // Use this when no alumni exist and you want to broadcast to current employees.
      broadcastCandidates:
        alumniUsers.length === 0 ? usersWithDetails : [],

      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error checking alumni by career URL:", error);

    return res.status(500).json({
      success: false,
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
      data: null,
    });
  }
};


const escapeRegex = (value = "") => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


/**
 * Extract company name from career page URL
 */
function extractCompanyNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    let domain = urlObj.hostname.replace(/^www\./, "");

    // Remove common TLDs and extract company name
    const patterns = [
      /^(?:careers?|jobs?)\.(.+?)\./i, // careers.company.com
      /^(.+?)\.(?:careers?|jobs?)\./i, // company.careers.com
      /^(.+?)\./i, // company.com
    ];

    let companyName = "";

    for (const pattern of patterns) {
      const match = domain.match(pattern);
      if (match) {
        companyName = match[1];
        break;
      }
    }

    if (!companyName) {
      const parts = domain.split(".");
      companyName = parts[0];
    }

    // Clean and format
    companyName = companyName
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();

    return companyName || null;
  } catch (error) {
    console.error("Error extracting company name:", error);
    return null;
  }
}