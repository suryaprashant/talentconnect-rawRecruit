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

export const getInterviews = () =>
  axiosClient.get("/interviews");

export const getCompanyInterviews = () =>
  axiosClient.get("/interviews/company");

export const getCollegeInterviews = () =>
  axiosClient.get("/interviews/college");

export const getInterviewById = (id) =>
  axiosClient.get(`/interviews/${id}`);

export const updateInterviewStatus = (id, status) =>
  axiosClient.patch(`/interviews/${id}/status`, { status });
