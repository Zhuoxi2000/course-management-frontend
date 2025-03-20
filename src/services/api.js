// src/services/api.js
import axios from 'axios';
import config from '../config/config';
import { message } from 'antd';
import { 
  mockUsers, 
  mockCourses, 
  mockNotifications, 
  mockFeedbacks,
  mockHomeworkSubmissions,
  mockAvailability,
  mockMatchingAvailability,
  mockStudentStats,
  mockTeacherStats,
  mockTeacherPerformance,
  mockStudentProfiles,
  mockTeacherProfiles
} from '../mock/mockData';

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
    const token = localStorage.getItem(config.STORAGE_KEYS?.TOKEN);
    
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
          localStorage.removeItem(config.STORAGE_KEYS?.TOKEN);
          localStorage.removeItem(config.STORAGE_KEYS?.USER);
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
          message.error(error.response.data?.detail || '请求出错，请稍后再试');
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

// 通用模拟延迟函数
const mockDelay = (data, ms = 300) => {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

// auth相关API
export const authAPI = {
  login: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = mockUsers.find(u => u.username === data.username);
          if (user && data.password === 'password123') {
            resolve({
              access_token: 'mock_token_123',
              token_type: 'bearer',
              user: { ...user }
            });
          } else {
            reject({ response: { data: { detail: '用户名或密码错误' } } });
          }
        }, 500);
      });
    }
    return api.post('/auth/login', data);
  },
  
  register: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay({
        success: true,
        message: '注册成功，请登录',
        user_id: mockUsers.length + 1
      }, 800);
    }
    return api.post('/auth/register', data);
  },
  
  getUserInfo: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      if (userJson) {
        const user = JSON.parse(userJson);
        const foundUser = mockUsers.find(u => u.id === user.id);
        return mockDelay(foundUser || user);
      }
      return Promise.reject('未找到用户信息');
    }
    return api.get('/auth/me');
  },
  
  resetPassword: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay({ success: true, message: '密码重置链接已发送到您的邮箱' }, 1000);
    }
    return api.post('/auth/reset-password', data);
  },
};

// 学生相关API
export const studentAPI = {
  getCourses: (params) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 过滤当前学生的课程
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 1 };
      
      let studentId = user.id;
      // 如果是学生角色，查找对应的学生资料
      if (user.role === 'student') {
        const studentProfile = mockStudentProfiles.find(s => s.user_id === user.id);
        if (studentProfile) {
          studentId = studentProfile.id;
        }
      }
      
      // 筛选当前学生的课程
      let filteredCourses = mockCourses.filter(course => course.student_id === studentId);
      
      // 如果有状态过滤参数
      if (params?.status) {
        filteredCourses = filteredCourses.filter(course => course.status === params.status);
      }
      
      return mockDelay(filteredCourses);
    }
    return api.get('/student/courses', { params });
  },
  
  getCourseDetail: (courseId) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const course = mockCourses.find(c => c.id === parseInt(courseId));
      
      if (!course) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 查找关联的反馈
      const feedback = mockFeedbacks.find(f => f.course_id === course.id);
      
      // 查找关联的作业提交
      const homeworkSubmission = feedback ? 
        mockHomeworkSubmissions.find(h => h.course_feedback_id === feedback.id) : null;
      
      return mockDelay({
        ...course,
        feedback: feedback || null,
        homework_submission: homeworkSubmission || null
      });
    }
    return api.get(`/student/courses/${courseId}`);
  },
  
  bookCourse: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 1 };
      
      // 查找学生ID
      let studentId = 1;
      if (user.role === 'student') {
        const studentProfile = mockStudentProfiles.find(s => s.user_id === user.id);
        if (studentProfile) {
          studentId = studentProfile.id;
        }
      }
      
      // 创建新课程
      const newCourse = {
        id: mockCourses.length + 1,
        student_id: studentId,
        teacher_id: data.teacher_id || 1,
        title: '新预约课程',
        start_time: data.start_time,
        end_time: data.end_time,
        status: 'pending',
        course_type: data.course_type,
        location: data.location,
        meeting_link: data.meeting_link,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_name: user.username,
        teacher_name: 'teacher1'
      };
      
      // 模拟将新课程添加到列表
      // 在实际应用中，这不会影响实际的mockCourses数组，因为模拟数据在每次刷新页面后会重置
      mockCourses.push(newCourse);
      
      return mockDelay(newCourse, 800);
    }
    return api.post('/student/book-course', data);
  },
  
  setAvailability: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay({ 
        success: true, 
        message: '可用时间设置成功' 
      }, 600);
    }
    return api.post('/student/availability', data);
  },
  
  getMatchingAvailability: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay(mockMatchingAvailability, 700);
    }
    return api.get('/student/matching-availability');
  },
  
  requestCancellation: (courseId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const courseIndex = mockCourses.findIndex(c => c.id === parseInt(courseId));
      
      if (courseIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 更新课程状态
      mockCourses[courseIndex].status = 'cancelled';
      mockCourses[courseIndex].updated_at = new Date().toISOString();
      
      return mockDelay({ 
        success: true, 
        message: '课程取消申请已提交' 
      }, 600);
    }
    return api.post(`/student/courses/${courseId}/cancel`, data);
  },
  
  submitHomework: (courseId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const course = mockCourses.find(c => c.id === parseInt(courseId));
      
      if (!course) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 查找关联的反馈
      const feedback = mockFeedbacks.find(f => f.course_id === course.id);
      
      if (!feedback) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程反馈不存在' } } });
      }
      
      // 创建作业提交
      const newSubmission = {
        id: mockHomeworkSubmissions.length + 1,
        course_feedback_id: feedback.id,
        student_id: course.student_id,
        content: data.content,
        submitted_at: new Date().toISOString(),
        feedback: null,
        grade: null
      };
      
      // 将作业提交添加到列表
      mockHomeworkSubmissions.push(newSubmission);
      
      return mockDelay(newSubmission, 800);
    }
    return api.post(`/student/courses/${courseId}/homework`, data);
  },
  
  getStats: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay(mockStudentStats);
    }
    return api.get('/student/stats');
  }
};

