export function matchRoute(pattern: string, currentPath: string): boolean {
  const regexPath = pattern
    .replace(/:([^\\/]+)/g, '([^/]+)')
    .replace(/\//g, '\\/')
  const regex = new RegExp(`^${regexPath}$`)
  return regex.test(currentPath)
}
