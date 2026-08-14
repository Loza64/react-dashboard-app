import type { RoleName } from '@/enum/role'

export function isRoleAuthorized(
  role: RoleName,
  allowedRoles: RoleName[]
): boolean {
  return allowedRoles.includes(role) || allowedRoles.includes('*')
}
