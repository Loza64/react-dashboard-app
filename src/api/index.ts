import UserService from './custom/UserService'
import Role from '@/models/entities/Role'
import Permissions from '@/models/entities/Permissions'
import Service from '@/sdk/core/Service'

//custom
export const userService = new UserService()

//core
export const roleService = new Service<Role>({ endpoint: 'roles' })

export const permissionService = new Service<Permissions>({
  endpoint: 'permissions',
})
