import BaseEntity from '@/sdk/model/entities/BaseEntity'

export default interface Permissions extends BaseEntity {
  path: string
  method: string
  title: string
}
