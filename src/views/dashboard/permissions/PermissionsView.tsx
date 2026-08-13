import { Button, Form, Input, Modal, Space, Table, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'

import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'
import { queryKeys } from '@/config/queryClient'
import errorResponse from '@/utils/errorResponse'
import { permissionService } from '@/api'
import Permissions from '@/models/entities/Permissions'

export default function PermissionsView() {
  const [editingPermission, setEditingPermission] =
    useState<Permissions | null>(null)

  const [open, setOpen] = useState(false)

  const [form] = Form.useForm()

  const [params, setParams] = useState({
    page: 1,
    size: 15,
  })

  const { data: response, isLoading } = useFindAll<Permissions>({
    queryKey: queryKeys.permissions,
    service: permissionService,
    queryParams: params,
  })

  const crud = useCrud({
    queryKey: queryKeys.permissions,
    service: permissionService,
  })

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      size: pagination.pageSize ?? prev.size,
    }))
  }

  const openEditModal = (permission: Permissions) => {
    setEditingPermission(permission)

    form.setFieldsValue({
      title: permission.title,
    })

    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setEditingPermission(null)
    form.resetFields()
  }

  const handleSave = async () => {
    if (!editingPermission) return

    try {
      const values = await form.validateFields()

      await crud.update({
        id: editingPermission.id!,
        payload: {
          title: values.title,
        },
      })

      message.success('Permiso actualizado')
      closeModal()
    } catch (error) {
      errorResponse({ error })
    }
  }

  const columns: ColumnsType<Permissions> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Método',
      dataIndex: 'method',
      align: 'center',
    },
    {
      title: 'Ruta',
      dataIndex: 'path',
      align: 'center',
    },
    {
      title: 'Título',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: 'Acciones',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table<Permissions>
        rowKey="id"
        columns={columns}
        dataSource={response?.data}
        loading={isLoading}
        pagination={{
          current: response?.pagination.page ?? 1,
          pageSize: response?.pagination.pageSize,
          total: response?.pagination.total ?? 0,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Editar Permiso"
        open={open}
        onOk={handleSave}
        onCancel={closeModal}
        okText="Guardar"
        cancelText="Cancelar"
        confirmLoading={crud.isUpdating}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Título"
            rules={[
              {
                required: true,
                message: 'Ingresa el título del permiso',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
