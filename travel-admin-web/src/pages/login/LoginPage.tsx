import { Button, Card, Divider, Input, Message, Typography } from '@arco-design/web-react';
import { IconArrowRight, IconCompass, IconLock, IconUser } from '@arco-design/web-react/icon';
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
      <div className="login-shell">
        <section className="login-brand-panel">
          <div className="login-brand-mark">
            <IconCompass />
          </div>
          <p className="login-kicker">旅游管理后台</p>
          <h1>旅游管理</h1>
          <div className="login-route-card">
            <span>目的地运营</span>
            <strong>城市 · 景点 · 商品 · 订单</strong>
          </div>
        </section>

        <Card className="login-card" bordered={false}>
          <div className="login-card-header">
            <h2 className="login-title">欢迎回来</h2>
            <Typography.Paragraph className="login-subtitle">
              测试环境默认密码：<Typography.Text bold>123456</Typography.Text>
            </Typography.Paragraph>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <label className="login-field">
              <span>账号</span>
              <Input
                prefix={<IconUser />}
                placeholder="director01"
                value={username}
                onChange={setUsername}
                allowClear
                autoComplete="username"
              />
            </label>
            <label className="login-field">
              <span>密码</span>
              <Input.Password
                prefix={<IconLock />}
                placeholder="123456"
                value={password}
                onChange={setPassword}
                allowClear
                autoComplete="current-password"
              />
            </label>
            <Button type="primary" long htmlType="submit" loading={loading} icon={<IconArrowRight />}>
              登录
            </Button>
          </form>

          <Divider className="login-divider">一键登录</Divider>

          <div className="login-account-grid">
            {TEST_ACCOUNTS.map((acc) => (
              <Button
                key={acc.username}
                type="outline"
                loading={loading}
                onClick={() => void doLogin(acc.username, acc.password)}
              >
                {acc.label}
                <span>{acc.username}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
