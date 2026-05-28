import { Spin } from '@arco-design/web-react';
import { IconBook, IconDelete, IconSafe, IconUserGroup } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { api } from '../../services/api';

const STAT_ITEMS = [
  { key: 'orderCount', label: '旅游订单', unit: '单', tone: 'blue', icon: IconBook },
  { key: 'pendingDeleteCount', label: '待审批删除', unit: '项', tone: 'amber', icon: IconDelete },
  { key: 'customerBindingCount', label: '客户归属', unit: '条', tone: 'green', icon: IconUserGroup },
  { key: 'adminCount', label: '启用账号', unit: '人', tone: 'violet', icon: IconSafe },
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
    <div className="dashboard-page">
      <PageHeader title="工作台" extra={<span className="dashboard-date">{dayjs().format('YYYY年M月D日')}</span>} />
      <div className="stat-grid">
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className={`stat-item stat-item-${item.tone}`}>
              <div className="stat-item-top">
                <span className="stat-icon">
                  <Icon />
                </span>
                <span className="stat-item-label">{item.label}</span>
              </div>
              <div className="stat-item-value">
                {Number(stats[item.key] || 0)}
                <span className="unit">{item.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="dashboard-panel">
        <div>
          <h2>运营概览</h2>
          <p>订单、审批、客户与账号的当前可见范围。</p>
        </div>
        <div className="dashboard-panel-metrics">
          <span>实时</span>
          <strong>{STAT_ITEMS.length}</strong>
          <span>项指标</span>
        </div>
      </div>
    </div>
  );
}
