import { LayoutDashboard, Key, Palette, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { roles, type RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'
import { matchRoute } from '@/utils/route-matcher'

export const AuthMode = {
  public: 'public',
  optional: 'optional',
  protected: 'protected',
} as const
export type AuthMode = (typeof AuthMode)[keyof typeof AuthMode]

export type RouteShell = 'public' | 'dashboard'

export type RouteMenuMeta = {
  icon: ComponentType<LucideProps>
  label: string
  order: number
}

type RouteDefinition = {
  shell: RouteShell
  auth: AuthMode
  roles?: RoleName[]
  permission?: string[]
  title: string
  search?: boolean
  menu?: RouteMenuMeta
  guestOnly?: boolean
}

export type RouteConfig = {
  shell: RouteShell
  auth: AuthMode
  roles: RoleName[]
  permission: string[]
  title: string
  search: boolean
  menu?: RouteMenuMeta
  guestOnly: boolean
}

const routeDefinitions: Record<RoutesEnum, RouteDefinition> = {
  [RoutesEnum.ROOT]: {
    shell: 'public',
    auth: AuthMode.public,
    title: 'Inicio',
    guestOnly: true,
  },
  [RoutesEnum.LOGIN]: {
    shell: 'public',
    auth: AuthMode.public,
    title: 'Login',
    guestOnly: true,
  },
  [RoutesEnum.DASHBOARD]: {
    shell: 'dashboard',
    auth: AuthMode.protected,
    roles: [roles.super_admin, roles.admin, roles.all],
    title: 'Dashboard',
    search: true,
    menu: { icon: LayoutDashboard, label: 'Dashboard', order: 1 },
  },
  [RoutesEnum.DASHBOARD_ROLES]: {
    shell: 'dashboard',
    auth: AuthMode.protected,
    roles: [roles.super_admin, roles.admin],
    title: 'Roles',
    search: true,
    menu: { icon: Users, label: 'Roles', order: 2 },
  },
  [RoutesEnum.DASHBOARD_PERMISSIONS]: {
    shell: 'dashboard',
    auth: AuthMode.protected,
    roles: [roles.super_admin],
    title: 'Permisos',
    search: true,
    menu: { icon: Key, label: 'Permisos', order: 3 },
  },
  [RoutesEnum.DASHBOARD_THEME]: {
    shell: 'dashboard',
    auth: AuthMode.protected,
    roles: [roles.super_admin, roles.admin, roles.all],
    title: 'Tema',
    search: false,
    menu: { icon: Palette, label: 'Tema', order: 4 },
  },
  [RoutesEnum.PUBLIC_PRODUCTS]: {
    shell: 'public',
    auth: AuthMode.public,
    title: 'Productos',
  },
}

const buildRouteConfig = (definition: RouteDefinition): RouteConfig => ({
  shell: definition.shell,
  auth: definition.auth,
  roles:
    definition.auth === AuthMode.protected
      ? (definition.roles ?? [roles.all])
      : [],
  permission: definition.permission ? [...definition.permission] : ['*'],
  title: definition.title,
  search: definition.search ?? false,
  menu: definition.menu,
  guestOnly: definition.guestOnly ?? false,
})

export const routesConfig = (
  Object.keys(routeDefinitions) as RoutesEnum[]
).reduce(
  (config, path) => {
    config[path] = buildRouteConfig(routeDefinitions[path])
    return config
  },
  {} as Record<RoutesEnum, RouteConfig>
)

export function findRouteConfig(pathname: string): RouteConfig | undefined {
  const matchedKey = (Object.keys(routesConfig) as RoutesEnum[]).find((key) =>
    matchRoute(key, pathname)
  )
  return matchedKey ? routesConfig[matchedKey] : undefined
}
