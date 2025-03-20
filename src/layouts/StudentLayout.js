// src/layouts/StudentLayout.js
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import HeaderComponent from '../components/common/Header';
import FooterComponent from '../components/common/Footer';
import NotificationPanel from '../components/common/NotificationPanel';

const { Content } = Layout;

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification || { notifications: [] });
  
  // 获取未读通知数量
  const unreadCount = notifications?.filter(n => !n.isRead)?.length || 0;
  
  // 处理通知面板开关
  const toggleNotificationPanel = () => {
    setNotificationVisible(!notificationVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sidebar 
        userRole="student" 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
      />
      
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 256,
        transition: 'all 0.2s'
      }}>
        {/* 头部 */}
        <HeaderComponent 
          collapsed={collapsed} 
          toggleCollapsed={() => setCollapsed(!collapsed)} 
          onNotificationClick={toggleNotificationPanel}
          notificationCount={unreadCount}
        />
        
        {/* 内容区 */}
        <Content style={{ 
          margin: '88px 24px 24px', 
          padding: 24, 
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          minHeight: 280 
        }}>
          <Outlet />
        </Content>
        
        {/* 页脚 */}
        <FooterComponent />
      </Layout>
      
      {/* 通知面板 */}
      <NotificationPanel 
        visible={notificationVisible} 
        onClose={() => setNotificationVisible(false)} 
        notifications={notifications || []}
      />
    </Layout>
  );
};

export default StudentLayout;