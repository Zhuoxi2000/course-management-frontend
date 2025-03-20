// src/pages/teacher/Courses.js
import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Button, 
  Empty, 
  Spin, 
  message, 
  Row, 
  Col, 
  Input,
  Modal, 
  Typography 
} from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../components/course/CourseCard';
import CourseForm from '../../components/course/CourseForm';
import { teacherAPI } from '../../services/api';

const { TabPane } = Tabs;
const { Title } = Typography;
const { confirm } = Modal;

const TeacherCourses = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // 初始加载课程数据
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取学生列表（用于添加课程）
      const studentsData = await teacherAPI.getStudents();
      setStudents(studentsData);
      
      // 获取课程列表
      await fetchCourses();
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('获取数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程数据
  const fetchCourses = async (status = null) => {
    try {
      const params = status && status !== 'all' ? { status } : {};
      const response = await teacherAPI.getCourses(params);
      setCourses(response);
      setFilteredCourses(response);
      return response;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      message.error('获取课程列表失败，请稍后再试');
      return [];
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
      (course.student_name && course.student_name.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredCourses(filtered);
  };

  // 查看课程详情
  const handleViewDetail = (courseId) => {
    navigate(`/teacher/courses/${courseId}`);
  };

  // 确认课程
  const handleConfirm = async (courseId) => {
    try {
      await teacherAPI.updateCourse(courseId, { status: 'confirmed' });
      message.success('课程已确认');
      fetchCourses(activeTab);
    } catch (error) {
      console.error('Failed to confirm course:', error);
      message.error('确认课程失败，请稍后再试');
    }
  };

  // 拒绝课程
  const handleReject = (courseId) => {
    confirm({
      title: '确定要拒绝这个课程预约吗?',
      icon: <ExclamationCircleOutlined />,
      content: '拒绝后，该课程状态将变为已取消',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        try {
          await teacherAPI.updateCourse(courseId, { status: 'cancelled' });
          message.success('课程已拒绝');
          fetchCourses(activeTab);
        } catch (error) {
          console.error('Failed to reject course:', error);
          message.error('操作失败，请稍后再试');
        }
      }
    });
  };

  // 提交反馈
  const handleFeedback = (courseId) => {
    navigate(`/teacher/feedback/${courseId}`);
  };

  // 调整课程
  const handleEdit = (courseId) => {
    navigate(`/teacher/courses/${courseId}/edit`);
  };

  // 添加新课程
  const handleAddCourse = async (values) => {
    setLoading(true);
    try {
      await teacherAPI.createCourse(values);
      message.success('课程已创建');
      setModalVisible(false);
      fetchCourses(activeTab);
    } catch (error) {
      console.error('Failed to create course:', error);
      message.error('创建课程失败，请稍后再试');
    } finally {
      setLoading(false);
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
            onClick={() => setModalVisible(true)}
          >
            添加新课程
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
              userRole="teacher" 
              onViewDetail={handleViewDetail}
              onConfirm={handleConfirm}
              onReject={handleReject}
              onFeedback={handleFeedback}
              onEdit={handleEdit}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="teacher-courses-container">
      <div className="courses-header">
        <Title level={2}>课程管理</Title>
        <div className="courses-actions">
          <Input.Search
            placeholder="搜索课程或学生"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            添加新课程
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

      {/* 添加课程模态框 */}
      <Modal
        title="添加新课程"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <CourseForm 
          userRole="teacher"
          students={students}
          onFinish={handleAddCourse}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default TeacherCourses;