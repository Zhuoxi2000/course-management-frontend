// src/pages/teacher/Students.js
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Avatar, 
  Tag, 
  Tooltip, 
  Progress, 
  Spin, 
  message, 
  Input, 
  Typography 
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';

const { Title } = Typography;

const TeacherStudents = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // 初始加载数据
  useEffect(() => {
    fetchStudents();
  }, []);

  // 获取学生数据
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await teacherAPI.getStudents();
      setStudents(response);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      message.error('获取学生数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 查看学生详情
  const handleViewStudent = (studentId) => {
    navigate(`/teacher/students/${studentId}`);
  };

  // 查看学生课程
  const handleViewStudentCourses = (studentId) => {
    navigate(`/teacher/courses?student=${studentId}`);
  };

  // 安排新课程
  const handleScheduleNewCourse = (studentId) => {
    navigate(`/teacher/schedule?student=${studentId}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '学生',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <span style={{ marginLeft: 8 }}>{text}</span>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => {
        return record.username?.toLowerCase().includes(value.toLowerCase()) ||
               record.email?.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <div>
          {record.email && (
            <Tooltip title={record.email}>
              <Button type="link" icon={<MailOutlined />} size="small" />
            </Tooltip>
          )}
          {record.phone && (
            <Tooltip title={record.phone}>
              <Button type="link" icon={<PhoneOutlined />} size="small" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '课时情况',
      key: 'hours',
      render: (_, record) => {
        const total = (record.remaining_hours || 0) + (record.completed_hours || 0);
        const percent = total > 0 ? (record.completed_hours / total) * 100 : 0;
        
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <span>已完成: {record.completed_hours || 0} 课时</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <span>剩余: {record.remaining_hours || 0} 课时</span>
            </div>
            <Progress 
              percent={percent.toFixed(0)} 
              size="small" 
              style={{ marginTop: 8 }}
            />
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewStudent(record.id)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            icon={<BookOutlined />} 
            onClick={() => handleViewStudentCourses(record.id)}
          >
            课程记录
          </Button>
          <Button 
            type="link" 
            icon={<CalendarOutlined />} 
            onClick={() => handleScheduleNewCourse(record.id)}
          >
            安排课程
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="teacher-students-container">
      <div className="students-header">
        <Title level={2}>我的学生</Title>
        <div className="students-search">
          <Input.Search
            placeholder="搜索学生姓名或邮箱"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </div>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Table 
            columns={columns} 
            dataSource={students.map(student => ({ ...student, key: student.id }))} 
            pagination={{ 
              pageSize: 10,
              showTotal: (total) => `共 ${total} 名学生`
            }}
            locale={{ emptyText: '暂无学生数据' }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default TeacherStudents;