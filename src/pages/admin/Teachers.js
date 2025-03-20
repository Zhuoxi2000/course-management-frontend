// src/pages/admin/Teachers.js
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Popconfirm, 
  message, 
  Row, 
  Col, 
  Divider, 
  Typography, 
  Avatar, 
  Rate,
  Tooltip,
  Tabs,
  Progress,
  Statistic
} from 'antd';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined,
  TeamOutlined,
  StarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { ClockCircleOutlined,CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 模拟数据 - 教师列表
const mockTeachers = [
  {
    id: 1,
    key: '1',
    username: 'teacher1',
    name: '李明',
    email: 'teacher1@example.com',
    phone: '13900139001',
    specialization: '英语',
    bio: '8年教学经验，英语专业八级，擅长英语口语教学',
    rating: 4.8,
    is_active: true,
    created_at: '2024-12-15 10:00:00',
    updated_at: '2025-02-15 10:00:00',
    avatar: null,
    students_count: 45,
    courses_count: 23,
    completed_courses: 218,
    attendance_rate: 98.5
  },
  {
    id: 2,
    key: '2',
    username: 'teacher2',
    name: '张华',
    email: 'teacher2@example.com',
    phone: '13900139002',
    specialization: '数学',
    bio: '5年教学经验，理工科背景，擅长数学思维培养',
    rating: 4.5,
    is_active: true,
    created_at: '2024-12-20 10:00:00',
    updated_at: '2025-02-16 10:00:00',
    avatar: null,
    students_count: 38,
    courses_count: 19,
    completed_courses: 182,
    attendance_rate: 97.2
  },
  {
    id: 3,
    key: '3',
    username: 'teacher3',
    name: '王强',
    email: 'teacher3@example.com',
    phone: '13900139003',
    specialization: '物理',
    bio: '3年教学经验，理论物理博士，擅长物理思维培养',
    rating: 4.7,
    is_active: true,
    created_at: '2025-01-05 10:00:00',
    updated_at: '2025-02-17 10:00:00',
    avatar: null,
    students_count: 22,
    courses_count: 12,
    completed_courses: 95,
    attendance_rate: 99.1
  },
  {
    id: 4,
    key: '4',
    username: 'teacher4',
    name: '赵秀英',
    email: 'teacher4@example.com',
    phone: '13900139004',
    specialization: '化学',
    bio: '7年教学经验，化学硕士，擅长实验教学',
    rating: 4.6,
    is_active: true,
    created_at: '2025-01-10 10:00:00',
    updated_at: '2025-02-18 10:00:00',
    avatar: null,
    students_count: 30,
    courses_count: 15,
    completed_courses: 145,
    attendance_rate: 98.3
  },
  {
    id: 5,
    key: '5',
    username: 'teacher5',
    name: '刘伟',
    email: 'teacher5@example.com',
    phone: '13900139005',
    specialization: '计算机',
    bio: '10年编程经验，全栈开发工程师，擅长Web应用开发',
    rating: 4.9,
    is_active: true,
    created_at: '2025-01-15 10:00:00',
    updated_at: '2025-02-19 10:00:00',
    avatar: null,
    students_count: 35,
    courses_count: 18,
    completed_courses: 170,
    attendance_rate: 99.5
  },
];

// 模拟数据 - 教师课程
const mockTeacherCourses = [
  {
    id: 1,
    teacher_id: 1,
    title: '高级英语会话',
    student_name: '王小明',
    start_time: '2025-03-20 14:00:00',
    status: 'confirmed',
    course_type: 'online'
  },
  {
    id: 2,
    teacher_id: 1,
    title: '英语写作',
    student_name: '张小军',
    start_time: '2025-03-25 19:00:00',
    status: 'pending',
    course_type: 'online'
  },
  {
    id: 3,
    teacher_id: 2,
    title: '数学分析',
    student_name: '李小红',
    start_time: '2025-03-22 14:00:00',
    status: 'confirmed',
    course_type: 'offline'
  }
];

// 模拟数据 - 教师学生
const mockTeacherStudents = [
  {
    id: 1,
    teacher_id: 1,
    name: '王小明',
    remaining_hours: 15,
    completed_hours: 10
  },
  {
    id: 2,
    teacher_id: 1,
    name: '张小军',
    remaining_hours: 20,
    completed_hours: 5
  },
  {
    id: 3,
    teacher_id: 2,
    name: '李小红',
    remaining_hours: 12,
    completed_hours: 8
  }
];

// 模拟数据 - 教师绩效
const mockTeacherPerformance = [
  {
    teacher_id: 1,
    month: '一月',
    courses_count: 25,
    completion_rate: 96,
    average_rating: 4.8
  },
  {
    teacher_id: 1,
    month: '二月',
    courses_count: 28,
    completion_rate: 97,
    average_rating: 4.7
  },
  {
    teacher_id: 1,
    month: '三月',
    courses_count: 30,
    completion_rate: 98,
    average_rating: 4.9
  },
  {
    teacher_id: 2,
    month: '一月',
    courses_count: 20,
    completion_rate: 94,
    average_rating: 4.5
  },
  {
    teacher_id: 2,
    month: '二月',
    courses_count: 22,
    completion_rate: 95,
    average_rating: 4.6
  },
  {
    teacher_id: 2,
    month: '三月',
    courses_count: 24,
    completion_rate: 96,
    average_rating: 4.7
  }
];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  
  const [form] = Form.useForm();
  
  // 获取教师课程
  const getTeacherCourses = (teacherId) => {
    return mockTeacherCourses.filter(course => course.teacher_id === teacherId);
  };
  
  // 获取教师学生
  const getTeacherStudents = (teacherId) => {
    return mockTeacherStudents.filter(student => student.teacher_id === teacherId);
  };
  
  // 获取教师绩效
  const getTeacherPerformance = (teacherId) => {
    return mockTeacherPerformance.filter(perf => perf.teacher_id === teacherId);
  };
  
  // 加载教师数据
  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      // 模拟API延迟
      setTimeout(() => {
        setTeachers(mockTeachers);
        setFilteredTeachers(mockTeachers);
        setLoading(false);
      }, 800);
    };
    
    loadTeachers();
  }, []);
  
  // 搜索过滤器
  const handleSearch = () => {
    let result = [...teachers];
    
    if (searchText) {
      const keyword = searchText.toLowerCase();
      result = result.filter(teacher => 
        teacher.name.toLowerCase().includes(keyword) || 
        teacher.username.toLowerCase().includes(keyword) || 
        teacher.email.toLowerCase().includes(keyword)
      );
    }
    
    if (searchSpecialization) {
      result = result.filter(teacher => teacher.specialization === searchSpecialization);
    }
    
    setFilteredTeachers(result);
  };
  
  // 重置搜索
  const resetSearch = () => {
    setSearchText('');
    setSearchSpecialization('');
    setFilteredTeachers(teachers);
  };
  
  // 打开编辑/创建模态框
  const showModal = (teacher = null) => {
    setCurrentTeacher(teacher);
    setIsEditing(!!teacher);
    
    if (teacher) {
      form.setFieldsValue({
        username: teacher.username,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        bio: teacher.bio,
        is_active: teacher.is_active,
      });
    } else {
      form.resetFields();
    }
    
    setModalVisible(true);
  };
  
  // 打开详情模态框
  const showDetailModal = (teacher) => {
    setCurrentTeacher(teacher);
    setDetailModalVisible(true);
  };
  
  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEditing) {
        // 更新教师
        const updatedTeachers = teachers.map(teacher => 
          teacher.id === currentTeacher.id ? { ...teacher, ...values } : teacher
        );
        setTeachers(updatedTeachers);
        setFilteredTeachers(
          filteredTeachers.map(teacher => 
            teacher.id === currentTeacher.id ? { ...teacher, ...values } : teacher
          )
        );
        message.success('教师信息更新成功');
      } else {
        // 添加教师
        const newTeacher = {
          id: teachers.length + 1,
          key: (teachers.length + 1).toString(),
          ...values,
          rating: 5.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          avatar: null,
          students_count: 0,
          courses_count: 0,
          completed_courses: 0,
          attendance_rate: 100
        };
        
        setTeachers([...teachers, newTeacher]);
        setFilteredTeachers([...filteredTeachers, newTeacher]);
        message.success('教师添加成功');
      }
      
      setModalVisible(false);
      setLoading(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  // 处理删除
  const handleDelete = async (id) => {
    setLoading(true);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
    setTeachers(updatedTeachers);
    setFilteredTeachers(filteredTeachers.filter(teacher => teacher.id !== id));
    
    message.success('教师删除成功');
    setLoading(false);
  };
  
  // 课程表格列
  const courseColumns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '学生',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        let text = status;
        
        if (status === 'confirmed') {
          color = 'green';
          text = '已确认';
        } else if (status === 'pending') {
          color = 'orange';
          text = '待确认';
        } else if (status === 'completed') {
          color = 'blue';
          text = '已完成';
        } else if (status === 'cancelled') {
          color = 'red';
          text = '已取消';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'course_type',
      key: 'course_type',
      render: type => type === 'online' ? '线上' : '线下',
    },
  ];
  
  // 学生表格列
  const studentColumns = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '剩余课时',
      dataIndex: 'remaining_hours',
      key: 'remaining_hours',
    },
    {
      title: '已完成课时',
      dataIndex: 'completed_hours',
      key: 'completed_hours',
    },
    {
      title: '进度',
      key: 'progress',
      render: (_, record) => {
        const total = record.remaining_hours + record.completed_hours;
        const percent = Math.round((record.completed_hours / total) * 100);
        return <Progress percent={percent} />;
      },
    },
  ];
  
  // 绩效表格列
  const performanceColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '课程数',
      dataIndex: 'courses_count',
      key: 'courses_count',
    },
    {
      title: '完成率',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      render: rate => `${rate}%`,
    },
    {
      title: '平均评分',
      dataIndex: 'average_rating',
      key: 'average_rating',
      render: rating => (
        <Space>
          <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 12 }} />
          <span>{rating}</span>
        </Space>
      ),
    },
  ];
  
  // 主教师表格列
  const columns = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            icon={<UserOutlined />} 
            src={record.avatar} 
            style={{ marginRight: 8 }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '专业',
      dataIndex: 'specialization',
      key: 'specialization',
      filters: [
        { text: '英语', value: '英语' },
        { text: '数学', value: '数学' },
        { text: '物理', value: '物理' },
        { text: '化学', value: '化学' },
        { text: '计算机', value: '计算机' },
      ],
      onFilter: (value, record) => record.specialization === value,
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text><MailOutlined /> {record.email}</Text>
          <Text><PhoneOutlined /> {record.phone}</Text>
        </Space>
      ),
    },
    {
      title: '学生数',
      dataIndex: 'students_count',
      key: 'students_count',
      sorter: (a, b) => a.students_count - b.students_count,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: rating => (
        <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 12 }} />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: is_active => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? '在职' : '离职'}
        </Tag>
      ),
      filters: [
        { text: '在职', value: true },
        { text: '离职', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
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
              onClick={() => showDetailModal(record)}
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
              title="确定要删除该教师吗?"
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
    <div className="teachers-management">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <Title level={2}>教师管理</Title>
      </div>
      
      {/* 搜索过滤区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="搜索教师姓名/用户名/邮箱"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="专业筛选"
              value={searchSpecialization}
              onChange={value => setSearchSpecialization(value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="英语">英语</Option>
              <Option value="数学">数学</Option>
              <Option value="物理">物理</Option>
              <Option value="化学">化学</Option>
              <Option value="计算机">计算机</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={handleSearch} 
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
              <Button 
                onClick={resetSearch} 
                icon={<ReloadOutlined />}
              >
                重置
              </Button>
              <Button 
                type="primary" 
                onClick={() => showModal()} 
                icon={<UserAddOutlined />}
              >
                添加教师
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* 教师表格 */}
      <Card bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={filteredTeachers} 
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
      
      {/* 教师详情模态框 */}
      <Modal
        title="教师详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setDetailModalVisible(false);
              showModal(currentTeacher);
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {currentTeacher && (
          <div className="teacher-detail">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Avatar 
                      size={80} 
                      icon={<UserOutlined />} 
                      src={currentTeacher.avatar}
                    />
                    <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                      {currentTeacher.name}
                    </Title>
                    <Tag color="blue">{currentTeacher.specialization}</Tag>
                    <div style={{ marginTop: 16 }}>
                      <Rate disabled value={currentTeacher.rating} allowHalf />
                      <div>{currentTeacher.rating} / 5</div>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <p><MailOutlined /> {currentTeacher.email}</p>
                    <p><PhoneOutlined /> {currentTeacher.phone}</p>
                    <p><UserOutlined /> {currentTeacher.username}</p>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <Statistic 
                      title="学生数" 
                      value={currentTeacher.students_count} 
                      prefix={<TeamOutlined />}
                      style={{ marginBottom: 16 }}
                    />
                    <Statistic 
                      title="当前课程" 
                      value={currentTeacher.courses_count} 
                      prefix={<BookOutlined />}
                      style={{ marginBottom: 16 }}
                    />
                    <Statistic 
                      title="已授课时" 
                      value={currentTeacher.completed_courses} 
                      prefix={<ClockCircleOutlined />}
                      style={{ marginBottom: 16 }}
                    />
                    <Statistic 
                      title="出勤率" 
                      value={`${currentTeacher.attendance_rate}%`} 
                      prefix={<CheckCircleOutlined />}
                    />
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} md={16}>
                <Card>
                  <Tabs defaultActiveKey="bio">
                    <TabPane tab="基本资料" key="bio">
                      <Title level={5}>个人简介</Title>
                      <Paragraph>{currentTeacher.bio}</Paragraph>
                      
                      <Divider />
                      
                      <Row>
                        <Col span={12}>
                          <Text type="secondary">注册时间</Text>
                          <p>{dayjs(currentTeacher.created_at).format('YYYY-MM-DD')}</p>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">最后更新</Text>
                          <p>{dayjs(currentTeacher.updated_at).format('YYYY-MM-DD')}</p>
                        </Col>
                      </Row>
                    </TabPane>
                    
                    <TabPane tab="课程安排" key="courses">
                      <Table 
                        columns={courseColumns} 
                        dataSource={getTeacherCourses(currentTeacher.id)}
                        pagination={false}
                        rowKey="id"
                      />
                    </TabPane>
                    
                    <TabPane tab="学生管理" key="students">
                      <Table 
                        columns={studentColumns} 
                        dataSource={getTeacherStudents(currentTeacher.id)}
                        pagination={false}
                        rowKey="id"
                      />
                    </TabPane>
                    
                    <TabPane tab="绩效数据" key="performance">
                      <Table 
                        columns={performanceColumns} 
                        dataSource={getTeacherPerformance(currentTeacher.id)}
                        pagination={false}
                        rowKey={(record) => `${record.teacher_id}-${record.month}`}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      
      {/* 添加/编辑教师模态框 */}
      <Modal
        title={isEditing ? "编辑教师信息" : "添加新教师"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            is_active: true,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="登录账号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="教师姓名"
                rules={[{ required: true, message: '请输入教师姓名' }]}
              >
                <Input placeholder="真实姓名" />
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
                <Input placeholder="电子邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: true, message: '请输入电话号码' }]}
              >
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="specialization"
            label="专业领域"
            rules={[{ required: true, message: '请选择专业领域' }]}
          >
            <Select placeholder="选择专业领域">
              <Option value="英语">英语</Option>
              <Option value="数学">数学</Option>
              <Option value="物理">物理</Option>
              <Option value="化学">化学</Option>
              <Option value="计算机">计算机</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="bio"
            label="个人简介"
            rules={[{ required: true, message: '请输入个人简介' }]}
          >
            <TextArea rows={4} placeholder="教师个人简介和专业背景" />
          </Form.Item>
          
          <Form.Item
            name="is_active"
            valuePropName="checked"
          >
            <Select placeholder="状态">
              <Option value={true}>在职</Option>
              <Option value={false}>离职</Option>
            </Select>
          </Form.Item>
          
          {!isEditing && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请设置初始密码' }]}
            >
              <Input.Password placeholder="设置初始密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers;