import axios from "axios";

let isRefreshing = false;
let refreshPromise = null;

export default function createAxiosClient() {
  const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_Backend_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Separate client without interceptors
  const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_Backend_URL,
    withCredentials: true,
  });

  axiosClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Don't retry twice
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Ignore auth me
      if (
        originalRequest.url?.includes("/api/auth/me") &&
        error.response?.status === 401
      ) {
        return Promise.reject(error);
      }

      // Ignore refresh endpoint itself
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        (
          error.response?.data?.code === "TOKEN_EXPIRED" ||
          error.response?.data?.code === "NO_ACCESS_TOKEN"
        )
      ) {
        originalRequest._retry = true;

        try {
          if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = refreshClient
              .post("/api/auth/refresh")
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          }

          await refreshPromise;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          sessionStorage.clear();

          window.location.replace("/login");

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosClient;
}