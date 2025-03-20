
// src/config/config.js

const config = {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    
    // 系统名称与信息
    APP_NAME: '选课管理系统',
    COMPANY_NAME: '智慧教育',
    
    // 默认分页设置
    DEFAULT_PAGE_SIZE: 10,
    
    // 上传文件限制
    UPLOAD_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'],
    
    // 通知相关
    NOTIFICATION_POLL_INTERVAL: 60000, // 60秒
    
    // 本地存储keys
    STORAGE_KEYS: {
      TOKEN: 'course_management_token',
      USER: 'course_management_user',
      REMEMBER_ME: 'course_management_remember',
      THEME: 'course_management_theme',
    },
    
    // JWT令牌相关
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5分钟 - 在令牌过期前这段时间自动刷新
  };
  
  export default config;