import type { RoleName } from '@/enum/role'
import BaseEntity from '@/sdk/model/entities/BaseEntity'
import Permissions from './Permissions'
export default interface Role extends BaseEntity {
  name: RoleName
  permissions: Permissions[]
  active?: boolean
}
