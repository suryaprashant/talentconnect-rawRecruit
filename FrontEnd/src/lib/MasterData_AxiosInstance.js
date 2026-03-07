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
export function getMasterDataByType(type, parent = null) {
  return axiosClient.get("/api/master-data", {
    params: { type, parent },
  });
}

/**
 * Create a new master data entry
 */
export function createMasterData(payload) {
  return axiosClient.post("/api/master-data", {
    type: payload.type,
    value: payload.value,
    parent: payload.parent || null, // for STREAM → DEGREE mapping
  });
}