import { ProtectedRoute } from '@/components/guards/ProtectedRoute'
import { useSession } from '@/hooks/useSession'
import { roles } from '@/enum/role'

// Sección restringida a administradores: ajusta la lista de roles según lo que necesites.
export default function RolesGate() {
  const { profile } = useSession()
  return (
    <ProtectedRoute
      allowedRoles={[roles.super_admin, roles.admin]}
      userRole={profile?.role?.name ?? ''}
    />
  )
}
