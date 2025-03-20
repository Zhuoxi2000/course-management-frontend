// src/services/api.ts
import axios from 'axios';
import config from '../config/config';
import { message } from 'antd';

import * as mockApi from '../mock/mockApi';

export const authAPI = {
  login: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockApi.login(data.username, data.password);
    }
    return api.post('/auth/login', data);
  },
  // 其他方法...
};

// 创建axios实例
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
    
    // 如果存在token，则在请求头中添加授权信息
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 处理成功响应
    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
          localStorage.removeItem(config.STORAGE_KEYS.USER);
          window.location.href = '/login';
          message.error('登录已过期，请重新登录');
          break;
          
        case 403:
          // 禁止访问
          message.error('您没有权限执行此操作');
          break;
          
        case 404:
          // 资源不存在
          message.error('请求的资源不存在');
          break;
          
        case 500:
          // 服务器错误
          message.error('服务器错误，请稍后再试或联系管理员');
          break;
          
        default:
          // 其他错误
          message.error(error.response.data.detail || '请求出错，请稍后再试');
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      message.error('无法连接到服务器，请检查您的网络连接');
    } else {
      // 其他错误
      message.error('请求失败，请稍后再试');
    }
    
    return Promise.reject(error);
  }
);

// // auth相关API
// export const authAPI = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   getUserInfo: () => api.get('/auth/me'),
//   resetPassword: (data) => api.post('/auth/reset-password', data),
// };

// 学生相关API
export const studentAPI = {
  getCourses: (params) => api.get('/student/courses', { params }),
  bookCourse: (data) => api.post('/student/book-course', data),
  setAvailability: (data) => api.post('/student/availability', data),
  getMatchingAvailability: () => api.get('/student/matching-availability'),
  requestCancellation: (courseId, data) => api.post(`/student/courses/${courseId}/cancel`, data),
  submitHomework: (courseId, data) => api.post(`/student/courses/${courseId}/homework`, data),
};

// 教师相关API
export const teacherAPI = {
  getCourses: (params) => api.get('/teacher/courses', { params }),
  updateCourse: (courseId, data) => api.put(`/teacher/courses/${courseId}`, data),
  setAvailability: (data) => api.post('/teacher/availability', data),
  createFeedback: (courseId, data) => api.post(`/teacher/feedback/${courseId}`, data),
  getStudents: () => api.get('/teacher/students'),
  getStudentDetails: (studentId) => api.get(`/teacher/students/${studentId}`),
};

// 管理员相关API
export const adminAPI = {
  createUser: (data) => api.post('/admin/users', data),
  assignTeacher: (data) => api.post('/admin/assign-teacher', data),
  getCourses: (params) => api.get('/admin/courses', { params }),
  getPerformance: (params) => api.get('/admin/performance', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  addCourseHours: (studentId, data) => api.post(`/admin/students/${studentId}/hours`, data),
};

// 通用API
export const commonAPI = {
  getNotifications: () => api.get('/notifications'),
  markNotificationAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  uploadFile: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percentCompleted);
      },
    });
  },
};

export default api;