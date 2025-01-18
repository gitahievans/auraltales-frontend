import axios from "axios";

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Function to get the session object from localStorage
const getSession = () => {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const parsedSession = getSession();
    const token = parsedSession?.jwt;

    console.log("token in axios instance", token);

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
    console.log("config returned", config);

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
        const session = getSession();
        const refreshToken = session?.refreshToken;

        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Refresh the token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh`,
          {
            refresh: refreshToken,
          }
        );

        const { access, refresh } = response.data;

        // Update the session object in localStorage
        const updatedSession = {
          ...session,
          jwt: access,
          refreshToken: refresh,
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);
        // Handle logout or session expiration logic here if needed
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
