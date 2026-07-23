# Documentación Técnica — Panel Admin (React + SDK propio)

## 1. Visión general

Es un panel administrativo **React + TypeScript** (Vite, por `import.meta.env` y `vite-env.d.ts`) con:

- **Enrutamiento por archivos**: `@generouted/react-router/lazy` (las rutas se generan a partir de `src/pages/*`).
- **Server state**: `@tanstack/react-query` (`useQuery`, `useMutation`, `useInfiniteQuery`).
- **Estado global/persistente**: `recoil` + cifrado con `crypto-js` en `localStorage`.
- **UI Kit**: `antd` (Ant Design) + Tailwind (clases utilitarias) + `lucide-react` (íconos).
- **HTTP**: `axios`, encapsulado en un **SDK propio** tipo "ORM de API REST" genérico.
- **Validación de esquemas**: `zod` (solo para lo persistido en Recoil/localStorage).
- **Notificaciones**: `react-toastify` (errores globales / axios) + `antd message` (feedback de formularios).

Patrón general: **Service (SDK) → Hook genérico (React Query) → Vista (antd)**. Todo endpoint CRUD reutiliza la misma clase `Service` y los mismos hooks (`useFindAll`, `useCrud`, `useInfiniteFindAll`), evitando repetir lógica de fetching por entidad.

---

## 2. Estructura de carpetas

```
src/
├── api/                  # Instancias concretas de servicios (uno por entidad)
│   ├── index.ts
│   └── custom/UserService.ts
├── sdk/                  # SDK genérico de acceso a API (motor CRUD)
│   ├── core/
│   │   ├── AxiosConfig.ts
│   │   ├── SdkSettings.ts
│   │   └── Service.ts
│   └── model/
│       ├── core/AbstractService.ts
│       ├── entities/BaseEntity.ts
│       └── response/{BaseResponse,PaginationResponse,SessionResponse,ErrorResponse}.ts
├── hooks/
│   ├── core/
│   │   ├── useCrud.ts
│   │   ├── useFindAll.ts
│   │   ├── useInfiniteFindAll.ts
│   │   ├── useQueryParams.ts
│   │   └── useRecoilStorage.ts
│   └── useSession.ts
├── context/
│   ├── SessionContext.ts
│   └── providers/SessionProvider.tsx
├── models/
│   ├── entities/{User,Role,Permissions}.ts
│   └── app/{menu.ts, context/SessionType.ts, photos/*.ts}
├── config/
│   ├── routes.app.ts     # matriz de permisos/rutas
│   ├── menu.ts           # menú lateral
│   ├── queryClient.ts    # QueryClient + queryKeys
│   └── antd.ts           # theming de Ant Design
├── enum/
│   ├── role.ts
│   └── routes..app.ts
├── components/core/SelectApi.tsx   # <Select> con fetching remoto genérico
├── ui/                    # componentes de layout / media
│   ├── outlet/{OutletContainer,OutletMenu}.tsx
│   ├── Media.tsx
│   └── AvatarUploader.tsx
├── views/                 # pantallas (lógica de negocio + antd)
│   ├── login/LoginView.tsx
│   ├── dashboard/DashboardView.tsx
│   ├── roles/RolesView.tsx
│   ├── permissions/PermissionsView.tsx
│   ├── AppOutlet.tsx
│   ├── NotFoundView.tsx
│   └── ForbiddenView.tsx
├── pages/                 # rutas de generouted (solo enlazan a views/)
├── utils/{permission.app.ts, errorResponse.ts}
├── App.tsx
└── main.tsx
```

## 3. El SDK (`src/sdk`)

El SDK es la pieza central: un cliente HTTP genérico y tipado para exponer operaciones CRUD estándar contra cualquier endpoint REST.

### 3.1 `SdkSettings` (`sdk/core/SdkSettings.ts`)

Singleton (`export const sdkSettings = new SdkSettings()`) que centraliza:

| Miembro | Descripción |
|---|---|
| `apiService` (getter) | Lee `import.meta.env.VITE_API_SERVICE`. Lanza error si no existe. |
| `secretKey` (getter) | Lee `import.meta.env.VITE_SECRET_KEY`. Usado para cifrar Recoil/localStorage. |
| `token` (getter/setter) | Lee/escribe el JWT en `localStorage` (clave `"token"`). |
| `removeToken()` | Elimina el token. |

