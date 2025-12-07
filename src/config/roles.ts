import {
  Users,
} from 'lucide-react'
import React from 'react'

export const roles = {
  admin: 'ADMIN',
} as const

export type RoleName = (typeof roles)[keyof typeof roles]

export const routes = {
  app: '/',
  dashboard: '/dashboard',
  login: '/login',
} as const

export type Route = (typeof routes)[keyof typeof routes]

export const authorizations: Record<RoleName, readonly Route[]> = {
  [roles.admin]: [
    routes.dashboard,
    routes.app,
  ],
}

export function isAuthorized(role: RoleName, route: Route): boolean {
  const allowed = authorizations[role]
  return allowed ? allowed.includes(route) : false
}

interface MenuItem {
  key: Route
  icon: React.ReactNode
  label: string
  name: string
  view: boolean
}

export const menu = (role?: RoleName): MenuItem[] => {
  const isAdmin = role === roles.admin

  return [
    {
      key: routes.dashboard,
      icon: React.createElement(Users),
      label: 'Usuarios',
      name: 'Gestión de usuarios',
      view: isAdmin,
    },
  ]
}
