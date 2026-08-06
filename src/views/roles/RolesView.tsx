import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { queryKeys } from '@/config/queryClient'
import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'
import { useSession } from '@/hooks/useSession'
import Role from '@/models/entities/Role'
import Permissions from '@/models/entities/Permissions'
import { permissionService, roleService } from '@/api'

export default function RolesView() {
  const { profile } = useSession()

  const [editing, setEditing] = useState<number>()
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const [params, setParams] = useState<Record<string, unknown>>({
    page: 1,
    size: 15,
  })

  const { data: response, isLoading: isLoadingList } = useFindAll<Role>({
    queryKey: queryKeys.roles,
    service: roleService,
    queryParams: params,
  })

  const { data: permissionsResponse } = useFindAll<Permissions>({
    queryKey: queryKeys.permissions,
    service: permissionService,
    queryParams: { page: 0, size: 1000 },
  })

  const crud = useCrud<Role>({
    service: roleService,
    queryKey: queryKeys.roles,
  })

  const { data, isLoading: isLoadingData } = crud.useFindById({ id: editing! })

  useEffect(() => {
    if (open && editing && data) {
      form.setFieldsValue({
        ...data,
        permissions: data.permissions?.map((p) => p.id),
      })
    }
  }, [data, editing, open, form])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      size: pagination.pageSize ?? prev.size,
    }))
  }

  const openCreate = () => {
    setEditing(undefined)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (role: number) => {
    form.resetFields()
    setEditing(role)
    setOpen(true)
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload: Role = {
      name: values.name,
      permissions: (values.permissions || []).map((id: number) => ({ id })),
    }

    if (editing) {
      await crud.update({ id: editing, payload })
    } else {
      await crud.create({ payload })
    }

    setOpen(false)
    form.resetFields()
  }

  const columns: ColumnsType<Role> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    { title: 'Nombre', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_text, record) => {
        if (record.id === 1) return null
        if (Number(record!.id) < Number(profile?.role!.id)) return null
        return (
          <Space>
            <Button type="link" onClick={() => openEdit(Number(record.id!))}>
              Editar
            </Button>
            <Button
              type="link"
              danger
              onClick={async () =>
                await crud.update({
                  id: record.id!,
                  payload: {
                    ...record,
                    active: !record.active,
                    createdAt: undefined,
                    deletedAt: undefined,
                    updatedAt: undefined,
                    id: undefined,
                  },
                })
              }
            >
              {record.active ? 'Desactivar' : 'Activar'}
            </Button>
          </Space>
        )
      },
    },
  ]

  const permissionsOptions = permissionsResponse?.data?.map(
    (p: Permissions) => ({
      label: p.title ?? `${p.method ?? ''} ${p.path ?? ''}`,
      value: p.id,
    })
  )

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button type="primary" onClick={openCreate}>
          Crear rol
        </Button>
      </div>

      <Table<Role>
        columns={columns}
        dataSource={response?.data}
        loading={isLoadingList}
        rowKey="id"
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
        title={editing ? 'Editar rol' : 'Crear rol'}
        open={open}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }}
        destroyOnHidden
        loading={isLoadingData}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permisos"
            rules={[
              {
                required: true,
                type: 'array',
                min: 1,
                message: 'Debe seleccionar al menos un permiso',
              },
            ]}
          >
            <Select mode="multiple" options={permissionsOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
