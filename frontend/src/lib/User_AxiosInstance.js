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


// student dashboard
export function getJobDetails(jobId) {
  return axiosClient.get(`/jobs/jobDetails/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}


export function getRelaventOpportunity() {
  return axiosClient.get(`/jobs/relevantjobs`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getAllInternship() {
  return axiosClient.get(`/internship`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getInternships() {
  return axiosClient.get(`/internship`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getHackathons() {
  return axiosClient.get(`/hackathon`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getHackathonDetail(hackathonId) {
  return axiosClient.get(`/hackathon/${hackathonId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

// application
export function ApplyForOppurtunity(jobId) {
  return axiosClient.post(`/application/offcampusapply`, { jobId: jobId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));

}

export function getApplicationStatus(userId) {
  return axiosClient.get(`/application`, { params: { Id: userId } })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}