// 教师相关API
export const teacherAPI = {
  getCourses: (params) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 过滤当前教师的课程
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 2 };
      
      let teacherId = 1;
      // 如果是教师角色，查找对应的教师资料
      if (user.role === 'teacher') {
        const teacherProfile = mockTeacherProfiles.find(t => t.user_id === user.id);
        if (teacherProfile) {
          teacherId = teacherProfile.id;
        }
      }
      
      // 筛选当前教师的课程
      let filteredCourses = mockCourses.filter(course => course.teacher_id === teacherId);
      
      // 如果有状态过滤参数
      if (params?.status) {
        filteredCourses = filteredCourses.filter(course => course.status === params.status);
      }
      
      return mockDelay(filteredCourses);
    }
    return api.get('/teacher/courses', { params });
  },
  
  updateCourse: (courseId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const courseIndex = mockCourses.findIndex(c => c.id === parseInt(courseId));
      
      if (courseIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 更新课程信息
      mockCourses[courseIndex] = {
        ...mockCourses[courseIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return mockDelay(mockCourses[courseIndex], 600);
    }
    return api.put(`/teacher/courses/${courseId}`, data);
  },
  
  setAvailability: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay({ 
        success: true, 
        message: '可用时间设置成功' 
      }, 600);
    }
    return api.post('/teacher/availability', data);
  },
  
  createFeedback: (courseId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const course = mockCourses.find(c => c.id === parseInt(courseId));
      
      if (!course) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 创建反馈
      const newFeedback = {
        id: mockFeedbacks.length + 1,
        course_id: parseInt(courseId),
        teacher_notes: data.teacher_notes,
        homework: data.homework,
        homework_due_date: data.homework_due_date,
        recording_url: data.recording_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // 将反馈添加到列表
      mockFeedbacks.push(newFeedback);
      
      // 更新课程状态为已完成
      const courseIndex = mockCourses.findIndex(c => c.id === parseInt(courseId));
      if (courseIndex !== -1) {
        mockCourses[courseIndex].status = 'completed';
        mockCourses[courseIndex].updated_at = new Date().toISOString();
      }
      
      return mockDelay(newFeedback, 800);
    }
    return api.post(`/teacher/feedback/${courseId}`, data);
  },
  
  getStudents: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 过滤当前教师的学生
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 2 };
      
      let teacherId = 1;
      // 如果是教师角色，查找对应的教师资料
      if (user.role === 'teacher') {
        const teacherProfile = mockTeacherProfiles.find(t => t.user_id === user.id);
        if (teacherProfile) {
          teacherId = teacherProfile.id;
        }
      }
      
      // 查找该教师的学生
      const studentProfiles = mockStudentProfiles.filter(s => s.teacher_id === teacherId);
      
      // 获取完整的学生信息
      const students = studentProfiles.map(profile => {
        const userInfo = mockUsers.find(u => u.id === profile.user_id);
        return {
          ...profile,
          username: userInfo?.username,
          email: userInfo?.email,
          phone: userInfo?.phone,
          avatar: userInfo?.avatar
        };
      });
      
      return mockDelay(students);
    }
    return api.get('/teacher/students');
  },
  
  getStudentDetails: (studentId) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const studentProfile = mockStudentProfiles.find(s => s.id === parseInt(studentId));
      
      if (!studentProfile) {
        return Promise.reject({ response: { status: 404, data: { detail: '学生不存在' } } });
      }
      
      const userInfo = mockUsers.find(u => u.id === studentProfile.user_id);
      
      // 获取学生的课程
      const courses = mockCourses.filter(c => c.student_id === parseInt(studentId));
      
      return mockDelay({
        ...studentProfile,
        username: userInfo?.username,
        email: userInfo?.email,
        phone: userInfo?.phone,
        avatar: userInfo?.avatar,
        courses: courses
      });
    }
    return api.get(`/teacher/students/${studentId}`);
  },getStats: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return mockDelay(mockTeacherStats);
    }
    return api.get('/teacher/stats');
  }
};

