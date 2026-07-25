import { sdkSettings } from '@/sdk/core/SdkSettings'
import { queryClient, queryKeys } from '@/config/queryClient'
import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import type SessionResponse from '@/sdk/model/response/SessionResponse'

const DEFAULT_TIMEOUT_MS = 60_000

export interface AxiosInstanceParams {
  origin: string
  initPath: string
}

const logout = () => {
  sdkSettings.removeToken()
  sdkSettings.removeRefreshToken()
  queryClient.setQueryData(queryKeys.session, null)
  window.location.href = '/login'
}

const refreshAccessToken = async (origin: string): Promise<string> => {
  const refreshToken = sdkSettings.refreshToken
  if (!refreshToken) throw new Error('No refresh token available')
  const { data } = await axios.post<SessionResponse>(
    `${origin}/api/auth/refresh`,
    { refreshToken }
  )
  sdkSettings.token = data.token
  sdkSettings.refreshToken = data.refreshToken
  return data.token
}

export const AxiosConfig = ({
  origin,
  initPath,
}: AxiosInstanceParams): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${origin}/${initPath}`,
    timeout: DEFAULT_TIMEOUT_MS,
  })

  instance.interceptors.request.use((config) => {
    const token = sdkSettings.token

    if (token) config.headers.Authorization = `Bearer ${token}`

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status
      const originalRequest = error.config

      const onUnauthorized = originalRequest?.onUnauthorized
      const onForbidden = originalRequest?.onForbidden

      if (status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true
        try {
          const newToken = await refreshAccessToken(origin)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return instance(originalRequest)
        } catch {
          if (onUnauthorized) {
            onUnauthorized()
          } else {
            toast.warning('Su sesión ha expirado')
            logout()
          }
          return Promise.reject(error)
        }
      }

      if (status === 403) {
        if (onForbidden) {
          onForbidden()
        } else {
          toast.warning('No tienes permiso para realizar esta petición')
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
