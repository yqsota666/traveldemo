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
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  );
}
