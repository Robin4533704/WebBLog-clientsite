// hook/useUserAxios.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const useUserAxios = () => {
  // Axios instance
  const axiosIntals = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to attach Firebase token
  axiosIntals.interceptors.request.use(async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken(true); // force refresh
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No logged-in user. Request may fail!");
      }

      return config;
    } catch (err) {
      console.error("❌ Error attaching token:", err);
      return config;
    }
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor (optional for logging)
  axiosIntals.interceptors.response.use(
    (response) => response.data || response,
    (error) => {
      console.error("❌ Axios response error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return { axiosIntals };
};

export default useUserAxios;
