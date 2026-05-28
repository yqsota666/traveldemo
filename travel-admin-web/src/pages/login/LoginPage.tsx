import { Button, Card, Divider, Input, Message, Typography } from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { clearToken } from '../../utils/request';

const TEST_ACCOUNTS = [
  { label: '超级管理员', username: 'superadmin', password: '123456' },
  { label: '高层管理', username: 'director01', password: '123456' },
  { label: '销售01', username: 'sales01', password: '123456' },
  { label: '销售02', username: 'sales02', password: '123456' },
] as const;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('director01');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearToken();
  }, []);

  const doLogin = async (u: string, p: string) => {
    const name = u.trim();
    const pass = p.trim();
    if (!name || !pass) {
      Message.warning('请输入账号和密码');
      return;
    }
    setLoading(true);
    try {
      await login(name, pass);
      Message.success('登录成功');
      navigate('/dashboard', { replace: true });
    } catch {
      /* 错误由拦截器展示 */
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void doLogin(username, password);
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div
          style={{
            marginBottom: 12,
            padding: '8px 12px',
            background: '#e8f3ff',
            border: '1px solid #165dff',
            borderRadius: 6,
            fontSize: 12,
            color: '#165dff',
          }}
        >
          【远程服务器 · 新版登录页】应看到下方「一键登录」按钮；若只有「请输入账号」则是旧页面，请关掉本机
          5174 进程后仅用 Cursor 转发远程 5174
        </div>
        <h1 className="login-title">旅游管理</h1>

        <Typography.Paragraph style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          测试环境默认密码：<Typography.Text bold>123456</Typography.Text>（账号已预填 director01）
        </Typography.Paragraph>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
              <Typography.Text type="error">*</Typography.Text> 账号
            </Typography.Text>
            <Input
              prefix={<IconUser />}
              placeholder="director01"
              value={username}
              onChange={setUsername}
              allowClear
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
              <Typography.Text type="error">*</Typography.Text> 密码
            </Typography.Text>
            <Input.Password
              prefix={<IconLock />}
              placeholder="123456"
              value={password}
              onChange={setPassword}
              allowClear
              autoComplete="current-password"
            />
          </div>
          <Button type="primary" long htmlType="submit" loading={loading}>
            登录
          </Button>
        </form>

        <Divider style={{ margin: '20px 0' }}>或一键登录</Divider>

        {TEST_ACCOUNTS.map((acc) => (
          <Button
            key={acc.username}
            long
            type="outline"
            loading={loading}
            style={{ marginBottom: 8 }}
            onClick={() => void doLogin(acc.username, acc.password)}
          >
            {acc.label}（{acc.username}）
          </Button>
        ))}
      </Card>
    </div>
  );
}
