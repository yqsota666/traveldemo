import { Button, Card, Form, Input, Message, Switch } from '@arco-design/web-react';
import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

export default function ConsultationConfigPage() {
  const { hasPermission, hasRole } = useAuth();
  const canApprove = hasPermission('cms:approve') || hasRole('SENIOR_ADMIN') || hasRole('SUPER_ADMIN');
  const [form] = Form.useForm();
  const [status, setStatus] = useState('');

  const load = () => {
    api.cmsConsultation().then((res) => {
      const d = res.data.result as Record<string, unknown>;
      setStatus(String(d.publish_status || ''));
      form.setFieldsValue({
        buttonText: d.button_text,
        contactPhone: d.contact_phone,
        qrcodeImageUrl: d.qrcode_image_url,
        enabled: d.enabled === 1,
      });
    });
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const values = await form.validate();
    await api.cmsSaveConsultation(values);
    Message.success('已保存');
    load();
  };

  return (
    <div>
      <PageHeader title="在线咨询配置" extra={<span>状态: {status}</span>} />
      <Card className="page-content-card">
        <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item label="按钮文案" field="buttonText" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="联系电话" field="contactPhone">
            <Input />
          </Form.Item>
          <Form.Item label="客服二维码 URL" field="qrcodeImageUrl">
            <Input />
          </Form.Item>
          <Form.Item label="启用" field="enabled" triggerPropName="checked">
            <Switch />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {hasPermission('cms:update') && (
            <Button type="primary" onClick={save}>
              保存
            </Button>
          )}
          {hasPermission('cms:submit') && (
            <Button onClick={() => api.cmsSubmitConsultation().then(() => { Message.success('已提交'); load(); })}>
              提交审核
            </Button>
          )}
          {canApprove && (
            <Button status="success" onClick={() => api.cmsApproveConsultation().then(() => { Message.success('已通过'); load(); })}>
              审核通过
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
