import { fetchOpportunityService } from "../services/Job.service.js";
import { getStudentService } from "../services/Student.service.js";
import { WeightedFilter } from "../utility/weightedJobSearch.js";


// offcampus
export const findRelevantOpportunityById = async (req, res) => {
    const userId = req.params.id;

    if (!userId) return res.status(404).json({ error: "Student Id missing" });

    try {
        // student data
        const response = await getStudentService(userId);
        // console.log("student", response.data);
        const lookingFor = response.data.lookingFor; // "Full-Time"
        const interestedIndustryType = response.data.interestedIndustry;
        const jobPreference = response.data.jobPreference; // ["Software Developer"]
        const skills = response.data.skills; // ["Spring Boot", "React.js"]
        const preferedWorkModes = response.data.preferedWorkModes; // ["Remote"]
        const preferedLocations = response.data.preferredJobLocations; // ["Delhi", "Pune"]

        // console.log(lookingFor, "\n", interestedIndustryType, "\n", jobPreference, "\n", skills, "\n", preferedWorkModes, "\n", preferedLocations);

        const query = {};
        if (lookingFor) query.employementType = lookingFor;
        if (jobPreference && jobPreference.length > 0) query.title = { $in: jobPreference };
        if (preferedWorkModes && preferedWorkModes.length > 0) query.workMode = { $in: preferedWorkModes };
        query.openingFor = { $ne: "Oncampus" };
        query.jobType = { $ne: "Internship" };

        // console.log(query);

        const Jobs = await fetchOpportunityService(query);
        const preferedJobs = await WeightedFilter(Jobs.data, skills, interestedIndustryType, preferedLocations);

        res.status(200).json(preferedJobs);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const fetchOpportunitiesForCollegeStudent = async (req, res) => {
    const { collegeId } = req.params;

    if (!collegeId) return res.status(404).json({ msg: "College Id not found!" });

    // search opportunity where collegeId is in job database
    const query = {};
    query.openingFor = "Oncampus";
    query.allowedColleges = { $in: [collegeId] };

    try {
        const opportunities = await fetchOpportunityService(query);
        if (opportunities.success === true) return res.status(200).json(opportunities.data);
        return res.status(404).json({ msg: "No Opportunities!" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}