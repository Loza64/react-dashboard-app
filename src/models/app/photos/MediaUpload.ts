import type { UploadFileLike } from './AvatarUpload'

export default interface UploadMedia extends UploadFileLike {
  id?: number
  originFileObj?: File
  url?: string
  deleted?: boolean
}
