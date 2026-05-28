import { Button, Card, Form, Input, Message, Modal, Select, Space, Table, Tag } from '@arco-design/web-react';
import { IconDelete, IconPlus, IconSearch } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface SalesOption {
  id: number;
  realName: string;
  username: string;
}

export default function BindingsPage() {
  const { hasPermission } = useAuth();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [salesOptions, setSalesOptions] = useState<SalesOption[]>([]);
  const [salesFilter, setSalesFilter] = useState<number | undefined>();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const load = async (p = 1, nextSalesFilter = salesFilter) => {
    setLoading(true);
    try {
      const res = await api.listBindings({ page: p, pageSize: 10, salesUserId: nextSalesFilter });
      setList(res.data.result.records);
      setTotal(res.data.result.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    if (!hasPermission('binding:manage')) return;
    const res = await api.listAdmins({ page: 1, pageSize: 100, roleCode: 'SALES' });
    setSalesOptions(res.data.result.records as unknown as SalesOption[]);
  };

  useEffect(() => {
    load();
    loadSales();
  }, []);

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ salesAdminUserId: salesFilter });
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validate();
    await api.createBinding(values);
    Message.success('归属已分配');
    setVisible(false);
    load(page);
  };

  const confirmDelete = (record: Record<string, unknown>) => {
    Modal.confirm({
      title: '解除客户归属',
      content: `确认解除「${String(record.customer_name || '-')}」与「${String(record.sales_name || '-')}」的归属关系？`,
      onOk: async () => {
        await api.deleteBinding(Number(record.id));
        Message.success('已解除');
        load(page);
      },
    });
  };

  const columns = [
    {
      title: '销售',
      dataIndex: 'sales_name',
      render: (v: string, r: Record<string, unknown>) => <Tag color="arcoblue">{v || `编号 ${String(r.sales_admin_user_id)}`}</Tag>,
    },
    { title: '客户', dataIndex: 'customer_name', render: (v: string) => <strong>{v}</strong> },
    { title: '电话', dataIndex: 'customer_phone' },
    { title: '分配人', dataIndex: 'assigned_by_name' },
    { title: '时间', dataIndex: 'created_at', render: (v?: string) => (v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-') },
    ...(hasPermission('binding:manage')
      ? [
          {
            title: '操作',
            render: (_: unknown, r: Record<string, unknown>) => (
              <Button type="text" status="danger" icon={<IconDelete />} onClick={() => confirmDelete(r)}>
                解除
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="客户归属"
        extra={
          hasPermission('binding:manage') ? (
            <Button type="primary" icon={<IconPlus />} onClick={openCreate}>
              分配客户
            </Button>
          ) : undefined
        }
      />
      <Card className="page-content-card">
        {hasPermission('binding:manage') && (
          <Space className="admin-filter-bar" wrap>
            <Select
              allowClear
              placeholder="按销售筛选"
              value={salesFilter}
              options={salesOptions.map((s) => ({ value: s.id, label: `${s.realName}（${s.username}）` }))}
              onChange={(value) => setSalesFilter(value)}
              style={{ width: 220 }}
            />
            <Button type="primary" icon={<IconSearch />} onClick={() => load(1)}>
              查询
            </Button>
          </Space>
        )}
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          data={list}
          pagination={{ current: page, total, pageSize: 10, onChange: (nextPage) => load(nextPage) }}
        />
      </Card>
      <Modal title="分配客户" visible={visible} onOk={submit} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="销售账号" field="salesAdminUserId" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="选择销售"
              options={salesOptions.map((s) => ({ value: s.id, label: `${s.realName}（${s.username}）` }))}
            />
          </Form.Item>
          <Form.Item label="客户姓名" field="customerName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="客户电话" field="customerPhone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
