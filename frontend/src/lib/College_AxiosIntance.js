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
axiosClient.defaults.withCredentials = true;

export function getCompanyPostingForOncampus() {
  return axiosClient.get(`/api/rawrecruit/oncampus-register`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getCompanyPostingForOncampusDetail(jobId) {
  return axiosClient.get(`/api/rawrecruit/oncampus-register/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function ApplyForPoolCampus(jobId) {
  return axiosClient.post(`/api/hiringDrive/poolcampus/apply`, { jobId: jobId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function ApplyForOnCampus(jobId) {
  return axiosClient.post(`/api/rawrecruit/oncampus/apply`, { jobId: jobId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getOncampusJobs() {
  return axiosClient.post(`/api/rawrecruit/college/oncampus`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}