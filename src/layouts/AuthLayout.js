// src/layouts/AuthLayout.js
import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={6}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <Title level={2} style={{ color: '#1890ff' }}>选课管理系统</Title>
              <Typography.Paragraph>智慧教育，高效管理</Typography.Paragraph>
            </div>
            <Outlet />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AuthLayout;