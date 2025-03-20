// src/pages/admin/Courses.tsx
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
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { adminAPI } from '../../services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' 或 'edit'
  const [editingCourse, setEditingCourse] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    teacher_id: undefined,
    student_id: undefined,
    date_range: null,
  });
  const [form] = Form.useForm();

  // 获取课程数据
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
    fetchStudents();
  }, []);

  // 获取课程列表
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.teacher_id) {
        params.teacher_id = filters.teacher_id;
      }
      
      if (filters.student_id) {
        params.student_id = filters.student_id;
      }
      
      if (filters.date_range && filters.date_range.length === 2) {
        params.start_date = filters.date_range[0].format('YYYY-MM-DD');
        params.end_date = filters.date_range[1].format('YYYY-MM-DD');
      }
      
      const response = await adminAPI.getCourses(params);
      setCourses(response.map(course => ({
        ...course,
        key: course.id,
      })));
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取教师列表
  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getUsers({ role: 'teacher' });
      setTeachers(response.map(teacher => ({
        ...teacher,
        key: teacher.id,
      })));
    } catch (error) {
      message.error('获取教师列表失败');
    }
  };

  // 获取学生列表
  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getUsers({ role: 'student' });
      setStudents(response.map(student => ({
        ...student,
        key: student.id,
      })));
    } catch (error) {
      message.error('获取学生列表失败');
    }
  };

  // 处理筛选条件变化
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // 应用筛选条件
  const applyFilters = () => {
    fetchCourses();
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      status: 'all',
      teacher_id: undefined,
      student_id: undefined,
      date_range: null,
    });
    fetchCourses();
  };

  // 打开添加课程模态框
  const showAddModal = () => {
    setModalType('add');
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑课程模态框
  const showEditModal = (record) => {
    setModalType('edit');
    setEditingCourse(record);
    
    form.setFieldsValue({
      student_id: record.student_id,
      teacher_id: record.teacher_id,
      date_time: [
        dayjs(record.start_time),
        dayjs(record.end_time),
      ],
      course_type: record.course_type,
      location: record.location || undefined,
      meeting_link: record.meeting_link || undefined,
      status: record.status,
      notes: record.notes,
    });
    
    setModalVisible(true);
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理课程表单提交
  const handleCourseSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const courseData = {
        student_id: values.student_id,
        teacher_id: values.teacher_id,
        start_time: values.date_time[0].format('YYYY-MM-DDTHH:mm:ss'),
        end_time: values.date_time[1].format('YYYY-MM-DDTHH:mm:ss'),
        course_type: values.course_type,
        status: values.status,
        notes: values.notes,
      };
      
      if (values.course_type === 'online') {
        courseData.meeting_link = values.meeting_link;
      } else {
        courseData.location = values.location;
      }
      
      if (modalType === 'add') {
        await adminAPI.createCourse(courseData);
        message.success('添加课程成功');
      } else {
        await adminAPI.updateCourse(editingCourse.id, courseData);
        message.success('更新课程成功');
      }
      
      setModalVisible(false);
      fetchCourses();
    } catch (error) {
      console.error('提交表单错误:', error);
      message.error('操作失败，请检查表单填写');
    }
  };

  // 处理删除课程
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await adminAPI.deleteCourse(id);
      message.success('删除课程成功');
      fetchCourses();
    } catch (error) {
      message.error('删除课程失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue">待确认</Tag>;
      case 'confirmed':
        return <Tag color="green">已确认</Tag>;
      case 'cancelled':
        return <Tag color="red">已取消</Tag>;
      case 'completed':
        return <Tag color="purple">已完成</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (text) => dayjs(text).format('HH:mm'),
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
      render: (text) => (text === 'online' ? '线上' : '线下'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)} 
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
    <div>
      <h2>课程管理</h2>
      
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Select
              placeholder="选择课程状态"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="cancelled">已取消</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择教师"
              style={{ width: '100%' }}
              value={filters.teacher_id}
              onChange={(value) => handleFilterChange('teacher_id', value)}
              allowClear
            >
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择学生"
              style={{ width: '100%' }}
              value={filters.student_id}
              onChange={(value) => handleFilterChange('student_id', value)}
              allowClear
            >
              {students.map(student => (
                <Option key={student.id} value={student.id}>{student.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              value={filters.date_range}
              onChange={(dates) => handleFilterChange('date_range', dates)}
            />
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={applyFilters}
              >
                查询
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
                onClick={showAddModal}
              >
                添加课程
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      <Table 
        columns={columns} 
        dataSource={courses} 
        loading={loading} 
        rowKey="id"
        pagination={{ 
          showSizeChanger: true, 
          showQuickJumper: true, 
          showTotal: (total) => `共 ${total} 条记录` 
        }}
      />
      
      {/* 添加/编辑课程模态框 */}
      <Modal
        title={modalType === 'add' ? '添加新课程' : '编辑课程'}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleCourseSubmit}>
            提交
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="student_id"
                label="学生"
                rules={[{ required: true, message: '请选择学生' }]}
              >
                <Select placeholder="选择学生">
                  {students.map(student => (
                    <Option key={student.id} value={student.id}>{student.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacher_id"
                label="教师"
                rules={[{ required: true, message: '请选择教师' }]}
              >
                <Select placeholder="选择教师">
                  {teachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="date_time"
            label="课程时间"
            rules={[{ required: true, message: '请选择课程时间' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course_type"
                label="课程类型"
                rules={[{ required: true, message: '请选择课程类型' }]}
                initialValue="online"
              >
                <Select>
                  <Option value="online">线上课程</Option>
                  <Option value="offline">线下课程</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="课程状态"
                rules={[{ required: true, message: '请选择课程状态' }]}
                initialValue="pending"
              >
                <Select>
                  <Option value="pending">待确认</Option>
                  <Option value="confirmed">已确认</Option>
                  <Option value="cancelled">已取消</Option>
                  <Option value="completed">已完成</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.course_type !== currentValues.course_type
            }
          >
            {({ getFieldValue }) => {
              const courseType = getFieldValue('course_type');
              
              return courseType === 'online' ? (
                <Form.Item
                  name="meeting_link"
                  label="会议链接"
                  rules={[{ required: true, message: '请输入会议链接' }]}
                >
                  <Input placeholder="请输入会议链接或平台" />
                </Form.Item>
              ) : (
                <Form.Item
                  name="location"
                  label="上课地点"
                  rules={[{ required: true, message: '请输入上课地点' }]}
                >
                  <Input placeholder="请输入上课地点" />
                </Form.Item>
              );
            }}
          </Form.Item>
          
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursesManagement;