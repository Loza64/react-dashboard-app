import type { UploadFile } from 'antd'
import type { RcFile } from 'antd/es/upload'

export default interface AvatarUpload extends UploadFile {
  id?: number
  originFileObj?: RcFile
  url?: string
}
