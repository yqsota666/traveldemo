import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from '@arco-design/web-react';
import PageHeader from '../../components/PageHeader';
import { IconDelete, IconEdit, IconPlus, IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import ImageUrlInput from '../../components/ImageUrlInput';
import { api, CmsResourceConfig } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  DRAFT: { color: 'gray', label: '草稿' },
  PENDING: { color: 'orange', label: '待审核' },
  PUBLISHED: { color: 'green', label: '已上架' },
  OFFLINE: { color: 'red', label: '已下架' },
};

interface Props {
  config: CmsResourceConfig;
}

function parseGalleryForForm(value: unknown) {
  if (!value) return '';
  if (Array.isArray(value)) return JSON.stringify(value, null, 2);
  if (typeof value !== 'string') return '';
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function CmsResourcePage({ config }: Props) {
  const { hasPermission, hasRole } = useAuth();
  const canApprove = hasPermission('cms:approve') || hasRole('SENIOR_ADMIN') || hasRole('SUPER_ADMIN');
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState({ keyword: '', publishStatus: '', cityId: undefined as number | undefined });
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [form] = Form.useForm();

  const load = async (p = 1, nextFilters = filters) => {
    const res = await api.cmsList(config.resource, {
      page: p,
      pageSize: 10,
      keyword: nextFilters.keyword || undefined,
      publishStatus: nextFilters.publishStatus || undefined,
      cityId: nextFilters.cityId,
    });
    setList(res.data.result.records as Record<string, unknown>[]);
    setTotal(res.data.result.total);
    setPage(p);
  };

  // 轮播图/景点等共用本组件，路由切换时须按 resource 重新拉数（不能只 mount 一次）
  useEffect(() => {
    const emptyFilters = { keyword: '', publishStatus: '', cityId: undefined as number | undefined };
    setPage(1);
    setSelected([]);
    setFilters(emptyFilters);
    setVisible(false);
    setEditingId(null);
    form.resetFields();

    api.cmsCityOptions().then((r) => setCities(r.data.result as { id: number; name: string }[]));

    void (async () => {
      const res = await api.cmsList(config.resource, { page: 1, pageSize: 10 });
      setList(res.data.result.records as Record<string, unknown>[]);
      setTotal(res.data.result.total);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form 实例稳定，仅随 resource 切换重置
  }, [config.resource]);

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ homeRecommended: false, sortOrder: 0 });
    setVisible(true);
  };

  const parseGalleryImages = (gallery: unknown) => {
    if (Array.isArray(gallery)) return gallery;
    if (typeof gallery !== 'string' || !gallery.trim()) return [];
    try {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditingId(row.id as number);
    const gallery = row.gallery_images ?? row.galleryImages;
    form.setFieldsValue({
      cityId: row.city_id,
      title: row.title,
      name: row.name,
      summary: row.summary,
      coverImage: row.cover_image,
      imageUrl: row.image_url,
      galleryImages: parseGalleryForForm(gallery),
      tags: row.tags,
      address: row.address,
      priceLabel: row.price_label,
      bookingChannel: row.booking_channel,
      openingHours: row.opening_hours,
      checkinPoints: row.checkin_points,
      scenicDriveTime: row.scenic_drive_time,
      roomTypes: row.room_types,
      facilities: row.facilities,
      price: row.price,
      externalLink: row.external_link,
      notice: row.notice,
      caseType: row.case_type,
      weatherHint: row.weather_hint,
      content: row.content,
      yearsExperience: row.years_experience,
      intro: row.intro,
      quoteText: row.quote_text,
      avatarUrl: row.avatar_url,
      homeRecommended: row.home_recommended === 1,
      sortOrder: row.sort_order,
      displayNo: row.display_no,
    });
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validate();
    const payload: Record<string, unknown> = { ...values };
    if (typeof payload.galleryImages === 'string' && payload.galleryImages) {
      try {
        payload.galleryImages = JSON.parse(payload.galleryImages as string);
      } catch {
        Message.error('图集格式须为数组');
          return;
      }
    }
    if (payload.galleryImages === '') {
      delete payload.galleryImages;
    }
    if (editingId) {
      await api.cmsUpdate(config.resource, editingId, payload);
      Message.success('已保存');
    } else {
      await api.cmsCreate(config.resource, payload);
      Message.success('已创建');
    }
    setVisible(false);
    load(page);
  };

  const confirmDelete = (row: Record<string, unknown>) => {
    Modal.confirm({
      title: '删除内容',
      content: `确认删除「${String(row.title || row.name || '-')}」？删除后不会在列表展示。`,
      onOk: async () => {
        await api.cmsDelete(config.resource, row.id as number);
        Message.success('已删除');
        load(page);
      },
    });
  };

  const imageColumnKey = config.fields.includes('coverImage')
    ? 'cover_image'
    : config.fields.includes('imageUrl')
      ? 'image_url'
      : config.fields.includes('avatarUrl')
        ? 'avatar_url'
        : '';

  const columns = [
    ...(config.showCity ? [{ title: '城市', dataIndex: 'city_name', width: 80 }] : []),
    ...(imageColumnKey
      ? [
          {
            title: '图片',
            dataIndex: imageColumnKey,
            width: 88,
            render: (v: string) => (v ? <img className="admin-table-thumb" src={v} alt="" /> : <span className="empty-cell">-</span>),
          },
        ]
      : []),
    {
      title: config.nameField === 'name' ? '名称' : '标题',
      dataIndex: config.nameField === 'name' ? 'name' : 'title',
    },
    {
      title: '状态',
      dataIndex: 'publish_status',
      width: 90,
      render: (v: string) => {
        const s = STATUS_MAP[v] || { color: 'gray', label: v };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    { title: '排序', dataIndex: 'sort_order', width: 70 },
    {
      title: '操作',
      width: 320,
      render: (_: unknown, row: Record<string, unknown>) => (
        <Space size={4} wrap>
          <Button type="text" size="small" icon={<IconEdit />} disabled={row.publish_status === 'PENDING'} onClick={() => openEdit(row)}>
            编辑
          </Button>
          {hasPermission('cms:submit') && ['DRAFT', 'OFFLINE'].includes(String(row.publish_status)) && (
            <Button type="text" size="small" onClick={() => api.cmsSubmit(config.resource, row.id as number).then(() => { Message.success('已提交审核'); load(page); }).catch(() => undefined)}>
              提交审核
            </Button>
          )}
          {canApprove && row.publish_status === 'PENDING' && (
            <Button type="text" size="small" status="success" onClick={() => api.cmsApprove(config.resource, row.id as number).then(() => { Message.success('已通过'); load(page); }).catch(() => undefined)}>
              通过
            </Button>
          )}
          {canApprove && row.publish_status === 'PUBLISHED' && (
            <Button type="text" size="small" onClick={() => api.cmsOffline(config.resource, row.id as number).then(() => { Message.success('已下架'); load(page); }).catch(() => undefined)}>
              下架
            </Button>
          )}
          {hasPermission('cms:delete') && row.publish_status !== 'PENDING' && (
            <Button type="text" size="small" status="danger" icon={<IconDelete />} onClick={() => confirmDelete(row)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={config.title}
        extra={
          hasPermission('cms:create') ? (
            <Button type="primary" icon={<IconPlus />} onClick={openCreate}>
              新增
            </Button>
          ) : undefined
        }
      />
      <Card className="page-content-card" style={{ marginBottom: 12 }}>
        <Form layout="inline" className="admin-inline-form">
          {config.showCity && (
            <Form.Item label="城市">
              <Select
                style={{ width: 120 }}
                allowClear
                placeholder="全部"
                options={cities.map((c) => ({ value: c.id, label: c.name }))}
                value={filters.cityId}
                onChange={(v) => setFilters((f) => ({ ...f, cityId: v }))}
              />
            </Form.Item>
          )}
          <Form.Item label="状态">
            <Select
              style={{ width: 120 }}
              allowClear
              placeholder="全部"
              options={Object.entries(STATUS_MAP).map(([k, v]) => ({ value: k, label: v.label }))}
              value={filters.publishStatus || undefined}
              onChange={(v) => setFilters((f) => ({ ...f, publishStatus: v || '' }))}
            />
          </Form.Item>
          <Form.Item label="关键词">
            <Input
              style={{ width: 160 }}
              value={filters.keyword}
              onChange={(v) => setFilters((f) => ({ ...f, keyword: v }))}
            />
          </Form.Item>
          <Button type="primary" onClick={() => load(1)}>
            <IconSearch />
            查询
          </Button>
          <Button
            onClick={() => {
              const empty = { keyword: '', publishStatus: '', cityId: undefined as number | undefined };
              setFilters(empty);
              load(1, empty);
            }}
          >
            <IconRefresh />
            重置
          </Button>
          {hasPermission('cms:batch') && selected.length > 0 && (
            <>
              <Button onClick={() => api.cmsBatchSubmit(config.resource, selected).then(() => { Message.success('已批量提交'); load(page); }).catch(() => undefined)}>
                批量提交
              </Button>
              <Button status="danger" onClick={() => api.cmsBatchDelete(config.resource, selected).then(() => { Message.success('已删除'); load(page); }).catch(() => undefined)}>
                批量删除
              </Button>
            </>
          )}
        </Form>
      </Card>
      <Card className="page-content-card">
        <Table
          rowKey="id"
          columns={columns}
          data={list}
          rowSelection={{ selectedRowKeys: selected, onChange: (keys) => setSelected(keys as number[]) }}
          pagination={{ current: page, total, pageSize: 10, onChange: (nextPage) => load(nextPage) }}
        />
      </Card>
      <Modal title={editingId ? '编辑' : '新增'} visible={visible} onOk={submit} onCancel={() => setVisible(false)} style={{ width: 640 }}>
        <Form form={form} layout="vertical">
          {config.showCity && (
            <Form.Item label="所属城市" field="cityId" rules={config.cityRequired ? [{ required: true }] : undefined}>
              <Select options={cities.map((c) => ({ value: c.id, label: c.name }))} />
            </Form.Item>
          )}
          {config.nameField === 'name' ? (
            <Form.Item label="名称" field="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          ) : (
            <Form.Item label="标题" field="title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('displayNo') && (
            <Form.Item label="展示编号" field="displayNo">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('summary') && (
            <Form.Item label="简介" field="summary">
              <Input.TextArea />
            </Form.Item>
          )}
          {config.fields.includes('imageUrl') && (
            <Form.Item label="图片地址" field="imageUrl" rules={[{ required: true }]}>
              <ImageUrlInput />
            </Form.Item>
          )}
          {config.fields.includes('coverImage') && (
            <Form.Item label="封面图地址" field="coverImage">
              <ImageUrlInput />
            </Form.Item>
          )}
          {config.fields.includes('avatarUrl') && (
            <Form.Item label="头像地址" field="avatarUrl">
              <ImageUrlInput />
            </Form.Item>
          )}
          {config.fields.includes('galleryImages') && (
            <Form.Item label="图集" field="galleryImages" extra='数组格式，例如 ["/uploads/cms/a.jpg"]；多图上传会在下一轮补成批量控件。'>
              <Input.TextArea placeholder='["/uploads/..."]' />
            </Form.Item>
          )}
          {config.fields.includes('price') && (
            <Form.Item label="价格" field="price">
              <InputNumber min={0} precision={2} />
            </Form.Item>
          )}
          {config.fields.includes('priceLabel') && (
            <Form.Item label="价格说明" field="priceLabel">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('bookingChannel') && (
            <Form.Item label="预约/购票渠道" field="bookingChannel">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
          {config.fields.includes('openingHours') && (
            <Form.Item label="开放时间" field="openingHours">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('checkinPoints') && (
            <Form.Item label="打卡点位" field="checkinPoints">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
          {config.fields.includes('scenicDriveTime') && (
            <Form.Item label="距离景点车程" field="scenicDriveTime">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('roomTypes') && (
            <Form.Item label="房型" field="roomTypes">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
          {config.fields.includes('facilities') && (
            <Form.Item label="设施服务" field="facilities">
              <Input.TextArea rows={3} />
            </Form.Item>
          )}
          {config.fields.includes('externalLink') && (
            <Form.Item label="外链" field="externalLink">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('address') && (
            <Form.Item label="地址" field="address">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('tags') && (
            <Form.Item label="标签" field="tags">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('notice') && (
            <Form.Item label="须知" field="notice">
              <Input.TextArea />
            </Form.Item>
          )}
          {config.fields.includes('caseType') && (
            <Form.Item label="案例类型" field="caseType" rules={[{ required: true }]}>
              <Select options={[
                { value: 'XHS', label: '小红书游记' },
                { value: 'WECHAT', label: '微信反馈' },
              ]} />
            </Form.Item>
          )}
          {config.fields.includes('yearsExperience') && (
            <Form.Item label="从业年限" field="yearsExperience">
              <InputNumber min={0} />
            </Form.Item>
          )}
          {config.fields.includes('intro') && (
            <Form.Item label="介绍" field="intro">
              <Input.TextArea />
            </Form.Item>
          )}
          {config.fields.includes('quoteText') && (
            <Form.Item label="语录" field="quoteText">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('weatherHint') && (
            <Form.Item label="天气提示" field="weatherHint">
              <Input />
            </Form.Item>
          )}
          {config.fields.includes('content') && (
            <Form.Item label="内容" field="content">
              <Input.TextArea rows={4} />
            </Form.Item>
          )}
          {config.fields.includes('homeRecommended') && (
            <Form.Item label="首页推荐" field="homeRecommended" triggerPropName="checked">
              <Switch />
            </Form.Item>
          )}
          <Form.Item label="排序" field="sortOrder">
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
