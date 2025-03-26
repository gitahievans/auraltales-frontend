// services/authService.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authService = {
  requestPasswordReset: async (email) => {
    const response = await axios.post(`${API_URL}accounts/password-reset/`, { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await axios.post(
      `${API_URL}accounts/password-reset/confirm/`,
      resetData
    );
    return response.data;
  },
};

export default authService;
