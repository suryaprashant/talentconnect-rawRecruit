import createAxiosClient from "./createAxiosClient";

const axiosClient = createAxiosClient();
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


export const getAdminInterviews = () => {
  return axiosClient.get("/api/admin/dashboard/interviews");
};