Es inyectable: recibe un `storage` custom en el constructor (por defecto `localStorage`), útil para tests o SSR.

**Variables de entorno requeridas** (`.env`):
```
VITE_API_SERVICE=https://api.tu-backend.com
VITE_SECRET_KEY=una_clave_secreta_para_cifrar_recoil
```

### 3.2 `AxiosConfig` (`sdk/core/AxiosConfig.ts`)

Factory que crea una instancia de axios por servicio:

```ts
AxiosConfig({ origin, initPath }) // baseURL = `${origin}/${initPath}`
```

- **Interceptor de request**: agrega `Authorization: Bearer <token>` automáticamente desde `sdkSettings.token`; si el payload es `FormData`, elimina el header `Content-Type` para que el navegador lo setee con el boundary correcto.
- **Interceptor de response** (manejo global de errores):
  - `401` → si se pasó `onUnauthorized` en la config de la petición, lo ejecuta; si no, muestra un toast de sesión expirada, borra el token, limpia el cache de `session` en React Query y redirige a `/login`.
  - `403` → si hay `onForbidden`, lo ejecuta; si no, muestra un toast de "sin permiso".
  - Timeout por defecto: **60 segundos**.

### 3.3 `Service<Entity>` (`sdk/core/Service.ts`)

Implementación concreta de `AbstractService<Entity>`. Cada instancia representa un recurso REST (`endpoint`) y expone:

```ts
findAll(params)      // GET  {endpoint}
findById(params)     // GET  {endpoint}/{id}
findBy(params)       // GET  {endpoint}/{path}   (subrutas custom)
create(params)       // POST {endpoint}
update(params)       // PUT  {endpoint}/{id}
delete(params)       // DELETE {endpoint}/{id}
restore(params)      // PATCH {endpoint}/{id}/restore  (soft-delete undo)
```

Constructor:
```ts
new Service<Entity>({
  origin = sdkSettings.apiService, // por defecto usa el env
  initPath = 'api',                // prefijo de baseURL
  endpoint = '',                   // recurso, ej. 'roles'
})
```

Todos los métodos aceptan `config?: ServiceConfig` (= `AxiosRequestConfig` + `{ onUnauthorized?, onForbidden? }`), que se propaga a los interceptores de axios para permitir overrides puntuales del manejo 401/403.

### 3.4 Tipos del SDK (`sdk/model`)

```ts
// BaseEntity — toda entidad del dominio la extiende
interface BaseEntity {
  readonly id?: string | number
  name?: string
  readonly createdAt?: string
  readonly updatedAt?: string
  readonly deletedAt?: string
}

// PaginationResponse — forma estándar de las respuestas de findAll
interface PaginationResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    nextCursor: string
    pageCount: number
  }
}

// BaseResponse<T> = T (alias, respuesta simple no paginada)
// SessionResponse: { token: string; data: User }
// ErrorResponse: { status: number; message: string }
```

### 3.5 Crear un servicio nuevo (genérico)

```ts
// src/api/index.ts
import Service from '@/sdk/core/Service'
import Role from '@/models/entities/Role'

export const roleService = new Service<Role>({ endpoint: 'roles' })
```

### 3.6 Servicio custom (extendiendo `Service`)

Cuando un recurso necesita endpoints no-CRUD (ej. auth), se extiende la clase y se reutiliza `this.axios`:

```ts
// src/api/custom/UserService.ts
export default class UserService extends Service<User> {
  constructor() {
    super({ origin: sdkSettings.apiService, endpoint: '/users' })
  }

  async login({ username, password, onUnauthorized }) {
    const res = await this.axios.post<SessionResponse>(
      '/auth/login',
      { username, password },
      { onUnauthorized }
    )
    return res.data
  }

  async signUp({ payload }) {
    const res = await this.axios.post<SessionResponse>('/auth/signup', payload)
    return res.data
  }

  async profile() {
    const res = await this.axios.get<User>('/auth/profile')
    return res.data
  }
}
```

---

## 4. Hooks (`src/hooks`)

### 4.1 `useFindAll` — listado paginado (`hooks/core/useFindAll.ts`)

Envuelve `useQuery` de React Query sobre `service.findAll`.

