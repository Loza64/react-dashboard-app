import { X } from 'lucide-react'
import type { RoleName } from '@/enum/role'
import LogoutButton from './LogoutButton'
import MenuList from './MenuList'
import ProfileBlock from './ProfileBlock'

export default function MenuPanel({
  collapsed = false,
  role,
  username,
  loadingProfile,
  selectedKeys,
  closingSession,
  onNavigate,
  onLogout,
  onClose,
}: {
  collapsed?: boolean
  role?: RoleName
  username?: string
  loadingProfile: boolean
  selectedKeys: string[]
  closingSession: boolean
  onNavigate: (key: string) => void
  onLogout: () => void
  onClose?: () => void
}) {
  return (
    <>
      <div
        className={`flex items-center ${onClose ? 'justify-between border-b border-gray-100 p-2 dark:border-neutral-800' : ''}`}
      >
        <ProfileBlock
          collapsed={collapsed}
          username={username}
          role={role}
          loadingProfile={loadingProfile}
        />

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto px-2">
        <MenuList
          role={role!}
          collapsed={collapsed}
          selectedKeys={selectedKeys}
          onNavigate={onNavigate}
        />
      </div>

      <div className="p-3">
        <LogoutButton
          collapsed={collapsed}
          closing={closingSession}
          onLogout={onLogout}
        />
      </div>
    </>
  )
}
