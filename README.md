# Documentación Técnica — Frontend (spring-app-template)

> Repositorio de referencia para pruebas: https://github.com/Loza64/spring-app-template.git

## 1. Descripción general

Aplicación **SPA (Single Page Application)** construida con **React + TypeScript + Vite**, orientada a la administración de usuarios, roles y permisos (panel de administración tipo backoffice). Consume una API REST (el backend de referencia es un proyecto Spring Boot, según el repositorio de prueba indicado) mediante Axios, con autenticación por token Bearer y control de acceso basado en roles/permisos.

### 1.1 Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework UI | React (con TSX) |
| Bundler / dev server | Vite (`import.meta.env`, `vite-env.d.ts`) |
| Lenguaje | TypeScript |
| Enrutamiento | `@generouted/react-router` (ruteo basado en archivos, carpeta `src/pages`) + `react-router-dom` |
| Librería de componentes UI | Ant Design (`antd`, `@ant-design/icons`) |
| Estilos utilitarios | Tailwind CSS (clases utilitarias en JSX) |
| Manejo de datos remotos | TanStack Query (`@tanstack/react-query`) |
| Cliente HTTP | Axios, con instancia centralizada e interceptores |
| Estado global/local persistente | Recoil (`atomFamily`) + `crypto-js` (cifrado AES en localStorage) |
| Validación de esquemas | Zod |
| Notificaciones | `react-toastify` (errores globales) y `antd message` (feedback puntual de formularios) |
| Fechas | `dayjs` (locale `es`) |
| Iconos | `lucide-react`, `@ant-design/icons` |
| Debounce | `lodash.debounce` |

### 1.2 Convención de capas

El proyecto separa responsabilidades en capas reutilizables:

```
pages/      → puntos de entrada de ruteo (generouted), delegan a views/
views/      → pantallas completas (lógica de negocio + composición de UI)
ui/         → componentes de presentación reutilizables (menú, uploader, media)
components/ → componentes "core" genéricos reutilizables entre entidades (SelectApi)
hooks/      → hooks reutilizables para consumo de API y utilidades (useCrud, useFindAll…)
services/   → capa de acceso a datos (Service genérico + servicios custom)
models/     → tipados de entidades, DTOs, contratos de API
config/     → configuración estática (rutas, menú, tema de Ant Design, entorno)
context/    → contexto de sesión de usuario (React Context)
enum/       → enumeraciones (rutas, roles)
utils/      → utilidades puras (manejo de errores, permisos)
constants/  → constantes compartidas
```

---

## 2. Arranque de la aplicación

**`main.tsx`** monta la raíz de React e importa los estilos globales (`styles/index.css`).

**`App.tsx`** es el componente raíz y compone, en este orden:

1. `ToastContainer` (react-toastify) — notificaciones globales.
2. `RecoilRoot` — proveedor de estado atómico de Recoil.
3. `QueryClientProvider` — proveedor de TanStack Query, usando la instancia `queryClient` exportada desde `lib/queryClient.ts`.
4. `<Routes />` de `@generouted/react-router/lazy` — genera las rutas automáticamente a partir de la estructura de `src/pages`.

También configura `dayjs.locale('es')` para formateo de fechas en español.

### 2.1 Ruteo basado en archivos (`src/pages`)

| Archivo | Ruta resultante | Vista |
|---|---|---|
| `pages/_app.tsx` | Layout raíz (envuelve todas las rutas) | `views/AppOutlet.tsx` |
| `pages/index.tsx` | `/` | Redirige a `/dashboard` |
| `pages/login/index.tsx` | `/login` | `views/login/LoginView.tsx` |
| `pages/dashboard/index.tsx` | `/dashboard` | `views/dashboard/DashboardView.tsx` |
| `pages/roles/index.tsx` | `/roles` | `views/roles/RolesView.tsx` |
| `pages/permissions/index.tsx` | `/permissions` | `views/permissions/PermissionsView.tsx` |

Cada `pages/*/index.tsx` es un simple *wrapper* que importa y renderiza su vista correspondiente desde `views/`, manteniendo el ruteo desacoplado de la lógica de pantalla.

### 2.2 Layout raíz (`views/AppOutlet.tsx`)

Envuelve todas las páginas con:

