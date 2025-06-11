import axios from "axios";

// const API_BASE_URL = "https://tripbng-backend-api-c6kw.onrender.com";
const API_BASE_URL = "https://api.tripbng.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("GET Error:", error?.response?.data || error.message);
      throw error;
    }
  },

  post: async (url, data, useFormData = false) => {
    try {
      const config = useFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error("POST Error:", error?.response?.data || error.message);
      throw error;
    }
  },

  patch: async (url, data) => {
    try {
      const response = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      console.error("PATCH Error:", error?.response?.data || error.message);
      throw error;
    }
  },

  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error("DELETE Error:", error?.response?.data || error.message);
      throw error;
    }
  },
};