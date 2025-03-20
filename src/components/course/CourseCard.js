import React from 'react';
import { Card, Tag, Button, Space, Typography, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const CourseCard = ({ 
  course, 
  userRole = 'student', 
  onViewDetail, 
  onConfirm, 
  onReject, 
  onEdit, 
  onFeedback 
}) => {
  // 获取状态标签颜色
  const getStatusTagColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };
  
  // 获取状态文本
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'cancelled':
        return '已取消';
      case 'completed':
        return '已完成';
      default:
        return status;
    }
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD');
  };
  
  // 格式化时间
  const formatTime = (dateString) => {
    return dayjs(dateString).format('HH:mm');
  };
  
  // 渲染课程位置或链接
  const renderLocationOrLink = () => {
    if (course.course_type === 'online') {
      return (
        <div className="flex items-center mb-2">
          <VideoCameraOutlined className="mr-2 text-blue-500" />
          <Text>{course.meeting_link || '线上课程'}</Text>
        </div>
      );
    } else {
      return (
        <div className="flex items-center mb-2">
          <EnvironmentOutlined className="mr-2 text-red-500" />
          <Text>{course.location || '线下课程'}</Text>
        </div>
      );
    }
  };
  
  // 渲染操作按钮
  const renderActions = () => {
    const actions = [];
    
    // 查看详情按钮对所有角色都显示
    actions.push(
      <Button type="link" onClick={() => onViewDetail && onViewDetail(course.id)}>
        查看详情
      </Button>
    );
    
    // 根据角色和课程状态显示不同的操作按钮
    if (userRole === 'teacher') {
      if (course.status === 'pending') {
        actions.push(
          <Button type="primary" size="small" onClick={() => onConfirm && onConfirm(course.id)}>
            确认
          </Button>,
          <Button danger size="small" onClick={() => onReject && onReject(course.id)}>
            拒绝
          </Button>
        );
      } else if (course.status === 'confirmed') {
        actions.push(
          <Button type="default" size="small" icon={<EditOutlined />} onClick={() => onEdit && onEdit(course.id)}>
            调整
          </Button>
        );
      } else if (course.status === 'completed') {
        actions.push(
          <Button type="default" size="small" icon={<FileTextOutlined />} onClick={() => onFeedback && onFeedback(course.id)}>
            反馈
          </Button>
        );
      }
    } else if (userRole === 'student') {
      if (course.status === 'confirmed') {
        actions.push(
          <Button type="default" size="small" danger onClick={() => onEdit && onEdit(course.id)}>
            请假
          </Button>
        );
      }
    }
    
    return actions;
  };

  return (
    <Card 
      className="mb-4 hover:shadow-lg transition-shadow duration-200"
      bordered={false}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <Space align="center">
            <Title level={4} style={{ marginBottom: 0 }}>{course.title || '课程'}</Title>
            <Tag color={getStatusTagColor(course.status)}>{getStatusText(course.status)}</Tag>
          </Space>
          
          <div className="flex items-center mt-3 mb-2">
            <CalendarOutlined className="mr-2 text-gray-500" />
            <Text>{formatDate(course.start_time)}</Text>
          </div>
          
          <div className="flex items-center mb-2">
            <ClockCircleOutlined className="mr-2 text-gray-500" />
            <Text>{formatTime(course.start_time)} - {formatTime(course.end_time)}</Text>
          </div>
          
          {renderLocationOrLink()}
          
          <div className="flex items-center mb-1">
            <UserOutlined className="mr-2 text-gray-500" />
            <Text>
              {userRole === 'student' ? 
                `教师: ${course.teacher_name || '未指定'}` : 
                `学生: ${course.student_name || '未指定'}`
              }
            </Text>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          {renderActions()}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;