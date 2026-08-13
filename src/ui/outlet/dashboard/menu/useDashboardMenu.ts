import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectMenuKeys } from '@/config/menu'
import { searchRecoil } from '@/constants/recoil'
import useRecoilStorage from '@/hooks/core/useRecoilStorage'
import { useSession } from '@/hooks/useSession'

export function useDashboardMenu() {
  const [, setSearch] = useRecoilStorage<string | undefined>(searchRecoil)
  const { profile, loading, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  const role = profile?.role?.name
  const [closingSession, setClosingSession] = useState(false)

  const selectedKeys = useMemo(
    () => selectMenuKeys(location.pathname),
    [location.pathname]
  )

  const handleLogout = async () => {
    try {
      setClosingSession(true)
      await logout()
    } finally {
      setClosingSession(false)
    }
  }

  const handleNavigate = (key: string) => {
    setSearch('')
    if (key === location.pathname) return
    navigate(key)
  }

  return {
    profile,
    loading,
    role,
    closingSession,
    selectedKeys,
    handleLogout,
    handleNavigate,
  }
}
