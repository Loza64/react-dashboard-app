import { menu, selectMenuKeys } from '@/config/menu'
import { searchRecoil } from '@/constants/recoil'
import type { RoleName } from '@/enum/role'
import useRecoilStorage from '@/hooks/core/useRecoilStorage'
import { useSession } from '@/hooks/useSession'
import type { MenuItem } from '@/models/app/menu'
import {
  CloseOutlined,
  LeftOutlined,
  LoadingOutlined,
  LogoutOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import {
  Avatar,
  Button,
  Input,
  Layout,
  Menu,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { MenuProps } from 'antd/lib'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const { Sider } = Layout
const { Text } = Typography

const isAuthorized = (item: MenuItem, role: RoleName) =>
  item.authorized.includes(role) || item.authorized.includes('*')

function buildMenuItemsForAntd(
  items: MenuItem[],
  role: RoleName,
  collapsed: boolean,
  depth = 0
): MenuProps['items'] {
  return items.reduce<NonNullable<MenuProps['items']>>((acc, item) => {
    const children = item.children?.length
      ? buildMenuItemsForAntd(item.children, role, collapsed, depth + 1)
      : undefined

    const hasVisibleChildren = !!children?.length
    const authorized = isAuthorized(item, role) && item.view !== false

    if (!authorized && !hasVisibleChildren) return acc

    acc.push({
      key: item.key,
      icon: depth === 0 ? item.icon : undefined,
      label:
        depth === 0 ? (
          item.label
        ) : (
          <Tooltip
            placement="bottomRight"
            title={collapsed ? undefined : item.label}
          >
            <div className="flex items-center gap-2">
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </div>
          </Tooltip>
        ),
      children: hasVisibleChildren ? children : undefined,
    })

    return acc
  }, [])
}

export default function DashboardMenu({
  isMobile,
  openMenu,
  collapsed,
}: {
  collapsed: boolean
  openMenu: () => void
  isMobile: boolean
}) {
  const [search, setSearch] = useRecoilStorage<string | undefined>(searchRecoil)
  const { profile: profile, loading, logout } = useSession()
  const navigate = useNavigate()

  const role = profile?.role?.name

  const location = useLocation()

  const filteredMenuItems = useMemo(
    () => buildMenuItemsForAntd(menu, role!, collapsed) ?? [],
    [role, collapsed]
  )

  const { mutateAsync: logoutMutate, isPending: closingSession } = useMutation({
    mutationFn: () => logout(),
  })

  const selectedKeys = useMemo(
    () => selectMenuKeys(location.pathname),
    [location.pathname]
  )

  const handleLogout = () => {
    logoutMutate()
  }

  const handleMenuClick = (key: string) => {
    if (key === 'logout') return handleLogout()
    if (key === 'toggle') return openMenu()
    navigate(key)
  }

  return (
    <>
      {!isMobile && (
        <>
          <div
            className={`fixed top-5 z-500 -translate-x-full transition-all duration-300 ease-out ${collapsed ? 'left-[95px]' : 'left-[265px]'} hidden xl:block`}
          >
            <button
              onClick={() => handleMenuClick('toggle')}
              className="text-primary flex items-center justify-center rounded-full bg-white p-1.5 shadow-md transition-transform duration-150 hover:bg-gray-50 active:scale-95"
            >
              {collapsed ? (
                <RightOutlined className="text-[15px] font-bold" />
              ) : (
                <LeftOutlined className="text-[15px] font-bold" />
              )}
            </button>
          </div>

          <aside className="relative flex h-dvh">
            <Sider
              collapsible
              collapsed={collapsed}
              theme="light"
              width={250}
              collapsedWidth={80}
              trigger={null}
            >
              <div
                className={`flex items-center gap-3 p-4 transition-all duration-300 ${
                  collapsed ? 'justify-center' : ''
                }`}
              >
                <Avatar
                  size={48}
                  className="bg-blue-100 font-semibold text-blue-600"
                >
                  {loading.profile ? (
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  ) : (
                    (profile?.username?.[0] ?? '?').toUpperCase()
                  )}
                </Avatar>

                {!collapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <Tooltip
                      title={`${profile?.username || 'Unknown'}`}
                      placement="bottom"
                    >
                      <Text
                        ellipsis
                        strong
                        className="text-sm leading-tight font-medium text-gray-800"
                      >
                        {loading.profile
                          ? 'Cargando...'
                          : `${profile?.username ?? 'Unknown'}`}
                      </Text>
                    </Tooltip>

                    <Tag
                      className="mt-1 w-fit text-xs"
                      color={role ? 'green' : 'red'}
                    >
                      {role?.toLocaleLowerCase() || 'unknown'}
                    </Tag>
                  </div>
                )}
              </div>

              <div className="scrollbar-hide h-[calc(100dvh-136px)] overflow-y-auto px-1">
                <Menu
                  mode="inline"
                  theme="light"
                  selectedKeys={selectedKeys}
                  items={filteredMenuItems}
                  onClick={({ key }) => {
                    if (key === location.pathname) return
                    navigate(key, { replace: false })
                  }}
                  inlineCollapsed={collapsed}
                  style={{ border: 'none' }}
                />
              </div>

              <div className="p-3">
                <Button
                  type="text"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  block
                  className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
                >
                  {!collapsed && 'Cerrar sesión'}
                </Button>
              </div>
            </Sider>
          </aside>
        </>
      )}
      {isMobile && (
        <div
          className={`fixed top-0 z-5000 h-dvh w-full overflow-y-auto bg-white shadow-md transition-all duration-300 ease-out ${
            collapsed ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="border-primary flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border text-center transition-colors duration-150">
              <Input
                placeholder="Buscar"
                prefix={<SearchOutlined className="text-blue-500" />}
                className="w-full! rounded-lg! border-none font-bold text-blue-500! placeholder:text-blue-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ width: 200 }}
              />
            </div>

            {/* Renderizado del menú filtrado con JSX para mobile */}
            <Menu
              mode="inline"
              theme="light"
              selectedKeys={selectedKeys}
              items={filteredMenuItems}
              onClick={({ key }) => {
                if (key === location.pathname) return
                navigate(key, { replace: false })
              }}
              inlineCollapsed={collapsed}
              style={{ border: 'none' }}
            />

            {/* Botón de cerrar sesión */}
            <div className="border-b-primary flex cursor-pointer items-center justify-center gap-3 border-b px-3 py-2 text-center transition-colors duration-150 hover:bg-gray-100">
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                loading={closingSession}
                block
                className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50"
              >
                {!collapsed && 'Cerrar sesión'}
              </Button>
            </div>

            {/* Botón de cerrar menú */}
            <div
              className="bg-primary mx-auto flex size-12 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-all duration-200 ease-out hover:bg-blue-700 active:scale-95"
              onClick={openMenu}
            >
              <CloseOutlined className="text-white" size={200} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
