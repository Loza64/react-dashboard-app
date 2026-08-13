import { menu } from '@/config/menu'
import type { RoleName } from '@/enum/role'
import NavItem from './NavItem'

export default function MenuList({
  role,
  collapsed,
  selectedKeys,
  onNavigate,
}: {
  role: RoleName
  collapsed: boolean
  selectedKeys: string[]
  onNavigate: (key: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {menu.map((item) => (
        <NavItem
          key={item.key}
          item={item}
          role={role}
          collapsed={collapsed}
          selectedKeys={selectedKeys}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}
