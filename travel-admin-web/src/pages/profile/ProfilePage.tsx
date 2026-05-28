import { Button, Card, Descriptions, Form, Input, Message, Space, Typography } from '@arco-design/web-react';
import { useState } from 'react';

import { api } from '../../services/api';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../hooks/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const values = await form.validate();
    if (values.newPassword !== values.confirmPassword) {
      Message.error('两次输入的新密码不一致');
      return;
    }
    setSubmitting(true);
    try {
      await api.changePassword(values.oldPassword, values.newPassword);
      Message.success('密码修改成功');
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="账号设置" />
      <Space align="start" size={16} className="profile-grid">
        <Card className="page-content-card profile-card">
          <Typography.Title heading={6}>当前账号</Typography.Title>
          <Descriptions
            column={1}
            data={[
              { label: '用户名', value: user?.username || '-' },
              { label: '姓名', value: user?.realName || '-' },
              { label: '手机号', value: user?.phone || '-' },
              { label: '角色', value: user?.roles.join(' / ') || '-' },
            ]}
          />
        </Card>
        <Card className="page-content-card profile-card">
          <Typography.Title heading={6}>修改密码</Typography.Title>
          <Form form={form} layout="vertical" onSubmit={onSubmit}>
            <Form.Item label="原密码" field="oldPassword" rules={[{ required: true, message: '请输入原密码' }]}>
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Form.Item
              label="新密码"
              field="newPassword"
              rules={[{ required: true, minLength: 6, message: '新密码至少 6 位' }]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item label="确认新密码" field="confirmPassword" rules={[{ required: true, message: '请再次输入新密码' }]}>
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              修改密码
            </Button>
          </Form>
        </Card>
      </Space>
    </div>
  );
}
