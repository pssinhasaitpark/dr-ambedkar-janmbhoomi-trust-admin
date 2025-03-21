import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle logout (to avoid circular dependency)
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  setTimeout(() => {
    window.location.href = "/login"; 
  }, 100);
};

// Attach token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      handleLogout();  // Use function instead of `store.dispatch(logoutUser())`
    }
    return Promise.reject(error);
  }
);

export default api;
