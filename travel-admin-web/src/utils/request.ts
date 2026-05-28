import axios from 'axios';
import { Message } from '@arco-design/web-react';

const TOKEN_KEY = 'travel_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export interface ApiResponse<T> {
  status: number;
  message: string;
  result: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 开发环境固定走相对路径 /api，经 Vite 代理到后端，本机只需转发 5174
const apiBase =
  import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE ?? '');

const request = axios.create({
  baseURL: apiBase,
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;
    if (data.status !== 200) {
      Message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message));
    }
    return response;
  },
  (error) => {
    const onLoginPage = window.location.pathname.includes('/login');
    const isAuthMe = String(error.config?.url || '').includes('/auth/me');

    if (error.response?.status === 401) {
      clearToken();
      if (!onLoginPage) {
        window.location.href = '/login';
      }
    }

    // 登录页加载时 /me 未登录属正常，不弹全局错误（易与「密码错误」混淆）
    if (onLoginPage && isAuthMe) {
      return Promise.reject(error);
    }

    const body = error.response?.data;
    const isNetwork =
      !error.response &&
      (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
    const msg = isNetwork
      ? '无法连接后端：请确认 Cursor 已转发端口 5174，并访问 http://localhost:5174/login'
      : (typeof body === 'object' && body !== null && 'message' in body && String(body.message)) ||
        error.message ||
        '网络错误';
    Message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