// 管理员相关API
export const adminAPI = {
  createUser: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 创建新用户
      const newUser = {
        id: mockUsers.length + 1,
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: data.role,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      // 添加到用户列表
      mockUsers.push(newUser);
      
      // 如果是学生或教师，创建相应的资料
      if (data.role === 'student') {
        const newStudentProfile = {
          id: mockStudentProfiles.length + 1,
          user_id: newUser.id,
          teacher_id: data.teacher_id || null,
          remaining_hours: data.remaining_hours || 0,
          completed_hours: 0,
          notes: data.notes || ''
        };
        
        mockStudentProfiles.push(newStudentProfile);
      } else if (data.role === 'teacher') {
        const newTeacherProfile = {
          id: mockTeacherProfiles.length + 1,
          user_id: newUser.id,
          specialization: data.specialization || '',
          rating: 5.0,
          bio: data.bio || ''
        };
        
        mockTeacherProfiles.push(newTeacherProfile);
      }
      
      return mockDelay(newUser, 800);
    }
    return api.post('/admin/users', data);
  },
  
  assignTeacher: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const studentProfile = mockStudentProfiles.find(s => s.id === data.student_id);
      
      if (!studentProfile) {
        return Promise.reject({ response: { status: 404, data: { detail: '学生不存在' } } });
      }
      
      const teacherProfile = mockTeacherProfiles.find(t => t.id === data.teacher_id);
      
      if (!teacherProfile) {
        return Promise.reject({ response: { status: 404, data: { detail: '教师不存在' } } });
      }
      
      // 更新学生的教师ID
      studentProfile.teacher_id = data.teacher_id;
      
      return mockDelay({
        success: true,
        message: '教师分配成功',
        student_id: data.student_id,
        teacher_id: data.teacher_id
      }, 600);
    }
    return api.post('/admin/assign-teacher', data);
  },
  
  getCourses: (params) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      let filteredCourses = [...mockCourses];
      
      // 根据参数筛选
      if (params?.status) {
        filteredCourses = filteredCourses.filter(course => course.status === params.status);
      }
      
      if (params?.teacher_id) {
        filteredCourses = filteredCourses.filter(course => course.teacher_id === parseInt(params.teacher_id));
      }
      
      if (params?.student_id) {
        filteredCourses = filteredCourses.filter(course => course.student_id === parseInt(params.student_id));
      }
      
      return mockDelay(filteredCourses);
    }
    return api.get('/admin/courses', { params });
  },
  
  getPerformance: (params) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      let filteredPerformance = [...mockTeacherPerformance];
      
      // 根据参数筛选
      if (params?.teacher_id) {
        filteredPerformance = filteredPerformance.filter(p => p.teacher_id === parseInt(params.teacher_id));
      }
      
      if (params?.month) {
        filteredPerformance = filteredPerformance.filter(p => p.month === parseInt(params.month));
      }
      
      if (params?.year) {
        filteredPerformance = filteredPerformance.filter(p => p.year === parseInt(params.year));
      }
      
      return mockDelay(filteredPerformance);
    }
    return api.get('/admin/performance', { params });
  },
  
  getUsers: (params) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      let filteredUsers = [...mockUsers];
      
      // 根据角色筛选
      if (params?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === params.role);
      }
      
      return mockDelay(filteredUsers);
    }
    return api.get('/admin/users', { params });
  },
  
  updateUser: (userId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const userIndex = mockUsers.findIndex(u => u.id === parseInt(userId));
      
      if (userIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '用户不存在' } } });
      }
      
      // 更新用户信息
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...data
      };
      
      return mockDelay(mockUsers[userIndex], 600);
    }
    return api.put(`/admin/users/${userId}`, data);
  },
  
  addCourseHours: (studentId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const studentProfileIndex = mockStudentProfiles.findIndex(s => s.id === parseInt(studentId));
      
      if (studentProfileIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '学生不存在' } } });
      }
      
      // 更新学生课时
      mockStudentProfiles[studentProfileIndex].remaining_hours += data.hours;
      
      return mockDelay({
        success: true,
        message: '课时添加成功',
        student_id: studentId,
        remaining_hours: mockStudentProfiles[studentProfileIndex].remaining_hours
      }, 600);
    }
    return api.post(`/admin/students/${studentId}/hours`, data);
  },
  
  createCourse: (data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 创建新课程
      const newCourse = {
        id: mockCourses.length + 1,
        student_id: data.student_id,
        teacher_id: data.teacher_id,
        title: data.title || '管理员创建的课程',
        start_time: data.start_time,
        end_time: data.end_time,
        status: data.status || 'confirmed',
        course_type: data.course_type,
        location: data.location,
        meeting_link: data.meeting_link,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_name: mockUsers.find(u => u.id === mockStudentProfiles.find(s => s.id === data.student_id)?.user_id)?.username || 'Unknown',
        teacher_name: mockUsers.find(u => u.id === mockTeacherProfiles.find(t => t.id === data.teacher_id)?.user_id)?.username || 'Unknown'
      };
      
      // 添加到课程列表
      mockCourses.push(newCourse);
      
      return mockDelay(newCourse, 800);
    }
    return api.post('/admin/courses', data);
  },
  
  updateCourse: (courseId, data) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const courseIndex = mockCourses.findIndex(c => c.id === parseInt(courseId));
      
      if (courseIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 更新课程信息
      mockCourses[courseIndex] = {
        ...mockCourses[courseIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      return mockDelay(mockCourses[courseIndex], 600);
    }
    return api.put(`/admin/courses/${courseId}`, data);
  },
  
  deleteCourse: (courseId) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const courseIndex = mockCourses.findIndex(c => c.id === parseInt(courseId));
      
      if (courseIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '课程不存在' } } });
      }
      
      // 从课程列表中移除
      mockCourses.splice(courseIndex, 1);
      
      return mockDelay({
        success: true,
        message: '课程删除成功'
      }, 600);
    }
    return api.delete(`/admin/courses/${courseId}`);
  }
};

