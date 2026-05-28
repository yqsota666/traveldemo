import { Card, Table, Tag, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';
import { emptyText, formatDateTime } from '../../utils/format';

export default function LoginLogsPage() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.loginLogs({ page: p, pageSize: 10 });
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
    { title: '用户', dataIndex: 'username', render: (value: string) => <Typography.Text>{emptyText(value)}</Typography.Text> },
    {
      title: '状态',
      dataIndex: 'login_status',
      width: 120,
      render: (value: string) => (
        <Tag color={value === 'SUCCESS' ? 'green' : 'red'}>
          {value === 'SUCCESS' ? '成功' : '失败'}
        </Tag>
      ),
    },
    { title: '登录地址', dataIndex: 'login_ip', render: emptyText },
    { title: '时间', dataIndex: 'created_at', width: 180, render: formatDateTime },
  ];

  return (
    <div>
      <PageHeader title="登录日志" />
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
