import React, { useState } from 'react';
import { Layout, Menu, Divider } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  FormOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import logo from '../../assets/logo.png'; // 确保您有这个资源文件

const { Sider } = Layout;

const Sidebar = ({ userRole = 'student', collapsed, onCollapse }) => {
  const location = useLocation();
  
  // 根据当前路径获取选中的菜单键
  const getSelectedKey = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return ['dashboard'];
    if (path.includes('/calendar') || path.includes('/schedule')) return ['calendar'];
    if (path.includes('/courses')) return ['courses'];
    if (path.includes('/book-course')) return ['book-course'];
    if (path.includes('/students')) return ['students'];
    if (path.includes('/teachers')) return ['teachers'];
    if (path.includes('/statistics')) return ['statistics'];
    if (path.includes('/profile')) return ['profile'];
    if (path.includes('/settings')) return ['settings'];
    
    return ['dashboard'];
  };
  
  // 定义不同角色的菜单项
  const getMenuItems = () => {
    // 学生菜单
    if (userRole === 'student') {
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/student/dashboard">学生仪表盘</Link>,
        },
        {
          key: 'courses',
          icon: <BookOutlined />,
          label: <Link to="/student/courses">我的课程</Link>,
        },
        {
          key: 'book-course',
          icon: <CalendarOutlined />,
          label: <Link to="/student/book-course">预约课程</Link>,
        },
        {
          key: 'calendar',
          icon: <ClockCircleOutlined />,
          label: <Link to="/student/calendar">我的日程</Link>,
        },
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/student/profile">个人资料</Link>,
        },
      ];
    }
    
    // 教师菜单
    if (userRole === 'teacher') {
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/teacher/dashboard">教师仪表盘</Link>,
        },
        {
          key: 'calendar',
          icon: <CalendarOutlined />,
          label: <Link to="/teacher/schedule">课程安排</Link>,
        },
        {
          key: 'courses',
          icon: <BookOutlined />,
          label: <Link to="/teacher/courses">课程管理</Link>,
        },
        {
          key: 'students',
          icon: <TeamOutlined />,
          label: <Link to="/teacher/students">我的学生</Link>,
        },
        {
          key: 'feedback',
          icon: <FormOutlined />,
          label: <Link to="/teacher/feedback">课程反馈</Link>,
        },
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/teacher/profile">个人资料</Link>,
        },
      ];
    }
    
    // 管理员菜单
    if (userRole === 'admin') {
      return [
        {
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/admin/dashboard">管理仪表盘</Link>,
        },
        {
          key: 'courses',
          icon: <CalendarOutlined />,
          label: <Link to="/admin/courses">课程管理</Link>,
        },
        {
          key: 'students',
          icon: <TeamOutlined />,
          label: <Link to="/admin/students">学生管理</Link>,
        },
        {
          key: 'teachers',
          icon: <UserOutlined />,
          label: <Link to="/admin/teachers">教师管理</Link>,
        },
        {
          key: 'statistics',
          icon: <BarChartOutlined />,
          label: <Link to="/admin/statistics">数据统计</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">系统设置</Link>,
        },
      ];
    }
    
    return [];
  };

  return (
    <Sider
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="sidebar"
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
      }}
    >
      <div className="logo" style={{ 
        height: 64, 
        padding: collapsed ? '16px 8px' : 16, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ 
            height: 32,
            marginRight: collapsed ? 0 : 8
          }} 
        />
        {!collapsed && <h2 style={{ margin: 0, color: '#1890ff' }}>选课系统</h2>}
      </div>
      
      <Divider style={{ margin: 0 }} />
      
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={getMenuItems()}
        style={{ border: 'none' }}
      />
      
      <div className="sidebar-footer" style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: collapsed ? '12px 0' : '12px 24px',
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        background: '#f8f8f8',
        borderTop: '1px solid #f0f0f0'
      }}>
        {!collapsed && <span>© 2025 选课管理系统</span>}
      </div>
    </Sider>
  );
};

export default Sidebar;