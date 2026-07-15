import axios from 'axios'
import { useAuthStore } from '@/shared/store/authStore'
import type { LoginResponse } from '@/shared/types'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')

export const getStoredAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN_KEY) ?? useAuthStore.getState().token

export const axiosInstance = axios.create({ baseURL: API_BASE_URL, timeout: 60000 })

axiosInstance.interceptors.request.use(config => {
  const token = getStoredAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) {
        try {
          const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          useAuthStore.getState().login(response.data)
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`
          return axiosInstance.request(error.config)
        } catch {
          useAuthStore.getState().logout()
        }
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
