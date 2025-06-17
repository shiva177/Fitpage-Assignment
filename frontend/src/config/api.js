import axios from "axios"

// Get the API base URL from environment or default to the correct port
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5009/api"

console.log("API Base URL:", API_BASE_URL)

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor to handle errors and redirect on unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login" 
    }
    console.error("API Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      fullUrl: error.config?.baseURL + error.config?.url,
    })
    return Promise.reject(error)
  },
)

export default api
