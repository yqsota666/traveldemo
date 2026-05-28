import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/orders/OrdersPage';
import DeleteApprovalsPage from './pages/delete-approvals/DeleteApprovalsPage';
import AdminsPage from './pages/admins/AdminsPage';
import RolesPage from './pages/roles/RolesPage';
import BindingsPage from './pages/bindings/BindingsPage';
import LoginLogsPage from './pages/logs/LoginLogsPage';
import OperationLogsPage from './pages/logs/OperationLogsPage';
import ProfilePage from './pages/profile/ProfilePage';
import CmsResourcePage from './pages/cms/CmsResourcePage';
import AboutConfigPage from './pages/cms/AboutConfigPage';
import ConsultationConfigPage from './pages/cms/ConsultationConfigPage';
import { CMS_CONFIGS } from './pages/cms/cmsConfigs';

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="delete-approvals" element={<DeleteApprovalsPage />} />
            <Route path="admins" element={<AdminsPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="bindings" element={<BindingsPage />} />
            <Route path="logs/login" element={<LoginLogsPage />} />
            <Route path="logs/operation" element={<OperationLogsPage />} />
            <Route path="cms/cities" element={<CmsResourcePage key="cms-cities" config={CMS_CONFIGS.cities} />} />
            <Route path="cms/banners" element={<CmsResourcePage key="cms-banners" config={CMS_CONFIGS.banners} />} />
            <Route path="cms/scenics" element={<CmsResourcePage key="cms-scenics" config={CMS_CONFIGS.scenics} />} />
            <Route path="cms/hotels" element={<CmsResourcePage key="cms-hotels" config={CMS_CONFIGS.hotels} />} />
            <Route path="cms/car-rentals" element={<CmsResourcePage key="cms-car-rentals" config={CMS_CONFIGS['car-rentals']} />} />
            <Route path="cms/products" element={<CmsResourcePage key="cms-products" config={CMS_CONFIGS.products} />} />
            <Route path="cms/guides" element={<CmsResourcePage key="cms-guides" config={CMS_CONFIGS.guides} />} />
            <Route path="cms/cases" element={<CmsResourcePage key="cms-cases" config={CMS_CONFIGS.cases} />} />
            <Route path="cms/trip-reminders" element={<CmsResourcePage key="cms-trip-reminders" config={CMS_CONFIGS['trip-reminders']} />} />
            <Route path="cms/about" element={<AboutConfigPage />} />
            <Route path="cms/consultation" element={<ConsultationConfigPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
}
