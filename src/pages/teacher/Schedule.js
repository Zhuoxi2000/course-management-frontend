// src/pages/teacher/Schedule.js
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Badge, 
  Card, 
  Button, 
  Modal, 
  Spin, 
  Descriptions, 
  Tag, 
  Tabs, 
  message, 
  Select, 
  Form,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  VideoCameraOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import AvailabilityCalendar from '../../components/calendar/AvailabilityCalendar';
import CourseForm from '../../components/course/CourseForm';
import { teacherAPI } from '../../services/api';

const { TabPane } = Tabs;
const { Title } = Typography;

const TeacherSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [newCourseModalVisible, setNewCourseModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const navigate = useNavigate();

  // 初始加载数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取课程数据
      const coursesData = await teacherAPI.getCourses();
      setCourses(coursesData);

      // 获取学生数据
      const studentsData = await teacherAPI.getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 日历单元格渲染
  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayCourses = courses.filter(course => 
      dayjs(course.start_time).format('YYYY-MM-DD') === dateStr
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
    setCourseModalVisible(true);
  };

  // 处理日期选择
  const handleDateSelect = (date) => {
    // 可以在这里处理日期选择，例如显示当天的课程或添加新课程
    const formattedDate = date.format('YYYY-MM-DD');
    const dayCourses = courses.filter(course => 
      dayjs(course.start_time).format('YYYY-MM-DD') === formattedDate
    );

    if (dayCourses.length === 1) {
      showCourseDetails(dayCourses[0]);
    } else if (dayCourses.length > 1) {
      // 如果有多个课程，可以显示一个列表供选择
      // 这里简化为显示第一个课程
      showCourseDetails(dayCourses[0]);
    } else {
      // 如果没有课程，可以弹出添加课程的对话框
      setNewCourseModalVisible(true);
    }
  };

  // 保存可用时间设置
  const handleSaveAvailability = async (availabilityData) => {
    try {
      await teacherAPI.setAvailability({ time_slots: availabilityData });
      message.success('可用时间设置已保存');
    } catch (error) {
      console.error('Failed to save availability:', error);
      message.error('保存可用时间失败，请稍后再试');
    }
  };

  // 处理创建新课程
  const handleCreateCourse = async (values) => {
    setLoading(true);
    try {
      await teacherAPI.createCourse(values);
      message.success('课程已创建');
      setNewCourseModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create course:', error);
      message.error('创建课程失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理确认课程
  const handleConfirmCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await teacherAPI.updateCourse(selectedCourse.id, { status: 'confirmed' });
      message.success('课程已确认');
      setCourseModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to confirm course:', error);
      message.error('确认课程失败，请稍后再试');
    }
  };

  // 处理拒绝课程
  const handleRejectCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      await teacherAPI.updateCourse(selectedCourse.id, { status: 'cancelled' });
      message.success('课程已拒绝');
      setCourseModalVisible(false);
      fetchData();
    } catch (error) {
      console.error('Failed to reject course:', error);
      message.error('拒绝课程失败，请稍后再试');
    }
  };

  return (
    <div className="teacher-schedule">
      <Title level={2}>课程安排</Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="日程表" key="schedule">
          <Spin spinning={loading}>
            <Card 
              bordered={false} 
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setNewCourseModalVisible(true)}
                >
                  添加课程
                </Button>
              }
            >
              <Calendar 
                dateCellRender={dateCellRender} 
                onSelect={handleDateSelect}
              />
            </Card>
          </Spin>
        </TabPane>
        <TabPane tab="可用时间设置" key="availability">
          <AvailabilityCalendar 
            userRole="teacher" 
            onSave={handleSaveAvailability}
          />
        </TabPane>
      </Tabs>

      {/* 课程详情模态框 */}
      <Modal
        title="课程详情"
        open={courseModalVisible}
        onCancel={() => setCourseModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCourseModalVisible(false)}>
            关闭
          </Button>,
          selectedCourse?.status === 'pending' && (
            <>
              <Button 
                key="reject" 
                danger
                onClick={handleRejectCourse}
              >
                拒绝
              </Button>
              <Button 
                key="confirm" 
                type="primary" 
                onClick={handleConfirmCourse}
              >
                确认
              </Button>
            </>
          ),
          <Button 
            key="view" 
            type="primary" 
            onClick={() => {
              navigate(`/teacher/courses/${selectedCourse.id}`);
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
              <Descriptions.Item label="学生">
                <UserOutlined style={{ marginRight: 8 }} />
                {selectedCourse.student_name || '未指定'}
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

      {/* 新建课程模态框 */}
      <Modal
        title="添加新课程"
        open={newCourseModalVisible}
        onCancel={() => setNewCourseModalVisible(false)}
        footer={null}
        width={700}
      >
        <CourseForm 
          userRole="teacher"
          students={students}
          onFinish={handleCreateCourse}
          onCancel={() => setNewCourseModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default TeacherSchedule;