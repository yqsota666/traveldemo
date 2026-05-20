import { Button, Card, Form, Input, Message } from '@arco-design/web-react';

import { api } from '../../services/api';

export default function ProfilePage() {
  const [form] = Form.useForm();

  const onSubmit = async () => {
    const values = await form.validate();
    await api.changePassword(values.oldPassword, values.newPassword);
    Message.success('密码修改成功');
    form.resetFields();
  };

  return (
    <Card className="page-content-card" style={{ maxWidth: 480 }}>
      <Form form={form} layout="vertical" onSubmit={onSubmit}>
        <Form.Item label="原密码" field="oldPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="新密码" field="newPassword" rules={[{ required: true, minLength: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          修改密码
        </Button>
      </Form>
    </Card>
  );
}
