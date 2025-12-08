import { useApiService } from "@/hooks/useApiService";
import User from "@/models/api/entities/User";
import userService from "@/services/api/UserService";
import { Table, Button, Space } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

export default function DashboardView() {

    const {
        response,
        loading,
        params,
        setPage,
        setPageSize,
    } = useApiService<User>({
        service: userService,
        autoFetch: true,
        initFetch: true
    });

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (pagination.current && pagination.current - 1 !== params.page) {
            setPage(pagination.current - 1);
        }
        if (pagination.pageSize && pagination.pageSize !== params.size) {
            setPageSize(pagination.pageSize);
        }
    };

    const columns: ColumnsType<User> = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" },
        { title: "Usuario", dataIndex: "username", key: "username", align: "center" },
        { title: "Nombres", dataIndex: "name", key: "name", align: "center" },
        { title: "Apellidos", dataIndex: "surname", key: "surname", align: "center" },
        { title: "Correo", dataIndex: "email", key: "email", align: "center" },
        { title: "Rol", dataIndex: ['role', 'name'], key: 'name', align: "center" },
        {
            title: "Acciones",
            key: "actions",
            align: "center",
            render: () => (
                <Space>
                    <Button type="link" onClick={() => { }}>Ver</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table<User>
                columns={columns}
                dataSource={response.data}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: response.page + 1,
                    pageSize: response.size,
                    total: response.total,
                    showSizeChanger: true,
                    position: ["bottomCenter"],
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}
