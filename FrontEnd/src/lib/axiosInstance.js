import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_Backend_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate client WITHOUT interceptors
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_Backend_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

// No Authorization header needed because we're using HttpOnly cookies

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If no request config exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't retry more than once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't intercept /me
    if (
      originalRequest.url?.includes("/api/auth/me") &&
      error.response?.status === 401
    ) {
      return Promise.reject(error);
    }

    // Don't intercept the refresh endpoint itself
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED"
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

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired. Logging out...");

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;