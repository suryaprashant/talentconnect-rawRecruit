import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_Backend_URL;

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// default 10sec
axiosClient.defaults.timeout = 10000;
axiosClient.defaults.withCredentials = true;
export const getCompanyImageUrl = (companyId) => {
  // Make sure this matches your backend route exactly
  
  return axiosClient.get(`/api/companyDashboard/getInformation/${companyId}`)
  .then((response) => response)
    .catch((error) => error);
};
export function getRegisteredColleges() {
  return axiosClient
    .get(`/api/student-dashboard/on-campus`)
    .then((response) => response)
    .catch((error) => error);
}

export function getCollegeById(collegeId) {
  return axiosClient
    .get(`/api/college-details/${collegeId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function getCollegeDetail(collegeId) {
  return axiosClient
    .get(`/api/student-dashboard/on-campus/company/${collegeId}`)
    .then((response) => response)
    .catch((error) => error);
}

// accept
export function getAcceptedOffCampusCandidates(jobId) {
  return axiosClient
    .get(`/application/accept/${jobId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function getProfileByResume(searchParams) {
  return axiosClient
    .get("api/resumes/search", { params: searchParams })
    .then((response) => response.data)
    .catch((error) => console.log("Error: ", error));
}

export function createCompanyProfile(formData) {
  return axiosClient
    .post(`/company`, formData)
    .then((response) => response)
    .catch((error) => error);
}

export function getAcceptedCampus(companyId) {
  return axiosClient
    .get(`/college/application/${companyId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function acceptCollegeRequest(companyId, collegeId) {
  return axiosClient
    .post(`/college/application`, { companyId, collegeId })
    .then((response) => response)
    .catch((error) => error);
}

// internship
export function postInternship(payload) {
  return axiosClient
    .post(`/api/rawrecruit/createinternship`, payload)
    .then((response) => response)
    .catch((error) => error);
}

// jobmanagement
export function getPostedJobs(jobType, status) {
  return axiosClient
    .get(`/company/jobmanagement`, {
      params: { jobType: jobType, status: status },
    })
    .then((response) => response)
    .catch((error) => error);
}
export function getEmployerJobs(jobType) {
  return axiosClient
    .get(`/company/jobmanagement/employer/${jobType}`)
    .then((response) => response)
    .catch((error) => error);
}

export function deleteJobById(jobId) {
  return axiosClient
    .delete(`/company/jobmanagement/${jobId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function getApplicationsForJob(jobId, jobType, targetStatus, isVisited) {
  let customParam;
  if (isVisited === undefined) {
    customParam = {
      jobId: jobId,
      jobType: jobType,
      targetStatus: targetStatus,
    };
  } else {
    customParam = {
      jobId: jobId,
      jobType: jobType,
      targetStatus: targetStatus,
      isVisited: isVisited,
    };
  }
  return axiosClient
    .get(`application/manage`, {
      params: customParam,
    })
    .then((response) => response)
    .catch((error) => error);
}


//past new working prathmesh 
export function getCollegeApplicationsForJob(
  jobId,
  jobType,
  targetStatus,
  isVisited
) {
  return axiosClient.get(`application/manage/college`, {
    params: {
      jobId,
      jobType,
      targetStatus,
      isVisited, // ✅ always passed (true / false / undefined)
    },
  });
}


// get shortlisted applicant
export function getShorlistedCandidateByCompany(applicantType, jobType) {
  return axiosClient
    .get(`/application/manage/shortlist/`, {
      params: {
        applicantType: applicantType,
        jobType: jobType,
      },
    })
    .then((response) => response)
    .catch((error) => error);
}

// get accepted applicant
export function getAcceptedCandidateByCompany(applicantType, jobType) {
  return axiosClient
    .get(`/application/manage/accept/`, {
      params: {
        applicantType: applicantType,
        jobType: jobType,
      },
    })
    .then((response) => response)
    .catch((error) => error);
}

// shortlist candidate
export function shortlistCandidate(applicationId, jobRole) {
  return axiosClient
    .patch(`/application/manage/shortlist/${applicationId}`, { jobRole })
    .then((response) => response)
    .catch((error) => error);
}

// reject
export function rejectCandidate(applicationId, jobRole) {
  return axiosClient
    .patch(`/application/manage/reject/${applicationId}`, { jobRole })
    .then((response) => response)
    .catch((error) => error);
}
// accept candidate
export function acceptCandidate(applicationId, jobRole) {
  return axiosClient
    .patch(`/application/manage/accept/${applicationId}`, { jobRole })
    .then((response) => response)
    .catch((error) => error);
}

//schedule interview
{/*export function scheduleInterview(applicantId, applicantType, jobRole, data) {
  return axiosClient
    .post(`/application/manage/schedule`, {
      applicantId: applicantId,
      applicantType: applicantType,
      jobRole: jobRole,
      data: {
    date,
    time,
    meetLink,
    message
  }
    })
    .then((response) => response)
    .catch((error) => error);
}*/}

{/*export function scheduleInterview(payload) {
  return axiosClient.post("/application/manage/schedule", {
    applicationId: payload.applicationId,
    jobId: payload.jobId,
    jobType: payload.jobType, // "On-campus" | "Pool-campus"

    applicantId: payload.applicantId,           // college profile id
    applicantAuthId: payload.applicantAuthId,   // college auth id
    applicantType: payload.applicantType,       // "college"

    jobRole: payload.jobRole || [],

    coordinator: {
      name: payload.coordinator?.name,
      designation: payload.coordinator?.designation,
      collegeName: payload.coordinator?.collegeName,
    },

    data: {
      date: payload.date,
      time: payload.time,
      meetLink: payload.meetLink,
      message: payload.message,
    },
  });
}}*/}

export function scheduleInterview(payload) {
  return axiosClient.post("/application/manage/schedule", {
    applicationId: payload.applicationId,
    jobId: payload.jobId,
    jobType: payload.jobType,

    applicantId: payload.applicantId,
    applicantAuthId: payload.applicantAuthId,
    applicantType: payload.applicantType,

    applicantName: payload.applicantName,
    applicantCollege: payload.applicantCollege,

    jobRole: payload.jobRole || [],

    coordinator: payload.coordinator || {},

    data: {
      date: payload.data.date,
      time: payload.data.time,
      meetLink: payload.data.meetLink,
      message: payload.data.message,
    },
  });
}




// company dashboard
// save opportunity
export function SaveOppurtunity(jobId, jobType) {
  return axiosClient
    .post(`/application/saveopportunity`, { jobId: jobId, jobType: jobType })
    .then((response) => response)
    .catch((error) => error);
}

export function UnsaveOppurtunity(jobId) {
  return axiosClient
    .delete(`/application/saveopportunity/${jobId}`)
    .then((response) => response)
    .catch((error) => {
      console.error("Unsave API error:", error);
      return error;
    });
}

// get save opportunity
export function fetchSavedJobs() {
  return axiosClient
    .get(`/application/saveopportunity`)
    .then((response) => response)
    .catch((error) => error);
}

// application
export function ApplyForOncampusOppurtunity(jobId) {
  return axiosClient
    .post(`/application/oncampus`, { jobId: jobId })
    .then((response) => response)
    .catch((error) => error);
}

export function ApplyForPoolcampusOppurtunity(jobId) {
  return axiosClient
    .post(`/application/poolcampus`, { jobId: jobId })
    .then((response) => response)
    .catch((error) => error);
}

// companies name for dropdown
export function fetchAllCompaniesName() {
  return axiosClient
    .get(`/dropdown/companiesName`)
    .then((response) => response)
    .catch((error) => error);
}

// Hosting Management APIs

// Hackathon Registration Management
export function getCompanyHackathonsWithRegistrations() {
  return axiosClient
    .get(`/api/hosting-management/hackathons`)
    .then((response) => response)
    .catch((error) => error);
}

export function getHackathonRegistrations(hackathonId) {
  return axiosClient
    .get(`/api/hosting-management/hackathons/${hackathonId}/registrations`)
    .then((response) => response)
    .catch((error) => error);
}

export function confirmHackathonRegistration(registrationId) {
  return axiosClient
    .put(
      `/api/hosting-management/hackathons/registrations/${registrationId}/confirm`
    )
    .then((response) => response)
    .catch((error) => error);
}

export function rejectHackathonRegistration(registrationId, data) {
  return axiosClient
    .put(
      `/api/hosting-management/hackathons/registrations/${registrationId}/reject`,
      data
    )
    .then((response) => response)
    .catch((error) => error);
}

// Case Study Registration Management
export function getCompanyCasestudiesWithRegistrations() {
  return axiosClient
    .get(`/api/hosting-management/casestudies`)
    .then((response) => response)
    .catch((error) => error);
}

export function getCasestudyRegistrations(casestudyId) {
  return axiosClient
    .get(`/api/hosting-management/casestudies/${casestudyId}/registrations`)
    .then((response) => response)
    .catch((error) => error);
}

export function confirmCasestudyRegistration(registrationId) {
  return axiosClient
    .put(
      `/api/hosting-management/casestudies/registrations/${registrationId}/confirm`
    )
    .then((response) => response)
    .catch((error) => error);
}

export function rejectCasestudyRegistration(registrationId, data) {
  return axiosClient
    .put(
      `/api/hosting-management/casestudies/registrations/${registrationId}/reject`,
      data
    )
    .then((response) => response)
    .catch((error) => error);
}

// Workshop Registration Management
export function getCompanyWorkshopsWithRegistrations() {
  return axiosClient
    .get(`/api/hosting-management/workshops`)
    .then((response) => response)
    .catch((error) => error);
}

export function getWorkshopRegistrations(workshopId) {
  return axiosClient
    .get(`/api/hosting-management/workshops/${workshopId}/registrations`)
    .then((response) => response)
    .catch((error) => error);
}

export function confirmWorkshopRegistration(registrationId) {
  return axiosClient
    .put(
      `/api/hosting-management/workshops/registrations/${registrationId}/confirm`
    )
    .then((response) => response)
    .catch((error) => error);
}

export function rejectWorkshopRegistration(registrationId, data) {
  return axiosClient
    .put(
      `/api/hosting-management/workshops/registrations/${registrationId}/reject`,
      data
    )
    .then((response) => response)
    .catch((error) => error);
}

// Event Edit/Delete APIs
export function getHackathonById(hackathonId) {
  return axiosClient
    .get(`/hackathon/${hackathonId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function updateHackathon(hackathonId, payload) {
  return axiosClient
    .put(`/hackathon/${hackathonId}`, payload)
    .then((response) => response)
    .catch((error) => error);
}

export function deleteHackathon(hackathonId) {
  return axiosClient
    .delete(`/hackathon/${hackathonId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function getCasestudyById(casestudyId) {
  return axiosClient
    .get(`/casestudy/${casestudyId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function updateCasestudy(casestudyId, payload) {
  return axiosClient
    .put(`/casestudy/${casestudyId}`, payload)
    .then((response) => response)
    .catch((error) => error);
}

export function deleteCasestudy(casestudyId) {
  return axiosClient
    .delete(`/casestudy/${casestudyId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function getWorkshopById(workshopId) {
  return axiosClient
    .get(`/workshop/${workshopId}`)
    .then((response) => response)
    .catch((error) => error);
}

export function updateWorkshop(workshopId, payload) {
  return axiosClient
    .put(`/workshop/${workshopId}`, payload)
    .then((response) => response)
    .catch((error) => error);
}

export function deleteWorkshop(workshopId) {
  return axiosClient
    .delete(`/workshop/${workshopId}`)
    .then((response) => response)
    .catch((error) => error);
}

// Send file to confirmed users
export function sendFileToHackathonUsers(hackathonId, formData) {
  return axiosClient
    .post(`/hosting-management/hackathons/${hackathonId}/send-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response)
    .catch((error) => error);
}

export function sendFileToCasestudyUsers(casestudyId, formData) {
  return axiosClient
    .post(
      `/hosting-management/casestudies/${casestudyId}/send-file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => response)
    .catch((error) => error);
}

export function sendFileToWorkshopUsers(workshopId, formData) {
  return axiosClient
    .post(`/hosting-management/workshops/${workshopId}/send-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response)
    .catch((error) => error);
}

// ==================================================  Start  ==================================================

// Service Requests APIs

// 1> request info
export function createWorkforceRequest(formData) {
  return axiosClient
    .post(`/api/servicerequests/company/workforce-recruitment`, formData)
    .then((response) => response)
    .catch((error) => error);
}

export function createEmployeeTrainingRequest(formData) {
  return axiosClient
    .post(`/api/servicerequests/company/employee-training`, formData)
    .then((response) => response)
    .catch((error) => error);
}
export function createBrandingRequest(formData) {
  return axiosClient
    .post(`/api/servicerequests/company/branding`, formData)
    .then((response) => response)
    .catch((error) => error);
}

// 2> registration info

export function createEmployeeTrainingRegistration(formData) {
  return axiosClient
    .post(
      `/api/servicerequests/company/employee-training-registration`,
      formData
    )
    .then((response) => response)
    .catch((error) => error);
}
export function createBrandingRegistration(formData) {
  return axiosClient
    .post(`/api/servicerequests/company/branding-registration`, formData)
    .then((response) => response)
    .catch((error) => error);
}

// Get company service requests status
export function getCompanyServiceRequestStatus() {
  return axiosClient
    .get(`/api/servicerequests/company/status`)
    .then((response) => response)
    .catch((error) => error);
}

// ==================================================  End

export function getCompanyDashboardMetrics() {
  return axiosClient
    .get(`/application/company/metrics`)
    .then((response) => response)
    .catch((error) => error);
}

export function submitAlternateDates(jobId, dateData) {
  return axiosClient.post(`/application/${jobId}/submit`, dateData)
    .then(response => response)
    .catch(error => error);
}


// Add these functions to your Company_AxiosInstance.js file:

// Get all shortlisted candidates for company dashboard
// export function getShortlistedCandidates() {
//   return axiosClient
//     .get(`/application/company/shortlisted`)
//     .then((response) => response)
//     .catch((error) => error);
// }

// // Get all accepted candidates for company dashboard
// export function getAcceptedCandidates() {
//   return axiosClient
//     .get(`/application/company/accepted`)
//     .then((response) => response)
//     .catch((error) => error);
// }

// Get categorized applications for dashboard
export function getCompanyApplicationsByCategory() {
  return axiosClient
    .get(`/application/company/applications-by-category`)
    .then((response) => response)
    .catch((error) => error);
}

// In lib/Company_AxiosInstance.js
// export const getCompanyApplications = () => axios.get('/api/company/applications');
// export const getCompanyApplicationsByType = (type) => axios.get(`/api/company/applications?type=${type}`);
// export const getCompanyShortlistedCandidates = () => axios.get('/api/company/candidates/shortlisted');
// export const getCompanyAcceptedCandidates = () => axios.get('/api/company/candidates/accepted');

// Add these functions to your Company_AxiosInstance.js file:

// Get all shortlisted candidates for company dashboard (aggregated across all job types)
export function getShortlistedCandidates() {
  // Since the backend doesn't have this endpoint, we need to aggregate from existing endpoints
  return Promise.all([
    getShorlistedCandidateByCompany('student', 'oncampus'),
    getShorlistedCandidateByCompany('student', 'poolcampus'),
    getShorlistedCandidateByCompany('student', 'offcampus')
  ])
    .then(([oncampusRes, poolcampusRes, offcampusRes]) => {
      const data = {
        success: true,
        data: []
      };
      
      if (oncampusRes.data?.success && Array.isArray(oncampusRes.data.data)) {
        data.data.push(...oncampusRes.data.data.map(item => ({...item, category: 'On-campus'})));
      }
      if (poolcampusRes.data?.success && Array.isArray(poolcampusRes.data.data)) {
        data.data.push(...poolcampusRes.data.data.map(item => ({...item, category: 'Pool-campus'})));
      }
      if (offcampusRes.data?.success && Array.isArray(offcampusRes.data.data)) {
        data.data.push(...offcampusRes.data.data.map(item => ({...item, category: 'Off-campus'})));
      }
      
      return { data };
    })
    .catch((error) => {
      console.error('Error aggregating shortlisted candidates:', error);
      return { data: { success: false, data: [] } };
    });
}

// Get all accepted candidates for company dashboard (aggregated across all job types)
export function getAcceptedCandidates() {
  // Since the backend doesn't have this endpoint, we need to aggregate from existing endpoints
  return Promise.all([
    getAcceptedCandidateByCompany('student', 'oncampus'),
    getAcceptedCandidateByCompany('student', 'poolcampus'),
    getAcceptedCandidateByCompany('student', 'offcampus')
  ])
    .then(([oncampusRes, poolcampusRes, offcampusRes]) => {
      const data = {
        success: true,
        data: []
      };
      
      if (oncampusRes.data?.success && Array.isArray(oncampusRes.data.data)) {
        data.data.push(...oncampusRes.data.data.map(item => ({...item, category: 'On-campus'})));
      }
      if (poolcampusRes.data?.success && Array.isArray(poolcampusRes.data.data)) {
        data.data.push(...poolcampusRes.data.data.map(item => ({...item, category: 'Pool-campus'})));
      }
      if (offcampusRes.data?.success && Array.isArray(offcampusRes.data.data)) {
        data.data.push(...offcampusRes.data.data.map(item => ({...item, category: 'Off-campus'})));
      }
      
      return { data };
    })
    .catch((error) => {
      console.error('Error aggregating accepted candidates:', error);
      return { data: { success: false, data: [] } };
    });
}

// Add this function to your Company_AxiosInstance.js file
// export const getInternshipApplicationsForJob = async (jobId, jobType, status, isVisited = null) => {
//   try {
//     let url = `${BASE_URL}/api/company/application/${jobId}`;
//     const params = new URLSearchParams();
    
//     if (jobType) params.append('jobType', jobType);
//     if (status) params.append('status', status);
//     if (isVisited !== null) params.append('isVisited', isVisited);
    
//     if (params.toString()) {
//       url += `?${params.toString()}`;
//     }
    
//     const response = await axios.get(url, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('companyToken')}`
//       }
//     });
    
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };