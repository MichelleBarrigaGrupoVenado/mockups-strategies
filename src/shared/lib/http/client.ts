import axios from 'axios'
import { env } from '@/shared/config/env'

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
})

let isRefreshing = false
let pendingQueue: Array<() => void> = []

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(httpClient(originalRequest)))
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      await httpClient.post('/auth/refresh')
      pendingQueue.forEach((retry) => retry())
      pendingQueue = []
      return httpClient(originalRequest)
    } catch (refreshError) {
      pendingQueue = []
      window.location.assign('/login')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
