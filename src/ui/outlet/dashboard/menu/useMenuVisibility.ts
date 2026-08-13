import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const DESKTOP_QUERY = '(min-width: 1024px)'

export function useMenuVisibility() {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    if (!isDesktop) queueMicrotask(() => setOpen(false))
  }, [location.pathname])

  return {
    open,
    toggle: () => setOpen((previous) => !previous),
    close: () => setOpen(false),
  }
}
