import { Button, Card, Form, Input, InputNumber, Message, Modal, Table } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function BindingsPage() {
  const { hasPermission } = useAuth();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    const res = await api.listBindings({ page: 1, pageSize: 50 });
    setList(res.data.result.records);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    const values = await form.validate();
    await api.createBinding(values);
    Message.success('归属已分配');
    setVisible(false);
    load();
  };

  const columns = [
    { title: '销售', dataIndex: 'sales_name' },
    { title: '客户', dataIndex: 'customer_name' },
    { title: '电话', dataIndex: 'customer_phone' },
    { title: '分配人', dataIndex: 'assigned_by_name' },
    { title: '时间', dataIndex: 'created_at' },
    ...(hasPermission('binding:manage')
      ? [
          {
            title: '操作',
            render: (_: unknown, r: Record<string, unknown>) => (
              <Button
                type="text"
                status="danger"
                onClick={async () => {
                  await api.deleteBinding(Number(r.id));
                  Message.success('已解除');
                  load();
                }}
              >
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
            <Button type="primary" icon={<IconPlus />} onClick={() => setVisible(true)}>
              分配客户
            </Button>
          ) : undefined
        }
      />
      <Card className="page-content-card">
        <Table rowKey="id" columns={columns} data={list} />
      </Card>
      <Modal title="分配客户" visible={visible} onOk={submit} onCancel={() => setVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="销售用户ID" field="salesAdminUserId" rules={[{ required: true }]}>
            <InputNumber placeholder="如 sales01 对应 ID=3" />
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
