import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardOutlet from './dashboard/DashboardOutlet'
import { useSession } from '@/hooks/useSession'
import { RoutesEnum } from '@/enum/routes..app'
import { routesConfig } from '@/config/routes.app'
import NotFoundView from '@/views/NotFoundView'
import { matchRoute } from '@/utils/route-matcher'

export default function OutletContainer({
  children,
  isMobile,
}: {
  children: React.ReactNode
  isMobile: boolean
}) {
  const { profile: user } = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname

  const matchedRouteKey = useMemo(() => {
    return (Object.keys(routesConfig) as RoutesEnum[]).find((routeKey) =>
      matchRoute(routeKey, currentPath)
    )
  }, [currentPath])

  const routeData = matchedRouteKey ? routesConfig[matchedRouteKey] : undefined

  useEffect(() => {
    if (routeData?.guestOnly && user) {
      navigate(RoutesEnum.DASHBOARD, { replace: true })
    }
  }, [routeData, user, navigate])

  if (!routeData) return <NotFoundView />

  // guestOnly aplica a cualquier grupo (hoy solo lo usan '/' y '/login'):
  // mientras el effect de arriba redirige, no mostramos nada.
  if (routeData.guestOnly && user) return null

  if (routeData.group === 'dashboard') {
    return (
      <DashboardOutlet routeData={routeData} isMobile={isMobile}>
        {children}
      </DashboardOutlet>
    )
  }

  // Grupos sin outlet propio (ej. "public") se muestran tal cual.
  return children
}
