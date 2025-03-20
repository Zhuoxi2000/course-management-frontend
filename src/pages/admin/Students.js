// src/pages/admin/Students.js
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Form, 
  InputNumber, 
  message,
  Card,
  Row,
  Col,
  Typography,
  Tooltip,
  Popconfirm,
  Statistic
} from 'antd';

import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserAddOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟数据
const mockTeachers = [
  { id: 1, name: '张老师', username: 'teacher1', specialization: '数学' },
  { id: 2, name: '李老师', username: 'teacher2', specialization: '英语' },
  { id: 3, name: '王老师', username: 'teacher3', specialization: '物理' },
];

const mockStudents = [
  { 
    id: 1, 
    name: '王小明', 
    username: 'student1', 
    email: 'student1@example.com', 
    phone: '13800138001', 
    teacher_id: 1, 
    teacher_name: '张老师',
    remaining_hours: 20, 
    completed_hours: 5, 
    status: 'active',
    created_at: '2024-01-15T08:30:00',
    last_login: '2025-03-18T14:25:30'
  },
  { 
    id: 2, 
    name: '李小红', 
    username: 'student2', 
    email: 'student2@example.com', 
    phone: '13800138002', 
    teacher_id: 2, 
    teacher_name: '李老师',
    remaining_hours: 15, 
    completed_hours: 10, 
    status: 'active',
    created_at: '2024-01-18T10:15:00',
    last_login: '2025-03-19T09:15:40'
  },
  { 
    id: 3, 
    name: '张小军', 
    username: 'student3', 
    email: 'student3@example.com', 
    phone: '13800138003', 
    teacher_id: 3, 
    teacher_name: '王老师',
    remaining_hours: 30, 
    completed_hours: 0, 
    status: 'active',
    created_at: '2024-01-20T15:45:00',
    last_login: '2025-03-15T16:30:20'
  },
  { 
    id: 4, 
    name: '刘小华', 
    username: 'student4', 
    email: 'student4@example.com', 
    phone: '13800138004', 
    teacher_id: 1, 
    teacher_name: '张老师',
    remaining_hours: 25, 
    completed_hours: 3, 
    status: 'inactive',
    created_at: '2024-01-25T09:20:00',
    last_login: '2025-03-10T11:45:10'
  },
  { 
    id: 5, 
    name: '陈小玲', 
    username: 'student5', 
    email: 'student5@example.com', 
    phone: '13800138005', 
    teacher_id: 2, 
    teacher_name: '李老师',
    remaining_hours: 10, 
    completed_hours: 15, 
    status: 'active',
    created_at: '2024-02-01T13:10:00',
    last_login: '2025-03-20T08:10:15'
  },
];

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [form] = Form.useForm();
  const [hoursForm] = Form.useForm();
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  // 加载学生数据
  useEffect(() => {
    fetchStudents();
  }, []);

  // 模拟加载学生数据
  const fetchStudents = () => {
    setLoading(true);
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  };

  // 处理表格筛选
  const getFilteredStudents = () => {
    let filtered = [...students];
    
    // 搜索文本筛选
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(
        student => 
          student.name.toLowerCase().includes(lowerSearchText) ||
          student.username.toLowerCase().includes(lowerSearchText) ||
          student.email.toLowerCase().includes(lowerSearchText) ||
          student.phone.includes(searchText)
      );
    }
    
    // 状态筛选
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    // 教师筛选
    if (teacherFilter !== 'all') {
      filtered = filtered.filter(student => student.teacher_id === parseInt(teacherFilter));
    }
    
    return filtered;
  };

  // 打开添加学生模态框
  const showAddModal = () => {
    setModalMode('add');
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑学生模态框
  const showEditModal = (student) => {
    setModalMode('edit');
    setCurrentStudent(student);
    form.setFieldsValue({
      name: student.name,
      username: student.username,
      email: student.email,
      phone: student.phone,
      teacher_id: student.teacher_id,
      status: student.status,
    });
    setIsModalVisible(true);
  };

  // 打开添加课时模态框
  const showAddHoursModal = (student) => {
    setCurrentStudent(student);
    hoursForm.resetFields();
    setIsHoursModalVisible(true);
  };

  // 处理添加/编辑学生表单提交
  const handleStudentSubmit = () => {
    form.validateFields().then(values => {
      if (modalMode === 'add') {
        // 模拟添加学生
        const newStudent = {
          id: Math.max(...students.map(s => s.id)) + 1,
          ...values,
          teacher_name: mockTeachers.find(t => t.id === values.teacher_id)?.name || '未分配',
          remaining_hours: 0,
          completed_hours: 0,
          created_at: new Date().toISOString(),
          last_login: null
        };
        setStudents([...students, newStudent]);
        message.success('学生添加成功');
      } else {
        // 模拟更新学生
        const updatedStudents = students.map(student => {
          if (student.id === currentStudent.id) {
            return {
              ...student,
              ...values,
              teacher_name: mockTeachers.find(t => t.id === values.teacher_id)?.name || '未分配',
            };
          }
          return student;
        });
        setStudents(updatedStudents);
        message.success('学生信息更新成功');
      }
      setIsModalVisible(false);
    });
  };

  // 处理添加课时表单提交
  const handleAddHoursSubmit = () => {
    hoursForm.validateFields().then(values => {
      // 模拟添加课时
      const updatedStudents = students.map(student => {
        if (student.id === currentStudent.id) {
          return {
            ...student,
            remaining_hours: student.remaining_hours + values.hours
          };
        }
        return student;
      });
      setStudents(updatedStudents);
      setIsHoursModalVisible(false);
      message.success(`已成功为 ${currentStudent.name} 添加 ${values.hours} 课时`);
    });
  };

  // 处理删除学生
  const handleDeleteStudent = (studentId) => {
    // 模拟删除学生
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    message.success('学生已删除');
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <span className="font-medium">{text}</span>
          {record.status === 'inactive' && (
            <Tag color="red" className="ml-2">未激活</Tag>
          )}
        </div>
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div className="mb-1">
            <MailOutlined className="mr-1" /> {record.email}
          </div>
          <div>
            <PhoneOutlined className="mr-1" /> {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: '指导教师',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    },
    {
      title: '课时',
      key: 'hours',
      render: (_, record) => (
        <div>
          <div className="mb-1">
            <Tooltip title="剩余课时">
              <ClockCircleOutlined className="mr-1 text-blue-500" />
              <span className="font-medium">{record.remaining_hours}</span>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="已完成课时">
              <CheckCircleOutlined className="mr-1 text-green-500" />
              <span>{record.completed_hours}</span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<ClockCircleOutlined />} 
            onClick={() => showAddHoursModal(record)}
          >
            添加课时
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此学生吗?"
            onConfirm={() => handleDeleteStudent(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="default" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>学生管理</Title>
      
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic 
              title="学生总数" 
              value={students.length} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="活跃学生" 
              value={students.filter(s => s.status === 'active').length} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总剩余课时" 
              value={students.reduce((sum, s) => sum + s.remaining_hours, 0)} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="总完成课时" 
              value={students.reduce((sum, s) => sum + s.completed_hours, 0)} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      {/* 筛选工具栏 */}
      <div className="mb-4 flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap items-center space-x-4">
          <Input 
            placeholder="搜索姓名/用户名/邮箱/手机号" 
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
            prefix={<SearchOutlined />} 
            style={{ width: 280 }} 
            allowClear
          />
          
          <Select 
            value={statusFilter} 
            onChange={value => setStatusFilter(value)}
            style={{ width: 120 }}
          >
            <Option value="all">所有状态</Option>
            <Option value="active">已激活</Option>
            <Option value="inactive">未激活</Option>
          </Select>
          
          <Select 
            value={teacherFilter} 
            onChange={value => setTeacherFilter(value)}
            style={{ width: 150 }}
          >
            <Option value="all">所有教师</Option>
            {mockTeachers.map(teacher => (
              <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
            ))}
          </Select>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              setSearchText('');
              setStatusFilter('all');
              setTeacherFilter('all');
            }}
          >
            重置
          </Button>
        </div>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          添加学生
        </Button>
      </div>
      
      {/* 学生表格 */}
      <Table 
        columns={columns} 
        dataSource={getFilteredStudents()} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          defaultPageSize: 10, 
          showSizeChanger: true, 
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`
        }}
      />
      
      {/* 添加/编辑学生模态框 */}
      <Modal
        title={modalMode === 'add' ? '添加新学生' : '编辑学生信息'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleStudentSubmit}
        okText={modalMode === 'add' ? '添加' : '保存'}
        cancelText="取消"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入学生姓名' }]}
              >
                <Input placeholder="请输入学生姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher_id"
                label="指导教师"
                rules={[{ required: true, message: '请选择指导教师' }]}
              >
                <Select placeholder="请选择指导教师">
                  {mockTeachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="active"
              >
                <Select>
                  <Option value="active">已激活</Option>
                  <Option value="inactive">未激活</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          {modalMode === 'add' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="初始密码"
                  rules={[{ required: true, message: '请设置初始密码' }]}
                >
                  <Input.Password placeholder="请设置初始密码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm_password"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
      
      {/* 添加课时模态框 */}
      <Modal
        title={`为 ${currentStudent?.name || ''} 添加课时`}
        open={isHoursModalVisible}
        onCancel={() => setIsHoursModalVisible(false)}
        onOk={handleAddHoursSubmit}
        okText="确认添加"
        cancelText="取消"
      >
        <Form
          form={hoursForm}
          layout="vertical"
        >
          <Form.Item
            name="hours"
            label="课时数量"
            rules={[
              { required: true, message: '请输入课时数量' },
              { type: 'number', min: 1, message: '课时数必须大于0' }
            ]}
          >
            <InputNumber 
              min={1} 
              style={{ width: '100%' }} 
              placeholder="请输入要添加的课时数量" 
            />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="可选：添加备注信息" 
            />
          </Form.Item>
        </Form>
        
        {currentStudent && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Text type="secondary">当前剩余课时: {currentStudent.remaining_hours} 小时</Text><br />
            <Text type="secondary">已完成课时: {currentStudent.completed_hours} 小时</Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsManagement;