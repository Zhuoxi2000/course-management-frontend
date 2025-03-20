import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Footer
      style={{
        textAlign: 'center',
        background: '#fff',
        padding: '16px 50px',
        color: '#888',
        fontSize: 14,
        boxShadow: '0 -1px 4px rgba(0,21,41,0.08)'
      }}
    >
      <div className="footer-content">
        <p style={{ margin: 0 }}>
          选课管理系统 &copy; {currentYear} 版权所有
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 12 }}>
          技术支持：高效教育信息技术部
        </p>
      </div>
    </Footer>
  );
};

export default FooterComponent;