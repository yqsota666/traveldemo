import request, { ApiResponse, PageResult } from '../utils/request';

export interface MeUser {
  id: number;
  username: string;
  realName: string;
  phone?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResult {
  accessToken: string;
  expireSeconds: number;
  user: MeUser;
}

export interface TravelOrder {
  id: number;
  orderNo: string;
  customerName: string;
  customerPhone?: string;
  destinationCity: string;
  travelDate: string;
  travelerCount: number;
  totalAmount: number;
  orderStatus: string;
  salesAdminUserId: number;
  salesAdminName?: string;
  createdByAdminUserId: number;
  createdByName?: string;
  createdAt?: string;
}

export interface DeleteRequest {
  id: number;
  orderId: number;
  orderNo: string;
  customerName: string;
  requestedByAdminUserId: number;
  requestedByName?: string;
  reason: string;
  requestStatus: string;
  createdAt?: string;
}

export const api = {
  login: (username: string, password: string) =>
    request.post<ApiResponse<LoginResult>>('/api/admin/v1/auth/login', { username, password }),

  me: () => request.get<ApiResponse<MeUser>>('/api/admin/v1/auth/me'),

  changePassword: (oldPassword: string, newPassword: string) =>
    request.post('/api/admin/v1/auth/change-password', { oldPassword, newPassword }),

  dashboardStats: () => request.get<ApiResponse<Record<string, unknown>>>('/api/admin/v1/dashboard/stats'),

  listOrders: (params: Record<string, unknown>) =>
    request.get<ApiResponse<PageResult<TravelOrder>>>('/api/admin/v1/orders', { params }),

  getOrder: (id: number) => request.get<ApiResponse<TravelOrder>>(`/api/admin/v1/orders/${id}`),

  createOrder: (data: Record<string, unknown>) =>
    request.post<ApiResponse<TravelOrder>>('/api/admin/v1/orders', data),

  updateOrder: (id: number, data: Record<string, unknown>) =>
    request.put<ApiResponse<TravelOrder>>(`/api/admin/v1/orders/${id}`, data),

  requestDelete: (id: number, reason: string) =>
    request.post<ApiResponse<number>>(`/api/admin/v1/orders/${id}/delete-request`, { reason }),

  orderLogs: (id: number) =>
    request.get<ApiResponse<Record<string, unknown>[]>>(`/api/admin/v1/orders/${id}/logs`),

  listDeleteRequests: (params: Record<string, unknown>) =>
    request.get<ApiResponse<PageResult<DeleteRequest>>>('/api/admin/v1/orders/delete-requests', { params }),

  approveDelete: (id: number) =>
    request.post(`/api/admin/v1/orders/delete-requests/${id}/approve`),

  rejectDelete: (id: number) =>
    request.post(`/api/admin/v1/orders/delete-requests/${id}/reject`),

  listAdmins: (params: Record<string, unknown>) =>
    request.get('/api/admin/v1/admins', { params }),

  createAdmin: (data: Record<string, unknown>) => request.post('/api/admin/v1/admins', data),

  updateAdmin: (id: number, data: Record<string, unknown>) =>
    request.put(`/api/admin/v1/admins/${id}`, data),

  listRoles: () => request.get('/api/admin/v1/roles'),

  listPermissions: () => request.get('/api/admin/v1/permissions'),

  roleMatrix: () => request.get('/api/admin/v1/roles/permissions-matrix'),

  listBindings: (params: Record<string, unknown>) =>
    request.get('/api/admin/v1/sales-bindings', { params }),

  createBinding: (data: Record<string, unknown>) =>
    request.post('/api/admin/v1/sales-bindings', data),

  deleteBinding: (id: number) => request.delete(`/api/admin/v1/sales-bindings/${id}`),

  loginLogs: (params: Record<string, unknown>) =>
    request.get('/api/admin/v1/logs/login', { params }),

  operationLogs: (params: Record<string, unknown>) =>
    request.get('/api/admin/v1/logs/operation', { params }),

  cmsCityOptions: () => request.get<ApiResponse<{ id: number; name: string }[]>>('/api/admin/v1/cms/cities/options'),

  cmsList: (resource: string, params: Record<string, unknown>) =>
    request.get<ApiResponse<PageResult<Record<string, unknown>>>>(`/api/admin/v1/cms/${resource}`, { params }),

  cmsCreate: (resource: string, data: Record<string, unknown>) =>
    request.post<ApiResponse<Record<string, unknown>>>(`/api/admin/v1/cms/${resource}`, data),

  cmsUpdate: (resource: string, id: number, data: Record<string, unknown>) =>
    request.put<ApiResponse<Record<string, unknown>>>(`/api/admin/v1/cms/${resource}/${id}`, data),

  cmsDelete: (resource: string, id: number) =>
    request.delete(`/api/admin/v1/cms/${resource}/${id}`),

  cmsSubmit: (resource: string, id: number) =>
    request.post(`/api/admin/v1/cms/${resource}/${id}/submit`),

  cmsApprove: (resource: string, id: number, comment?: string) =>
    request.post(`/api/admin/v1/cms/${resource}/${id}/approve`, comment ? { comment } : {}),

  cmsOffline: (resource: string, id: number) =>
    request.post(`/api/admin/v1/cms/${resource}/${id}/offline`),

  cmsBatchDelete: (resource: string, ids: number[]) =>
    request.post(`/api/admin/v1/cms/${resource}/batch-delete`, { ids }),

  cmsBatchSubmit: (resource: string, ids: number[]) =>
    request.post(`/api/admin/v1/cms/${resource}/batch-submit`, { ids }),

  cmsAboutCompany: () =>
    request.get<ApiResponse<Record<string, unknown>>>('/api/admin/v1/cms/about/company'),

  cmsSaveAboutCompany: (data: Record<string, unknown>) =>
    request.put('/api/admin/v1/cms/about/company', data),

  cmsSubmitAbout: () => request.post('/api/admin/v1/cms/about/company/submit'),

  cmsApproveAbout: () => request.post('/api/admin/v1/cms/about/company/approve'),

  cmsConsultation: () =>
    request.get<ApiResponse<Record<string, unknown>>>('/api/admin/v1/cms/consultation'),

  cmsSaveConsultation: (data: Record<string, unknown>) =>
    request.put('/api/admin/v1/cms/consultation', data),

  cmsSubmitConsultation: () => request.post('/api/admin/v1/cms/consultation/submit'),

  cmsApproveConsultation: () => request.post('/api/admin/v1/cms/consultation/approve'),

  cmsUpload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request.post<ApiResponse<{ url: string }>>('/api/admin/v1/cms/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export interface CmsResourceConfig {
  resource: string;
  title: string;
  nameField: 'name' | 'title';
  showCity: boolean;
  cityRequired: boolean;
  fields: string[];
}
