// src/pages/teacher/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  List, 
  Avatar, 
  Tag, 
  Button, 
  Divider, 
  Tabs,
  Spin,
  message,
  Typography
} from 'antd';
import { 
  ClockCircleOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  UserOutlined,
  StarOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { teacherAPI } from '../../services/api';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    completedCourses: 0,
    rating: 0
  });
  const [pendingCourses, setPendingCourses] = useState([]);
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // 加载数据
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取统计数据
      const statsData = await teacherAPI.getStats();
      setStats(statsData);

      // 获取待确认课程
      const pendingData = await teacherAPI.getCourses({ status: 'pending' });
      setPendingCourses(pendingData);

      // 获取即将开始的课程
      const confirmedData = await teacherAPI.getCourses({ status: 'confirmed' });
      // 按开始时间排序
      const sortedCourses = confirmedData.sort((a, b) => 
        new Date(a.start_time) - new Date(b.start_time)
      );
      setUpcomingCourses(sortedCourses.slice(0, 3));  // 显示最近的3个课程

      // 获取学生列表
      const studentsData = await teacherAPI.getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理课程确认
  const handleConfirmCourse = async (courseId) => {
    try {
      await teacherAPI.updateCourse(courseId, { status: 'confirmed' });
      message.success('课程已确认');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to confirm course:', error);
      message.error('课程确认失败，请稍后再试');
    }
  };

  // 处理课程拒绝
  const handleRejectCourse = async (courseId) => {
    try {
      await teacherAPI.updateCourse(courseId, { status: 'cancelled' });
      message.success('课程已拒绝');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to reject course:', error);
      message.error('操作失败，请稍后再试');
    }
  };

  // 查看课程详情
  const handleViewCourseDetail = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  // 查看学生详情
  const handleViewStudentDetail = (studentId) => {
    navigate(`/teacher/students/${studentId}`);
  };

  return (
    <Spin spinning={loading}>
      <div className="teacher-dashboard">
        <Title level={2}>教师仪表盘</Title>
        
        {/* 统计卡片 */}
        <Row gutter={16} className="stats-row">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="学生总数" 
                value={stats.totalStudents} 
                prefix={<TeamOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="待确认课程" 
                value={pendingCourses.length} 
                prefix={<ClockCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="已完成课程" 
                value={stats.completedCourses} 
                prefix={<CheckCircleOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic 
                title="教师评分" 
                value={stats.rating} 
                prefix={<StarOutlined />} 
                precision={1}
                suffix="/5"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="dashboard-content">
          {/* 左侧内容 */}
          <Col xs={24} md={8}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="待确认课程" key="1">
                {pendingCourses.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={pendingCourses}
                    renderItem={(course) => (
                      <List.Item
                        actions={[
                          <Button 
                            type="primary" 
                            size="small"
                            onClick={() => handleConfirmCourse(course.id)}
                          >
                            确认
                          </Button>,
                          <Button 
                            danger 
                            size="small"
                            onClick={() => handleRejectCourse(course.id)}
                          >
                            拒绝
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={course.title || '课程'}
                          description={
                            <>
                              <div><CalendarOutlined /> {new Date(course.start_time).toLocaleDateString()} {new Date(course.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                              <div><UserOutlined /> 学生: {course.student_name || '未知'}</div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: '暂无待确认课程' }}
                  />
                ) : (
                  <div className="empty-list">暂无待确认课程</div>
                )}
              </TabPane>
              
              <TabPane tab="我的学生" key="2">
                {students.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={students}
                    renderItem={(student) => (
                      <List.Item
                        actions={[
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => handleViewStudentDetail(student.id)}
                          >
                            查看
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={student.username}
                          description={
                            <>
                              <div>已完成课程: {student.completed_hours || 0} 课时</div>
                              <div>剩余课时: {student.remaining_hours || 0} 课时</div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: '暂无学生' }}
                  />
                ) : (
                  <div className="empty-list">暂无学生</div>
                )}
              </TabPane>
            </Tabs>
          </Col>
          
          {/* 右侧内容 */}
          <Col xs={24} md={16}>
            <Card title="即将开始的课程">
              {upcomingCourses.length > 0 ? (
                <div className="upcoming-courses">
                  {upcomingCourses.map(course => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                      userRole="teacher"
                      onViewDetail={() => handleViewCourseDetail(course.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-courses">
                  <Text type="secondary">暂无即将开始的课程</Text>
                  <div style={{ marginTop: 16 }}>
                    <Button type="primary" onClick={() => navigate('/teacher/schedule')}>
                      查看课程安排
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default TeacherDashboard;