import { Card, Table, Tag } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function RolesPage() {
  const [matrix, setMatrix] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    api.roleMatrix().then((res) => setMatrix(res.data.result));
  }, []);

  const columns = [
    { title: '角色', dataIndex: 'role_name', render: (_: unknown, r: Record<string, unknown>) => (
      <Tag color="arcoblue">{String(r.role_name)} ({String(r.role_code)})</Tag>
    )},
    { title: '权限码', dataIndex: 'permission_code' },
    { title: '权限名', dataIndex: 'permission_name' },
  ];

  return (
    <div>
      <Card className="page-content-card">
        <Table
          rowKey={(r) => `${String(r.role_code)}-${String(r.permission_code)}`}
          columns={columns}
          data={matrix}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
}
