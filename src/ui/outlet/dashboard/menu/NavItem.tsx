import type { RoleName } from '@/enum/role'
import type { MenuItem } from '@/models/app/menu'

const isAuthorized = (item: MenuItem, role: RoleName) =>
  item.authorized.includes(role) || item.authorized.includes('*')

export default function NavItem({
  item,
  role,
  selectedKeys,
  onNavigate,
  depth = 0,
}: {
  item: MenuItem
  role: RoleName
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
        className={`dashboard-nav-item group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-extrabold transition-colors ${
          depth > 0 ? 'pl-8' : ''
        } ${active ? 'is-active bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-primary)]'} `}
      >
        {item.icon && (
          <span
            className={`flex items-center justify-center ${
              active ? 'text-white' : 'text-[var(--text-secondary)]'
            }`}
          >
            {item.icon}
          </span>
        )}
        <span className="truncate">{item.label}</span>
      </button>

      {hasVisibleChildren && (
        <div className="mt-1 flex flex-col gap-1">
          {children!.map((child) => (
            <NavItem
              key={child.key}
              item={child}
              role={role}
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
