// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Button, 
  Select, 
  DatePicker, 
  Tabs, 
  Typography,
  Progress
} from 'antd';
import { 
  TeamOutlined, 
  BookOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  SolutionOutlined,
  BarChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';

import { Line, Column, Pie } from '@ant-design/plots';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟数据 - 统计数据
const mockStats = {
  totalStudents: 156,
  totalTeachers: 12,
  totalCourses: 78,
  completedCourses: 542,
  pendingCourses: 14,
  totalHours: 1247,
  cancelledCourses: 23,
  averageRating: 4.7
};

// 模拟数据 - 近期课程
const mockRecentCourses = [
  {
    key: '1',
    id: 1,
    date: '2025-03-20',
    time: '19:00-20:30',
    title: '高级英语会话',
    teacher: '李老师',
    student: '王小明',
    status: 'confirmed',
    type: 'online'
  },
  {
    key: '2',
    id: 2,
    date: '2025-03-22',
    time: '14:00-16:00',
    title: '数学分析',
    teacher: '张老师',
    student: '李小红',
    status: 'confirmed',
    type: 'offline'
  },
  {
    key: '3',
    id: 3,
    date: '2025-03-25',
    time: '19:00-20:30',
    title: '英语写作',
    teacher: '李老师',
    student: '张小军',
    status: 'pending',
    type: 'online'
  },
];

// 模拟数据 - 教师表现
const mockTeacherPerformance = [
  {
    key: '1',
    id: 1,
    name: '李老师',
    students: 45,
    courses: 23,
    completedCourses: 218,
    rating: 4.8,
    attendance: 98.5
  },
  {
    key: '2',
    id: 2,
    name: '张老师',
    students: 38,
    courses: 19,
    completedCourses: 182,
    rating: 4.5,
    attendance: 97.2
  },
  {
    key: '3',
    id: 3,
    name: '王老师',
    students: 22,
    courses: 12,
    completedCourses: 95,
    rating: 4.7,
    attendance: 99.1
  },
];

// 模拟数据 - 图表数据
const mockChartData = [
  { month: '1月', courses: 42, completed: 39 },
  { month: '2月', courses: 53, completed: 48 },
  { month: '3月', courses: 78, completed: 65 },
  { month: '4月', courses: 65, completed: 52 },
  { month: '5月', courses: 72, completed: 61 },
  { month: '6月', courses: 58, completed: 49 },
];

// 模拟数据 - 课程类型分布
const mockCourseTypeData = [
  { type: '英语', value: 42 },
  { type: '数学', value: 28 },
  { type: '物理', value: 16 },
  { type: '化学', value: 10 },
  { type: '计算机', value: 18 },
  { type: '其他', value: 8 },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [recentCourses, setRecentCourses] = useState(mockRecentCourses);
  const [teacherPerformance, setTeacherPerformance] = useState(mockTeacherPerformance);
  const [chartData, setChartData] = useState(mockChartData);
  const [courseTypeData, setCourseTypeData] = useState(mockCourseTypeData);
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 课程表格列定义
  const courseColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '课程',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '学生',
      dataIndex: 'student',
      key: 'student',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span>
          {status === 'confirmed' ? '已确认' : 
           status === 'pending' ? '待确认' : 
           status === 'completed' ? '已完成' : 
           status === 'cancelled' ? '已取消' : status}
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <span>{type === 'online' ? '线上' : '线下'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          查看
        </Button>
      ),
    },
  ];
  
  // 教师表格列定义
  const teacherColumns = [
    {
      title: '教师',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '待上课程',
      dataIndex: 'courses',
      key: 'courses',
    },
    {
      title: '已完成课程',
      dataIndex: 'completedCourses',
      key: 'completedCourses',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: '出勤率',
      dataIndex: 'attendance',
      key: 'attendance',
      render: (attendance) => (
        <span>{attendance}%</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">
          查看
        </Button>
      ),
    },
  ];
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header" style={{ marginBottom: 24 }}>
        <Title level={2}>管理员仪表盘</Title>
      </div>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic 
              title="学生总数" 
              value={stats.totalStudents} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic 
              title="教师总数" 
              value={stats.totalTeachers} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic 
              title="待上课程" 
              value={stats.pendingCourses} 
              prefix={<BookOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic 
              title="已完成课程" 
              value={stats.completedCourses} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="课程统计" 
            className="chart-card"
            loading={loading}
            extra={<RangePicker />}
          >
            {/* <Line
              data={chartData}
              xField="month"
              yField="value"
              seriesField="category"
              point={{ size: 5, shape: 'diamond' }}
              legend={{ position: 'top' }}
              xAxis={{ title: { text: '月份' } }}
              tooltip={{ showMarkers: false }}
              height={300}
              meta={{
                value: {
                  formatter: (v) => `${v} 节课`
                }
              }}
              annotations={[
                {
                  type: 'text',
                  position: ['min', 'max'],
                  content: '课程数量趋势',
                  offsetY: -30,
                  style: { textAlign: 'right' }
                }
              ]}
              interactions={[{ type: 'element-active' }]}
              yAxis={{
                min: 0,
                title: { text: '课程数' }
              }}
              animation={{
                appear: {
                  animation: 'fade-in'
                }
              }}
            /> */}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="课程类型分布" 
            className="chart-card"
            loading={loading}
          >
            {/* <Pie
              data={courseTypeData}
              angleField='value'
              colorField='type'
              radius={0.8}
              innerRadius={0.5}
              label={{
                type: 'spider',
                content: '{name}: {percentage}',
              }}
              interactions={[{ type: 'element-active' }]}
              height={300}
              legend={{
                layout: 'horizontal',
                position: 'bottom'
              }}
              animation={{
                appear: {
                  animation: 'fade-in'
                }
              }}
            /> */}
          </Card>
        </Col>
      </Row>
      
      {/* 选项卡 - 表格数据 */}
      <Card 
        style={{ marginTop: 16 }} 
        bodyStyle={{ padding: 0 }}
        loading={loading}
      >
        <Tabs defaultActiveKey="1" style={{ padding: '0 16px' }}>
          <TabPane tab="近期课程" key="1">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Select 
                    placeholder="课程状态" 
                    style={{ width: '100%' }}
                    defaultValue="all"
                  >
                    <Option value="all">所有状态</Option>
                    <Option value="confirmed">已确认</Option>
                    <Option value="pending">待确认</Option>
                    <Option value="completed">已完成</Option>
                    <Option value="cancelled">已取消</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <Select 
                    placeholder="课程类型" 
                    style={{ width: '100%' }}
                    defaultValue="all"
                  >
                    <Option value="all">所有类型</Option>
                    <Option value="online">线上课程</Option>
                    <Option value="offline">线下课程</Option>
                  </Select>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 800);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    刷新
                  </Button>
                  <Button type="primary">创建课程</Button>
                </Col>
              </Row>
              <Table 
                columns={courseColumns} 
                dataSource={recentCourses} 
                pagination={{ pageSize: 5 }}
              />
            </div>
          </TabPane>
          <TabPane tab="教师绩效" key="2">
            <div style={{ padding: '16px 0' }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Select 
                    placeholder="专业类型" 
                    style={{ width: '100%' }}
                    defaultValue="all"
                  >
                    <Option value="all">所有专业</Option>
                    <Option value="english">英语</Option>
                    <Option value="math">数学</Option>
                    <Option value="physics">物理</Option>
                    <Option value="chemistry">化学</Option>
                    <Option value="computer">计算机</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <Select 
                    placeholder="评分排序" 
                    style={{ width: '100%' }}
                    defaultValue="desc"
                  >
                    <Option value="desc">评分从高到低</Option>
                    <Option value="asc">评分从低到高</Option>
                  </Select>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                  <Button type="primary">添加教师</Button>
                </Col>
              </Row>
              <Table 
                columns={teacherColumns} 
                dataSource={teacherPerformance} 
                pagination={{ pageSize: 5 }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Dashboard;