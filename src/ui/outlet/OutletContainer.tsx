
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, Spin } from 'antd'
import { MenuSquare } from 'lucide-react'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import OutletMenu from './OutletMenu'
import { useSession } from '@/hooks/useSession'
import { isAuthorized, menu, type Route } from '@/config/roles'
import ForbiddenView from '@/views/ForbiddenView'
import useRecoil from '@/hooks/useRecoil'
import { searchRecoil } from '@/constants/recoil'



export default function OutletContainer({
  children,
  isMobile,
}: {
  children: React.ReactNode
  isMobile: boolean
}) {
  const [search, setSearch] = useRecoil<string | undefined>(searchRecoil)
  const [collapsed, setCollapsed] = useState(true)

  const { user, loadingSession } = useSession()
  const location = useLocation()

  const role = user?.role?.name
  const pathname = location.pathname as Route

  const allowed = role && isAuthorized(role, pathname)

  const menuItems = useMemo(
    () => (role ? menu(role).filter((item) => item.view) : []),
    [role],
  )

  const pageInfo = useMemo(() => {
    const current = menuItems.find((r) => r.key === pathname)
    setSearch('')
    return current
      ? { name: current.name, key: current.label }
      : { name: 'Dashboard' }
  }, [menuItems, setSearch, pathname])

  const showSearch = !pathname.startsWith('/audit')

  const toggleMenu = useCallback(() => {
    setCollapsed((previous) => !previous)
  }, [])

  if (pathname === '/login') return children

  if (!allowed) return <ForbiddenView />

  return (
    <>
      <OutletMenu
        collapsed={collapsed}
        isMobile={isMobile}
        openMenu={toggleMenu}
      />

      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white transition-all duration-200 ease-in-out">
        {!isMobile && (
          <div className="flex shrink-0 items-center justify-between gap-4  px-9 py-4">
            <div className="flex flex-col text-primary">
              <span className="text-3xl font-extrabold">{pageInfo.name}</span>
            </div>

            {showSearch && (
              <Input
                placeholder="Buscar"
                prefix={<SearchOutlined className="text-blue-500" />}
                className="w-full! max-w-80 rounded-lg"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            )}
          </div>
        )}

        <div
          className={`scrollbar-hide overflow-y-auto rounded-tl-lg bg-gray-100 p-3 transition-all duration-200 ${isMobile ? 'h-[calc(100dvh-55px)]' : 'h-[calc(100dvh-70px)]'
            }`}>
          {children}
        </div>

        {isMobile && (
          <div className="flex items-center justify-around gap-3 bg-gray-200 px-3">
            <button
              className="rounded-lg bg-primary p-1.5 text-white transition-all active:bg-blue-950"
              onClick={toggleMenu}>
              <MenuSquare />
            </button>

            {loadingSession ? (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            ) : (
              <Avatar
                size={38}
                className="m-2 border-2 border-primary bg-blue-100 font-semibold text-blue-600"
                /*src={user?.picture?.url} */>
                {/*!user?.picture && */ (user?.username?.[0] ?? '?').toUpperCase()}
              </Avatar>
            )}
          </div>
        )}
      </div>
    </>
  )
}
