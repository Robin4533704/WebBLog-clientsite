
// hook/useUserAxios.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const useUserAxios = () => {
  const axiosIntals = async (url, options = {}) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // ✅ Default headers
      let headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      // ✅ Attach Firebase token if logged in
      if (user) {
        const token = await user.getIdToken(true); // force refresh token
        headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("⚠️ No logged-in user. Request may fail!");
      }

      // ✅ Axios request
      const response = await axios({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        url,
        method: options.method || "GET",
        data: options.data || null,
        params: options.params || null,
        headers,
      });

      return response.data || [];
    } catch (err) {
      console.error("❌ Axios request failed:", err.response?.data || err.message);

      // ✅ Improved error handling
      if (err.response?.status === 401) {
        console.warn("⚠️ Unauthorized! Token may be invalid or expired.");
      } else if (err.response?.status === 403) {
        console.warn("⚠️ Forbidden! Admins only.");
      } else if (err.response?.status === 404) {
        console.warn("⚠️ API route not found:", url);
      }

      throw err; // important to propagate error for component handling
    }
  };

  return { axiosIntals };
};

export default useUserAxios;