// 通用API
export const commonAPI = {
  getNotifications: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 过滤当前用户的通知
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 1 };
      
      const filteredNotifications = mockNotifications.filter(notification => notification.user_id === user.id);
      
      return mockDelay(filteredNotifications);
    }
    return api.get('/notifications');
  },
  
  markNotificationAsRead: (notificationId) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      const notificationIndex = mockNotifications.findIndex(n => n.id === parseInt(notificationId));
      
      if (notificationIndex === -1) {
        return Promise.reject({ response: { status: 404, data: { detail: '通知不存在' } } });
      }
      
      // 标记为已读
      mockNotifications[notificationIndex].is_read = true;
      mockNotifications[notificationIndex].read_at = new Date().toISOString();
      
      return mockDelay({ success: true });
    }
    return api.put(`/notifications/${notificationId}/read`);
  },
  
  markAllNotificationsAsRead: () => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      // 过滤当前用户的通知
      const userJson = localStorage.getItem(config.STORAGE_KEYS?.USER);
      const user = userJson ? JSON.parse(userJson) : { id: 1 };
      
      // 标记所有通知为已读
      mockNotifications.forEach(notification => {
        if (notification.user_id === user.id) {
          notification.is_read = true;
          notification.read_at = new Date().toISOString();
        }
      });
      
      return mockDelay({ success: true });
    }
    return api.put('/notifications/mark-all-read');
  },
  
  uploadFile: (file, onProgress) => {
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (onProgress) onProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              resolve({
                file_name: file.name,
                file_url: URL.createObjectURL(file),
                file_size: file.size,
                upload_time: new Date().toISOString()
              });
            }, 500);
          }
        }, 200);
      });
    }
    
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