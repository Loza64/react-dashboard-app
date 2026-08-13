import { LayoutDashboard, Key, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'
import { roles, type RoleName } from '@/enum/role'
import { RoutesEnum } from '@/enum/routes..app'

/**
 * Un "grupo" describe cómo se comporta una sección completa de rutas:
 * si requiere sesión, y qué roles tienen acceso por defecto.
 *
 * Para agregar una sección nueva (ej. "reports" que requiera auth pero sin
 * roles específicos) solo hay que sumar una entrada aquí. OutletContainer
 * usa el `group` únicamente para decidir qué Outlet renderiza cada ruta
 * (ver ui/outlet/OutletContainer.tsx); el layout en sí vive en el Outlet
 * de cada grupo (ej. DashboardOutlet), no acá.
 */
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
  /** Controla el orden dentro del sidebar. Menor = más arriba. */
  order: number
}

type RouteOverrides = {
  group: RouteGroup
  roles?: RoleName[]
  permission?: string[]
  title: string
  search?: boolean
  /** Si se define, la ruta aparece automáticamente en el menú lateral. */
  menu?: RouteMenuMeta
  /**
   * Solo para rutas públicas: si un usuario YA logueado entra acá, se lo
   * redirige al dashboard en vez de mostrarle la página (útil para
   * '/login' o '/'). Rutas públicas normales (ej. '/public/products') no
   * necesitan esto: deben verse igual con o sin sesión.
   */
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

/**
 * Registro central de rutas. Para agregar una ruta nueva:
 *   1. Sumar su path en `RoutesEnum` (src/enum/routes..app.ts)
 *   2. Registrarla acá con su `group` y su `title`
 *   3. Crear el archivo en src/pages siguiendo la misma carpeta del path
 *
 * Con eso el guard de autenticación/roles, el título+buscador del header
 * y el ítem del menú lateral (si se define `menu`) quedan listos solos.
 */
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
