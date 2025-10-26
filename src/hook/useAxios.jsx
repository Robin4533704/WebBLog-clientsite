// hook/useAxios.js - Simple version
import axios from "axios";

const useAxios = () => {
  const sendRequest = async (url, options = {}) => {
    const {
      method = "GET",
      body = null,
      headers: customHeaders = {},
    } = options;

    try {
      let headers = { 
        "Content-Type": "application/json", 
        ...customHeaders 
      };

      // Add token if available
      const token = localStorage.getItem("fbToken");
      if (token && !url.includes('imgbb.com')) {
        headers.Authorization = `Bearer ${token}`;
      }

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const finalUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

      console.log("🌐 Sending request to:", finalUrl);

      const response = await axios({
        url: finalUrl,
        method,
        data: body,
        headers,
      });

      return response.data;
    } catch (err) {
      console.error("❌ Axios Error:", err.message);
      throw err;
    }
  };

  return { sendRequest };
};

export default useAxios;