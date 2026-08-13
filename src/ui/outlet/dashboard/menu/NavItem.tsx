import type { RoleName } from '@/enum/role'
import type { MenuItem } from '@/models/app/menu'

const isAuthorized = (item: MenuItem, role: RoleName) =>
  item.authorized.includes(role) || item.authorized.includes('*')

export default function NavItem({
  item,
  role,
  collapsed,
  selectedKeys,
  onNavigate,
  depth = 0,
}: {
  item: MenuItem
  role: RoleName
  collapsed: boolean
  selectedKeys: string[]
  onNavigate: (key: string) => void
  depth?: number
}) {
  const children = item.children?.filter(
    (child) => isAuthorized(child, role) && child.view !== false
  )
  const hasVisibleChildren = !!children?.length
  const authorized = isAuthorized(item, role) && item.view !== false

  if (!authorized && !hasVisibleChildren) return null

  const active = selectedKeys.includes(item.key)

  return (
    <div>
      <button
        onClick={() => onNavigate(item.key)}
        title={collapsed ? item.label : undefined}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-extrabold transition-colors ${depth > 0 ? 'pl-8' : ''} ${collapsed ? 'justify-center px-0' : ''} ${active ? 'bg-primary text-white!' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800'}`}
      >
        {item.icon && (
          <span
            className={`flex items-center justify-center ${active ? 'text-white' : 'text-black dark:text-gray-200'}`}
          >
            {item.icon}
          </span>
        )}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>

      {hasVisibleChildren && !collapsed && (
        <div className="mt-1 flex flex-col gap-1">
          {children!.map((child) => (
            <NavItem
              key={child.key}
              item={child}
              role={role}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
