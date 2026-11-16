import axios from 'axios'
import { clearToken, getToken } from '@/utils/storage'
import { authEvents } from './authEvents'
import { AUTH_FORM_PATHS } from './endpoints'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

// Attach the JWT to every request when we have one.
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A 401 outside the login/register forms means the token is invalid or expired.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const hadToken = Boolean(error.config?.headers?.Authorization)
    if (status === 401 && hadToken && !AUTH_FORM_PATHS.includes(url)) {
      clearToken()
      authEvents.emit('unauthorized')
    }
    return Promise.reject(error)
  },
)
