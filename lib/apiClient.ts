// lib/apiClient.ts
import axios from "axios";

// Create an instance of Axios with default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Function to get the session object from localStorage (only in browser)
const getSession = () => {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return null; // Return null if on the server
  }
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
          user: {
            id: session.id,
            firstName: session.firstName,
            lastName: session.lastName,
            email: session.email,
            is_staff: session.is_staff,
            is_active: session.is_active,
            is_author: session.is_author || false,
            date_joined: session.date_joined,
          },
          expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          jwt: access,
          refreshToken: newRefreshToken,
        };

        // Only set localStorage if in the browser
        if (typeof window !== "undefined") {
          localStorage.setItem("session", JSON.stringify(updatedSession));
        }

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("Refresh token error:", refreshError);
        // Only access localStorage if in the browser
        if (typeof window !== "undefined") {
          localStorage.removeItem("session");
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
