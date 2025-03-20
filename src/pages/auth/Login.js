// src/pages/auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/auth/slice';
import * as mockApi from '../../mock/mockApi';

import config from '../../config/config';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((state) => state.auth);
  
  // 检查是否有"记住我"选项
  const rememberMe = localStorage.getItem(config.STORAGE_KEYS.REMEMBER_ME) === 'true';
  
  useEffect(() => {
    // 从URL参数中获取重定向URL
    const from = location.state?.from?.pathname || '/';
    
    // 清除错误
    dispatch(clearError());
    
    // 如果存在记住我选项，则自动填充用户名
    if (rememberMe) {
      const user = JSON.parse(localStorage.getItem(config.STORAGE_KEYS.USER) || 'null');
      if (user) {
        form.setFieldsValue({ username: user.username, remember: true });
      }
    }
  }, [dispatch, form, location.state, rememberMe]);
  
  // 处理表单提交
// src/pages/auth/Login.tsx
const handleSubmit = async (values) => {
  setLoading(true);
  
  try {
    // 模拟API调用或实际API调用
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 使用模拟数据登录
      const response = await mockApi.login(values.username, values.password);
      // 保存用户信息和token
      localStorage.setItem(config.STORAGE_KEYS.TOKEN, response.access_token);
      localStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      // 派发登录action（如果使用Redux）
      dispatch(login({
        username: values.username,
        password: values.password,
        remember: values.remember,
      }));
      
      // 根据用户角色导航到不同页面
      const role = response.user.role;
      if (role === 'student') {
        console.log('Role detected:', role);
        console.log('Attempting navigation to:', '/student/dashboard');
        
        // 在导航前后都添加打印
        navigate('/student/dashboard');
        console.log('Navigation function called');
        
        // 添加一个超时检查，看看是否是异步问题
        setTimeout(() => {
          console.log('Current location after timeout:', window.location.pathname);
        }, 100);
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
      message.success('登录成功');
    } else {
      // 实际API调用的代码保持不变
      await dispatch(login({
        username: values.username,
        password: values.password,
        remember: values.remember,
      })).unwrap();
      
      // 获取重定向URL
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      message.success('登录成功');
    }
  } catch (err) {
    console.error('登录失败:', err);
    message.error('用户名或密码错误');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>用户登录</h2>
      
      {error && (
        <div style={{ color: '#ff4d4f', marginBottom: 16, textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      <Form
        form={form}
        name="login"
        initialValues={{ remember: rememberMe }}
        onFinish={handleSubmit}
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          
          <Link to="/forgot-password" style={{ float: 'right' }}>
            忘记密码?
          </Link>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block
          >
            登录
          </Button>
        </Form.Item>
        
        <Divider>
          <span style={{ color: '#999', fontSize: 14 }}>还没有账号?</span>
        </Divider>
        
        <div style={{ textAlign: 'center' }}>
          <Link to="/register">
            立即注册
          </Link>
        </div>
      </Form>
    </Card>
  );
};

export default Login;