import { routesConfig } from '@/config/routes.app'
import type { RoleName } from '@/enum/role'
import type { RoutesEnum } from '@/enum/routes..app'
import { matchRoute } from '@/utils/route-matcher'

export function isAuthorized(role: RoleName, currentPath: string): boolean {
  const matchedRouteKey = Object.keys(routesConfig).find((routeKey) => {
    return matchRoute(routeKey, currentPath)
  }) as RoutesEnum | undefined

  if (!matchedRouteKey) return false

  const routeData = routesConfig[matchedRouteKey]

  if (routeData) {
    return routeData.roles.includes(role) || routeData.roles.includes('*')
  }

  return false
}
