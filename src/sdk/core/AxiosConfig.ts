import { sdkSettings } from '@/sdk/core/SdkSettings'
import { queryClient, queryKeys } from '@/config/queryClient'
import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

const DEFAULT_TIMEOUT_MS = 60_000

export interface AxiosInstanceParams {
  origin: string
  initPath: string
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
    (error) => {
      const status = error?.response?.status

      const onUnauthorized = error.config?.onUnauthorized
      const onForbidden = error.config?.onForbidden

      if (status === 401) {
        if (onUnauthorized) {
          onUnauthorized()
        } else {
          toast.warning('Su sesión ha expirado')
          sdkSettings.removeToken()
          queryClient.setQueryData(queryKeys.session, null)
          window.location.href = '/login'
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
