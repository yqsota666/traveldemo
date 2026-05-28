import { Card, Table, Tag, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { emptyText, formatDateTime } from '../../utils/format';

const ACTION_COLOR: Record<string, string> = {
  create: 'green',
  update: 'arcoblue',
  delete: 'red',
  approve_delete: 'orange',
  submit: 'purple',
  approve: 'green',
  offline: 'gray',
};

export default function OperationLogsPage() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.operationLogs({ page: p, pageSize: 10 });
      setList(res.data.result.records as Record<string, unknown>[]);
      setTotal(res.data.result.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      title: '操作类型',
      dataIndex: 'operation_type',
      width: 140,
      render: (value: string) => <Tag color={ACTION_COLOR[value] || 'arcoblue'}>{emptyText(value)}</Tag>,
    },
    {
      title: '模块',
      dataIndex: 'target_type',
      width: 120,
      render: (value: string) => <Typography.Text>{emptyText(value)}</Typography.Text>,
    },
    {
      title: '详情',
      dataIndex: 'operation_detail',
      ellipsis: true,
      render: (value: string) => <Typography.Text copyable={{ text: value }}>{emptyText(value)}</Typography.Text>,
    },
    { title: '时间', dataIndex: 'created_at', width: 180, render: formatDateTime },
  ];

  return (
    <div>
      <PageHeader title="操作日志" />
      <Card className="page-content-card">
        <Table
          rowKey="id"
          columns={columns}
          data={list}
          loading={loading}
          pagination={{ current: page, total, pageSize: 10, onChange: load }}
        />
      </Card>
    </div>
  );
}
