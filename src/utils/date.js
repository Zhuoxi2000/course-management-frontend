// src/utils/date.js
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 配置dayjs
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期
 * @param {string} format - 格式
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * 获取相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * 获取星期几文本
 * @param {number} day - 0-6 (0代表星期日)
 * @returns {string} 星期几
 */
export const getDayOfWeekText = (day) => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[day] || '';
};

/**
 * 根据开始时间和结束时间计算持续时间
 * @param {string|Date} startTime - 开始时间
 * @param {string|Date} endTime - 结束时间
 * @returns {string} 持续时间（小时）
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0';
  
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const hours = end.diff(start, 'hour', true);
  
  return hours.toFixed(1);
};

/**
 * 判断日期是否为今天
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为今天
 */
export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * 判断日期是否为未来
 * @param {string|Date} date - 日期
 * @returns {boolean} 是否为未来
 */
export const isFuture = (date) => {
  return dayjs(date).isAfter(dayjs());
};

// src/utils/format.js
/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额
 */
export const formatAmount = (amount, decimals = 2) => {
  if (typeof amount !== 'number') {
    return '0.00';
  }
  
  return amount.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

/**
 * 获取文件尺寸显示文本
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} length - 最大长度
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, length = 20) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * 格式化手机号码为 XXX-XXXX-XXXX 格式
 * @param {string} phone - 手机号码
 * @returns {string} 格式化后的手机号码
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // 移除所有非数字字符
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // 检查是否是11位手机号
  if (cleaned.length !== 11) return phone;
  
  return cleaned.substring(0, 3) + '-' + cleaned.substring(3, 7) + '-' + cleaned.substring(7);
};

// src/utils/auth.js
import config from '../config/config';

/**
 * 检查用户是否有特定权限
 * @param {object} user - 用户对象
 * @param {string} permission - 权限名称
 * @returns {boolean} 是否有权限
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  
  // 管理员拥有所有权限
  if (user.role === 'admin') return true;
  
  // 权限映射表
  const permissionMap = {
    'student': ['view_course', 'book_course', 'view_profile', 'edit_profile'],
    'teacher': ['view_course', 'edit_course', 'view_student', 'view_profile', 'edit_profile'],
    'admin': ['*'], // 管理员拥有所有权限
  };
  
  // 检查用户角色是否存在于权限映射中
  if (!permissionMap[user.role]) return false;
  
  // 检查用户角色是否拥有特定权限或拥有"*"权限
  return permissionMap[user.role].includes(permission) || permissionMap[user.role].includes('*');
};

/**
 * 从 localStorage 获取当前用户
 * @returns {object|null} 用户对象
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(config.STORAGE_KEYS.USER);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

/**
 * 从 localStorage 获取 JWT token
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem(config.STORAGE_KEYS.TOKEN);
};

/**
 * 检查 token 是否即将过期
 * @param {string} token - JWT token
 * @returns {boolean} 是否即将过期
 */
export const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  
  try {
    // 解析 JWT token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    // 检查是否在阈值时间内过期
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    
    return expirationTime - currentTime < config.TOKEN_REFRESH_THRESHOLD;
  } catch (e) {
    return true;
  }
};

// src/utils/validator.js
/**
 * 验证邮箱格式
 * @param {string} email - 邮箱
 * @returns {boolean} 是否符合邮箱格式
 */
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否符合手机号格式
 */
export const isValidPhone = (phone) => {
  const re = /^1[3-9]\d{9}$/;
  return re.test(String(phone));
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {object} 密码强度结果
 */
export const checkPasswordStrength = (password) => {
  let strength = 0;
  const result = {
    score: 0, // 0-4, 0最弱，4最强
    isValid: false,
    feedback: [],
  };
  
  if (!password) {
    result.feedback.push('请输入密码');
    return result;
  }
  
  // 长度检查
  if (password.length < 8) {
    result.feedback.push('密码长度至少为8个字符');
  } else {
    strength += 1;
  }
  
  // 包含数字
  if (/\d/.test(password)) {
    strength += 1;
  } else {
    result.feedback.push('密码需包含数字');
  }
  
  // 包含小写字母
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    result.feedback.push('密码需包含小写字母');
  }
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    result.feedback.push('密码需包含大写字母');
  }
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  } else {
    result.feedback.push('密码需包含特殊字符');
  }
  
  result.score = Math.min(4, Math.floor(strength));
  result.isValid = strength >= 3;
  
  return result;
};