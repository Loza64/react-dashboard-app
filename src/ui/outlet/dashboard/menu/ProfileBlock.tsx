import { Loader2 } from 'lucide-react'

export default function ProfileBlock({
  username,
  role,
  loadingProfile,
}: {
  username?: string
  role?: string
  loadingProfile: boolean
}) {
  return (
    <div className="border-default flex items-center gap-3 border-b bg-(--bg-contrast) p-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--primary)/10 text-lg font-semibold text-(--primary)">
        {loadingProfile ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          (username?.[0] ?? '?').toUpperCase()
        )}
      </div>

      <div className="flex min-w-0 flex-col overflow-hidden">
        <span
          title={username || 'Unknown'}
          className="truncate text-sm leading-tight font-medium text-(--text-primary)"
        >
          {loadingProfile ? 'Cargando...' : (username ?? 'Unknown')}
        </span>

        <span
          className={`mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            role
              ? 'bg-(--primary)/10 text-(--primary)'
              : 'bg-(--bg-contrast) text-(--text-secondary)'
          }`}
        >
          {role?.toLocaleLowerCase() || 'unknown'}
        </span>
      </div>
    </div>
  )
}
