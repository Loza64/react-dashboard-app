import BaseEntity from '../../sdk/model/entities/BaseEntity'
import type Role from './Role'

export default interface User extends BaseEntity {
  username: string
  surname: string
  email: string
  password: string
  role?: Role
}