```ts
const { data, isLoading, addItemInCache, updateItemInCache, removeItemInCache, emptyCache }
  = useFindAll<Role>({
    service: roleService,
    queryKey: queryKeys.roles,     // string | string[]
    queryParams: { page: 1, size: 15 }, // se pasan como query params HTTP
    endpoint: 'activos',           // opcional: override del endpoint base
  })
```

- `queryKey` final = `[...queryKey, endpoint ?? null, JSON.stringify(queryParams)]` (memoizado), así cada combinación de filtros/paginación tiene su propio cache.
- Expone helpers de **actualización optimista del cache** sin refetch: `addItemInCache`, `updateItemInCache(id, updater)`, `removeItemInCache(id)`, `emptyCache()`.
- Acepta cualquier opción estándar de `useQuery` (`enabled`, `staleTime`, etc.) vía spread.

### 4.2 `useCrud` — mutaciones + queries puntuales (`hooks/core/useCrud.ts`)

```ts
const crud = useCrud<Role>({ service: roleService, queryKey: queryKeys.roles })

await crud.create({ payload })
await crud.update({ id, payload })
await crud.delete({ id })
await crud.restore({ id })

crud.isCreating / crud.isUpdating / crud.isDeleting / crud.isRestoring
crud.createError / crud.updateError / crud.deleteError / crud.restoreError

const { data, isLoading } = crud.useFindById({ id: editingId }) // enabled: !!id
const { data } = crud.useFindByPath({ path: 'me/notifications' })
```

- Cada mutación invalida automáticamente `queryKey` en `onSuccess` (refetch del listado).
- `onUnauthorized`/`onForbidden` se pueden definir a nivel de hook (aplican a todas las operaciones) o sobreescribir por llamada individual.

### 4.3 `useInfiniteFindAll` — scroll infinito (`hooks/core/useInfiniteFindAll.ts`)

Igual a `useFindAll` pero sobre `useInfiniteQuery`. Requiere `getNextPageParam` (obligatorio) y opcionalmente `initialPageParam`. Expone los mismos helpers de cache (`addItemInCache` inserta en la primera página, etc.).

```ts
const { data, fetchNextPage, hasNextPage } = useInfiniteFindAll<User>({
  service: userService,
  queryKey: 'users-infinite',
  queryParams: { size: 20 },
  getNextPageParam: (lastPage) =>
    lastPage.pagination.page < lastPage.pagination.pageCount
      ? { page: lastPage.pagination.page + 1 }
      : undefined,
})
```

### 4.4 `useQueryParams` — sincronización con la URL (`hooks/core/useQueryParams.ts`)

Hook type-safe para leer/escribir parámetros de query string permitidos:

```ts
const { params, setUrlParam, removeUrlParam, setUrlParams } =
  useQueryParams(['search', 'page'] as const)

params.search       // string | null
setUrlParam('page', '2')
setUrlParams({ search: 'juan', page: '1' }, { replace: true })
removeUrlParam('search')
```

Se re-sincroniza en eventos `popstate` (botón atrás/adelante del navegador).

### 4.5 `useRecoilStorage` — estado persistente cifrado (`hooks/core/useRecoilStorage.ts`)

Combina `recoil` (`atomFamily`) + `zod` + `crypto-js` (AES) para persistir estado en `localStorage` de forma **cifrada** con `sdkSettings.secretKey`.

```ts
const [search, setSearch] = useRecoilStorage<string | undefined>('search', '')
```

Internamente valida el valor deserializado con un `ZodType` (por defecto `z.unknown()`); si la validación falla o el descifrado falla, limpia la clave corrupta del storage. Uso real en el proyecto: `searchRecoil` (`constants/recoil.ts`) para el buscador del layout.

### 4.6 `useSession` (`hooks/useSession.ts`)

```ts
const { profile, login, signup, saveSession, logout, loading } = useSession()
```
Lee el `SessionContext`; lanza error si se usa fuera de `<SessionProvider>`.

---

## 5. Contexto de sesión (`src/context`)

`SessionProvider` (`context/providers/SessionProvider.tsx`) es el corazón de autenticación:

