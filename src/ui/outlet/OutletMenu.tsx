import { menu } from '@/config/roles'
import { searchRecoil } from '@/constants/recoil'
import useRecoil from '@/hooks/useRecoil'
import { useSession } from '@/hooks/useSession'
import {
  CloseOutlined,
  LeftOutlined,
  LoadingOutlined,
  LogoutOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'
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
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const { Sider } = Layout
const { Text } = Typography

export default function OutletMenu({
  isMobile,
  openMenu,
  collapsed,
}: {
  collapsed: boolean
  openMenu: () => void
  isMobile: boolean
}) {
  const [search, setSearch] = useRecoil<string | undefined>(searchRecoil)
  const { user: profile, loadingSession, logout } = useSession()
  const navigate = useNavigate()

  const role = profile?.role

  const menuItems = useMemo(() => {
    return menu(role?.name).filter((item) => item.view)
  }, [role])

  const handleLogout = () => {
    logout()
  }

  const handleMenuClick = (key: string) => {
    if (key === 'logout') return logout()
    if (key === 'toggle') return openMenu()
    navigate(key)
  }

  return (
    <>
      {!isMobile && (
        <>
          <div
            className={`fixed top-5 z-500 -translate-x-full transition-all duration-300 ease-out  ${collapsed ? 'left-[95px]' : 'left-[265px]'} hidden xl:block`}>
            <button
              onClick={() => handleMenuClick('toggle')}
              className="flex items-center justify-center rounded-full bg-white p-1.5 text-primary shadow-md transition-transform duration-150 hover:bg-gray-50 active:scale-95">
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
                className={`flex items-center gap-3 p-4 transition-all duration-300 ${collapsed ? 'justify-center' : ''
                  }`}>
                <Avatar
                  size={48}
                  className="bg-blue-100 font-semibold text-blue-600"
                >
                  {loadingSession ? (
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  ) : (
                    (profile?.username?.[0] ?? '?').toUpperCase()
                  )}
                </Avatar>

                {!collapsed && (
                  <div className="flex flex-col overflow-hidden">
                    <Tooltip
                      title={`${profile?.username || 'Unknown'}`}
                      placement="bottom">
                      <Text
                        ellipsis
                        strong
                        className="text-sm font-medium leading-tight text-gray-800">
                        {loadingSession
                          ? 'Cargando...'
                          : `${profile?.username ?? 'Unknown'}`}
                      </Text>
                    </Tooltip>

                    <Tag
                      className="mt-1 w-fit text-xs"
                      color={role ? 'green' : 'red'}>
                      {role?.name.toLocaleLowerCase() || 'unknown'}
                    </Tag>
                  </div>
                )}
              </div>

              <div className="scrollbar-hide h-[calc(100dvh-136px)] overflow-y-auto px-1">
                <Menu
                  mode="inline"
                  theme="light"
                  selectedKeys={[location.pathname]}
                  items={menuItems.map((route) => ({
                    key: route.key,
                    icon: route.icon,
                    label: route.label,
                  }))}
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
                  className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50">
                  {!collapsed && 'Cerrar sesión'}
                </Button>
              </div>
            </Sider>
          </aside>
        </>
      )}

      {isMobile && (
        <div
          className={`fixed top-0 z-5000 h-dvh w-full overflow-y-auto bg-white shadow-md transition-all duration-300 ease-out ${collapsed ? '-translate-x-full' : 'translate-x-0'
            }`}>
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border border-primary text-center transition-colors duration-150">
              <Input
                placeholder="Buscar"
                prefix={<SearchOutlined className="text-blue-500 " />}
                className="w-full! rounded-lg! border-none  font-bold text-blue-500! placeholder:text-blue-400"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ width: 200 }}
              />
            </div>
            {menuItems
              .filter((item) => item.view)
              .map((item) => (
                <div
                  key={item.key}
                  className="flex cursor-pointer items-center justify-center gap-3  border-b border-b-primary px-3 py-2 text-center transition-colors duration-150 hover:bg-gray-100"
                  onClick={() => {
                    navigate(item.key, { replace: false })
                    openMenu()
                  }}>
                  <div className="text-primary">{item.icon}</div>
                  <Text className="font-medium">{item.label}</Text>
                </div>
              ))}

            <div className="flex cursor-pointer items-center justify-center gap-3  border-b border-b-primary px-3 py-2 text-center transition-colors duration-150 hover:bg-gray-100">
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                block
                className="flex items-center justify-center gap-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50">
                {!collapsed && 'Cerrar sesión'}
              </Button>
            </div>
            <div
              className="mx-auto flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-200 ease-out hover:bg-blue-700 active:scale-95"
              onClick={openMenu}>
              <CloseOutlined className="text-white" size={200} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
