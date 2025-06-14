const weights = {
    skills: 5,
    jobRole: 4,
    industry: 2,
    location: 2,
    experience: 3
};

export function calculateMatchScore(resumes, jobDescription) {
    // jobdesc -> jobtitle , skills, preferedloc, experience, 

    const relevantresume = resumes.map((resume) => {
        let score = 0;

        if (jobDescription.yearsOfExperience && resume.yearsOfExperience >= jobDescription.yearsOfExperience) score += weights.experience;

        const matchedLocation = jobDescription.preferredJobLocations.filter(location => resume.preferredJobLocations.includes(location));
        if (matchedLocation.length > 0) {
            score += (matchedLocation.length / jobDescription.preferredJobLocations.length) * weights.location;
        }

        const matchedSkills = jobDescription.skills.filter(skill => resume.skills.includes(skill));
        if (matchedSkills.length > 0) {
            score += (matchedSkills.length / jobDescription.skills.length) * weights.skills;
        }

        if (resume.interestedJobRoles.includes(jobDescription.jobTitle)) score += weights.jobRole;

        return { ...resume._doc, matchedscore: score };
    })

    return relevantresume.sort((a, b) => b.matchedscore - a.matchedscore);
}