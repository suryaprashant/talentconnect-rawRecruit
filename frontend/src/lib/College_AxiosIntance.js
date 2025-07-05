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

export function getCompanyPostingForOncampus() {
  return axiosClient.get(`/api/applications/oncampus-register`)
    .then(response => response)
    .catch(error => console.log("Error: ", error));
}