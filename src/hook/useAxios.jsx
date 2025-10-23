import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

const useAxios = () => {
  const sendRequest = async (url, options = {}) => {
    const { method = "GET", body = null, params = null, headers = {} } = options;

    try {
      const token = localStorage.getItem("fbToken");
      console.log("📦 Sending Token:", token); // Debug log

      const response = await api({
        url,
        method,
        data: body,
        params,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      });

      return response.data ?? null;
    } catch (err) {
      console.error("Axios Error:", err.response?.data || err.message);
      throw err;
    }
  };

  return { sendRequest };
};

export default useAxios;
