import axios from "axios";

const useUserAxios = () => {
  const sendRequest = async (url, options = {}) => {
    const token = localStorage.getItem("fbToken"); // ✅ Token from localStorage
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await axios({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
      url,
      method: options.method || "GET",
      data: options.data || null,
      params: options.params || null,
      headers,
    });

    return response.data;
  };

  return { sendRequest };
};

export default useUserAxios;
