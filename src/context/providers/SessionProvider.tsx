import { type ReactNode, useCallback, useEffect } from 'react'
import { message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { SessionContext } from '../SessionContext'
import { sdkSettings } from '@/sdk/core/SdkSettings'
import { queryKeys } from '@/config/queryClient'
import { userService } from '@/api'
import SessionResponse from '@/sdk/model/response/SessionResponse'
import User from '@/models/entities/User'
import SessionType from '@/models/app/context/SessionType'

const service = userService
const settings = sdkSettings

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const token = settings.token

  const { data: profile, isLoading: profileLoading } = useQuery<User>({
    queryKey: queryKeys.session,
    queryFn: () => service.profile(),
    enabled: !!token,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (payload: { username: string; password: string }) =>
      service.login(payload),
  })

  const signupMutation = useMutation({
    mutationFn: (payload: User) => service.signUp({ payload }),
  })

  const saveSession = useCallback(
    ({ token, data }: SessionResponse) => {
      settings.token = token
      queryClient.setQueryData(queryKeys.session, data)
      navigate('/dashboard', { replace: true })
    },
    [navigate, queryClient]
  )

  const logout = useCallback(() => {
    settings.removeToken()
    queryClient.setQueryData(queryKeys.session, null)

    messageApi.info('Sesión cerrada correctamente.')

    if (location.pathname !== '/login') {
      navigate('/login', { replace: true })
      window.location.reload()
    }
  }, [messageApi, navigate, location.pathname, queryClient])

  useEffect(() => {
    if (!profileLoading && !token && location.pathname !== '/login') {
      navigate('/login', { replace: true })
    }
  }, [profileLoading, token, location.pathname, navigate])

  const value: SessionType = {
    profile,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    saveSession,
    logout,
    loading: {
      profile: profileLoading,
      login: loginMutation.isPending,
      signup: signupMutation.isPending,
    },
  }

  if (profileLoading && token) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-gray-600">
        Cargando sesión...
      </div>
    )
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
      {contextHolder}
    </SessionContext.Provider>
  )
}
