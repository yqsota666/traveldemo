import { Button, Card, Form, Input, Message, Modal, Select, Table, Tag } from '@arco-design/web-react';
import PageHeader from '../../components/PageHeader';
import { IconPlus } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface AdminUser {
  id: number;
  username: string;
  realName: string;
  phone?: string;
  status: string;
  roles: string[];
}

export default function AdminsPage() {
  const { hasPermission, hasRole } = useAuth();
  const [list, setList] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const load = async (p = 1) => {
    const res = await api.listAdmins({ page: p, pageSize: 10 });
    setList(res.data.result.records);
    setTotal(res.data.result.total);
    setPage(p);
  };

  useEffect(() => {
    load();
  }, []);

  const roleOptions = hasRole('SUPER_ADMIN')
    ? [
        { value: 'SENIOR_ADMIN', label: '高层管理' },
        { value: 'SALES', label: '销售' },
      ]
    : [{ value: 'SALES', label: '销售' }];

  const submit = async () => {
    const values = await form.validate();
    await api.createAdmin(values);
    Message.success('账号创建成功');
    setVisible(false);
    load(page);
  };

  const columns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '姓名', dataIndex: 'realName' },
    { title: '手机', dataIndex: 'phone' },
    {
      title: '角色',
      dataIndex: 'roles',
      render: (roles: string[]) => roles?.map((r) => <Tag key={r}>{r}</Tag>),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v: string) => <Tag color={v === 'ENABLED' ? 'green' : 'red'}>{v}</Tag>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="管理员账号"
        extra={
          hasPermission('admin:user:create') ? (
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => {
                form.resetFields();
                setVisible(true);
              }}
            >
              新增账号
            </Button>
          ) : undefined
        }
      />
      <Card className="page-content-card">
        <Table
          rowKey="id"
          columns={columns}
          data={list}
          pagination={{ current: page, total, pageSize: 10, onChange: load }}
        />
      </Card>
      <Modal title="新增管理员" visible={visible} onOk={submit} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="用户名" field="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" field="password" rules={[{ required: true, minLength: 6 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="姓名" field="realName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机" field="phone">
            <Input />
          </Form.Item>
          <Form.Item label="角色" field="roleCode" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
