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

export function getJobLisingJobDetails(jobId) {
  return axiosClient.get(`/jobs/jobDetails/joblisting/${jobId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}


export function getRelaventOffcampusOpportunity() {
  return axiosClient.get(`/jobs/relevantjobs/offcampus`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getRelaventJobListingOpportunity() {
  return axiosClient.get(`/jobs/relevantjobs/joblisting`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getAllInternship() {
  return axiosClient.get(`/internship`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getInternshipDetail(Id) {
  return axiosClient.get(`/internship/getInternshipDetail/${Id}`)
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

export function ApplyForJobListingOppurtunity(jobId) {
  return axiosClient.post(`/application/joblistingapply`, { jobId: jobId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function ApplyForInternship(internshipId) {
  return axiosClient.post(`/application/internship/apply`, { internshipId: internshipId })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getJobListingApplicationStatus(userId) {
  return axiosClient.get(`/application`, { params: { Id: userId } })
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}

export function getOffCampusApplicationStatus(userId) {
  return axiosClient.get(`/application/offcampus/${userId}`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}