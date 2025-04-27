import StudentOverview from "../models/Student.js";
import { fetchOpportunityService } from "../services/Job.service.js";
import { WeightedFilter } from "../utility/weightedJobSearch.js";


// offcampus
export const findRelevantOpportunityById = async (req, res) => {
    const studentId = req.params.id;

    if (!studentId) return res.status(404).json({ error: "Student Id missing" });

    try {
        // student data
        const response = await StudentOverview.findById(studentId);

        const lookingFor = response.lookingFor; // "Full-Time"
        const interestedIndustryType = response.interestedIndustry;
        const jobPreference = response.jobPreference; // ["Software Developer"]
        const skills = response.skills; // ["Spring Boot", "React.js"]
        const preferedWorkModes = response.preferedWorkModes; // ["Remote"]
        const preferedLocations = response.preferredJobLocations; // ["Delhi", "Pune"]

        // console.log(lookingFor, "\n", interestedIndustryType, "\n", jobPreference, "\n", skills, "\n", preferedWorkModes, "\n", preferedLocations);

        const query = {};
        if (lookingFor) query.jobType = lookingFor;
        if (jobPreference && jobPreference.length > 0) query.title = { $in: jobPreference };
        if (preferedWorkModes && preferedWorkModes.length > 0) query.workMode = { $in: preferedWorkModes };
        query.openingFor = { $ne: "Oncampus" };

        const Jobs = await fetchOpportunityService(query);

        const preferedJobs = WeightedFilter(Jobs, skills, interestedIndustryType, preferedLocations);
        // console.log("preferedJob:", preferedJobs);
        res.status(200).json({ preferedJobs: preferedJobs });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const fetchOpportunitiesForCollegeStudent = async (req, res) => {
    const { collegeId } = req.body.collegeId
    const query = {};
    query.openingFor = "Oncampus";
    query.allowedColleges = { $in: [collegeId] };


    try {
        const opportunities = await fetchOpportunityService(query);
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}