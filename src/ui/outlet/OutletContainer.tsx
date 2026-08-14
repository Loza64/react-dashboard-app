import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardOutlet from './dashboard/DashboardOutlet'
import { useSession } from '@/hooks/useSession'
import { RoutesEnum } from '@/enum/routes..app'
import { getRouteShell, routesConfig } from '@/config/routes.app'
import NotFoundView from '@/views/NotFoundView'
import { matchRoute } from '@/utils/route-matcher'

export default function OutletContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile: user } = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname

  const matchedRouteKey = useMemo(
    () =>
      (Object.keys(routesConfig) as RoutesEnum[]).find((routeKey) =>
        matchRoute(routeKey, currentPath)
      ),
    [currentPath]
  )

  const routeData = matchedRouteKey ? routesConfig[matchedRouteKey] : undefined
  const routeShell = getRouteShell(routeData)

  useEffect(() => {
    if (routeData?.guestOnly && user) {
      navigate(RoutesEnum.DASHBOARD, { replace: true })
    }
  }, [routeData, user, navigate])

  if (!routeData) return <NotFoundView />

  if (routeData.guestOnly && user) return null

  const renderByShell = {
    dashboard: (
      <DashboardOutlet routeData={routeData}>{children}</DashboardOutlet>
    ),
    public: children,
  }

  return renderByShell[routeShell ?? 'public']
}
