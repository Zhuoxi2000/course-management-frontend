import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Tag, Button, Divider } from 'antd';
import { 
  ClockCircleOutlined, 
  BookOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import CourseCalendar from '../../components/calendar/CourseCalendar';

const StudentDashboard = () => {
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [courseHistory, setCourseHistory] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    remainingHours: 0,
    completedHours: 0,
  });

  // 模拟数据 - 实际应用中应从API获取
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟API调用
        const mockUpcoming = [
          { 
            id: 1, 
            title: '高级英语会话', 
            date: '2025-03-20', 
            time: '19:00-20:30',
            teacher: '李老师',
            status: 'confirmed',
            isOnline: true
          },
          { 
            id: 2, 
            title: '数学分析', 
            date: '2025-03-22', 
            time: '14:00-16:00',
            teacher: '张老师',
            status: 'pending',
            isOnline: false
          },
        ];
        
        const mockHistory = [
          { 
            id: 101, 
            title: '英语写作', 
            date: '2025-03-15', 
            time: '19:00-20:30',
            teacher: '李老师',
            status: 'completed',
            feedback: '很好的进步，继续保持'
          },
          { 
            id: 102, 
            title: '数学分析', 
            date: '2025-03-10', 
            time: '14:00-16:00',
            teacher: '张老师',
            status: 'completed',
            feedback: '需要更多练习'
          },
        ];
        
        const mockStats = {
          totalCourses: 12,
          completedCourses: 8,
          remainingHours: 32,
          completedHours: 16,
        };
        
        setUpcomingCourses(mockUpcoming);
        setCourseHistory(mockHistory);
        setStats(mockStats);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">学生仪表盘</h1>
      
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic 
              title="总课程数" 
              value={stats.totalCourses} 
              prefix={<BookOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已完成课程" 
              value={stats.completedCourses} 
              prefix={<CheckCircleOutlined />} 
              suffix={`/${stats.totalCourses}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="剩余课时" 
              value={stats.remainingHours} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已完成课时" 
              value={stats.completedHours} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        {/* 左侧列表 */}
        <Col span={8}>
          <Card title="即将开始的课程" extra={<a href="/student/courses">查看全部</a>}>
            <List
              itemLayout="horizontal"
              dataSource={upcomingCourses}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small">
                      详情
                    </Button>,
                    item.status === 'confirmed' && (
                      <Button type="link" size="small" danger>
                        请假
                      </Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div className="flex items-center">
                        {item.title}
                        <Tag 
                          color={item.status === 'confirmed' ? 'green' : 'blue'} 
                          className="ml-2"
                        >
                          {item.status === 'confirmed' ? '已确认' : '待确认'}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div><CalendarOutlined /> {item.date} {item.time}</div>
                        <div><UserOutlined /> {item.teacher}</div>
                        <div>{item.isOnline ? '线上课程' : '线下课程'}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
          
          <Card title="课程历史" className="mt-6" extra={<a href="/student/history">查看全部</a>}>
            <List
              itemLayout="horizontal"
              dataSource={courseHistory}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.title}
                    description={
                      <div>
                        <div><CalendarOutlined /> {item.date} {item.time}</div>
                        <div><UserOutlined /> {item.teacher}</div>
                        <div>反馈: {item.feedback}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* 日历 */}
        <Col span={16}>
          <CourseCalendar userRole="student" userId={1} />
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
