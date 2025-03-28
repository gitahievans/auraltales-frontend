// lib/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Utility function to get token expiration time
const getTokenExpiration = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(
      `Token expiration: ${new Date(payload.exp * 1000).toISOString()}`
    );
    return payload.exp; // Expiration time in seconds
  } catch (e: any) {
    console.log("Invalid token detected in getTokenExpiration:", e.message);
    return 0; // Treat invalid token as expired
  }
};

// Function to get the session from localStorage (browser-only)
const getSession = () => {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const session = getSession();
    console.log("API Request - Current session from localStorage:", {
      jwt: session?.jwt,
      refreshToken: session?.refreshToken,
    });

    if (session && session.jwt) {
      const token = session.jwt;
      const exp = getTokenExpiration(token);
      const now = Date.now() / 1000; // Current time in seconds
      const threshold = 300; // 5 minutes in seconds
      console.log(
        `Token check - Now: ${now}, Exp: ${exp}, Threshold: ${now + threshold}`
      );

      if (exp < now || exp < now + threshold) {
        console.log("Token expired or near expiration, refreshing...");
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
            { refresh: session.refreshToken }
          );
          const { access, refresh: newRefreshToken } = response.data;
          console.log("Token refreshed successfully:", {
            access,
            newRefreshToken,
          });

          const updatedSession = {
            ...session,
            jwt: access,
            refreshToken: newRefreshToken || session.refreshToken,
          };
          localStorage.setItem("session", JSON.stringify(updatedSession));
          console.log("Updated localStorage with new session:", updatedSession);
          config.headers.Authorization = `Bearer ${access}`;
        } catch (error) {
          console.error("Token refresh failed:", error);
          localStorage.removeItem("session");
          window.location.href = "/";
          return Promise.reject(error);
        }
      } else {
        console.log("Token is valid, proceeding with request.");
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log(
        "No valid session found, proceeding without Authorization header."
      );
    }
    config.headers.Accept = "application/json";
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor (as a fallback)
apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response received:", response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    console.log("API Response error:", {
      status: error?.response?.status,
      message: error.message,
    });

    if (error?.response?.status === 401 && !originalRequest?.sent) {
      originalRequest.sent = true;
      const session = getSession();
      const refreshToken = session?.refreshToken;
      console.log("401 detected, attempting token refresh with:", {
        refreshToken,
      });

      if (!refreshToken) {
        console.log("No refresh token available, rejecting request.");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );
        const { access, refresh: newRefreshToken } = response.data;
        console.log("Fallback token refresh successful:", {
          access,
          newRefreshToken,
        });

        const updatedSession = {
          ...session,
          jwt: access,
          refreshToken: newRefreshToken || session.refreshToken,
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));
        console.log(
          "Updated localStorage in response interceptor:",
          updatedSession
        );

        originalRequest.headers.Authorization = `Bearer ${access}`;
        console.log("Retrying original request with new token...");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token error in response interceptor:",
          refreshError
        );
        localStorage.removeItem("session");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    console.log("Non-401 error or retry failed, rejecting:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
