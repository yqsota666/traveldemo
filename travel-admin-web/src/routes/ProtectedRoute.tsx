import { Spin } from '@arco-design/web-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../utils/request';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size={32} />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
