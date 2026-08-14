import type { RoleName } from '@/enum/role'
import LogoutButton from './LogoutButton'
import MenuList from './MenuList'
import ProfileBlock from './ProfileBlock'

export default function MenuPanel({
  role,
  username,
  loadingProfile,
  selectedKeys,
  closingSession,
  onNavigate,
  onLogout,
}: {
  role?: RoleName
  username?: string
  loadingProfile: boolean
  selectedKeys: string[]
  closingSession: boolean
  onNavigate: (key: string) => void
  onLogout: () => void
}) {
  return (
    <>
      <ProfileBlock
        username={username}
        role={role}
        loadingProfile={loadingProfile}
      />

      <div className="scrollbar-hide flex-1 overflow-y-auto px-2 py-2">
        <MenuList
          role={role}
          selectedKeys={selectedKeys}
          onNavigate={onNavigate}
        />
      </div>

      <div className="p-3">
        <LogoutButton closing={closingSession} onLogout={onLogout} />
      </div>
    </>
  )
}
