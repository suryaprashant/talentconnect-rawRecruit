import Job from "../models/Job.js";
import StudentOverview from "../models/Student.js";

// job filter and scoring algo
const weights = {
    industryType: 1,
    skills: 4,
    location: 1
}

const WeightedFilter = (PreferedJobs, skills, interestedIndustryType, preferedLocations) => {
    const scoredJobs = PreferedJobs.map(job => {
        let score = 0;

        if (interestedIndustryType.includes(job.industryType)) score += weights.industryType;
        if (preferedLocations.includes(job.location)) score += weights.location;

        const matchedSkills = job.skillsRequired.filter(skill => skills.includes(skill));
        if (matchedSkills.length > 0) {
            score += (matchedSkills.length / job.skillsRequired.length) * weights.skills;
        }

        return { ...job._doc, matchedscore: score };
    })

    // sort jobs in decreasing order of matching preference
    return scoredJobs.sort((a, b) => b.matchedscore - a.matchedscore);
}


// offcampus
export const findRelevantOpportunityById = async (req, res) => {
    const studentId = req.query;

    if (!studentId) return res.status(404).json({ error: "Student Id missing" });

    try {
        // student record fetched here
        const response = await StudentOverview.findbyId(studentId);

        const lookingFor = response.lookingFor; // "Full-Time"
        const interestedIndustryType = response.interestedIndustryType;
        const jobPreference = response.jobPreference; // ["Software Developer"]
        const skills = response.skills; // ["Spring Boot", "React.js",]
        const preferedWorkModes = response.preferedWorkModes; // ["Remote"]
        const preferedLocations = response.preferedLocations; // ["Delhi", "Pune"]
        
        const Jobs = await Job.find({
            jobType: lookingFor,
            title: { $in: jobPreference }, // later to be removed to advance matching keyword search algo
            workMode: { $in: preferedWorkModes },
        });

        const preferedJobs = WeightedFilter(Jobs, skills, interestedIndustryType, preferedLocations);
        // console.log("preferedJob:", preferedJobs);
        res.status(200).json({ preferedJobs: preferedJobs });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ erorr: error.message });
    }
}