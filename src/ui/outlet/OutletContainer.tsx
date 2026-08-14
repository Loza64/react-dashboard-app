import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardOutlet from './dashboard/DashboardOutlet'
import { useSession } from '@/hooks/useSession'
import { RoutesEnum } from '@/enum/routes..app'
import { AuthMode, findRouteConfig } from '@/config/routes.app'
import { isRoleAuthorized } from '@/utils/permission.app'
import NotFoundView from '@/views/NotFoundView'
import ForbiddenView from '@/views/ForbiddenView'

export default function OutletContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile: user, loading } = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname
  const routeData = useMemo(() => findRouteConfig(currentPath), [currentPath])

  const isLoggedIn = !!user
  const role = user?.role?.name

  const blockedForGuest =
    routeData?.auth === AuthMode.protected && !loading.profile && !isLoggedIn
  const blockedForUser = !!routeData?.guestOnly && isLoggedIn
  const blockedForRole =
    routeData?.auth === AuthMode.protected &&
    isLoggedIn &&
    !(role ? isRoleAuthorized(role, routeData.roles) : false)

  useEffect(() => {
    if (blockedForGuest) navigate(RoutesEnum.LOGIN, { replace: true })
    if (blockedForUser) navigate(RoutesEnum.DASHBOARD, { replace: true })
  }, [blockedForGuest, blockedForUser, navigate])

  if (!routeData) return <NotFoundView />
  if (blockedForGuest || blockedForUser) return null
  if (blockedForRole) return <ForbiddenView />

  if (routeData.shell === 'dashboard') {
    return <DashboardOutlet routeData={routeData}>{children}</DashboardOutlet>
  }

  return children
}
