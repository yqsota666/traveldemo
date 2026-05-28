import { Button, Card, Form, Input, Message, Tag } from '@arco-design/web-react';
import PageHeader from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import ImageUrlInput from '../../components/ImageUrlInput';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  DRAFT: { color: 'gray', label: '草稿' },
  PENDING: { color: 'orange', label: '待审核' },
  PUBLISHED: { color: 'green', label: '已上架' },
  OFFLINE: { color: 'red', label: '已下架' },
};

function statusTag(status: string) {
  const meta = STATUS_MAP[status] || { color: 'gray', label: status || '未配置' };
  return <Tag color={meta.color}>{meta.label}</Tag>;
}

export default function AboutConfigPage() {
  const { hasPermission, hasRole } = useAuth();
  const canApprove = hasPermission('cms:approve') || hasRole('SENIOR_ADMIN') || hasRole('SUPER_ADMIN');
  const [form] = Form.useForm();
  const [status, setStatus] = useState('');

  const load = () => {
    api.cmsAboutCompany().then((res) => {
      const d = res.data.result as Record<string, unknown>;
      setStatus(String(d.publish_status || ''));
      form.setFieldsValue({
        title: d.title,
        logoUrl: d.logo_url,
        coverImage: d.cover_image,
        longText: d.long_text,
        contactPhone: d.contact_phone,
        address: d.address,
      });
    });
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const values = await form.validate();
    await api.cmsSaveAboutCompany(values);
    Message.success('已保存');
    load();
  };

  return (
    <div>
      <PageHeader title="公司简介" extra={statusTag(status)} />
      <Card className="page-content-card">
        <Form form={form} layout="vertical" style={{ maxWidth: 640 }}>
          <Form.Item label="标题" field="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="标识图片地址" field="logoUrl">
            <ImageUrlInput />
          </Form.Item>
          <Form.Item label="封面图" field="coverImage">
            <ImageUrlInput />
          </Form.Item>
          <Form.Item label="详细介绍" field="longText" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item label="联系电话" field="contactPhone">
            <Input />
          </Form.Item>
          <Form.Item label="地址" field="address">
            <Input />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {hasPermission('cms:update') && (
            <Button type="primary" onClick={save}>
              保存
            </Button>
          )}
          {hasPermission('cms:submit') && ['DRAFT', 'OFFLINE'].includes(status) && (
            <Button onClick={() => api.cmsSubmitAbout().then(() => { Message.success('已提交审核'); load(); })}>
              提交审核
            </Button>
          )}
          {canApprove && status === 'PENDING' && (
            <Button status="success" onClick={() => api.cmsApproveAbout().then(() => { Message.success('已通过'); load(); })}>
              审核通过
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
