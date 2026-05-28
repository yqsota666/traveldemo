import {
  IconBook,
  IconDelete,
  IconFile,
  IconHome,
  IconLock,
  IconMenu,
  IconSafe,
  IconSettings,
  IconUser,
  IconUserGroup,
  IconImage,
  IconStorage,
  IconPoweroff,
} from '@arco-design/web-react/icon';
import { Avatar, Dropdown, Layout, Menu, Typography } from '@arco-design/web-react';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Sider, Header, Content } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

type MenuLeaf = { key: string; title: string; icon?: React.ReactNode };

type MenuGroup = {
  key: string;
  title: string;
  icon: React.ReactNode;
  children: MenuLeaf[];
};

/** 根据当前路径决定应展开的分组 */
function openGroupKeyForPath(pathname: string): string | null {
  if (pathname.startsWith('/cms')) return 'cms';
  if (pathname.startsWith('/orders') || pathname.startsWith('/delete-approvals')) return 'orders';
  if (pathname.startsWith('/admins') || pathname.startsWith('/roles') || pathname.startsWith('/bindings')) {
    return 'system';
  }
  if (pathname.startsWith('/logs')) return 'logs';
  return null;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '工作台',
  '/orders': '旅游订单',
  '/delete-approvals': '删除审批',
  '/admins': '管理员账号',
  '/roles': '角色权限',
  '/bindings': '客户归属',
  '/cms/cities': '城市管理',
  '/cms/banners': '轮播图',
  '/cms/scenics': '景点管理',
  '/cms/products': '文创商品',
  '/cms/hotels': '住宿管理',
  '/cms/car-rentals': '租车管理',
  '/cms/guides': '讲解员',
  '/cms/cases': '案例截图',
  '/cms/trip-reminders': '行程提醒',
  '/cms/about': '公司简介',
  '/cms/consultation': '在线咨询',
  '/logs/login': '登录日志',
  '/logs/operation': '操作日志',
  '/profile': '账号设置',
};

export default function AdminLayout() {
  const { user, logout, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups = useMemo(() => {
    const groups: MenuGroup[] = [];

    const orderChildren: MenuLeaf[] = [];
    if (hasPermission('order:view_all') || hasPermission('order:view_assigned')) {
      orderChildren.push({ key: '/orders', title: '旅游订单', icon: <IconBook /> });
    }
    if (hasPermission('order:delete_request') || hasPermission('order:approve_delete')) {
      orderChildren.push({ key: '/delete-approvals', title: '删除审批', icon: <IconDelete /> });
    }
    if (orderChildren.length > 0) {
      groups.push({ key: 'orders', title: '订单管理', icon: <IconBook />, children: orderChildren });
    }

    if (hasPermission('cms:view') || hasRole('SALES') || hasRole('SENIOR_ADMIN')) {
      groups.push({
        key: 'cms',
        title: '内容运营',
        icon: <IconMenu />,
        children: [
          { key: '/cms/cities', title: '城市管理', icon: <IconStorage /> },
          { key: '/cms/banners', title: '轮播图', icon: <IconImage /> },
          { key: '/cms/scenics', title: '景点管理', icon: <IconImage /> },
          { key: '/cms/products', title: '文创商品', icon: <IconStorage /> },
          { key: '/cms/hotels', title: '住宿管理', icon: <IconStorage /> },
          { key: '/cms/car-rentals', title: '租车管理', icon: <IconStorage /> },
          { key: '/cms/guides', title: '讲解员', icon: <IconUser /> },
          { key: '/cms/cases', title: '案例截图', icon: <IconImage /> },
          { key: '/cms/trip-reminders', title: '行程提醒', icon: <IconFile /> },
          { key: '/cms/about', title: '公司简介', icon: <IconFile /> },
          { key: '/cms/consultation', title: '在线咨询', icon: <IconSettings /> },
        ],
      });
    }

    const systemChildren: MenuLeaf[] = [];
    if (hasPermission('admin:user:view')) {
      systemChildren.push({ key: '/admins', title: '管理员账号', icon: <IconUserGroup /> });
    }
    if (hasRole('SUPER_ADMIN')) {
      systemChildren.push({ key: '/roles', title: '角色权限', icon: <IconSafe /> });
    }
    if (hasPermission('binding:manage') || hasRole('SALES')) {
      systemChildren.push({ key: '/bindings', title: '客户归属', icon: <IconUser /> });
    }
    if (systemChildren.length > 0) {
      groups.push({ key: 'system', title: '系统管理', icon: <IconSafe />, children: systemChildren });
    }

    if (hasPermission('log:view')) {
      groups.push({
        key: 'logs',
        title: '审计日志',
        icon: <IconFile />,
        children: [
          { key: '/logs/login', title: '登录日志', icon: <IconFile /> },
          { key: '/logs/operation', title: '操作日志', icon: <IconLock /> },
        ],
      });
    }

    return groups;
  }, [hasPermission, hasRole]);

  const allLeafKeys = useMemo(() => {
    const keys = ['/dashboard', '/profile', ...menuGroups.flatMap((g) => g.children.map((c) => c.key))];
    return keys.sort((a, b) => b.length - a.length);
  }, [menuGroups]);

  const selectedKey = useMemo(() => {
    const match = allLeafKeys.find((k) => location.pathname === k || location.pathname.startsWith(k + '/'));
    return match || '/dashboard';
  }, [allLeafKeys, location.pathname]);

  const pageTitle = PAGE_TITLES[selectedKey] || '工作台';

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const g = openGroupKeyForPath(location.pathname);
    return g ? [g] : [];
  });

  useEffect(() => {
    const g = openGroupKeyForPath(location.pathname);
    if (g) {
      setOpenKeys((prev) => (prev.includes(g) ? prev : [...prev, g]));
    }
  }, [location.pathname]);

  const dropList = (
    <Menu>
      <MenuItem key="profile" onClick={() => navigate('/profile')}>
        账号设置
      </MenuItem>
      <MenuItem
        key="logout"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        <IconPoweroff />
        退出登录
      </MenuItem>
    </Menu>
  );

  return (
    <Layout style={{ height: '100%' }}>
      <Sider className="admin-sider" collapsible breakpoint="lg" width={220}>
        <div className="admin-sider-logo">
          <span className="admin-brand-mark">旅</span>
          <span>
            <strong>旅游管理</strong>
            <small>管理后台</small>
          </span>
        </div>
        <Menu
          className="admin-side-menu"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onClickSubMenu={(key, keys) => setOpenKeys(keys as string[])}
          onClickMenuItem={(key) => navigate(key)}
          autoOpen
        >
          <MenuItem key="/dashboard">
            <IconHome />
            工作台
          </MenuItem>

          {menuGroups.map((group) => (
            <SubMenu
              key={group.key}
              title={
                <span className="admin-submenu-title">
                  {group.icon}
                  <span>{group.title}</span>
                </span>
              }
            >
              {group.children.map((item) => (
                <MenuItem key={item.key}>
                  {item.icon}
                  {item.title}
                </MenuItem>
              ))}
            </SubMenu>
          ))}

          <MenuItem key="/profile">
            <IconSettings />
            账号设置
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header className="admin-header">
          <Typography.Text className="admin-header-title">
            {pageTitle}
          </Typography.Text>
          <Dropdown droplist={dropList} position="br">
            <div className="admin-user-trigger">
              <Avatar size={28} className="admin-user-avatar">
                {(user?.realName || user?.username || 'U').slice(0, 1).toUpperCase()}
              </Avatar>
              <span>{user?.realName || user?.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
