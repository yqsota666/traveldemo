import { Button, Card, Message, Modal, Space, Table, Tag, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api, DeleteRequest } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { PageResult } from '../../utils/request';
import { emptyText, formatDateTime } from '../../utils/format';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'orange', label: '待处理' },
  APPROVED: { color: 'green', label: '已通过' },
  REJECTED: { color: 'red', label: '已驳回' },
};

export default function DeleteApprovalsPage() {
  const { hasPermission } = useAuth();
  const [data, setData] = useState<PageResult<DeleteRequest>>({
    records: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string | undefined>('PENDING');

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.listDeleteRequests({ page, pageSize: 10, status: filter });
      setData(res.data.result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const approve = (record: DeleteRequest, approved: boolean) => {
    Modal.confirm({
      title: approved ? '通过删除申请' : '驳回删除申请',
      content: approved
        ? `确认通过订单「${record.orderNo}」的删除申请？通过后订单会被删除。`
        : `确认驳回订单「${record.orderNo}」的删除申请？`,
      okButtonProps: approved ? { status: 'danger' } : undefined,
      onOk: async () => {
        if (approved) {
          await api.approveDelete(record.id);
          Message.success('已通过，订单已删除');
        } else {
          await api.rejectDelete(record.id);
          Message.success('已驳回删除申请');
        }
        load(data.page);
      },
    });
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', render: (value: string) => <Typography.Text copyable>{emptyText(value)}</Typography.Text> },
    { title: '客户', dataIndex: 'customerName', render: emptyText },
    { title: '申请人', dataIndex: 'requestedByName', render: emptyText },
    { title: '原因', dataIndex: 'reason', ellipsis: true, render: (value: string) => <Typography.Text>{emptyText(value)}</Typography.Text> },
    {
      title: '状态',
      dataIndex: 'requestStatus',
      width: 100,
      render: (v: string) => {
        const status = STATUS_MAP[v] || { color: 'gray', label: v };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    { title: '申请时间', dataIndex: 'createdAt', width: 180, render: formatDateTime },
    { title: '处理人', dataIndex: 'approverName', width: 120, render: emptyText },
    { title: '处理时间', dataIndex: 'processedAt', width: 180, render: formatDateTime },
    {
      title: '操作',
      width: 150,
      render: (_: unknown, record: DeleteRequest) =>
        record.requestStatus === 'PENDING' && hasPermission('order:approve_delete') ? (
          <Space>
            <Button type="primary" size="small" onClick={() => approve(record, true)}>
              通过
            </Button>
            <Button size="small" onClick={() => approve(record, false)}>
              驳回
            </Button>
          </Space>
        ) : (
          '-'
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="删除审批" />
      <Card className="page-content-card">
        <Space className="admin-filter-bar">
          <Button type={filter === 'PENDING' ? 'primary' : 'secondary'} onClick={() => setFilter('PENDING')}>
            待处理
          </Button>
          <Button type={filter === 'APPROVED' ? 'primary' : 'secondary'} onClick={() => setFilter('APPROVED')}>
            已通过
          </Button>
          <Button type={filter === 'REJECTED' ? 'primary' : 'secondary'} onClick={() => setFilter('REJECTED')}>
            已驳回
          </Button>
          <Button type={filter === undefined ? 'primary' : 'secondary'} onClick={() => setFilter(undefined)}>
            全部
          </Button>
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
            onChange: load,
          }}
        />
      </Card>
    </div>
  );
}