- `SessionProvider` — contexto de sesión (autenticación).
- `ConfigProvider` de Ant Design — tema personalizado (`config/antd.ts`) y locale en español (`antd/locale/es_ES`).
- `Layout` de Ant Design + `OutletContainer` — layout visual con menú lateral y `<Outlet />` de React Router para renderizar la vista activa.

---

## 3. Sesión y autenticación

### 3.1 `AppSettings` (`AppSettings.ts`)

Clase responsable de la persistencia del token de sesión:

- `token` (getter/setter): lee/escribe el token en `localStorage` (o el storage inyectado por constructor).
- `removeToken()`: elimina el token.
- `apiService`: obtiene la URL base de la API desde `VITE_API_SERVICE` (variable de entorno).
- `secretKey`: obtiene una clave desde `VITE_SECRET_KEY`, usada para cifrar datos en `localStorage` (ver `useRecoilStorage`).

Se exporta una instancia singleton: `appSettings`.

### 3.2 `SessionContext` / `useSession` / `SessionProvider`

- **`SessionContext.ts`**: contexto de React tipado con `SessionType`.
- **`useSession.ts`**: hook que consume el contexto; lanza un error explícito si se usa fuera del `SessionProvider`.
- **`SessionProvider.tsx`**: implementa toda la lógica de sesión:
  - Consulta el perfil del usuario autenticado (`userService.profile()`) vía TanStack Query, solo si existe un `token` (`enabled: !!token`).
  - Expone mutaciones `login` y `signup` que delegan en `userService`.
  - `saveSession`: persiste el token, cachea el perfil en TanStack Query y navega a `/dashboard`.
  - `logout`: borra el token, limpia la cache de sesión, notifica con un mensaje y redirige a `/login` (con recarga completa de la página).
  - Redirige automáticamente a `/login` si no hay token y la ruta actual no es `/login`.
  - Muestra una pantalla de carga (`Cargando sesión...`) mientras se resuelve el perfil, si existe un token.

### 3.3 Interceptores HTTP (`services/utils/axiosInstance.ts`)

La instancia de Axios (`axiosInstance`) agrega:

- **Interceptor de request**: adjunta `Authorization: Bearer <token>` si existe token; si el payload es `FormData`, elimina el header `Content-Type` para que el navegador lo gestione automáticamente (necesario para *multipart*).
- **Interceptor de response** (manejo centralizado de errores):
  - `401 Unauthorized`: si se define un callback `onUnauthorized` en la config de la petición, se ejecuta; si no, se limpia la sesión, se notifica con un `toast.warning` y se redirige a `/login`.
  - `403 Forbidden`: si se define `onForbidden`, se ejecuta; si no, se muestra un `toast.warning` genérico.
  - En ambos casos, los callbacks son inyectables por request (tipado extendido en `types/axios.d.ts`), permitiendo comportamiento distinto por pantalla/formulario (por ejemplo, mostrar un error de "credenciales inválidas" en el login en vez de redirigir).

---

## 4. Control de acceso (roles y rutas)

### 4.1 Roles (`enum/role.ts`)

```ts
roles = { admin: 'ADMIN', user: 'USER', all: '*' }
```

### 4.2 Enum de rutas (`enum/routes..app.ts`)

Define las rutas de la aplicación como enum (`RoutesEnum`): `ROOT`, `LOGIN`, `DASHBOARD`, `ROLES`, `PERMISSIONS`.

### 4.3 Configuración de rutas (`config/routes.app.ts`)

Mapa `routesConfig` que, por cada ruta, define:
- `auth`: si requiere sesión iniciada.
- `roles`: roles permitidos (`'*'` = todos).
- `permission`: permisos requeridos (reservado para uso futuro).
- `title`: título mostrado en el layout.
- `search`: si la vista muestra el input de búsqueda en el header.

### 4.4 `isAuthorized` (`utils/permission.app.ts`)

Función utilitaria que valida si un `role` tiene acceso a una ruta, según `routesConfig`.

### 4.5 Aplicación de las reglas (`OutletContainer.tsx`)

