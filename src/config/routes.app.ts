import { LayoutDashboard, Key, Palette, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { roles, type RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

export const routeGroups: Record<
  'public' | 'dashboard',
  {
    shell: 'public' | 'dashboard'
    authRequired: boolean
    defaultRoles: RoleName[]
    description: string
  }
> = {
  public: {
    shell: 'public',
    authRequired: false,
    defaultRoles: [],
    description: 'Rutas abiertas para visitantes o contenido público',
  },
  dashboard: {
    shell: 'dashboard',
    authRequired: true,
    defaultRoles: [roles.all],
    description: 'Rutas protegidas con layout de dashboard',
  },
}

export type RouteGroup = keyof typeof routeGroups
export type RouteShell = (typeof routeGroups)[RouteGroup]['shell']

export type RouteMenuMeta = {
  icon: ComponentType<LucideProps>
  label: string
  order: number
}

type RouteDefinition = {
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
  shell: RouteShell
  auth: boolean
  roles: RoleName[]
  permission: string[]
  title: string
  search: boolean
  menu?: RouteMenuMeta
  guestOnly: boolean
}

const routeDefinitions: Record<RoutesEnum, RouteDefinition> = {
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
  [RoutesEnum.DASHBOARD_THEME]: {
    group: 'dashboard',
    roles: [roles.super_admin, roles.admin, roles.all],
    title: 'Tema',
    search: false,
    menu: { icon: Palette, label: 'Tema', order: 4 },
  },
  [RoutesEnum.PUBLIC_PRODUCTS]: {
    group: 'public',
    title: 'Productos',
  },
}

const buildRouteConfig = (
  _path: RoutesEnum,
  definition: RouteDefinition
): RouteConfig => {
  const groupConfig = routeGroups[definition.group]

  return {
    group: definition.group,
    shell: groupConfig.shell,
    auth: groupConfig.authRequired,
    roles: definition.roles
      ? [...definition.roles]
      : [...groupConfig.defaultRoles],
    permission: definition.permission ? [...definition.permission] : ['*'],
    title: definition.title,
    search: definition.search ?? false,
    menu: definition.menu,
    guestOnly: definition.guestOnly ?? false,
  }
}

export const routesConfig = (
  Object.keys(routeDefinitions) as RoutesEnum[]
).reduce(
  (config, path) => {
    config[path] = buildRouteConfig(path, routeDefinitions[path])
    return config
  },
  {} as Record<RoutesEnum, RouteConfig>
)

export const getRouteShell = (route?: RouteConfig): RouteShell | undefined =>
  route?.shell

export const isProtectedRoute = (route?: RouteConfig) => !!route && route.auth
