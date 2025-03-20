// src/mock/mockData.js
// 生成过去或未来几天的日期
const getDateString = (dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0] + 'T' + (dayOffset % 2 === 0 ? '14:00:00' : '19:00:00');
  };
  
  // 用户数据
  export const mockUsers = [
    { 
      id: 1, 
      username: 'student1', 
      role: 'student', 
      email: 'student1@example.com',
      phone: '13800138001',
      avatar: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    { 
      id: 2, 
      username: 'teacher1', 
      role: 'teacher', 
      email: 'teacher1@example.com',
      phone: '13900139001',
      avatar: null,
      is_active: true,
      created_at: new Date().toISOString() 
    },
    { 
      id: 3, 
      username: 'admin', 
      role: 'admin', 
      email: 'admin@example.com',
      phone: '13700137001',
      avatar: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    { 
      id: 4, 
      username: 'student2', 
      role: 'student', 
      email: 'student2@example.com',
      phone: '13800138002',
      avatar: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
    { 
      id: 5, 
      username: 'teacher2', 
      role: 'teacher', 
      email: 'teacher2@example.com',
      phone: '13900139002',
      avatar: null,
      is_active: true,
      created_at: new Date().toISOString()
    },
  ];
  
  // 学生资料
  export const mockStudentProfiles = [
    {
      id: 1,
      user_id: 1,
      teacher_id: 1,
      remaining_hours: 20,
      completed_hours: 5,
      notes: '英语基础较好，重点提高口语能力'
    },
    {
      id: 2,
      user_id: 4,
      teacher_id: 2,
      remaining_hours: 15,
      completed_hours: 8,
      notes: '重点提高数学计算能力'
    }
  ];
  
  // 教师资料
  export const mockTeacherProfiles = [
    {
      id: 1,
      user_id: 2,
      specialization: '英语',
      rating: 4.8,
      bio: '8年教学经验，擅长英语口语教学'
    },
    {
      id: 2,
      user_id: 5,
      specialization: '数学',
      rating: 4.5,
      bio: '5年教学经验，专注高中数学教学'
    }
  ];
  
  // 课程数据
  export const mockCourses = [
    {
      id: 1,
      student_id: 1,
      teacher_id: 1,
      title: '高级英语会话',
      start_time: getDateString(1),
      end_time: getDateString(1).replace('14:00:00', '16:00:00').replace('19:00:00', '21:00:00'),
      status: 'confirmed',
      course_type: 'online',
      meeting_link: '腾讯会议',
      created_at: getDateString(-5),
      updated_at: getDateString(-5),
      student_name: 'student1',
      teacher_name: 'teacher1'
    },
    {
      id: 2,
      student_id: 1,
      teacher_id: 1,
      title: '英语写作',
      start_time: getDateString(3),
      end_time: getDateString(3).replace('14:00:00', '16:00:00').replace('19:00:00', '21:00:00'),
      status: 'pending',
      course_type: 'offline',
      location: '教学楼302',
      created_at: getDateString(-3),
      updated_at: getDateString(-3),
      student_name: 'student1',
      teacher_name: 'teacher1'
    },
    {
      id: 3,
      student_id: 1,
      teacher_id: 1,
      title: '英语口语训练',
      start_time: getDateString(-2),
      end_time: getDateString(-2).replace('14:00:00', '16:00:00').replace('19:00:00', '21:00:00'),
      status: 'completed',
      course_type: 'online',
      meeting_link: '腾讯会议',
      created_at: getDateString(-10),
      updated_at: getDateString(-2),
      student_name: 'student1',
      teacher_name: 'teacher1'
    },
    {
      id: 4,
      student_id: 2,
      teacher_id: 2,
      title: '高等数学基础',
      start_time: getDateString(2),
      end_time: getDateString(2).replace('14:00:00', '16:00:00').replace('19:00:00', '21:00:00'),
      status: 'confirmed',
      course_type: 'offline',
      location: '教学楼501',
      created_at: getDateString(-4),
      updated_at: getDateString(-4),
      student_name: 'student2',
      teacher_name: 'teacher2'
    },
    {
      id: 5,
      student_id: 2,
      teacher_id: 2,
      title: '微积分进阶',
      start_time: getDateString(5),
      end_time: getDateString(5).replace('14:00:00', '16:00:00').replace('19:00:00', '21:00:00'),
      status: 'pending',
      course_type: 'online',
      meeting_link: '钉钉',
      created_at: getDateString(-2),
      updated_at: getDateString(-2),
      student_name: 'student2',
      teacher_name: 'teacher2'
    }
  ];
  
  // 通知数据
  export const mockNotifications = [
    {
      id: 1,
      user_id: 1,
      title: '课程提醒',
      content: '您有一节课程将在明天 14:00 开始',
      type: 'in_app',
      is_read: false,
      created_at: getDateString(-1),
      read_at: null
    },
    {
      id: 2,
      user_id: 1,
      title: '教师反馈',
      content: '您的英语口语训练课程已添加反馈，请查看',
      type: 'in_app',
      is_read: true,
      created_at: getDateString(-2),
      read_at: getDateString(-2).replace('14:00:00', '15:30:00').replace('19:00:00', '20:30:00')
    },
    {
      id: 3,
      user_id: 1,
      title: '课程确认',
      content: '您的英语写作课程预约已被教师确认',
      type: 'in_app',
      is_read: false,
      created_at: getDateString(-1).replace('14:00:00', '10:30:00').replace('19:00:00', '16:30:00'),
      read_at: null
    }
  ];
  
  // 反馈数据
  export const mockFeedbacks = [
    {
      id: 1,
      course_id: 3,
      teacher_notes: '今天的课程表现不错，在语法方面有了明显进步，但发音还需要继续加强练习。',
      homework: '完成课本第35页的练习，并朗读课文3遍。',
      homework_due_date: getDateString(2),
      recording_url: 'https://example.com/recordings/123',
      created_at: getDateString(-2),
      updated_at: getDateString(-2)
    }
  ];
  
  // 作业提交数据
  export const mockHomeworkSubmissions = [
    {
      id: 1,
      course_feedback_id: 1,
      student_id: 1,
      content: '我已完成所有作业，课文朗读录音链接：https://example.com/student/recordings/456',
      submitted_at: getDateString(-1),
      feedback: '朗读流畅度有提升，继续保持',
      grade: 'A'
    }
  ];
  
  // 可用时间数据
  export const mockAvailability = [
    {
      user_id: 1,
      day_of_week: 1, // 周一
      start_time: '09:00',
      end_time: '12:00',
      is_recurring: true
    },
    {
      user_id: 1,
      day_of_week: 3, // 周三
      start_time: '14:00',
      end_time: '18:00',
      is_recurring: true
    },
    {
      user_id: 1,
      day_of_week: 5, // 周五
      start_time: '19:00',
      end_time: '21:00',
      is_recurring: true
    },
    {
      user_id: 2,
      day_of_week: 2, // 周二
      start_time: '10:00',
      end_time: '16:00',
      is_recurring: true
    },
    {
      user_id: 2,
      day_of_week: 4, // 周四
      start_time: '13:00',
      end_time: '19:00',
      is_recurring: true
    }
  ];
  
  // 教师-学生可预约时间数据
  export const mockMatchingAvailability = [
    {
      date: getDateString(3).split('T')[0],
      slots: [
        { start: '14:00', end: '15:30' },
        { start: '16:00', end: '17:30' }
      ]
    },
    {
      date: getDateString(5).split('T')[0],
      slots: [
        { start: '19:00', end: '20:30' }
      ]
    },
    {
      date: getDateString(7).split('T')[0],
      slots: [
        { start: '14:00', end: '15:30' },
        { start: '16:00', end: '17:30' },
        { start: '19:00', end: '20:30' }
      ]
    }
  ];
  
  // 统计数据
  export const mockStudentStats = {
    totalCourses: 12,
    completedCourses: 3,
    pendingCourses: 2,
    remainingHours: 17,
    completedHours: 8
  };
  
  export const mockTeacherStats = {
    totalStudents: 5,
    activeCourses: 8,
    completedCourses: 34,
    rating: 4.8
  };
  
  // 教师绩效数据
  export const mockTeacherPerformance = [
    {
      id: 1,
      teacher_id: 1,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      courses_count: 15,
      average_rating: 4.8,
      attendance_rate: 98.5,
      created_at: getDateString(-1),
      updated_at: getDateString(-1)
    },
    {
      id: 2,
      teacher_id: 2,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      courses_count: 12,
      average_rating: 4.5,
      attendance_rate: 96.8,
      created_at: getDateString(-1),
      updated_at: getDateString(-1)
    }
  ];