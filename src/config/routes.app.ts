import { LayoutDashboard, Key, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { roles, type RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

export const routeGroups = {
  public: {
    auth: false,
    roles: [] as RoleName[],
  },
  dashboard: {
    auth: true,
    roles: [roles.all] as RoleName[],
  },
} as const

export type RouteGroup = keyof typeof routeGroups

export type RouteMenuMeta = {
  icon: ComponentType<LucideProps>
  label: string
  order: number
}

type RouteOverrides = {
  group: RouteGroup
  roles?: RoleName[]
  permission?: string[]
  title: string
  search?: boolean
  menu?: RouteMenuMeta
  guestOnly?: boolean
}

export type RouteConfig = {
  group: RouteGroup
  auth: boolean
  roles: RoleName[]
  permission: string[]
  title: string
  search: boolean
  menu?: RouteMenuMeta
  guestOnly: boolean
}

const routeDefinitions: Record<RoutesEnum, RouteOverrides> = {
  [RoutesEnum.ROOT]: {
    group: 'public',
    title: 'Inicio',
    guestOnly: true,
  },
  [RoutesEnum.LOGIN]: {
    group: 'public',
    title: 'Login',
    guestOnly: true,
  },
  [RoutesEnum.DASHBOARD]: {
    group: 'dashboard',
    roles: [roles.super_admin, roles.admin, roles.all],
    title: 'Dashboard',
    search: true,
    menu: { icon: LayoutDashboard, label: 'Dashboard', order: 1 },
  },
  [RoutesEnum.DASHBOARD_ROLES]: {
    group: 'dashboard',
    roles: [roles.super_admin, roles.admin],
    title: 'Roles',
    search: true,
    menu: { icon: Users, label: 'Roles', order: 2 },
  },
  [RoutesEnum.DASHBOARD_PERMISSIONS]: {
    group: 'dashboard',
    roles: [roles.super_admin],
    title: 'Permisos',
    search: true,
    menu: { icon: Key, label: 'Permisos', order: 3 },
  },
  // Ejemplo pedido: una sección nueva "public/products", sin auth, sin
  // roles y sin tocar OutletContainer/AppOutlet/permission.app.ts.
  [RoutesEnum.PUBLIC_PRODUCTS]: {
    group: 'public',
    title: 'Productos',
  },
}

function buildRoutesConfig(
  definitions: Record<RoutesEnum, RouteOverrides>
): Record<RoutesEnum, RouteConfig> {
  const entries = Object.entries(definitions) as [RoutesEnum, RouteOverrides][]

  return entries.reduce(
    (config, [path, override]) => {
      const groupDefaults = routeGroups[override.group]

      config[path] = {
        group: override.group,
        auth: groupDefaults.auth,
        roles: override.roles ?? groupDefaults.roles,
        permission: override.permission ?? ['*'],
        title: override.title,
        search: override.search ?? false,
        menu: override.menu,
        guestOnly: override.guestOnly ?? false,
      }

      return config
    },
    {} as Record<RoutesEnum, RouteConfig>
  )
}

export const routesConfig = buildRoutesConfig(routeDefinitions)
