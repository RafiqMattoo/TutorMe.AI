import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import type { LoginResponse } from '../types'

const api = axios.create({ baseURL: '/api', timeout: 60000 })

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const res = await axios.post<LoginResponse>('/api/auth/refresh', { refreshToken: refresh })
          useAuthStore.getState().login(res.data)
          err.config.headers.Authorization = `Bearer ${res.data.accessToken}`
          return api.request(err.config)
        } catch { useAuthStore.getState().logout() }
      }
    }
    return Promise.reject(err)
  }
)

export default api
