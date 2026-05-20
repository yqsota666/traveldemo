import { Button, Card, Message, Space, Table, Tag } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { api, DeleteRequest } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { PageResult } from '../../utils/request';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
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

  const approve = async (id: number, approved: boolean) => {
    if (approved) {
      await api.approveDelete(id);
      Message.success('已通过，订单已删除');
    } else {
      await api.rejectDelete(id);
      Message.success('已驳回删除申请');
    }
    load(data.page);
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '客户', dataIndex: 'customerName' },
    { title: '申请人', dataIndex: 'requestedByName' },
    { title: '原因', dataIndex: 'reason', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'requestStatus',
      render: (v: string) => <Tag color={STATUS_COLOR[v]}>{v}</Tag>,
    },
    { title: '申请时间', dataIndex: 'createdAt' },
    {
      title: '操作',
      render: (_: unknown, record: DeleteRequest) =>
        record.requestStatus === 'PENDING' && hasPermission('order:approve_delete') ? (
          <Space>
            <Button type="primary" size="small" onClick={() => approve(record.id, true)}>
              通过
            </Button>
            <Button size="small" onClick={() => approve(record.id, false)}>
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
      <Card className="page-content-card">
        <Space style={{ marginBottom: 16 }}>
          <Button type={filter === 'PENDING' ? 'primary' : 'secondary'} onClick={() => setFilter('PENDING')}>
            待处理
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
