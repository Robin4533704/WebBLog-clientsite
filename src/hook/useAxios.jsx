import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const sendRequest = async (url, options = {}) => {
    const {
      method = "GET",
      body = null,
      params = null,
      headers: customHeaders = {},
      skipToken = false,
    } = options;

    try {
      let headers = { "Content-Type": "application/json", ...customHeaders };

      if (!skipToken) {
        // ✅ Get Firebase token
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // force refresh
          headers.Authorization = `Bearer ${token}`;
        } else {
          // fallback: localStorage token
          const token =
            localStorage.getItem("fbToken") ||
            localStorage.getItem("access-token") ||
            localStorage.getItem("token");
          if (token) headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await axios({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
        url,
        method,
        data: body,
        params,
        headers,
      });

      return response.data ?? null;
    } catch (err) {
      console.error("❌ Axios Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        console.warn("⚠️ Unauthorized! Token may be invalid or expired.");
      } else if (err.response?.status === 403) {
        console.warn("⚠️ Forbidden! Admins only.");
      }

      throw err; // important to propagate
    }
  };

  return { sendRequest };
};

export default useAxios;
