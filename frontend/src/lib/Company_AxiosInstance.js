import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_Backend_URL;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// default 10sec
axiosClient.defaults.timeout = 10000;
axiosClient.defaults.withCredentials = true;

export function getRegisteredColleges() {
  return axiosClient.get(`/company/dashboard/oncampus/registeredcampus`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getCollegeDetail(collegeId) {
  return axiosClient.get(`/company/dashboard/oncampus/registeredcampus/${collegeId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

// accept
export function getAcceptedOffCampusCandidates(jobId) {
  return axiosClient.get(`/application/accept/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getProfileByResume(searchParams) {
  return axiosClient.get(`/company/dashboard/resume`, { params: searchParams })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function createCompanyProfile(formData) {
  return axiosClient.post(`/company`, formData)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getAcceptedCampus(companyId) {
  return axiosClient.get(`/college/application/${companyId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function acceptCollegeRequest(companyId, collegeId) {
  return axiosClient.post(`/college/application`, { companyId, collegeId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

// internship
export function postInternship(payload) {
  return axiosClient.post(`/api/rawrecruit/createinternship`, payload)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

// jobmanagement
export function getPostedJobs() {
  return axiosClient.get(`/company/jobmanagement/offcampus`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getApplicationsForJob(jobId) {
  return axiosClient.get(`/company/jobmanagement/offcampus/applications/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

// shortlisted
export function getShorlistedCandidateByCompany() {
  return axiosClient.get(`/application/offcampus/shortlisted`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}