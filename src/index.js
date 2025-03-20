import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import App from './App';
import store from './store';
import './index.css';

// 如果还没有创建store，可以使用一个简单的store
// const store = {
//   getState: () => ({
//     auth: {
//       isAuthenticated: localStorage.getItem('token') ? true : false,
//       user: JSON.parse(localStorage.getItem('user') || 'null'),
//       loading: false,
//       error: null
//     },
//     notification: {
//       notifications: [],
//       loading: false,
//       error: null
//     }
//   }),
//   dispatch: () => {},
//   subscribe: () => {}
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
);