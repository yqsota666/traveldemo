import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  Message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from '@arco-design/web-react';
import { IconPlus, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api, TravelOrder } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { PageResult } from '../../utils/request';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: '待确认' },
  CONFIRMED: { color: 'green', label: '已确认' },
  CANCELLED: { color: 'gray', label: '已取消' },
};

interface SalesOption {
  id: number;
  realName: string;
  username: string;
}

export default function OrdersPage() {
  const { hasPermission } = useAuth();
  const [data, setData] = useState<PageResult<TravelOrder>>({
    records: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [salesOptions, setSalesOptions] = useState<SalesOption[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<TravelOrder | null>(null);
  const [detail, setDetail] = useState<TravelOrder | null>(null);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [form] = Form.useForm();

  const load = async (page = 1, nextKeyword = keyword, nextStatus = status) => {
    setLoading(true);
    try {
      const res = await api.listOrders({
        page,
        pageSize: 10,
        keyword: nextKeyword || undefined,
        status: nextStatus,
      });
      setData(res.data.result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (hasPermission('order:view_all')) {
      api
        .listAdmins({ page: 1, pageSize: 100, roleCode: 'SALES' })
        .then((res) => setSalesOptions(res.data.result.records as unknown as SalesOption[]))
        .catch(() => setSalesOptions([]));
    }
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ travelerCount: 1, orderStatus: 'PENDING' });
    setFormVisible(true);
  };

  const openEdit = (record: TravelOrder) => {
    setEditing(record);
    form.setFieldsValue(record);
    setFormVisible(true);
  };

  const submitForm = async () => {
    const values = await form.validate();
    if (editing) {
      await api.updateOrder(editing.id, values);
      Message.success('订单已更新，操作已留痕');
    } else {
      await api.createOrder(values);
      Message.success('订单创建成功');
    }
    setFormVisible(false);
    load(data.page);
  };

  const showDetail = async (record: TravelOrder) => {
    const res = await api.getOrder(record.id);
    setDetail(res.data.result);
    const logRes = await api.orderLogs(record.id);
    setLogs(logRes.data.result);
  };

  const requestDelete = (record: TravelOrder) => {
    let reason = '';
    Modal.confirm({
      title: '申请删除订单',
      content: (
        <Input.TextArea
          placeholder="请填写删除原因（必填）"
          onChange={(v) => {
            reason = v;
          }}
        />
      ),
      onOk: async () => {
        if (!reason.trim()) {
          Message.warning('请填写删除原因');
          return Promise.reject();
        }
        await api.requestDelete(record.id, reason);
        Message.success('已提交删除审批');
        load(data.page);
      },
    });
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', width: 180 },
    { title: '客户', dataIndex: 'customerName' },
    { title: '目的地', dataIndex: 'destinationCity' },
    { title: '出行日', dataIndex: 'travelDate', width: 120 },
    { title: '金额', dataIndex: 'totalAmount', render: (v: number) => `¥${v}` },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      render: (v: string) => (
        <Tag color={STATUS_MAP[v]?.color}>{STATUS_MAP[v]?.label || v}</Tag>
      ),
    },
    { title: '负责销售', dataIndex: 'salesAdminName' },
    {
      title: '操作',
      width: 220,
      render: (_: unknown, record: TravelOrder) => (
        <Space>
          <Button type="text" onClick={() => showDetail(record)}>
            详情
          </Button>
          {(hasPermission('order:update_assigned') || hasPermission('order:view_all')) && (
            <Button type="text" onClick={() => openEdit(record)}>
              编辑
            </Button>
          )}
          {hasPermission('order:delete_request') && (
            <Button type="text" status="danger" onClick={() => requestDelete(record)}>
              申请删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="旅游订单" />
      <Card className="page-content-card">
        <Space className="admin-filter-bar" wrap>
          <Input
            prefix={<IconSearch />}
            placeholder="订单号/客户/目的地"
            style={{ width: 260 }}
            value={keyword}
            onChange={setKeyword}
          />
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 140 }}
            value={status}
            onChange={setStatus}
            options={Object.entries(STATUS_MAP).map(([v, o]) => ({ value: v, label: o.label }))}
          />
          <Button type="primary" onClick={() => load(1)}>
            查询
          </Button>
          <Button
            icon={<IconRefresh />}
            onClick={() => {
              setKeyword('');
              setStatus(undefined);
              load(1, '', undefined);
            }}
          >
            重置
          </Button>
          {hasPermission('order:create') && (
            <Button type="primary" icon={<IconPlus />} onClick={openCreate}>
              新建订单
            </Button>
          )}
        </Space>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          data={data.records}
          pagination={{
            current: data.page,
            pageSize: data.pageSize,
            total: data.total,
            onChange: (nextPage) => load(nextPage),
          }}
        />
      </Card>

      <Modal
        title={editing ? '编辑订单' : '新建订单'}
        visible={formVisible}
        onOk={submitForm}
        onCancel={() => setFormVisible(false)}
        style={{ width: 560 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="客户姓名" field="customerName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="客户电话" field="customerPhone">
            <Input />
          </Form.Item>
          <Form.Item label="目的地" field="destinationCity" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="出行日期" field="travelDate" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item label="人数" field="travelerCount" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="总金额" field="totalAmount" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} />
          </Form.Item>
          <Form.Item label="状态" field="orderStatus" rules={[{ required: true }]}>
            <Select
              options={Object.entries(STATUS_MAP).map(([v, o]) => ({ value: v, label: o.label }))}
            />
          </Form.Item>
          {!editing && hasPermission('order:view_all') && (
            <Form.Item label="负责销售" field="salesAdminUserId" extra="不选择时默认归属当前登录账号">
              <Select
                allowClear
                showSearch
                placeholder="选择销售"
                options={salesOptions.map((s) => ({ value: s.id, label: `${s.realName}（${s.username}）` }))}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Drawer
        width={520}
        title="订单详情"
        visible={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
      >
        {detail && (
          <div>
            <p>
              <b>订单号：</b>
              {detail.orderNo}
            </p>
            <p>
              <b>客户：</b>
              {detail.customerName} {detail.customerPhone}
            </p>
            <p>
              <b>行程：</b>
              {detail.destinationCity} · {detail.travelDate} · {detail.travelerCount}人
            </p>
            <p>
              <b>金额：</b>¥{detail.totalAmount}
            </p>
            <p>
              <b>销售：</b>
              {detail.salesAdminName}
            </p>
            <h4 style={{ marginTop: 24 }}>操作留痕</h4>
            {logs.map((log) => (
              <Card key={String(log.id)} size="small" style={{ marginBottom: 8 }}>
                <div>
                  <Tag>{String(log.operation_type)}</Tag>{' '}
                  {dayjs(String(log.created_at)).format('YYYY-MM-DD HH:mm')}
                </div>
                <div style={{ color: '#4e5969', marginTop: 4 }}>{String(log.operation_detail)}</div>
              </Card>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
