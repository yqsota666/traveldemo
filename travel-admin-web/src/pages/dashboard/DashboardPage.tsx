import { Spin } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const STAT_ITEMS = [
  { key: 'orderCount', label: '旅游订单', unit: '单' },
  { key: 'pendingDeleteCount', label: '待审批删除', unit: '项' },
  { key: 'customerBindingCount', label: '客户归属', unit: '条' },
  { key: 'adminCount', label: '启用账号', unit: '人' },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .dashboardStats()
      .then((res) => {
        setStats(res.data.result ?? {});
      })
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div className="stat-grid">
      {STAT_ITEMS.map((item) => (
        <div key={item.key} className="stat-item">
          <div className="stat-item-label">{item.label}</div>
          <div className="stat-item-value">
            {Number(stats[item.key] || 0)}
            <span className="unit">{item.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
