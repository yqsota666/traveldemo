import { Card, Table } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function LoginLogsPage() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const load = async (p = 1) => {
    const res = await api.loginLogs({ page: p, pageSize: 10 });
    setList(res.data.result.records);
    setTotal(res.data.result.total);
    setPage(p);
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: '用户', dataIndex: 'username' },
    { title: '状态', dataIndex: 'login_status' },
    { title: 'IP', dataIndex: 'login_ip' },
    { title: '时间', dataIndex: 'created_at' },
  ];

  return (
    <Card className="page-content-card">
      <Table rowKey="id" columns={columns} data={list} pagination={{ current: page, total, onChange: load }} />
    </Card>
  );
}
