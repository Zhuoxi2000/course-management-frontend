// src/mock/mockData.js
export const mockUsers = [
    { 
      id: 1, 
      username: 'student1', 
      role: 'student', 
      email: 'student1@example.com',
      is_active: true,
      created_at: new Date().toISOString()
    },
    { 
      id: 2, 
      username: 'teacher1', 
      role: 'teacher', 
      email: 'teacher1@example.com',
      is_active: true,
      created_at: new Date().toISOString() 
    },
    { 
      id: 3, 
      username: 'admin', 
      role: 'admin', 
      email: 'admin@example.com',
      is_active: true,
      created_at: new Date().toISOString()
    },
  ];
  
  export const mockCourses = [
    {
      id: 1,
      student_id: 1,
      teacher_id: 2,
      start_time: '2025-03-20T14:00:00',
      end_time: '2025-03-20T16:00:00',
      status: 'confirmed',
      course_type: 'online',
      meeting_link: '腾讯会议',
      created_at: '2025-03-15T10:00:00',
      updated_at: '2025-03-15T10:00:00'
    },
    {
      id: 2,
      student_id: 1,
      teacher_id: 2,
      start_time: '2025-03-25T14:00:00',
      end_time: '2025-03-25T16:00:00',
      status: 'pending',
      course_type: 'offline',
      location: '教学楼302',
      created_at: '2025-03-15T10:00:00',
      updated_at: '2025-03-15T10:00:00'
    }
  ];
  
  export const mockNotifications = [
    {
      id: 1,
      user_id: 1,
      title: '课程提醒',
      content: '您有一节课程将在明天 14:00 开始',
      type: 'in_app',
      is_read: false,
      created_at: '2025-03-19T10:00:00',
      read_at: null
    }
  ];