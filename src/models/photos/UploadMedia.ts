import type { RcFile } from 'antd/es/upload'
import type { UploadFile } from 'antd/lib'

export default interface UploadMedia extends UploadFile {
  id?: number
  originFileObj?: RcFile
  url?: string
  deleted?: boolean
}
