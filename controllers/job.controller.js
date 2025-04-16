import Job from "../models/Job.js";

export async function createJob(req, res) {
    const {
        title,
        description,
        location,
        workMode,
        industryType,
        jobType,
        employementType,
        noOfOpenings,
        salaryPerMonth,
        minimumEducation,
        preferedFieldOfStudy,
        yearsOfExperience,
        skillsRequired,
        certificates,
        workAuthorizationRequired,
        companyPosted,
    } = req.body;

    try {
        const newJob = new Job({
            title,
            description,
            location,
            workMode,
            industryType,
            jobType,
            employementType,
            noOfOpenings,
            salaryPerMonth,
            minimumEducation,
            preferedFieldOfStudy,
            yearsOfExperience,
            skillsRequired,
            certificates,
            workAuthorizationRequired,
            companyPosted:companyPosted,
        });

        await newJob.save();
        res.status(201).json({ message: "Job Created" });
    } catch (error) {
        console.log("Error ", error.message);
        res.status(500).json({ Error: "Internal Server Error" });
    }
}