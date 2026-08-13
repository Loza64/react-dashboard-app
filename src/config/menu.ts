import React from 'react'
import type { MenuItem } from '@/models/app/menu'
import { RoutesEnum } from '@/enum/routes..app'
import { routesConfig, type RouteMenuMeta } from './routes.app'

/**
 * El menú lateral ya no se mantiene a mano: se arma solo a partir de las
 * rutas registradas en `routesConfig` que definen `menu`. Agregar una ruta
 * nueva al sidebar es agregar el bloque `menu: {...}` en su definición de
 * routes.app.ts, nada más.
 */
function buildMenuFromRoutes(): MenuItem[] {
  const items: {
    path: RoutesEnum
    meta: RouteMenuMeta
    roles: MenuItem['authorized']
  }[] = []

  for (const path of Object.keys(routesConfig) as RoutesEnum[]) {
    const route = routesConfig[path]
    if (!route.menu) continue
    items.push({ path, meta: route.menu, roles: route.roles })
  }

  return items
    .sort((a, b) => a.meta.order - b.meta.order)
    .map(({ path, meta, roles }) => ({
      key: path,
      icon: React.createElement(meta.icon),
      label: meta.label,
      authorized: roles,
      view: true,
    }))
}

export const menu: MenuItem[] = buildMenuFromRoutes()

function findMenuChain(
  items: MenuItem[],
  route: string,
  ancestors: MenuItem[] = []
): MenuItem[] | undefined {
  let best: MenuItem[] | undefined

  for (const item of items) {
    const matches = item.key === route || route.startsWith(`${item.key}/`)
    if (!matches) continue

    const chain = item.children?.length
      ? (findMenuChain(item.children, route, [...ancestors, item]) ?? [
          ...ancestors,
          item,
        ])
      : [...ancestors, item]

    // Con rutas anidadas (ej. /dashboard y /dashboard/roles) puede haber
    // más de una coincidencia por prefijo; nos quedamos con la más
    // específica (la de key más largo).
    if (!best || chain.at(-1)!.key.length > best.at(-1)!.key.length) {
      best = chain
    }
  }

  return best
}

export function selectMenuKeys(route: string): string[] {
  return findMenuChain(menu, route)?.map((item) => item.key) ?? []
}
