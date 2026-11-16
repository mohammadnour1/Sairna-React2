import axios from 'axios'
import { adminAuthEvents } from './adminAuthEvents'
import { adminEndpoints } from './adminEndpoints'
import { clearAdminToken, getAdminToken } from './adminToken'

/** Axios instance for the Dashboard API only (the passenger site has its own client). */
export const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL,
  timeout: 15000,
})

adminClient.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A 401 on anything but the login form = the admin token is missing, invalid or expired.
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const hadToken = Boolean(error.config?.headers?.Authorization)
    if (status === 401 && hadToken && url !== adminEndpoints.login()) {
      clearAdminToken()
      adminAuthEvents.emitUnauthorized()
    }
    return Promise.reject(error)
  },
)