Es el punto central donde se resuelven las reglas de acceso en cada navegación:
- Si la ruta no existe en `routesConfig` → `NotFoundView` (404).
- Si la ruta **no requiere auth** y hay usuario logueado → `ForbiddenView` (evita, por ejemplo, ver `/login` estando autenticado).
- Si la ruta no requiere auth y no hay usuario → renderiza los `children` directamente (pantalla pública).
- Si requiere auth → se calcula `allowed` con `isAuthorized`, se renderiza el menú lateral (`OutletMenu`) y el contenido (`children`).

### 4.6 Menú dinámico (`config/menu.ts` + `OutletMenu.tsx`)

- `menu`: array de `MenuItem` (Dashboard, Roles, Permisos) con ícono, ruta y roles autorizados.
- `OutletMenu` filtra dinámicamente los ítems de menú (y submenús) según el rol del usuario autenticado, y resalta la ruta activa comparando `location.pathname` contra las claves del menú.
- Incluye una versión responsiva: sidebar colapsable en escritorio y panel deslizante a pantalla completa en móvil (controlado por la prop `isMobile`, actualmente fijada en `false` de forma estática en `AppOutlet`).

---

## 5. Capa de acceso a datos (Servicios)

### 5.1 Contrato (`models/api/core/AbstractService.ts`)

Clase abstracta genérica `AbstractService<Entity>` que define el contrato CRUD estándar:

```ts
findAll(params) → Promise<PaginationResponse<Entity>>
findById(params) → Promise<BaseResponse<Entity>>
findBy(params)   → Promise<BaseResponse<Entity>>   // búsqueda por path custom
create(params)   → Promise<BaseResponse<Entity>>
update(params)   → Promise<BaseResponse<Entity>>
delete(params)   → Promise<void>
restore(params)  → Promise<void>                    // soft-delete restore
```

Todos los parámetros aceptan `onUnauthorized` y `onForbidden` (para personalizar el manejo de 401/403 por operación) y un `config` de tipo `ServiceConfig` (extiende `AxiosRequestConfig`).

### 5.2 Implementación genérica (`services/core/Service.ts`)

`Service<Entity>` implementa `AbstractService<Entity>` de forma genérica y reutilizable para cualquier entidad:

- Construye su propia instancia de Axios vía `axiosInstance({ origin, initPath })`, con `origin` por defecto `appSettings.apiService` y `initPath` por defecto `'api'`.
- Resuelve URLs combinando el `endpoint` base de la instancia con un `id` o `path` opcional.
- Cada método CRUD delega en el verbo HTTP correspondiente (`GET`, `POST`, `PUT`, `DELETE`) e inyecta los callbacks `onUnauthorized`/`onForbidden` en la config de Axios.
- `restore` hace un `DELETE` a `"<endpoint>/<id>/restore"` (convención de soft-delete reversible).

### 5.3 Servicios concretos (`services/api/index.ts`)

```ts
userService        → new UserService()                         // custom
roleService         → new Service<Role>({ endpoint: 'roles' })
permissionService   → new Service<Permissions>({ endpoint: 'permissions' })
```

### 5.4 Servicio custom (`services/api/custom/UserService.ts`)

Extiende `Service<User>` (endpoint `/users`) y agrega métodos de autenticación que no siguen el patrón CRUD genérico:

- `login({ username, password, onUnauthorized })` → `POST /auth/login`
- `signUp({ payload })` → `POST /auth/signup`
- `profile()` → `GET /auth/profile`

### 5.5 Manejo de errores (`utils/errorResponse.ts`)

Función `errorResponse({ error, alert })` que normaliza cualquier error (Axios o nativo de JS) a un objeto `{ status, message }`, distinguiendo:
- Error de respuesta del servidor (con `status`/`message` del backend).
- Error de red (sin respuesta) → `status: 0`, mensaje genérico de conexión.
- Error de JS puro.

Por defecto muestra un `toast.error` (desactivable con `alert: false`). Se usa en los `catch` de las vistas (por ejemplo, al guardar formularios).

---

## 6. Hooks de datos (capa de integración con TanStack Query)

Estos hooks envuelven TanStack Query para estandarizar el consumo de los `Service`.

### 6.1 `useFindAll` (`hooks/core/useFindAll.ts`)

