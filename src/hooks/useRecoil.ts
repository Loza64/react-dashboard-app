import { useMemo } from 'react'
import { atomFamily, useRecoilState } from 'recoil'

export default function useRecoil<T>(key: string, defaultValue?: T) {
  const dynamicAtom = useMemo(
    () =>
      atomFamily<T, string>({
        key: `key_${key}`,
        default: defaultValue as T,
      }),
    [defaultValue, key]
  )

  return useRecoilState(dynamicAtom(key))
}
