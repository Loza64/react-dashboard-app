import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  allowedRoles: string[]
  userRole: string // O obtenido de tu estado global / hook de autenticación
}

export function ProtectedRoute({
  allowedRoles,
  userRole,
}: ProtectedRouteProps) {
  // 1. Si no tiene el rol permitido, redirigir (ej. al inicio o a una página de "No autorizado")
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }
  // 2. Si pasa la validación, renderiza la ruta hija
  return <Outlet />
}
