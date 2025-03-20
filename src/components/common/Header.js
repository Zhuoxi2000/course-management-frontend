import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Badge, Avatar, Space, Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { logout } from '../../features/auth/slice';

const { Header } = Layout;

const HeaderComponent = ({ 
  collapsed, 
  toggleCollapsed, 
  onNotificationClick, 
  notificationCount = 0
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  // 获取用户角色文本
  const getRoleText = (role) => {
    const roleMap = {
      'student': '学生',
      'teacher': '教师',
      'admin': '管理员'
    };
    return roleMap[role] || '用户';
  };
  
  // 用户下拉菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(`/${user?.role}/profile`)}>
        个人资料
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate(`/${user?.role}/settings`)}>
        账号设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );
  
  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        position: 'fixed',
        zIndex: 1,
        width: 'calc(100% - 256px)',
        right: 0,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: collapsed ? 80 : 256,
        transition: 'all 0.2s'
      }}
    >
      <div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{ fontSize: 16 }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="帮助中心">
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            onClick={() => navigate('/help')}
            style={{ marginRight: 8 }}
          />
        </Tooltip>
        
        <Tooltip title="通知">
          <Badge count={notificationCount} dot={notificationCount > 0}>
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={onNotificationClick}
              style={{ marginRight: 16 }}
            />
          </Badge>
        </Tooltip>
        
        <Dropdown overlay={userMenu} trigger={['click']}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar 
              icon={<UserOutlined />} 
              src={user?.avatar} 
              style={{ marginRight: 8 }}
            />
            <Space>
              <span style={{ fontWeight: 500 }}>
                {user?.username || '用户'}
              </span>
              <span style={{ 
                color: '#999', 
                fontSize: 12, 
                background: '#f0f0f0', 
                padding: '2px 6px', 
                borderRadius: 4 
              }}>
                {getRoleText(user?.role)}
              </span>
            </Space>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;