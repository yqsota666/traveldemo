import { Button, Card, Form, Input, Message } from '@arco-design/web-react';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getToken } from '../../utils/request';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      Message.success('登录成功');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <h1 className="login-title">旅游管理</h1>
        <Form layout="vertical" onSubmit={onSubmit} autoComplete="off">
          <Form.Item label="账号" field="username" rules={[{ required: true, message: '请输入账号' }]}>
            <Input prefix={<IconUser />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item label="密码" field="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<IconLock />} placeholder="请输入密码" />
          </Form.Item>
          <Button type="primary" long htmlType="submit" loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
