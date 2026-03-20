import  Onboarding  from "../models/studentonboardingModel.js";
import {JobPostingTable}  from "../models/jobPostingsModel.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY, // Ensure this is in your .env file
  baseURL: "https://api.groq.com/openai/v1", // This tells the SDK to talk to Groq
});

export const getAlumniPostedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get current student's college
    const myProfile = await Onboarding.findOne({ userId });

    if (!myProfile || !myProfile.college) {
      return res.status(404).json({ message: "College info not found in your profile." });
    }

    const myCollege = myProfile.college;

    // 2. Find jobs where the 'candidatePosted' alum is from the same college
    // We use populate to look into the Onboarding details of the poster
    const jobs = await JobPostingTable.find({
        jobType: "Referral",
        approvalStatus:"Approved",
      candidatePosted: { $exists: true, $ne: null }
    })
    .populate({
      path: 'candidatePosted',
      match: { college: myCollege }, // Only include posters from my college
      select: 'name college profileImage'
    })
    .sort({ createdAt: -1 });

    // 3. Filter out the nulls (jobs that didn't match the college filter in populate)
    // and exclude jobs posted by the user themselves
    const alumniJobs = jobs.filter(job => 
      job.candidatePosted !== null && 
      job.postedByUser?.toString() !== userId.toString()
    );

    res.status(200).json({
      success: true,
      college: myCollege,
      count: alumniJobs.length,
      jobs: alumniJobs
    });

  } catch (error) {
    console.error("Error fetching alumni jobs:", error);
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
