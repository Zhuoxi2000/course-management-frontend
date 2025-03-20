// src/pages/student/Calendar.js
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Badge, 
  Card, 
  Modal, 
  Spin, 
  Typography, 
  Button, 
  Tabs, 
  Descriptions, 
  Tag, 
  Row, 
  Col,
  message 
} from 'antd';
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  VideoCameraOutlined, 
  UserOutlined,
  CalendarOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import AvailabilityCalendar from '../../components/calendar/AvailabilityCalendar';
import { studentAPI } from '../../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StudentCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const navigate = useNavigate();

  // 初始加载课程数据
  useEffect(() => {
    fetchCourses();
  }, []);

  // 获取课程数据
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getCourses();
      setCourses(response);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      message.error('获取课程数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理日期单元格渲染
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const dayCourses = courses.filter(course => 
      dayjs(course.start_time).format('YYYY-MM-DD') === date
    );

    return (
      <ul className="events">
        {dayCourses.map(course => (
          <li key={course.id} onClick={(e) => {
            e.stopPropagation();
            showCourseDetails(course);
          }}>
            <Badge 
              status={getStatusBadge(course.status)} 
              text={
                <span style={{ fontSize: '12px' }}>
                  {dayjs(course.start_time).format('HH:mm')} {course.title || '课程'}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 获取状态对应的徽标颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
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

  // 获取状态标签颜色
  const getStatusColor = (status) => {
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

  // 显示课程详情
  const showCourseDetails = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  // 处理日期选择
  const handleDateSelect = (value) => {
    const date = value.format('YYYY-MM-DD');
    const dayCourses = courses.filter(course => 
      dayjs(course.start_time).format('YYYY-MM-DD') === date
    );

    if (dayCourses.length === 1) {
      showCourseDetails(dayCourses[0]);
    } else if (dayCourses.length > 1) {
      // 如果当天有多个课程，可以显示一个选择列表
      // 这里简化为显示第一个课程
      showCourseDetails(dayCourses[0]);
    }
  };

  // 保存可用时间设置
  const handleSaveAvailability = async (availabilityData) => {
    try {
      await studentAPI.setAvailability({ time_slots: availabilityData });
      message.success('可用时间设置已保存');
    } catch (error) {
      console.error('Failed to save availability:', error);
      message.error('保存可用时间失败，请稍后再试');
    }
  };

  return (
    <div className="student-calendar-container">
      <div className="calendar-header">
        <Title level={2}>我的日程</Title>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="课程日程" key="schedule">
          <Spin spinning={loading}>
            <Card bordered={false}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/student/book-course')}
                >
                  预约新课程
                </Button>
              </div>
              <Calendar 
                dateCellRender={dateCellRender} 
                onSelect={handleDateSelect}
              />
            </Card>
          </Spin>
        </TabPane>
        <TabPane tab="可用时间设置" key="availability">
          <AvailabilityCalendar 
            userRole="student" 
            onSave={handleSaveAvailability}
          />
        </TabPane>
      </Tabs>

      {/* 课程详情模态框 */}
      <Modal
        title="课程详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          selectedCourse?.status === 'confirmed' && (
            <Button 
              key="leave" 
              type="danger" 
              onClick={() => {
                studentAPI.requestCancellation(selectedCourse.id, { reason: '学生请假' })
                  .then(() => {
                    message.success('请假申请已提交');
                    fetchCourses();
                    setModalVisible(false);
                  })
                  .catch(() => {
                    message.error('请假申请失败，请稍后再试');
                  });
              }}
            >
              请假
            </Button>
          ),
          <Button 
            key="view" 
            type="primary" 
            onClick={() => {
              navigate(`/student/courses/${selectedCourse.id}`);
            }}
          >
            查看完整详情
          </Button>,
        ]}
        width={600}
      >
        {selectedCourse && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="课程名称">
                {selectedCourse.title || '未命名课程'}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(selectedCourse.status)}>
                  {getStatusText(selectedCourse.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="教师">
                <UserOutlined style={{ marginRight: 8 }} />
                {selectedCourse.teacher_name || '未指定'}
              </Descriptions.Item>
              <Descriptions.Item label="日期">
                <CalendarOutlined style={{ marginRight: 8 }} />
                {dayjs(selectedCourse.start_time).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="时间">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {dayjs(selectedCourse.start_time).format('HH:mm')} - {dayjs(selectedCourse.end_time).format('HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="授课方式">
                {selectedCourse.course_type === 'online' ? (
                  <>
                    <VideoCameraOutlined style={{ marginRight: 8 }} />
                    线上授课 - {selectedCourse.meeting_link || '未指定平台'}
                  </>
                ) : (
                  <>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    线下授课 - {selectedCourse.location || '未指定地点'}
                  </>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCalendar;