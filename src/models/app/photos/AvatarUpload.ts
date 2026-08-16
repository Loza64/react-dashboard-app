/** Reemplaza el `UploadFile`/`RcFile` de antd por un tipo mínimo propio, sin dependencias de UI. */
export interface UploadFileLike {
  uid: string
  name: string
  status?: 'uploading' | 'done' | 'error' | 'removed'
}

export default interface AvatarUpload extends UploadFileLike {
  id?: number
  originFileObj?: File
  url?: string
}
