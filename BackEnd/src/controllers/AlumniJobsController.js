import  Onboarding  from "../models/studentonboardingModel.js";
import {JobPostingTable}  from "../models/jobPostingsModel.js";
import OpenAI from "openai";
import Application from "../models/applicationModel.js";
import mongoose from "mongoose";
import { fetchProfessionalReferralMetrics } from "../services/adminService.js"; // adjust import path
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Ensure this is in your .env file
  baseURL: "https://api.groq.com/openai/v1", // This tells the SDK to talk to Groq
});


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

export const getAlumniPostedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { company } = req.params;

    if (!company) {
      return res.status(400).json({ message: "Company name is required in params." });
    }

    // 1. Get current user's college
    const myProfile = await Onboarding.findOne({ userId });
    if (!myProfile?.college) {
      return res.status(404).json({ message: "College info not found in your profile." });
    }

    // 2. Find professional alumni from same college working at the given company
    const alumni = await Onboarding.find({
      college: myProfile.college,
      userId: { $ne: userId },
      profileType: "professional",
      currentCompany: { $regex: new RegExp(`^${company}$`, "i") },
    }).lean();

    // 3. Attach referral metrics (responseRate, referralSuccessRate, etc.) to each alumni
    const alumniWithMetrics = await Promise.all(
      alumni.map(async (person) => {
        const metrics = await fetchProfessionalReferralMetrics(person._id);
        return {
          ...person,
          referralMetrics: metrics,
        };
      })
    );

    return res.status(200).json({
      success: true,
      college: myProfile.college,
      company,
      count: alumniWithMetrics.length,
      alumni: alumniWithMetrics,
    });

  } catch (error) {
    console.error("Error fetching alumni by company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
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


export const getCollegeAlumni = async (req, res) => {
  try {
    const userId = req.user._id;

    const myProfile = await Onboarding.findOne({ userId });
    if (!myProfile?.college) {
      return res.status(404).json({ success: false, message: "College info not found in your profile." });
    }

    const alumni = await Onboarding.find({
      college: myProfile.college,
      userId: { $ne: userId },
      //profileType: "professional",
    });
    // No .select() — full profile returned

    // Attach referral metrics to each alumni in parallel
    const alumniWithMetrics = await Promise.all(
      alumni.map(async (person) => {
        const metrics = await fetchProfessionalReferralMetrics(person._id);
        return {
          ...person.toObject(),
          referralMetrics: metrics,
        };
      })
    );

    return res.status(200).json({
      success: true,
      college: myProfile.college,
      count: alumniWithMetrics.length,
      alumni: alumniWithMetrics,
    });
  } catch (error) {
    console.error("Error fetching college alumni:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



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

export const getCompanyAlumni = async (req, res) => {
  try {
    const userId = req.user._id;

    const myProfile = await Onboarding.findOne({ userId });
    if (!myProfile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    // Collect all companies user has worked at (including current)
    const allCompanies = [];

    if (myProfile.currentCompany) {
      allCompanies.push(myProfile.currentCompany);
    }

    if (myProfile.experiences?.length > 0) {
      myProfile.experiences.forEach((exp) => {
        if (exp.company) allCompanies.push(exp.company);
      });
    }

    if (allCompanies.length === 0) {
      return res.status(404).json({ success: false, message: "No companies found in your profile." });
    }

    // Deduplicate case-insensitively
    const uniqueCompanies = [...new Map(
      allCompanies.map((c) => [c.toLowerCase(), c])
    ).values()];

    // Build $or conditions — one per company for both currentCompany and experiences.company
    const orConditions = uniqueCompanies.flatMap((company) => {
      const regex = new RegExp(`^${company}$`, "i");
      return [
        { currentCompany: regex },
        { "experiences.company": regex },
      ];
    });

    const companyAlumni = await Onboarding.find({
      userId: { $ne: userId },
      $or: orConditions,
    });

    // Group alumni by which shared company they belong to
    const alumniByCompany = {};
    uniqueCompanies.forEach((company) => {
      const regex = new RegExp(`^${company}$`, "i");
      alumniByCompany[company] = companyAlumni.filter(
        (alumni) =>
          (alumni.currentCompany && regex.test(alumni.currentCompany)) ||
          alumni.experiences?.some((exp) => exp.company && regex.test(exp.company))
      );
    });

    return res.status(200).json({
      success: true,
      companiesChecked: uniqueCompanies,
      totalUniqueAlumni: companyAlumni.length,
      alumniByCompany,
    });
  } catch (error) {
    console.error("Error fetching company alumni:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
