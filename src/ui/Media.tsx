import { CloseOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import UploadMedia from '@models/photos/UploadMedia'
import type { UploadFile } from 'antd'
import { Image as AntdImage, Form, message } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { useCallback, useMemo } from 'react'

interface MediaProps {
  setPhotos?: React.Dispatch<React.SetStateAction<UploadMedia[]>>
  photos: UploadMedia[]
  height?: string
  defaultEditable?: boolean
  maxVisible?: number
}

export default function Media({
  photos,
  setPhotos,
  height,
  defaultEditable = false,
  maxVisible = 5,
}: MediaProps) {

  const validPhotos: UploadMedia[] = useMemo(() => photos, [photos])

  const handleFileUpload = useCallback(
    ({ fileList }: { fileList: UploadFile[] }) => {
      if (setPhotos) {
        setPhotos((previous) => {
          const previousArray = previous
          const activePhotos = previousArray.filter((p) => !p.deleted)

          const newFiles = fileList
            .filter(
              (newFile) =>
                !activePhotos.some(
                  (photo) =>
                    photo.name === newFile.name &&
                    photo.size === newFile.size &&
                    photo.lastModified === (newFile.originFileObj as File)?.lastModified,
                ),
            )
            .map((file) => ({
              ...(file as UploadMedia),
              uid: crypto.randomUUID(),
              deleted: false,
            }))

          const deletedFiles = previousArray.filter((p) => p.deleted)

          return [...activePhotos, ...newFiles, ...deletedFiles].slice(
            0,
            maxVisible,
          )
        })
      } else {
        message.error('hook setPhotos not found')
      }
    },
    [setPhotos, maxVisible],
  )

  const handleFileRemove = useCallback(
    (file: UploadMedia) => {
      if (setPhotos) {
        setPhotos((previous) => {
          const previousArray = Array.isArray(previous) ? previous : []
          return previousArray.map((f) =>
            f.uid === file.uid ? { ...f, deleted: true } : f,
          )
        })
      } else {
        message.error('hook setPhotos not found')
      }
    },
    [setPhotos],
  )

  const renderPreview = useCallback(() => {
    const visibleFiles = validPhotos
      .filter((f) => !f.deleted)
      .slice(0, maxVisible)

    if (visibleFiles.length === 0) {
      if (!defaultEditable) {
        return (
          <div className="w-full text-center italic text-gray-400">
            No hay imágenes disponibles
          </div>
        )
      }
      return null
    }

    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {visibleFiles.map((file) => (
          <div
            key={file.uid}
            className="
        group relative aspect-square
        w-[48%] overflow-hidden rounded-xl bg-gray-50
        shadow-sm transition-all duration-300 hover:shadow-md
        sm:w-[31%] md:w-[23%] lg:w-[18%]
      ">
            <AntdImage
              src={
                file.originFileObj
                  ? URL.createObjectURL(file.originFileObj)
                  : file.url
              }
              alt={file.name}
              className="size-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {defaultEditable && (
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleFileRemove(file)
                }}
                className="
            absolute right-1.5 top-1.5 z-30 flex size-6 items-center
            justify-center rounded-full bg-red-500 text-[10px] text-white
            shadow-sm transition-all hover:bg-red-600
            sm:size-7 sm:text-[11px]
            md:size-8 md:text-[12px]
          ">
                <CloseOutlined className="text-[9px] sm:text-[10px] md:text-[11px]" />
              </button>
            )}
          </div>
        ))}

        {visibleFiles.length < maxVisible && defaultEditable && (
          <Dragger
            name="newImages"
            fileList={[]}
            onChange={handleFileUpload}
            multiple
            showUploadList={false}
            beforeUpload={() => false}
            openFileDialogOnClick
            className="
        flex aspect-square
        w-[48%] cursor-pointer items-center justify-center
        rounded-xl border-2 border-dashed
        border-gray-300 bg-gray-50 transition-all duration-300 hover:border-blue-400
        hover:bg-blue-50 sm:w-[31%] md:w-[23%] lg:w-[18%]
      ">
            <PlusOutlined className="text-3xl text-blue-500 opacity-80 group-hover:opacity-100" />
          </Dragger>
        )}
      </div>
    )
  }, [
    validPhotos,
    handleFileRemove,
    defaultEditable,
    handleFileUpload,
    maxVisible,
  ])

  const renderUploadArea = useCallback(
    () => (
      <div className="flex w-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-3 rounded-full bg-blue-50 p-4 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-blue-100">
          <InboxOutlined className="text-4xl text-blue-500" />
        </div>

        <p className="mb-1 text-sm font-medium text-gray-800">
          Arrastra tus imágenes aquí o haz clic para seleccionar
        </p>

        <div className="mt-1 text-xs leading-tight text-gray-500 dark:text-gray-400">
          <p>Formatos comunes: JPG, PNG, GIF, WEBP</p>
          <p>Sin restricciones de tamaño o dimensiones</p>
        </div>
      </div>
    ),
    [],
  )

  return (
    <Form.Item
      name="imageUrl"
      valuePropName="fileList"
      getValueFromEvent={(event) => event?.fileList}
      className="mb-6">
      <div className="relative w-full rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:shadow-md">
        {validPhotos.filter((f) => !f.deleted).length === 0 &&
          defaultEditable ? (
          <Dragger
            name="portada"
            fileList={[]}
            accept="image/*"
            onChange={handleFileUpload}
            multiple
            showUploadList={false}
            beforeUpload={() => false}
            className={`flex ${height} min-h-[270px] w-full flex-wrap items-center justify-center rounded-2xl bg-transparent`}>
            {renderUploadArea()}
          </Dragger>
        ) : (
          <div
            className={`flex ${height} min-h-[270px] flex-wrap items-center justify-center rounded-xl`}>
            {renderPreview()}
          </div>
        )}
      </div>
    </Form.Item>
  )
}
