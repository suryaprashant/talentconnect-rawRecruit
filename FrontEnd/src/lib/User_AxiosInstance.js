import createAxiosClient from "./createAxiosClient";

const axiosClient = createAxiosClient();

// const publicAxios = axios.create({
//   baseURL: import.meta.env.VITE_Backend_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   }
// });
// student dashboard
export function viewed(jobId) {
  return axiosClient.post(`/api/hiring-channels/view/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

// Change this in User_AxiosInstance.js
export const deleteAccountApi = async (email, password) => {
  const response = await axiosClient.delete("/api/auth/delete", {
    data: { email, password } // DELETE requests need 'data' property in axios
  });
  return response.data;
};

export function getJobDetails(jobId) {
  return axiosClient.get(`/jobs/jobDetails/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

export function getJobLisingJobDetails(jobId) {
  return axiosClient.get(`/jobs/jobDetails/joblisting/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

export function getReferalJobDetails(jobId) {
  return axiosClient.get(`/jobs/jobDetails/referral/${jobId}`)
    .then(response => response)
    .catch(error => error);
}


export function getRelaventOffcampusOpportunity() {
  return axiosClient.get(`/api/student-dashboard/off-campus`)
    .then(response => response)
    .catch(error => error);
}

export function getRelaventJobListingOpportunity() {
  return axiosClient.get(`/api/student-dashboard/job-postings`)
    .then(response => response)
    .catch(error => error);
}

export function getAllInternship() {
  return axiosClient.get(`/api/student-dashboard/internship-postings`)
    .then(response => response)
    .catch(error => error);
}

// export function getInternshipDetail(Id) {
//   return axiosClient.get(`/internship/getInternshipDetail/${Id}`)
//     .then(response => response)
//     .catch(error => error);
// }

export function getInternshipDetail(Id) {
  return axiosClient.get(`/api/student-dashboard/getPoolCampusJob/${Id}`)
    .then(response => response)
    .catch(error => error);
}

export function getInternshipById(internshipId) {
  return axiosClient.get(`/api/student-dashboard/getInternshipDetail/${internshipId}`)
    .then(response => response)
    .catch(error => error);
}
export function getEventApplicationStatus() {
  return axiosClient.get(`/eventParticipation/byParticipent`)
    .then(response => response)
    .catch(error => error);
}


export function getHackathons() {
  return axiosClient.get(`/hackathon`)
    .then(response => response)
    .catch(error => error);
}
export function getWorkShops() {
  return axiosClient.get(`/workshop`)
    .then(response => response)
    .catch(error => error);
}
export function getCaseStudy() {
  return axiosClient.get(`/casestudy`)
    .then(response => response)
    .catch(error => error);
}

export function getHackathonDetail(hackathonId) {
  return axiosClient.get(`/hackathon/${hackathonId}`)
    .then(response => response)
    .catch(error => error);
}
export function getEventDetail(eventId, event_name) {
  return axiosClient.get(`/${event_name}/${eventId}`)
    .then(response => response)
    .catch(error => error);
}

// save opportunity
export function SaveOppurtunity(jobId, jobType) {
  return axiosClient.post(`/application/saveopportunity`, { jobId: jobId, jobType: jobType })
    .then(response => response)
    .catch(error => error);
}
// get save opportunity
export function fetchSavedJobs(applicantType) {
  return axiosClient.get(`/application/saveopportunity`)
    .then(response => response)
    .catch(error => error);
}

// application
export function ApplyForOppurtunity(jobId, matchScore) {
  return axiosClient.post(`/application/candidate/offcampus`, { jobId: jobId, matchScore: matchScore, })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForJobListingOppurtunity(jobId) {
  return axiosClient.post(`/application/candidate/joblisting`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForInternship(internshipId, matchScore) {
  return axiosClient.post(`/application/candidate/internship`, { internshipId: internshipId, matchScore: matchScore, })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForReferral(referralId, matchScore, referralCompany) {
  return axiosClient.post(`/application/candidate/referral`, { 
    referralId, 
    matchScore, 
    referralCompany   // added
  })
    .then(response => response)
    .catch(error => error);
}

// export function getJobListingApplicationStatus() {
//   return axiosClient.get(`/application/candidate/joblisting`)
//     .then(response => response)
//     .catch(error => error);
// }

export function getUserApplicationStatus(jobType) {
  return axiosClient.get(`/application/status/candidate/${jobType}`)
    .then(response => response)
    .catch(error => error);
}

// export function getInternshipApplicationStatus() {
//   return axiosClient.get(`/application/candidate/internship`)
//     .then(response => response)
//     .catch(error => error);
// }

export const postReferralJob = (jobData) => {
  return axiosClient.post('/api/hiring-channels/referral-posting', jobData)
    .then(response => response.data)
    .catch(error => {
      console.error("Error posting referral job:", error);
      throw error;
    });
}

export function getMyApprovedReferralpost(){
  return axiosClient.get('/api/student-dashboard/posted-referral-job')
  .then(response => response)
    .catch(error => console.log("Error:", error));
}
export const permanentDeleteReferralJob = async (jobId) => {
  const response = await axiosClient.delete(`/api/delete-job/${jobId}`);
  return response;
};

export function makeReferralJobInactive(jobId) {
  return axiosClient.patch(`/company/jobmanagement/referral/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error:", error));
}

export function getMyInactiveReferralpost() {
  return axiosClient.get('/api/student-dashboard/inactive-posted-referral-job')
    .then(response => response)
    .catch(error => console.log("Error:", error));
}

export function getReferralJobListing() {
  return axiosClient.get(`/api/student-dashboard/referral-jobs`)
    .then(response => response)
    .catch(error => console.log("Error:", error));
}

export function getReferralJobById(referralJob) {
  return axiosClient.get(`api/student-dashboard/referral-jobs/${referralJob}`)
    .then(response => response)
    .catch(error => error);
}



// Service request 
export function createCounsellingRequest(formData) {
  return axiosClient.post('/api/servicerequests/student/counselling', formData)
    .then(response => response)
    .catch(error => error);
}

export function createMockInterviewRequest(formData) {
  return axiosClient.post('/api/servicerequests/student/mock-interview', formData)
    .then(response => response)
    .catch(error => error);
}

export function requestPasswordReset(email) {
  return axiosClient.post('/api/auth/forgot-password', { email })
    .then(response => response)
    .catch(error => {
      console.error('Forgot password error:', error);
      throw error;
    });
}

export function validateResetToken(token) {
  return axiosClient.post('/api/auth/validate-reset-token', { token })
    .then(response => response)
    .catch(error => {
      console.error('Token validation error:', error);
      throw error;
    });
}

export function resetPassword(token, newPassword) {
  return axiosClient.post('/api/auth/reset-password', { token, newPassword })
    .then(response => response)
    .catch(error => {
      console.error('Reset password error:', error);
      throw error;
    });
}

export const getStudentDashboardMetrics = async () => {
  return axiosClient.get("/api/student/dashboard/metrics");
};

export const getProfessionalDashboardMetrics = async () => {
  return axiosClient.get("/application/professional/metrics");
};

// Add these functions to your User_AxiosInstance.js file
export function getOffCampusJobDetail(jobId) {
  return axiosClient.get(`/api/student-dashboard/off-campus/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

export function ApplyForOffCampusJob(jobId, matchScore) {
  return axiosClient.post(`/application/candidate/offcampus`, { jobId: jobId, matchScore: matchScore, })
    .then(response => response)
    .catch(error => error);
}


export const getReferralApplications = (jobId,isVisited) => {
  return axiosClient.get(`/application/my-referral-applications`, {
    params: {
      jobId: jobId,
      // isVisited:isVisited,
      adminApprovalStatus: 'Approved'
    }
  });
};

export const updateApplicationStatusApi = (applicationId, status) => {
  return axiosClient.patch(`/application/update-status/${applicationId}`, { status });
  // REMOVE .then/.catch here so the component handles the logic
};

export function scheduleInterviewByAdmin(payload) {
  return axiosClient.post("/api/admin/dashboard/admin/schedule-interview", {
    applicationId: payload.applicationId,
    jobId: payload.jobId,

    applicantProfileId: payload.applicantProfileId,
    applicantAuthId: payload.applicantAuthId,
    applicantType: payload.applicantType,

    applicantName: payload.applicantName,

    data: {
      date: payload.data.date,
      time: payload.data.time,
      meetLink: payload.data.meetLink,
      message: payload.data.message,
    },
  });
}

export function getMasterDataByType(type, parent = null) {
  return axiosClient.get("/api/master-data", {
    params: { type, parent },
  });
}

export function createMasterData(payload) {
  return axiosClient.post("/api/master-data", {
    type: payload.type,
    value: payload.value,
    parent: payload.parent || null, // for STREAM → DEGREE mapping
  });
}

// -------- Skills APIs --------

// Get all skills
export function getSkills() {
  return axiosClient.get('/api/meta/get-skills')
    .then(response => response)
    .catch(error => {
      console.error("Error fetching skills:", error);
      throw error;
    });
}

// Add new skill
export function addSkill(skill) {
  return axiosClient.post('/api/meta/add-skill', { skills: skill })
    .then(response => response)
    .catch(error => {
      console.error("Error adding skill:", error);
      throw error;
    });
}