Hook para listados paginados:
- Normaliza `queryKey` (string o array) y serializa `queryParams` para generar una `finalQueryKey` estable (evita refetch innecesario por referencias de objeto distintas con el mismo contenido).
- Expone, además del resultado estándar de `useQuery`, helpers de manipulación optimista de caché: `addItemInCache`, `updateItemInCache`, `removeItemInCache`, `emptyCache`.
- Devuelve un valor "seguro" por defecto (`EMPTY_PAGINATION`) cuando la caché aún no tiene datos.

### 6.2 `useInfiniteFindAll` (`hooks/core/useInfiniteFindAll.ts`)

Variante para scroll infinito, basada en `useInfiniteQuery`. Misma filosofía de `queryKey` estable y helpers de caché, mapeando sobre `pages` en lugar de un único arreglo `data`.

### 6.3 `useCrud` (`hooks/core/useCrud.ts`)

Hook que expone mutaciones CRUD completas para una entidad (`create`, `update`, `delete`, `restore`), cada una invalidando automáticamente la `queryKey` asociada al éxito. También expone:
- `useFindById`: `useQuery` habilitado solo si hay un `id`, para precargar datos en modales de edición.
- `useFindByPath` (alias `useFindBy`): búsqueda por un `path` custom.
- Flags de estado (`isCreating`, `isUpdating`, etc.) y errores por operación.

### 6.4 `useQueryParams` (`hooks/core/useQueryParams.ts`)

Hook para sincronizar estado con parámetros de la URL (`URLSearchParams`), sin depender de una librería de ruteo específica: expone `params`, `setUrlParam`, `removeUrlParam`, `setUrlParams`, y escucha el evento `popstate` para mantenerse sincronizado con la navegación del navegador.

### 6.5 `useRecoilStorage` / `localStorageEffectWithZod` (`hooks/core/useRecoilStorage.ts`)

- `localStorageEffectWithZod`: *effect* de Recoil que persiste el estado de un átomo en `localStorage`, **cifrado con AES** (`crypto-js`, usando `appSettings.secretKey`) y validado con un esquema **Zod** al leerlo (si la validación falla, se descarta el valor corrupto/alterado).
- `dynamicRecoilFamily`: `atomFamily` de Recoil que crea un átomo por cada `key` string, usando el effect anterior.
- `useRecoilStorage(key, defaultValue)`: hook de conveniencia que expone `[state, setState]` como `useState`, inicializando con `defaultValue` si no hay valor persistido.
- Uso actual: persistir el texto de búsqueda del header (`searchRecoil`, en `constants/recoil.ts`).

---

## 7. Modelos y tipado (`models/`)

### 7.1 Núcleo (`models/api/core/`)

