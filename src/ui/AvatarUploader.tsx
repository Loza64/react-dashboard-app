'use client'

import type AvatarUpload from '@/models/photos/AvatarUpload'
import { Button, Upload, message } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import { useMemo } from 'react'

type AvatarUploaderProps = {
  avatarFile: AvatarUpload | null
  setAvatarFile: (file: AvatarUpload | null) => void
}

export default function AvatarUploader({
  avatarFile,
  setAvatarFile,
}: AvatarUploaderProps) {
  const avatarPreview = useMemo(
    () =>
      avatarFile
        ? avatarFile.url ||
        (avatarFile.originFileObj
          ? URL.createObjectURL(avatarFile.originFileObj)
          : null)
        : null,
    [avatarFile],
  )

  return (
    <div className="relative">
      <div className="size-28 overflow-hidden rounded-full border bg-neutral-100">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-neutral-400">
            Sin foto
          </div>
        )}
      </div>

      <Upload
        showUploadList={false}
        accept="image/*"
        beforeUpload={(file: RcFile) => {
          if (!file.type.startsWith('image/')) {
            message.error('La imagen seleccionada no es válida')
            return Upload.LIST_IGNORE
          }
          if (file.size > 3 * 1024 * 1024) {
            message.error('La imagen supera 3MB')
            return Upload.LIST_IGNORE
          }

          const customFile: AvatarUpload = {
            uid: file.uid,
            name: file.name,
            originFileObj: file,
            status: 'done',
          }
          setAvatarFile(customFile)
          return false // evita la subida automática
        }}>
        <Button
          size="small"
          className="absolute -bottom-2 right-0 rounded-full border bg-white text-xs shadow-sm hover:bg-neutral-50">
          Cambiar
        </Button>
      </Upload>
    </div>
  )
}
