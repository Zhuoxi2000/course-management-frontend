// src/pages/admin/Courses.js
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Row, 
  Col, 
  DatePicker, 
  Select, 
  Input, 
  Popconfirm, 
  Modal, 
  Form, 
  message,
  Tooltip,
  Typography,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined
} from '@ant-design/icons';
import CourseForm from '../../components/course/CourseForm';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟数据 - 课程列表
const mockCourses = [
  {
    key: '1',
    id: 1,
    title: '高级英语会话',
    start_time: '2025-03-20 14:00:00',
    end_time: '2025-03-20 16:00:00',
    student_id: 1,
    teacher_id: 1,
    student_name: '王小明',
    teacher_name: '李老师',
    status: 'confirmed',
    course_type: 'online',
    meeting_link: '腾讯会议',
    notes: '重点练习口语对话',
    created_at: '2025-03-15 10:00:00',
    updated_at: '2025-03-15 10:00:00'
  },
  {
    key: '2',
    id: 2,
    title: '数学分析',
    start_time: '2025-03-22 14:00:00',
    end_time: '2025-03-22 16:00:00',
    student_id: 2,
    teacher_id: 2,
    student_name: '李小红',
    teacher_name: '张老师',
    status: 'confirmed',
    course_type: 'offline',
    location: '教学楼302',
    notes: '带上教材和计算器',
    created_at: '2025-03-15 10:00:00',
    updated_at: '2025-03-15 10:00:00'
  },
  {
    key: '3',
    id: 3,
    title: '英语写作',
    start_time: '2025-03-25 19:00:00',
    end_time: '2025-03-25 20:30:00',
    student_id: 3,
    teacher_id: 1,
    student_name: '张小军',
    teacher_name: '李老师',
    status: 'pending',
    course_type: 'online',
    meeting_link: '腾讯会议',
    notes: '写作训练，提前准备好题目',
    created_at: '2025-03-15 10:00:00',
    updated_at: '2025-03-15 10:00:00'
  },
  {
    key: '4',
    id: 4,
    title: '物理实验',
    start_time: '2025-03-18 14:00:00',
    end_time: '2025-03-18 17:00:00',
    student_id: 4,
    teacher_id: 3,
    student_name: '刘小华',
    teacher_name: '王老师',
    status: 'completed',
    course_type: 'offline',
    location: '实验楼201',
    notes: '实验室安全注意事项',
    created_at: '2025-03-10 10:00:00',
    updated_at: '2025-03-10 10:00:00'
  },
  {
    key: '5',
    id: 5,
    title: '化学课程',
    start_time: '2025-03-19 09:00:00',
    end_time: '2025-03-19 11:00:00',
    student_id: 5,
    teacher_id: 4,
    student_name: '陈小玲',
    teacher_name: '赵老师',
    status: 'cancelled',
    course_type: 'offline',
    location: '教学楼405',
    notes: '临时取消，学生请假',
    created_at: '2025-03-12 10:00:00',
    updated_at: '2025-03-12 10:00:00'
  },
];

// 模拟数据 - 教师列表
const mockTeachers = [
  { id: 1, name: '李老师', specialization: '英语' },
  { id: 2, name: '张老师', specialization: '数学' },
  { id: 3, name: '王老师', specialization: '物理' },
  { id: 4, name: '赵老师', specialization: '化学' },
  { id: 5, name: '刘老师', specialization: '计算机' },
];

