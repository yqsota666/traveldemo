import { Card, Grid, Space, Table, Tag, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';

const ROLE_META: Record<string, { color: string; desc: string }> = {
  SUPER_ADMIN: { color: 'red', desc: '最高权限，可管理账号、订单、CMS 与审计。' },
  SENIOR_ADMIN: { color: 'arcoblue', desc: '管理销售与业务数据，可处理审批。' },
  SALES: { color: 'green', desc: '负责客户、订单与内容提交，数据范围受限。' },
};

export default function RolesPage() {
  const [matrix, setMatrix] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.roleMatrix()
      .then((res) => setMatrix(res.data.result as Record<string, unknown>[]))
      .finally(() => setLoading(false));
  }, []);

  const roleGroups = matrix.reduce<Record<string, Record<string, unknown>[]>>((acc, item) => {
    const role = String(item.role_code || '');
    if (!acc[role]) acc[role] = [];
    acc[role].push(item);
    return acc;
  }, {});

  const columns = [
    {
      title: '角色',
      dataIndex: 'role_name',
      width: 220,
      render: (_: unknown, r: Record<string, unknown>) => {
        const code = String(r.role_code);
        return (
          <Space direction="vertical" size={2}>
            <Tag color={ROLE_META[code]?.color || 'arcoblue'}>{String(r.role_name)}</Tag>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {code}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: '权限码',
      dataIndex: 'permission_code',
      render: (value: string) => <Typography.Text code>{value}</Typography.Text>,
    },
    { title: '权限名', dataIndex: 'permission_name' },
  ];

  return (
    <div>
      <PageHeader title="角色权限" />
      <Grid.Row gutter={16} style={{ marginBottom: 16 }}>
        {Object.entries(roleGroups).map(([role, items]) => (
          <Grid.Col span={8} key={role}>
            <Card className="page-content-card role-summary-card">
              <Space direction="vertical" size={8}>
                <Tag color={ROLE_META[role]?.color || 'arcoblue'}>{String(items[0]?.role_name || role)}</Tag>
                <Typography.Text type="secondary">{ROLE_META[role]?.desc || '固定角色权限'}</Typography.Text>
                <Typography.Text className="role-summary-count">{items.length}</Typography.Text>
                <Typography.Text type="secondary">项权限</Typography.Text>
              </Space>
            </Card>
          </Grid.Col>
        ))}
      </Grid.Row>
      <Card className="page-content-card">
        <Table
          rowKey={(r) => `${String(r.role_code)}-${String(r.permission_code)}`}
          columns={columns}
          data={matrix}
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  );
}