- `useQuery(queryKeys.session)` → llama `userService.profile()` **solo si hay token** (`enabled: !!token`), sin reintentos.
- `loginMutation` / `signupMutation` envuelven `userService.login` / `userService.signUp`.
- `saveSession({ token, data })`: guarda el token en `sdkSettings`, setea el cache de `session` manualmente (evita un refetch extra) y navega a `/dashboard`.
- `logout()`: borra token, limpia cache de sesión, notifica con `antd message`, redirige a `/login` y hace `window.location.reload()` (limpia todo el estado de memoria/Recoil).
- Efecto de guardia: si terminó de cargar y **no hay token** y no estás en `/login`, redirige a `/login`.
- Mientras carga el perfil con token presente, muestra una pantalla de "Cargando sesión...".

`SessionType` (contrato expuesto por el contexto):
```ts
interface SessionType {
  profile?: User
  login: (payload: { username; password; onUnauthorized? }) => Promise<SessionResponse>
  signup: (payload: User) => Promise<SessionResponse>
  saveSession: (session: SessionResponse) => void
  logout: () => void
  loading: { profile: boolean; login: boolean; signup: boolean }
}
```

---

## 6. Modelos de dominio (`src/models/entities`)

```ts
interface User extends BaseEntity {
  username: string
  surname: string
  email: string
  password: string
  role?: Role
}

interface Role extends BaseEntity {
  name: RoleName          // 'ADMIN' | 'USER' | '*'
  permissions: Permissions[]
  active?: boolean
}

interface Permissions {
  id?: number
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  title?: string
}
```

Todas heredan (o pueden heredar) de `BaseEntity` del SDK, lo que las hace compatibles con `Service<Entity>` y los hooks genéricos sin escribir tipado adicional.

---

## 7. Enrutamiento y control de acceso

- **Generouted** (`@generouted/react-router/lazy`) genera las rutas a partir de `src/pages/**`. Cada archivo en `pages/` es un wrapper delgado que importa la vista real de `src/views/`.
- `RoutesEnum` (`enum/routes..app.ts`) centraliza los paths (`/`, `/login`, `/dashboard`, `/roles`, `/permissions`).
- `routesConfig` (`config/routes.app.ts`) define, por ruta: `auth` (requiere sesión), `roles` permitidos, `permission`, `title` (usado como encabezado de página) y `search` (si el layout muestra el buscador).
- `isAuthorized(role, route)` (`utils/permission.app.ts`) evalúa si el rol del usuario tiene acceso a la ruta.
- `OutletContainer` (`ui/outlet/OutletContainer.tsx`) es el guard central: si la ruta no existe en `routesConfig` → `NotFoundView`; si la ruta es pública pero hay sesión iniciada → `ForbiddenView`; si requiere auth, renderiza `OutletMenu` + el contenido. *(Nota: la línea `if (!allowed) return <ForbiddenView />` está comentada en el código actual, por lo que el chequeo de rol por ruta no se aplica todavía en runtime — queda como TODO.)*
- `menu.ts` (`config/menu.ts`) define el menú lateral (`MenuItem[]`) con íconos de `lucide-react`, filtrado por `authorized` (roles) usando `buildMenuItemsForAntd`.

---

## 8. Componentes reutilizables clave

### 8.1 `SelectApi<Entity>` (`components/core/SelectApi.tsx`)

`<Select>` de antd con **búsqueda remota** genérica contra cualquier `Service`:

```tsx
<SelectApi<Role>
  service={roleService}
  queryKey={queryKeys.roles}
  placeholder="Selecciona un rol"
  querySearch={(text) => ({ search: text })}   // opcional: mapea texto -> query params
  renderOption={(role) => role.name}             // opcional: custom label
  value={selectedRole}
  onChange={(role) => setSelectedRole(role)}
/>
```

- Debounce de 400ms sobre el texto de búsqueda (`lodash.debounce`).
- Carga diferida: solo hace fetch al abrir el dropdown (`onDropdownVisibleChange`).
- Devuelve la **entidad completa** seleccionada (no solo el id) vía `onChange`.

### 8.2 `Media` / `AvatarUploader` (`ui/Media.tsx`, `ui/AvatarUploader.tsx`)

Manejo de subida de imágenes con `antd Upload.Dragger`, soporte multi-imagen con soft-delete (`deleted: true` en vez de remover del array) y preview con `URL.createObjectURL`. Se integran como `Form.Item` de antd (`name="imageUrl"`).