// 模拟数据 - 学生列表
const mockStudents = [
  { id: 1, name: '王小明' },
  { id: 2, name: '李小红' },
  { id: 3, name: '张小军' },
  { id: 4, name: '刘小华' },
  { id: 5, name: '陈小玲' },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    status: undefined,
    course_type: undefined,
    teacher_id: undefined,
    student_id: undefined,
    date_range: undefined,
    keyword: '',
  });
  
  const [form] = Form.useForm();
  
  // 加载课程数据
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      // 模拟API加载延迟
      setTimeout(() => {
        setCourses(mockCourses);
        setFilteredCourses(mockCourses);
        setLoading(false);
      }, 800);
    };
    
    loadCourses();
  }, []);
  
  // 处理筛选条件变化
  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };
  
  // 应用筛选条件
  const applyFilters = () => {
    let result = [...courses];
    
    if (filters.status) {
      result = result.filter(course => course.status === filters.status);
    }
    
    if (filters.course_type) {
      result = result.filter(course => course.course_type === filters.course_type);
    }
    
    if (filters.teacher_id) {
      result = result.filter(course => course.teacher_id === filters.teacher_id);
    }
    
    if (filters.student_id) {
      result = result.filter(course => course.student_id === filters.student_id);
    }
    
    if (filters.date_range && filters.date_range[0] && filters.date_range[1]) {
      const startDate = filters.date_range[0].startOf('day');
      const endDate = filters.date_range[1].endOf('day');
      
      result = result.filter(course => {
        const courseDate = dayjs(course.start_time);
        return courseDate.isAfter(startDate) && courseDate.isBefore(endDate);
      });
    }
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(keyword) || 
        course.student_name.toLowerCase().includes(keyword) || 
        course.teacher_name.toLowerCase().includes(keyword)
      );
    }
    
    setFilteredCourses(result);
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      status: undefined,
      course_type: undefined,
      teacher_id: undefined,
      student_id: undefined,
      date_range: undefined,
      keyword: '',
    });
    setFilteredCourses(courses);
  };
  
  // 打开课程表单模态框
  const showModal = (course = null) => {
    setCurrentCourse(course);
    setIsEditing(!!course);
    
    if (course) {
      // 如果是编辑模式，设置表单初始值
      form.setFieldsValue({
        title: course.title,
        student_id: course.student_id,
        teacher_id: course.teacher_id,
        start_time: dayjs(course.start_time),
        end_time: dayjs(course.end_time),
        course_type: course.course_type,
        location: course.location,
        meeting_link: course.meeting_link,
        status: course.status,
        notes: course.notes,
      });
    } else {
      form.resetFields();
    }
    
    setModalVisible(true);
  };
  
  // 查看课程详情
  const viewCourseDetail = (course) => {
    setCurrentCourse(course);
    setDetailModalVisible(true);
  };
  
  // 处理课程表单提交
  const handleSubmit = async (values) => {
    try {
      // 模拟API提交
      const formattedValues = {
        ...values,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
      };
      
      setLoading(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEditing) {
        // 更新课程
        const updatedCourses = courses.map(course => 
          course.id === currentCourse.id ? { ...course, ...formattedValues } : course
        );

        setCourses(updatedCourses);
        setFilteredCourses(applyFilters());
        message.success('课程更新成功');
      } else {
        // 添加课程
        const newCourse = {
          id: courses.length + 1,
          key: (courses.length + 1).toString(),
          ...formattedValues,
          student_name: mockStudents.find(s => s.id === values.student_id)?.name || '',
          teacher_name: mockTeachers.find(t => t.id === values.teacher_id)?.name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const newCourses = [...courses, newCourse];
        setCourses(newCourses);
        setFilteredCourses([...filteredCourses, newCourse]);
        message.success('课程创建成功');
      }
      
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试');
      setLoading(false);
    }
  };
  
  // 处理课程删除
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 删除课程
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      setFilteredCourses(filteredCourses.filter(course => course.id !== id));
      
      message.success('课程删除成功');
      setLoading(false);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
      setLoading(false);
    }
  };
  
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
  
  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '课程',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: text => dayjs(text).format('HH:mm'),
    },
    {
      title: '学生',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: '教师',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
    {
      title: '类型',
      dataIndex: 'course_type',
      key: 'course_type',
      render: text => text === 'online' ? '线上' : '线下',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={getStatusTagColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => viewCourseDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个课程吗?"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="courses-management">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <Title level={2}>课程管理</Title>
      </div>
      
      {/* 筛选器区域 */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="课程状态"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="cancelled">已取消</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="课程类型"
              style={{ width: '100%' }}
              value={filters.course_type}
              onChange={(value) => handleFilterChange('course_type', value)}
              allowClear
            >
              <Option value="online">线上课程</Option>
              <Option value="offline">线下课程</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择教师"
              style={{ width: '100%' }}
              value={filters.teacher_id}
              onChange={(value) => handleFilterChange('teacher_id', value)}
              allowClear
            >
              {mockTeachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择学生"
              style={{ width: '100%' }}
              value={filters.student_id}
              onChange={(value) => handleFilterChange('student_id', value)}
              allowClear
            >
              {mockStudents.map(student => (
                <Option key={student.id} value={student.id}>{student.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['开始日期', '结束日期']}
              value={filters.date_range}
              onChange={(dates) => handleFilterChange('date_range', dates)}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input 
              placeholder="搜索课程/学生/教师" 
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={applyFilters}
              >
                应用筛选
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={resetFilters}
              >
                重置
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                添加课程
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* 课程表格 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={filteredCourses} 
          loading={loading}
          rowKey="id"
          pagination={{ 
            showSizeChanger: true, 
            showQuickJumper: true, 
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10
          }}
        />
      </Card>
      
      {/* 课程表单模态框 */}
      <Modal
        title={isEditing ? "编辑课程" : "添加课程"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        <CourseForm
          form={form}
          initialValues={currentCourse}
          teachers={mockTeachers}
          students={mockStudents}
          isEdit={isEditing}
          userRole="admin"
          onFinish={handleSubmit}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
      
      {/* 课程详情模态框 */}
      <Modal
        title="课程详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setDetailModalVisible(false);
              showModal(currentCourse);
            }}
          >
            编辑
          </Button>
        ]}
        width={600}
      >
        {currentCourse && (
          <div className="course-detail">
            <Divider orientation="left">基本信息</Divider>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>课程名称：</Text> {currentCourse.title}
              </Col>
              <Col span={12}>
                <Text strong>状态：</Text> 
                <Tag color={getStatusTagColor(currentCourse.status)}>
                  {getStatusText(currentCourse.status)}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>开始时间：</Text> {dayjs(currentCourse.start_time).format('YYYY-MM-DD HH:mm')}
              </Col>
              <Col span={12}>
                <Text strong>结束时间：</Text> {dayjs(currentCourse.end_time).format('YYYY-MM-DD HH:mm')}
              </Col>
              <Col span={12}>
                <Text strong>课程类型：</Text> {currentCourse.course_type === 'online' ? '线上' : '线下'}
              </Col>
              <Col span={12}>
                {currentCourse.course_type === 'online' ? (
                  <>
                    <Text strong>会议链接：</Text> {currentCourse.meeting_link}
                  </>
                ) : (
                  <>
                    <Text strong>上课地点：</Text> {currentCourse.location}
                  </>
                )}
              </Col>
            </Row>
            
            <Divider orientation="left">参与人员</Divider>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>学生：</Text> {currentCourse.student_name}
              </Col>
              <Col span={12}>
                <Text strong>教师：</Text> {currentCourse.teacher_name}
              </Col>
            </Row>
            
            <Divider orientation="left">其他信息</Divider>
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Text strong>备注：</Text> {currentCourse.notes || '无'}
              </Col>
              <Col span={12}>
                <Text strong>创建时间：</Text> {dayjs(currentCourse.created_at).format('YYYY-MM-DD HH:mm')}
              </Col>
              <Col span={12}>
                <Text strong>更新时间：</Text> {dayjs(currentCourse.updated_at).format('YYYY-MM-DD HH:mm')}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Courses;