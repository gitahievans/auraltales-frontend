import axios from "axios";

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  baseURL: "https://bootlight.onrender.com",
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (
      config.method === "post" &&
      config.headers["Content-Type"] !== "multipart/form-data"
    ) {
      config.headers["Content-Type"] = "application/json";
    } else if (config.headers["Content-Type"] !== "application/json") {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && !originalRequest?.sent) {
      originalRequest.sent = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "https://bootlight.onrender.com/api/token/refresh",
          {
            refresh: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { access, refresh } = response.data;
        localStorage.setItem("token", access);
        localStorage.setItem("refreshToken", refresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
