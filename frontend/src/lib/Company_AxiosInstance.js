import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_Backend_URL;

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

// default 10sec
axiosClient.defaults.timeout = 10000;

// in case of tokens
// axiosClient.defaults.withCredentials = true;

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