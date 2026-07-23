import { roles, type RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

type RouteConfig = {
  auth: boolean
  roles: RoleName[]
  permission: string[]
  title: string
  search: boolean
}

export const routesConfig: Record<RoutesEnum, RouteConfig> = {
  [RoutesEnum.ROOT]: {
    auth: false,
    roles: [],
    permission: ['*'],
    title: 'Inicio',
    search: false,
  },
  [RoutesEnum.LOGIN]: {
    auth: false,
    roles: [],
    permission: ['*'],
    title: 'Login',
    search: false,
  },
  [RoutesEnum.DASHBOARD]: {
    auth: true,
    roles: [roles.super_admin, roles.admin, roles.all],
    permission: ['*'],
    title: 'Dashboard',
    search: true,
  },
  [RoutesEnum.ROLES]: {
    auth: true,
    roles: [roles.super_admin, roles.admin],
    permission: ['*'],
    title: 'Roles',
    search: true,
  },
  [RoutesEnum.PERMISSIONS]: {
    auth: true,
    roles: [roles.super_admin],
    permission: ['*'],
    title: 'Permisos',
    search: true,
  },
} as const
