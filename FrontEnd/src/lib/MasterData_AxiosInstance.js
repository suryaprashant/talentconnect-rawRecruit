import createAxiosClient from "./createAxiosClient";

const axiosClient = createAxiosClient();
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