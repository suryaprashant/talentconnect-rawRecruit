import createAxiosClient from "./createAxiosClient";

const axiosClient = createAxiosClient();
// Add this to your API library
// lib/College_AxiosInstance.js
// Inside your lib/College_AxiosInstance.js


export function getCompanyPostingForOncampus() {
  return axiosClient.get(`/api/student-dashboard/on-campus/college`)
    .then(response => response)
    .catch(error => error);
}


export const getAllStudentsInCollege = (profileType) => {
  const params = profileType ? { profileType } : {};
  return axiosClient.get('/api/college/students', { params });
};

export function getCompanyPostingForOncampusDetail(jobId) {
  return axiosClient.get(`/api/student-dashboard/oncampus/college/${jobId}`)
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
export function fetchSavedJobs() {
  return axiosClient.get(`/application/saveopportunity`)
    .then(response => response)
    .catch(error => error);
}

// application
export function ApplyForPoolCampus(jobId) {
  return axiosClient.post(`/application/poolcampus`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForOnCampus(jobId) {
  return axiosClient.post(`/application/oncampus`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function ApplyForCampusInternship(jobId) {
  return axiosClient.post(`/application/internship`, { jobId: jobId })
    .then(response => response)
    .catch(error => error);
}

export function getOncampusJobs() {
  return axiosClient.post(`/api/rawrecruit/college/oncampus`)
    .then(response => response)
    .catch(error => error);
}
//pool
export function getPoolCampusForCompany() {
  return axiosClient.get(`/api/student-dashboard/pool-campus/company`)
    .then(response => response)
    .catch(error => error);
}

export function getPoolCampusJobByIdForCompany(jobId) {
  return axiosClient.get(`/api/student-dashboard/pool-campus/company/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error", error));
}
// /api/student-dashboard/getPoolCampusJob/${id}

export function getOnCampusJobById(id) {
  return axiosClient.get(`/api/student-dashboard/getOnCampusJob/${id}`)
    .then(response => response)
    .catch(error => error);
}

export function getPoolCampusJobById(id) {
  return axiosClient.get(`/api/student-dashboard/getPoolCampusJob/${id}`)
    .then(response => response)
    .catch(error => error);
}

// job management 
export function getCollegePostedJobs(jobType, key, active) {
  const params = {};
  if (active !== undefined && active !== null) {
    params.active = active.toString(); // ✅ explicitly convert to string "false"
  }
  return axiosClient.get(`/college/jobmanagement/${key}/${jobType}`, { params })
    .then(response => response)
    .catch(error => error);
}
export function getApplicationByJobOfManagement(jobId, jobType, targetStatus,isVisited) {
  return axiosClient.get(`application/manage/college`, {
    params: {
      jobId: jobId,
      jobType: jobType,
      targetStatus: targetStatus,
      isVisited: isVisited
    }
  })
    .then(response => response)
    .catch(error => {
      console.log("Error: ", error);

      throw error;
    });
}

// application status (as College applicant) per job type
export function getMyApplicationStatus(jobType) {
  return axiosClient.get(`/application/status/candidate/${encodeURIComponent(jobType)}`)
    .then(response => response)
    .catch(error => error);
}

// get all college names 
// export function fetchAllCollegesName() {
//   return axiosClient.get(`/dropdown/collegeName`)
//     .then(response => response)
//     .catch(error => error);
// }

export function fetchAllCollegesName (){
  return axiosClient.get("/api/colleges/all");
}

//export const fetchAllCollegesName = () => .get("/all");

// ADD the 'export' keyword here

export function registerNewCollege (name){
  return axiosClient.post("/api/colleges/register", { name });
}
//export const registerNewCollege = (name) => API.post("/register", { name });

// get shortlistedCompanies by college

export function shortlistCompanyByCollege(applicationId, jobRole) {
  return axiosClient.patch(`/application/manage/college/shortlist/${applicationId}`, { jobRole })
    .then(response => response)
    .catch(error => error);
}

export function getShorlistedCompaniesByCollege(applicantType, jobType) {
  return axiosClient.get(`/application/manage/college/shortlist/`, {
    params: {
      applicantType: applicantType,
      jobType: jobType
    }
  })
    .then(response => response)
    .catch(error => error);
}

export function acceptCompanies(applicationId, jobRole) {
  return axiosClient.patch(`/application/manage/accept/${applicationId}`, { jobRole })
    .then(response => response)
    .catch(error => error);
}


export function rejectCompanyApplication(applicationId, jobRole) {
  return axiosClient.patch(`/application/manage/reject/${applicationId}`, { jobRole })
    .then(response => response)
    .catch(error => error);
}

// reject  application
export function rejectCompanyApplicationForCollege(applicationId, jobRole) {
  return axiosClient.patch(`/application/manage/college/reject/${applicationId}`, { jobRole })
    .then(response => response)
    .catch(error => error);
}


// Auto-conversation creation between college and company
export const conversationWithCollege = (companyId) => {
  return axiosClient.post(`/api/messages/conversation`, { receiverId: companyId })
    .then(response => response)
    .catch(error => error);
};

// college service requests
export function createOnCampusPlacementRequest(data) {
  return axiosClient.post(`/api/servicerequests/college/On-campus-Placement`, data)
    .then(response => response)
    .catch(error => error);
}
export function createPoolCampusRequest(data) {
  return axiosClient.post(`/api/servicerequests/college/pool-campus`, data)
    .then(response => response)
    .catch(error => error);
}
export function createStudentTrainingRequest(data) {
  return axiosClient.post(`/api/servicerequests/college/student-training`, data)
    .then(response => response)
    .catch(error => error);
}
export function createCollegeSeminarRequest(data) {
  return axiosClient.post(`/api/servicerequests/college-seminar`, data)
    .then(response => response)
    .catch(error => error);
}
export function createCollegeBrandingRequest(data) {
  return axiosClient.post(`/api/servicerequests/college/branding`, data)
    .then(response => response)
    .catch(error => error);
}

// get college service requests status
export function getCollegeServiceRequestStatus() {
  return axiosClient.get(`/api/servicerequests/college/status`)
    .then(response => response)
    .catch(error => error);
}
// Permanent delete (hard delete) — DELETE /api/delete-job/:id
export const permanentDeleteCollegeJob = async (jobId) => {
  const response = await axiosClient.delete(`/api/delete-job/${jobId}`);
  return response;
};

export function deleteCollegeJob(jobId) {
  return axiosClient.delete(`/college/jobmanagement/delete/${jobId}`)
    .then(response => response)
    .catch(error => error);
}

// In College_AxiosInstance.js, update getCollegePostingForPoolcampus:
export function getCollegePostingForPoolcampus() {
  // Use the existing route that works
  return axiosClient.get(`/api/student-dashboard/getAllPoolCampusJobs`)
    .then(response => {
      console.log('API Response from getAllPoolCampusJobs:', response);
      return response;
    })
    .catch(error => {
      console.error('API Error:', error);
      throw error;
    });
}

export const createCollegeMasterData = async (payload) => {
  return axiosClient.post(
    "/api/college-onboarding/college-master-data",
    payload
  );
};

// GET BY TYPE
export const getCollegeMasterDataByType = async (type) => {
  return axiosClient.get(
    `/api/college-onboarding/college-master-data/${type}`
  );
};