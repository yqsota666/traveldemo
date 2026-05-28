import { Button, Card, Form, Input, Message, Modal, Select, Space, Table, Tag } from '@arco-design/web-react';
import { IconEdit, IconPlus, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface AdminUser {
  id: number;
  username: string;
  realName: string;
  phone?: string;
  status: string;
  roles: string[];
  lastLoginAt?: string;
  createdAt?: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '超级管理员',
  SENIOR_ADMIN: '高层管理',
  SALES: '销售',
};

const STATUS_LABELS: Record<string, { color: string; label: string }> = {
  ENABLED: { color: 'green', label: '启用' },
  DISABLED: { color: 'red', label: '禁用' },
};

export default function AdminsPage() {
  const { hasPermission, hasRole } = useAuth();
  const [list, setList] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [filters, setFilters] = useState({ keyword: '', roleCode: undefined as string | undefined });
  const [form] = Form.useForm();

  const load = async (p = 1, nextFilters = filters) => {
    setLoading(true);
    try {
      const res = await api.listAdmins({
        page: p,
        pageSize: 10,
        keyword: nextFilters.keyword || undefined,
        roleCode: nextFilters.roleCode,
      });
      setList(res.data.result.records as unknown as AdminUser[]);
      setTotal(res.data.result.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const roleOptions = [
    ...(hasRole('SUPER_ADMIN') ? [{ value: 'SENIOR_ADMIN', label: '高层管理' }] : []),
    { value: 'SALES', label: '销售' },
  ];

  const filterRoleOptions = hasRole('SUPER_ADMIN')
    ? [
        { value: 'SUPER_ADMIN', label: '超级管理员' },
        { value: 'SENIOR_ADMIN', label: '高层管理' },
        { value: 'SALES', label: '销售' },
      ]
    : [{ value: 'SALES', label: '销售' }];

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'ENABLED', roleCode: roleOptions[0]?.value });
    setVisible(true);
  };

  const openEdit = (record: AdminUser) => {
    setEditing(record);
    form.setFieldsValue({
      realName: record.realName,
      phone: record.phone,
      status: record.status || 'ENABLED',
    });
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validate();
    if (editing) {
      await api.updateAdmin(editing.id, {
        realName: values.realName,
        phone: values.phone,
        status: values.status,
      });
      Message.success('账号已更新');
    } else {
      await api.createAdmin(values);
      Message.success('账号创建成功');
    }
    setVisible(false);
    load(page);
  };

  const toggleStatus = (record: AdminUser) => {
    const nextStatus = record.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    Modal.confirm({
      title: nextStatus === 'ENABLED' ? '启用账号' : '禁用账号',
      content: `确认${nextStatus === 'ENABLED' ? '启用' : '禁用'}「${record.realName || record.username}」？`,
      onOk: async () => {
        await api.updateAdmin(record.id, {
          realName: record.realName,
          phone: record.phone,
          status: nextStatus,
        });
        Message.success('状态已更新');
        load(page);
      },
    });
  };

  const columns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '姓名', dataIndex: 'realName' },
    { title: '手机', dataIndex: 'phone' },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (roles: string[]) => roles?.map((r) => <Tag key={r}>{ROLE_LABELS[r] || r}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => {
        const s = STATUS_LABELS[v] || { color: 'gray', label: v };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: '最近登录',
      dataIndex: 'lastLoginAt',
      width: 170,
      render: (v?: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-'),
    },
    ...(hasPermission('admin:user:update')
      ? [
          {
            title: '操作',
            width: 180,
            render: (_: unknown, record: AdminUser) => (
              <Space>
                <Button type="text" size="small" icon={<IconEdit />} onClick={() => openEdit(record)}>
                  编辑
                </Button>
                <Button type="text" size="small" status={record.status === 'ENABLED' ? 'danger' : 'success'} onClick={() => toggleStatus(record)}>
                  {record.status === 'ENABLED' ? '禁用' : '启用'}
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="管理员账号"
        extra={
          hasPermission('admin:user:create') ? (
            <Button type="primary" icon={<IconPlus />} onClick={openCreate}>
              新增账号
            </Button>
          ) : undefined
        }
      />
      <Card className="page-content-card">
        <Space className="admin-filter-bar" wrap>
          <Input
            prefix={<IconSearch />}
            allowClear
            placeholder="搜索用户名 / 姓名"
            value={filters.keyword}
            onChange={(keyword) => setFilters((f) => ({ ...f, keyword }))}
            onPressEnter={() => load(1)}
            style={{ width: 220 }}
          />
          <Select
            allowClear
            placeholder="角色"
            value={filters.roleCode}
            options={filterRoleOptions}
            onChange={(roleCode) => setFilters((f) => ({ ...f, roleCode }))}
            style={{ width: 150 }}
          />
          <Button type="primary" icon={<IconSearch />} onClick={() => load(1)}>
            查询
          </Button>
          <Button
            icon={<IconRefresh />}
            onClick={() => {
              const empty = { keyword: '', roleCode: undefined };
              setFilters(empty);
              load(1, empty);
            }}
          >
            重置
          </Button>
        </Space>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          data={list}
          pagination={{ current: page, total, pageSize: 10, onChange: (nextPage) => load(nextPage) }}
        />
      </Card>
      <Modal title={editing ? '编辑管理员' : '新增管理员'} visible={visible} onOk={submit} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          {!editing && (
            <>
              <Form.Item label="用户名" field="username" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="密码" field="password" rules={[{ required: true, minLength: 6 }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item label="姓名" field="realName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机" field="phone">
            <Input />
          </Form.Item>
          {!editing && (
            <Form.Item label="角色" field="roleCode" rules={[{ required: true }]}>
              <Select options={roleOptions} />
            </Form.Item>
          )}
          {editing && (
            <Form.Item label="状态" field="status" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'ENABLED', label: '启用' },
                  { value: 'DISABLED', label: '禁用' },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
