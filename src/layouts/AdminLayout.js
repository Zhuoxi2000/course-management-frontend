// src/layouts/StudentLayout.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DashboardOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { logout } from '../features/auth/slice';
import NotificationPanel from '../components/common/NotificationPanel';

const { Header, Sider, Content } = Layout;

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  
  // 获取未读通知数量
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // 根据当前路径设置选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return ['dashboard'];
    if (path.includes('/courses') && !path.includes('/book-course')) return ['courses'];
    if (path.includes('/book-course')) return ['book-course'];
    if (path.includes('/profile')) return ['profile'];
    return ['dashboard'];
  };
  
  // 处理菜单点击
  const handleMenuClick = (key) => {
    switch (key) {
      case 'dashboard':
        navigate('/student/dashboard');
        break;
      case 'courses':
        navigate('/student/courses');
        break;
      case 'book-course':
        navigate('/student/book-course');
        break;
      case 'profile':
        navigate('/student/profile');
        break;
      default:
        navigate('/student/dashboard');
    }
  };
  
  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // 用户下拉菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/student/profile')}>
        个人资料
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={256}
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
          zIndex: 10
        }}
      >
        <div className="logo" style={{ height: 64, padding: '16px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'CMS' : '选课管理系统'}
          </h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          onClick={({ key }) => handleMenuClick(key)}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            学生仪表盘
          </Menu.Item>
          <Menu.Item key="courses" icon={<BookOutlined />}>
            我的课程
          </Menu.Item>
          <Menu.Item key="book-course" icon={<CalendarOutlined />}>
            预约课程
          </Menu.Item>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            个人信息
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={unreadCount} dot>
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: 18 }} />} 
                onClick={() => setNotificationVisible(!notificationVisible)}
              />
            </Badge>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ marginLeft: 16, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                <span style={{ marginLeft: 8 }}>{user?.username || '学生用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff',
          borderRadius: 4,
          minHeight: 280 
        }}>
          <Outlet />
        </Content>
      </Layout>
      
      <NotificationPanel 
        visible={notificationVisible} 
        onClose={() => setNotificationVisible(false)} 
      />
    </Layout>
  );
};

export default StudentLayout;