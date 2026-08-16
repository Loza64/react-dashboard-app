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
