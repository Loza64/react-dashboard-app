import { useSession } from '@/hooks/useSession'
import { Spin } from 'antd'
import { useMemo } from 'react'
import { authorizations } from 'src/config/roles'

function ForbiddenView() {
  const { user } = useSession()

  const path = useMemo(() => {
    if (!user) return '/login'

    const roleName = user.role?.name
    if (!roleName || !authorizations[roleName]) {
      console.warn(`Rol inválido o no encontrado: "${roleName}"`)
      return '/login'
    }

    const allowedRoutes = authorizations[roleName]
    if (!Array.isArray(allowedRoutes) || allowedRoutes.length === 0) {
      console.warn(`El rol "${roleName}" no tiene rutas configuradas`)
      return '/login'
    }

    return allowedRoutes[0] as string
  }, [user])

  return user ? (
    <div className="flex h-screen flex-col items-center justify-center p-5 text-center font-sans text-gray-800">
      <h1 className="mb-4 text-5xl font-light">401</h1>
      <p className="mb-8 max-w-md text-xl">
        No tienes permiso para acceder a esta área
      </p>
      <a
        href={path}
        className="rounded-md border border-gray-300 px-6 py-2 transition-colors hover:bg-gray-50">
        Volver al inicio
      </a>
    </div>
  ) : (
    <div className="flex h-dvh w-full items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

export default ForbiddenView
