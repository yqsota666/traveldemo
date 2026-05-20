import {
  IconBook,
  IconDelete,
  IconFile,
  IconHome,
  IconLock,
  IconSafe,
  IconSettings,
  IconUser,
  IconUserGroup,
} from '@arco-design/web-react/icon';
import { Dropdown, Layout, Menu, Typography } from '@arco-design/web-react';
import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider, Header, Content } = Layout;

export default function AdminLayout() {
  const { user, logout, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => {
    const items: { key: string; icon: React.ReactNode; title: string }[] = [
      { key: '/dashboard', icon: <IconHome />, title: '工作台' },
    ];
    if (hasPermission('order:view_all') || hasPermission('order:view_assigned')) {
      items.push({ key: '/orders', icon: <IconBook />, title: '旅游订单' });
    }
    if (hasPermission('order:delete_request') || hasPermission('order:approve_delete')) {
      items.push({ key: '/delete-approvals', icon: <IconDelete />, title: '删除审批' });
    }
    if (hasPermission('admin:user:view')) {
      items.push({ key: '/admins', icon: <IconUserGroup />, title: '管理员账号' });
    }
    if (hasRole('SUPER_ADMIN')) {
      items.push({ key: '/roles', icon: <IconSafe />, title: '角色权限' });
    }
    if (hasPermission('binding:manage') || hasRole('SALES')) {
      items.push({ key: '/bindings', icon: <IconUser />, title: '客户归属' });
    }
    if (hasPermission('log:view')) {
      items.push(
        { key: '/logs/login', icon: <IconFile />, title: '登录日志' },
        { key: '/logs/operation', icon: <IconLock />, title: '操作日志' }
      );
    }
    items.push({ key: '/profile', icon: <IconSettings />, title: '账号设置' });
    return items;
  }, [hasPermission, hasRole]);

  const selectedKey =
    menuItems.find((m) => location.pathname.startsWith(m.key))?.key || '/dashboard';

  const pageTitle = menuItems.find((m) => location.pathname.startsWith(m.key))?.title || '工作台';

  const dropList = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        账号设置
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ height: '100%' }}>
      <Sider className="admin-sider" collapsible breakpoint="lg" width={200}>
        <div className="admin-sider-logo">旅游管理</div>
        <Menu selectedKeys={[selectedKey]} onClickMenuItem={(key) => navigate(key)}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>
              {item.icon}
              {item.title}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Typography.Text style={{ marginRight: 'auto', fontWeight: 500 }}>
            {pageTitle}
          </Typography.Text>
          <Dropdown droplist={dropList} position="br">
            <Typography.Text style={{ cursor: 'pointer', color: 'var(--color-text)' }}>
              {user?.realName || user?.username}
            </Typography.Text>
          </Dropdown>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
