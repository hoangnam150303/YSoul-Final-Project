import axios from "axios";
import constants from "../constants/contants";
import { message } from "antd";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
const agentAxiosClient = axios.create({
  baseURL: import.meta.env.VITE_AGENT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(constants.ACCESS_TOKEN);
    if (token && token !== "undefined" && token !== "null") {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 429) {
      message.error("Too many requests, please try again later!");
    }
    // check if error is 401 and not retry yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh token request is already in progress, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh token API
        const refreshResponse = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data.success) {
          const newToken = refreshResponse.data.access_token;

          // save new token
          localStorage.setItem(constants.ACCESS_TOKEN, newToken);

          // update header for original request
          originalRequest.headers["Authorization"] = "Bearer " + newToken;

          // Process queue
          processQueue(null, newToken);

          // Retry original request
          return axiosClient(originalRequest);
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        console.log("Refresh token failed:", refreshError);

        // Delete old token
        localStorage.removeItem(constants.ACCESS_TOKEN);

        // Process queue with error
        processQueue(refreshError, null);

        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export { axiosClient, agentAxiosClient };
