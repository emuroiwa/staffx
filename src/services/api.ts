import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Flag to prevent multiple concurrent refresh attempts
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authToken = localStorage.getItem('authToken')
        if (authToken) {
          // Create a new axios instance without interceptors for the refresh request
          const refreshApi = axios.create({
            baseURL: API_BASE_URL,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          })
          
          const response = await refreshApi.post('/auth/refresh')
          const { token } = response.data.data
          
          localStorage.setItem('authToken', token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          processQueue(null, token)
          
          return api(originalRequest)
        } else {
                  localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api