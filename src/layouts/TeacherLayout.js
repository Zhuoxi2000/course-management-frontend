// src/layouts/TeacherLayout.js
import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import HeaderComponent from '../components/common/Header';
import FooterComponent from '../components/common/Footer';
import NotificationPanel from '../components/common/NotificationPanel';

const { Content } = Layout;

const TeacherLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const { notifications } = useSelector((state) => state.notification || { notifications: [] });
  
  // 获取未读通知数量
  const unreadCount = notifications?.filter(n => !n.isRead)?.length || 0;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        userRole="teacher" 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
      />
      
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 256,
        transition: 'all 0.2s'
      }}>
        <HeaderComponent 
          collapsed={collapsed} 
          toggleCollapsed={() => setCollapsed(!collapsed)} 
          onNotificationClick={() => setNotificationVisible(!notificationVisible)}
          notificationCount={unreadCount}
        />
        
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
        
        <FooterComponent />
      </Layout>
      
      <NotificationPanel 
        visible={notificationVisible} 
        onClose={() => setNotificationVisible(false)} 
        notifications={notifications || []}
      />
    </Layout>
  );
};

export default TeacherLayout;