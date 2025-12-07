import { useCallback } from 'react'

export default function useQueryParams<const T extends readonly string[]>(
  querys: T,
) {
  type Keys = T[number]

  const isAllowed = useCallback(
    (key: string): key is Keys => querys.includes(key as Keys),
    [querys],
  )

  const getUrlParams = useCallback(() => {
    if (typeof window === 'undefined') return {} as Record<Keys, string | null>

    const urlParams = new URLSearchParams(window.location.search)
    const result = {} as Record<Keys, string | null>

    ;(querys as readonly Keys[]).forEach((q) => {
      result[q] = urlParams.get(q)
    })

    return result
  }, [querys])

  const setUrlParameter = useCallback(
    (key: Keys, value: string) => {
      if (typeof window === 'undefined') return
      if (!isAllowed(key)) return

      const url = new URL(window.location.href)
      url.searchParams.set(key, value)
      window.history.pushState({}, '', url.toString())
    },
    [isAllowed],
  )

  const removeUrlParameter = useCallback(
    (key: Keys) => {
      if (typeof window === 'undefined') return
      if (!isAllowed(key)) return

      const url = new URL(window.location.href)
      url.searchParams.delete(key)
      window.history.pushState({}, '', url.toString())
    },
    [isAllowed],
  )

  const setUrlParams = useCallback(
    (parameters: Partial<Record<Keys, string>>) => {
      if (typeof window === 'undefined') return

      const url = new URL(window.location.href)

      ;(Object.entries(parameters) as [Keys, string | undefined][]).forEach(
        ([key, value]) => {
          if (!isAllowed(key)) return
          if (value === undefined) return
          url.searchParams.set(key, value)
        },
      )

      window.history.pushState({}, '', url.toString())
    },
    [isAllowed],
  )

  return {
    getUrlParams,
    setUrlParam: setUrlParameter,
    removeUrlParam: removeUrlParameter,
    setUrlParams,
  }
}
