// src/pages/student/Courses.js
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Button, 
  Empty, 
  Spin, 
  message, 
  Row, 
  Col, 
  Typography, 
  Select,
  Input
} from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import { studentAPI } from '../../services/api';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const StudentCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // 初始加载课程数据
  useEffect(() => {
    fetchCourses();
  }, []);

  // 获取课程数据
  const fetchCourses = async (status = null) => {
    setLoading(true);
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await studentAPI.getCourses(params);
      setCourses(response);
      setFilteredCourses(response);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      message.error('获取课程列表失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'all') {
      fetchCourses();
    } else {
      fetchCourses(key);
    }
    setSearchText('');
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
    if (!value) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course => 
      (course.title && course.title.toLowerCase().includes(value.toLowerCase())) ||
      (course.teacher_name && course.teacher_name.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredCourses(filtered);
  };

  // 导航到课程详情页
  const handleViewDetail = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  // 处理请假（取消课程）
  const handleRequestLeave = async (courseId) => {
    try {
      await studentAPI.requestCancellation(courseId, { reason: '学生请假' });
      message.success('请假申请已提交');
      fetchCourses(activeTab);
    } catch (error) {
      console.error('Failed to request leave:', error);
      message.error('请假申请失败，请稍后再试');
    }
  };

  // 渲染课程列表
  const renderCourseList = () => {
    if (loading) {
      return <div className="course-list-loading"><Spin size="large" /></div>;
    }

    if (!filteredCourses.length) {
      return (
        <Empty 
          description="没有找到相关课程" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/student/book-course')}
          >
            预约新课程
          </Button>
        </Empty>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredCourses.map(course => (
          <Col xs={24} sm={24} md={12} lg={8} key={course.id}>
            <CourseCard 
              course={course} 
              userRole="student" 
              onViewDetail={handleViewDetail}
              onEdit={handleRequestLeave}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="student-courses-container">
      <div className="courses-header">
        <Title level={2}>我的课程</Title>
        <div className="courses-actions">
          <Input.Search
            placeholder="搜索课程或教师"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/student/book-course')}
          >
            预约新课程
          </Button>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="全部课程" key="all" />
        <TabPane tab="待确认" key="pending" />
        <TabPane tab="已确认" key="confirmed" />
        <TabPane tab="已完成" key="completed" />
        <TabPane tab="已取消" key="cancelled" />
      </Tabs>

      <div className="courses-list">
        {renderCourseList()}
      </div>
    </div>
  );
};

export default StudentCourses;