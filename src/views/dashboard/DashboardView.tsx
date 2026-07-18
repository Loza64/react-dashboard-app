import { Button, Form, Input, Modal, Space, Table, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useFindAll } from '@/hooks/core/useFindAll'
import useCrud from '@/hooks/core/useCrud'
import { queryKeys } from '@/lib/queryClient'
import type User from '@/models/api/entities/User'
import type Role from '@/models/api/entities/Role'
import { roleService, userService } from '@/services/api'
import SelectApi from '@/components/core/SelectApi'
import { useSession } from '@/hooks/useSession'
import errorResponse from '@/utils/errorResponse'

export default function DashboardView() {
  const { profile } = useSession()

  const [params, setParams] = useState<Record<string, unknown>>({
    search: '',
    page: 1,
    size: 15,
  })
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [form] = Form.useForm()

  const { data, isLoading } = useFindAll<User>({
    queryKey: queryKeys.users,
    service: userService,
    queryParams: params,
  })

  const crud = useCrud<User>({
    queryKey: queryKeys.users,
    service: userService,
  })

  const response = useMemo(() => data, [data])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setParams((prev) => ({
      ...prev,
      page: (pagination.current ?? 1),
      size: pagination.pageSize ?? prev.size,
    }))
  }

  const openCreateModal = () => {
    setEditingUser(null)
    form.resetFields()
    setOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue({
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
    })
    setOpen(true)
  }

  const handleDelete = async (id?: number | string) => {
    if (!id) return
    await crud.delete({ id })
    message.success('Usuario eliminado')
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    const payload: Partial<User> = {
      username: values.username,
      name: values.name,
      surname: values.surname,
      email: values.email,
      role: { id: values.role.id } as Role,
    }

    if (values.password) {
      payload.password = values.password
    }

    try {
      if (editingUser) {
        await crud.update({ id: editingUser.id!, payload })
        message.success('Usuario actualizado')
      } else {
        await crud.create({ payload: payload as User })
        message.success('Usuario creado')
      }
      setOpen(false)
      form.resetFields()
    } catch (error: unknown) {
      errorResponse({ error })
    }
  }

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', key: 'id', align: 'center' },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    { title: 'Nombres', dataIndex: 'name', key: 'name', align: 'center' },
    {
      title: 'Apellidos',
      dataIndex: 'surname',
      key: 'surname',
      align: 'center',
    },
    { title: 'Correo', dataIndex: 'email', key: 'email', align: 'center' },
    { title: 'Rol', dataIndex: ['role', 'name'], key: 'role', align: 'center' },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_text, record) => {
        if (record.role?.id === 1) return null //super admin no editable

        if (record.id === profile?.id) return null //No se puede editar mi propia informacion

        if (Number(record.role!.id) < Number(profile?.role!.id)) return null

        return (
          <Space>
            <Button type="link" onClick={() => openEditModal(record)}>
              Editar
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              Eliminar
            </Button>
          </Space>
        )

      },
    },
  ]

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="primary" onClick={openCreateModal}>
          Crear usuario
        </Button>
      </div>

      <Table<User>
        columns={columns}
        dataSource={response?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: (response?.pagination.page ?? 1),
          pageSize: response?.pagination.pageSize,
          total: response?.pagination.total ?? 0,
          showSizeChanger: true,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingUser ? 'Editar usuario' : 'Crear usuario'}
        open={open}
        onOk={handleSave}
        onCancel={() => setOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
        confirmLoading={crud.isCreating || crud.isUpdating}
        destroyOnHidden
        style={{ top: 10 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Usuario"
            rules={[
              { required: true, message: 'Ingresa un nombre de usuario' },
              {
                pattern: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.\s]+$/,
                message: 'Solo se permiten letras, espacios y puntos',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nombres"
            rules={[{ required: true, message: 'Ingresa el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Apellidos"
            rules={[{ required: true, message: 'Ingresa el apellido' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo"
            rules={[
              { required: true, message: 'Ingresa el correo' },
              { type: 'email', message: 'Correo inválido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <SelectApi<Role>
              service={roleService}
              queryKey={queryKeys.roles}
              placeholder="Selecciona un rol"
              renderOption={(item) => item.name}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