- **`_BaseEntity.ts`**: interfaz base que todas las entidades extienden (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`, todos opcionales/readonly).
- **`PaginationResponse.ts`**: forma estándar de una respuesta paginada (`data: T[]`, `pagination: { total, page, pageSize, nextCursor, pageCount }`).
- **`BaseResponse.ts`**: alias de tipo (`BaseResponse<T> = T`) para respuestas de un único recurso.
- **`AbstractService.ts`**: descrito en la sección 5.1.

### 7.2 Entidades (`models/api/entities/`)

- **`User.ts`**: `username`, `surname`, `email`, `password`, `role?` (extiende `BaseEntity`, que ya aporta `name`).
- **`Role.ts`**: `name: RoleName`, `permissions: Permissions[]`, `active?`.
- **`Permissions.ts`**: `path`, `method?` (`GET | POST | PUT | DELETE`), `title?`.

### 7.3 Otros modelos

- **`SessionResponse.ts`**: `{ token, data: User }` — respuesta de login/signup.
- **`ErrorResponse.ts`**: `{ status, message }` — forma esperada del error del backend.
- **`SessionType.ts`**: contrato del contexto de sesión (perfil, funciones de login/signup/logout, flags de carga).
- **`app/menu.ts`**: `MenuItem` / `SubMenuItem` — estructura del menú de navegación.
- **`photos/AvatarUpload.ts`** y **`photos/UploadMedia.ts`**: extienden `UploadFile` de Ant Design para el manejo de imágenes (avatar único vs. galería múltiple).

---

## 8. Componentes y UI reutilizable

### 8.1 `SelectApi` (`components/core/SelectApi.tsx`)

Componente `<Select>` de Ant Design genérico y reutilizable para **búsqueda remota paginada** contra cualquier `AbstractService`:
- Búsqueda con *debounce* de 400ms (`lodash.debounce`).
- Carga diferida: solo dispara la consulta cuando el dropdown se abre por primera vez (`onDropdownVisibleChange` → `loaded`).
- Soporta un `value` seleccionado que no esté en la página actual de resultados (lo inyecta como opción adicional).
- `renderOption` permite personalizar la etiqueta mostrada por entidad.
- Usado actualmente en `DashboardView` para seleccionar el `Role` de un usuario.

### 8.2 `AvatarUploader` (`ui/AvatarUploader.tsx`)

Selector de imagen de avatar único con vista previa (usa `URL.createObjectURL`), validación de tipo (`image/*`) y tamaño máximo (3MB). Evita la subida automática (`beforeUpload` retorna `false`) para que el envío se controle manualmente desde el formulario padre.

### 8.3 `Media` (`ui/Media.tsx`)

Componente de galería de imágenes múltiples con soporte de arrastrar y soltar (`Dragger` de Ant Design), integrado como `Form.Item` (`name="imageUrl"`). Permite modo de solo vista previa o modo editable (con eliminación *soft* mediante la bandera `deleted`, útil para no perder el registro de archivos existentes que se desean quitar al guardar). Límite configurable de imágenes visibles (`maxVisible`).

### 8.4 `OutletContainer` / `OutletMenu` (`ui/outlet/`)

Descritos en la sección 4.5 y 4.6. Implementan el layout principal, el guard de acceso por ruta, el header con buscador, y el menú lateral responsivo (desktop/mobile) con logout integrado.

### 8.5 Vistas de error (`views/ForbiddenView.tsx`, `views/NotFoundView.tsx`)

Pantallas simples de error 401/403 ("Forbidden") y 404 ("Not Found"), con botón de regreso en el caso de `ForbiddenView`.

---

## 9. Vistas de negocio (CRUD)

Las tres vistas principales (`RolesView`, `PermissionsView`, `DashboardView` —gestión de usuarios—) comparten un mismo patrón:

1. Estado de paginación (`params`) sincronizado con `useFindAll`.
2. Un `Modal` de Ant Design con un `Form` para crear/editar.
3. `useCrud` para las mutaciones, con invalidación automática de caché tras cada operación.
4. Columnas de tabla con una columna de "Acciones" cuya visibilidad depende del rol/jerarquía del usuario autenticado frente al registro (para evitar, por ejemplo, que un rol edite registros de mayor jerarquía).

### 9.1 `RolesView` (`views/roles/RolesView.tsx`)

- Lista roles paginados (`roleService`) y carga **todos** los permisos disponibles (`permissionService`, `size: 1000`) para poblar el `<Select mode="multiple">` de permisos del formulario.
- Al editar, usa `crud.useFindById` para traer el detalle del rol y sincroniza el formulario con un `useEffect` reactivo a la llegada de los datos (patrón corregido para evitar condiciones de carrera entre el montaje del formulario y la resolución asíncrona de la petición).
- La columna "Acciones" oculta las opciones de edición cuando el registro es el rol raíz (`id === 1`) o cuando el rol del registro tiene mayor jerarquía que el rol del usuario autenticado.
- El botón "Activar/Desactivar" hace un `update` optimista invirtiendo el flag `active`, limpiando explícitamente los campos de auditoría (`createdAt`, `updatedAt`, `deletedAt`, `id`) del payload antes de enviarlo.

### 9.2 `PermissionsView` (`views/permissions/PermissionsView.tsx`)

- Lista de permisos (método HTTP, ruta, título) generados típicamente por el backend a partir de sus endpoints.
- Solo permite **editar el título** (`title`) de un permiso existente; no expone creación ni borrado desde esta vista (los permisos se asumen generados/sincronizados por el backend).

### 9.3 `DashboardView` (`views/dashboard/DashboardView.tsx`)

Actúa como la vista de **gestión de usuarios** (a pesar del nombre "Dashboard"):
- CRUD completo de usuarios, con selección de rol vía `SelectApi`.
- Reglas de visibilidad de acciones: no se puede editar el usuario "super admin" (`role.id === 1`), no se puede editar el propio usuario autenticado desde esta tabla, y no se puede editar un usuario cuyo rol tenga mayor jerarquía que el del usuario autenticado.
- El campo `password` en edición es opcional (solo se envía si el usuario lo completa, permitiendo dejarlo sin cambios).

### 9.4 `LoginView` (`views/login/LoginView.tsx`)

Pantalla de autenticación con dos pestañas (Ant Design `Tabs`):
- **Login**: usuario + contraseña, delega en `useSession().login` y redirige mediante `saveSession` al obtener la respuesta.
- **Registro**: formulario con validaciones de formato de correo y una política de contraseña vía *regex* (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial), más confirmación de contraseña con validador cruzado (`dependencies`).

---

## 10. Estilos y tematización

- **`config/antd.ts`**: `ThemeConfig` de Ant Design centralizado — define paleta de color primario/secundario, radios de borde, tipografía base y estilos por componente (`Input`, `Select`, `Table`, `Modal`, `Button`, `Tooltip`). Se inyecta globalmente vía `ConfigProvider` en `AppOutlet`.
- **Tailwind CSS**: usado de forma utilitaria directamente en el JSX de las vistas y componentes (`styles/index.css` como entrada, más hojas específicas en `styles/components/` para animaciones, scroll personalizado y ajustes puntuales sobre componentes de Ant Design).

---

## 11. Variables de entorno

Definidas en `types/vite-env.d.ts` y consumidas mediante `import.meta.env`:

| Variable | Uso |
|---|---|
| `VITE_API_SERVICE` | URL base de la API consumida por `AppSettings.apiService` (usada por defecto en cada `Service`) |
| `VITE_SECRET_KEY` | Clave usada para el cifrado AES de datos persistidos en `localStorage` (Recoil) y expuesta también vía `AppSettings.secretKey` / `Environment.getSecretKey` |

> Estas variables deben definirse en un archivo `.env` (no incluido en este paquete de código) en la raíz del proyecto, siguiendo la convención de Vite (prefijo `VITE_`).

---

## 12. Cómo probar el proyecto

Repositorio de referencia proporcionado para pruebas:

```
https://github.com/Loza64/spring-app-template.git
```

Pasos generales sugeridos (ajustar según el `package.json` real del repositorio, no incluido en este paquete de código analizado):

```bash
git clone https://github.com/Loza64/spring-app-template.git
cd spring-app-template
```

Crear un archivo `.env` en la raíz con, como mínimo:

```
VITE_API_SERVICE=http://localhost:<puerto-del-backend>
VITE_SECRET_KEY=<una-clave-cualquiera-para-cifrado-local>
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Esto requiere que el backend (Spring Boot, según el nombre del repositorio) esté corriendo y exponga, como mínimo, los endpoints usados por el frontend:

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/profile`
- `GET/POST/PUT/DELETE /api/roles[/:id]`
- `GET/PUT /api/permissions[/:id]`
- `GET/POST/PUT/DELETE /api/users[/:id]` (usado desde `DashboardView`, aunque no se identificó un `userService` CRUD genérico explícito más allá de los métodos de autenticación — ver nota en la sección de servicios)

---

## 13. Resumen de responsabilidades por carpeta (referencia rápida)

| Carpeta | Responsabilidad principal |
|---|---|
| `pages/` | Enrutamiento basado en archivos (generouted) |
| `views/` | Pantallas completas con lógica de negocio |
| `ui/` | Componentes visuales reutilizables no atados a una entidad |
| `components/core/` | Componentes genéricos reutilizables entre entidades |
| `hooks/core/` | Integración genérica con TanStack Query/Recoil |
| `hooks/useSession.ts` | Acceso al contexto de sesión |
| `services/core/` | Cliente CRUD genérico (`Service`) |
| `services/api/` | Instancias concretas de servicios por entidad |
| `services/utils/` | Configuración de Axios e interceptores |
| `models/api/core/` | Contratos y tipos base compartidos |
| `models/api/entities/` | Tipado de entidades de dominio |
| `config/` | Configuración estática (rutas, menú, tema, entorno) |
| `context/` | Contexto de sesión de usuario |
| `enum/` | Enumeraciones de rutas y roles |
| `utils/` | Utilidades puras (errores, permisos) |
| `constants/` | Constantes compartidas (claves de Recoil, etc.) |