import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Avatar, Input, Spin } from 'antd'
import { MenuSquare } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OutletMenu from './OutletMenu'
import { useSession } from '@/hooks/useSession'
import ForbiddenView from '@/views/ForbiddenView'
import { searchRecoil } from '@/constants/recoil'
import { RoutesEnum } from '@/enum/routes..app'
import { routesConfig } from '@/config/routes.app'
import { isAuthorized } from '@/utils/permission.app'
import NotFoundView from '@/views/NotFoundView'
import useRecoilStorage from '@/hooks/core/useRecoilStorage'

export default function OutletContainer({
  children,
  isMobile,
}: {
  children: React.ReactNode
  isMobile: boolean
}) {
  const [search, setSearch] = useRecoilStorage<string | undefined>(searchRecoil)
  const [collapsed, setCollapsed] = useState(true)

  const { profile: user, loading } = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = location.pathname as RoutesEnum
  const routeData = routesConfig[pathname]

  const role = user?.role?.name
  const allowed = useMemo(
    () => (role ? isAuthorized(role, pathname) : false),
    [role, pathname]
  )

  useEffect(() => {
    setSearch('')
  }, [location.pathname, setSearch])

  useEffect(() => {
    if (routeData && !routeData.auth && user) {
      navigate(RoutesEnum.DASHBOARD, { replace: true })
    }
  }, [routeData, user, navigate])

  const toggleMenu = useCallback(() => {
    setCollapsed((previous) => !previous)
  }, [])

  if (!routeData) return <NotFoundView />

  if (!routeData.auth) {
    return user ? null : children
  }

  if (loading.profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    )
  }

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
          <div className="flex shrink-0 items-center justify-between gap-4 px-9 py-4">
            <div className="text-primary flex flex-col">
              <span className="text-3xl font-extrabold">{routeData.title}</span>
            </div>

            {routeData.search && (
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
          className={`scrollbar-hide overflow-y-auto rounded-tl-lg bg-gray-100 p-3 transition-all duration-200 ${
            isMobile ? 'h-[calc(100dvh-55px)]' : 'h-[calc(100dvh-70px)]'
          }`}
        >
          {children}
        </div>

        {isMobile && (
          <div className="flex items-center justify-around gap-3 bg-gray-200 p-3">
            <button
              className="bg-primary rounded-lg p-1.5 text-white! transition-all active:bg-blue-950"
              onClick={toggleMenu}
            >
              <MenuSquare />
            </button>

            {loading.profile ? (
              <Spin indicator={<LoadingOutlined spin />} size="small" />
            ) : (
              <Avatar
                size={38}
                className="border-primary m-2 border-2 bg-blue-100 font-semibold text-blue-600"
              >
                {(user?.username?.[0] ?? '?').toUpperCase()}
              </Avatar>
            )}
          </div>
        )}
      </div>
    </>
  )
}
