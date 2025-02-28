import axios from "axios";

// Create an instance of Axios with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Function to get the session object from localStorage
const getSession = () => {
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const parsedSession = getSession();
    const token = parsedSession?.jwt;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    }

    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
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
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access, refresh: newRefreshToken } = response.data;

        const updatedSession = {
          ...session,
          jwt: access,
          refreshToken: newRefreshToken, 
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);
        localStorage.removeItem("session");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