### 8.3 `errorResponse` (`utils/errorResponse.ts`)

Normaliza cualquier error (axios o nativo) a `{ status, message }` y opcionalmente dispara un toast:

```ts
try {
  await crud.update({ id, payload })
} catch (error) {
  errorResponse({ error })              // muestra toast automáticamente
  // errorResponse({ error, alert: false }) // solo retorna el objeto normalizado
}
```

---

## 9. `queryClient` y `queryKeys` (`config/queryClient.ts`)

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,   // 5 min
      gcTime: 1000 * 60 * 30,     // 30 min
    },
  },
})

export const queryKeys = {
  session: ['session'],
  users: ['users'],
  roles: ['roles'],
  permissions: ['permissions'],
}
```

Se usa como fuente única de `queryKey` para evitar strings mágicos repetidos entre vistas.

---

## 10. Ejemplo end-to-end: CRUD de Roles

`views/roles/RolesView.tsx` combina todo lo anterior:

```tsx
const { data: response, isLoading } = useFindAll<Role>({
  queryKey: queryKeys.roles,
  service: roleService,
  queryParams: { page: 1, size: 15 },
})

const { data: permissionsResponse } = useFindAll<Permissions>({
  queryKey: queryKeys.permissions,
  service: permissionService,
  queryParams: { page: 0, size: 1000 },
})

const crud = useCrud<Role>({ service: roleService, queryKey: queryKeys.roles })
const { data: roleDetail } = crud.useFindById({ id: editingId })

// Crear/editar
await crud.create({ payload: { name, permissions: ids.map(id => ({ id })) } })
await crud.update({ id: editingId, payload })

// Tabla + paginación server-side con antd <Table onChange>
<Table
  dataSource={response?.data}
  pagination={{
    current: response?.pagination.page,
    pageSize: response?.pagination.pageSize,
    total: response?.pagination.total,
  }}
  onChange={(pagination) => setParams(prev => ({ ...prev, page: pagination.current, size: pagination.pageSize }))}
/>
```

Este mismo patrón se repite en `DashboardView.tsx` (usuarios) y `PermissionsView.tsx` (permisos), cambiando únicamente el `Service` y las columnas de la tabla — es la prueba de que el SDK + hooks generalizan bien cualquier recurso CRUD nuevo.

---

## 11. Cómo agregar un nuevo módulo CRUD (receta)

1. **Modelo**: crear `src/models/entities/MiEntidad.ts extends BaseEntity`.
2. **Servicio**: `export const miEntidadService = new Service<MiEntidad>({ endpoint: 'mi-entidad' })` en `src/api/index.ts`.
3. **Query key**: agregar `miEntidad: ['mi-entidad']` en `config/queryClient.ts`.
4. **Ruta**: agregar entrada en `RoutesEnum` + `routesConfig` (`auth`, `roles`, `title`) y opcionalmente en `menu.ts`.
5. **Página**: crear `src/pages/mi-entidad/index.tsx` que renderiza `src/views/mi-entidad/MiEntidadView.tsx`.
6. **Vista**: usar `useFindAll` (listado) + `useCrud` (mutaciones) + `antd Table/Form/Modal`, siguiendo el patrón de `RolesView.tsx`.

No hace falta tocar el SDK ni los hooks — son 100% genéricos sobre `BaseEntity`.

---

## 12. Dependencias identificadas (por imports, sin `package.json`)

| Paquete | Uso |
|---|---|
| `react`, `react-dom` | Base |
| `@generouted/react-router/lazy`, `react-router-dom` | Enrutamiento por archivos |
| `@tanstack/react-query` | Server state / cache |
| `axios` | Cliente HTTP |
| `antd`, `@ant-design/icons` | UI Kit |
| `recoil` | Estado global persistente |
| `zod` | Validación de esquemas (Recoil storage) |
| `crypto-js` | Cifrado AES de localStorage |
| `react-toastify` | Notificaciones globales (errores HTTP) |
| `lucide-react` | Íconos del menú |
| `lodash.debounce` | Debounce de búsqueda en `SelectApi` |
| `dayjs` | Fechas (locale `es`) |
| Tailwind (utility classes) | Estilos |
| Vite (`import.meta.env`, `vite-env.d.ts`) | Bundler/entorno |

---