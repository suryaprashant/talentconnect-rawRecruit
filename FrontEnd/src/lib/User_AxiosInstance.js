import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_Backend_URL;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',

};

// default 10sec
axiosClient.defaults.timeout = 10000;
axiosClient.defaults.withCredentials = true;


// student dashboard
export function viewed(jobId) {
  return axiosClient.post(`/api/hiring-channels/view/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

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
export function ApplyForOppurtunity(jobId) {
  return axiosClient.post(`/application/candidate/offcampus`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForJobListingOppurtunity(jobId) {
  return axiosClient.post(`/application/candidate/joblisting`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForInternship(internshipId) {
  return axiosClient.post(`/application/candidate/internship`, { internshipId: internshipId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForReferral(referralId) {
  return axiosClient.post(`/application/candidate/referral`, { referralId: referralId })
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
  try {
    const response = await axios.get('/api/student/dashboard/metrics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProfessionalDashboardMetrics = async () => {
  try {
    const response = await axiosClient.get('/application/professional/metrics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Add these functions to your User_AxiosInstance.js file
export function getOffCampusJobDetail(jobId) {
  return axiosClient.get(`/api/student-dashboard/off-campus/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

export function ApplyForOffCampusJob(jobId) {
  return axiosClient.post(`/application/candidate/offcampus`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}


export const getReferralApplications = (jobId) => {
  return axiosClient.get(`/application/my-referral-applications`, {
    params: {
      jobId: jobId,
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
