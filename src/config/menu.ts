import { Users, Key, LayoutDashboard } from 'lucide-react'
import React from 'react'
import type { LucideProps } from 'lucide-react'
import type { MenuItem } from '@/models/app/menu'
import { RoutesEnum } from '@/enum/routes..app'
import { routesConfig } from './routes.app'

export const createIcon = (IconComponent: React.ComponentType<LucideProps>) =>
  React.createElement(IconComponent)

export const menu: MenuItem[] = [
  {
    key: RoutesEnum.DASHBOARD,
    icon: createIcon(LayoutDashboard),
    label: 'Dashboard',
    authorized: routesConfig[RoutesEnum.DASHBOARD].roles,
    view: true,
  },
  {
    key: RoutesEnum.ROLES,
    icon: createIcon(Users),
    label: 'Roles',
    authorized: routesConfig[RoutesEnum.ROLES].roles,
    view: true,
  },
  {
    key: RoutesEnum.PERMISSIONS,
    icon: createIcon(Key),
    label: 'Permisos',
    authorized: routesConfig[RoutesEnum.PERMISSIONS].roles,
    view: true,
  },
]

function findMenuChain(
  items: MenuItem[],
  route: string
): MenuItem[] | undefined {
  for (const item of items) {
    const matches = item.key === route || route.startsWith(item.key)
    if (!matches) continue

    if (item.children?.length) {
      const childChain = findMenuChain(item.children, route)
      if (childChain) return [item, ...childChain]
    }

    return [item]
  }
  return undefined
}

export function selectMenuKeys(route: string): string[] {
  return findMenuChain(menu, route)?.map((item) => item.key) ?? []
}
