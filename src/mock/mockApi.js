// src/mock/mockApi.js
import { mockUsers, mockCourses, mockNotifications } from './mockData';

// 模拟登录
export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username);
      if (user && password === 'password123') {
        resolve({
          access_token: 'mock_token_123',
          token_type: 'bearer',
          user: { ...user }
        });
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 500);
  });
};

// 模拟登出
export const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

// 模拟获取课程列表
export const getCourses = (status = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let courses = [...mockCourses];
      if (status) {
        courses = courses.filter(course => course.status === status);
      }
      resolve(courses);
    }, 500);
  });
};

// 模拟获取通知
export const getNotifications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNotifications]);
    }, 300);
  });
};

// 模拟标记通知为已读
export const markNotificationAsRead = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};