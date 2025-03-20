import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Tag, Button, Divider, Tabs } from 'antd';
import { 
  ClockCircleOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  UserOutlined,
  StarOutlined 
} from '@ant-design/icons';
import CourseCalendar from '../../components/calendar/CourseCalendar';

const { TabPane } = Tabs;

const TeacherDashboard = () => {
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    completedCourses: 0,
    rating: 0,
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
            student: '王小明',
            status: 'confirmed',
            isOnline: true
          },
          { 
            id: 2, 
            title: '数学分析', 
            date: '2025-03-22', 
            time: '14:00-16:00',
            student: '李小红',
            status: 'confirmed',
            isOnline: false
          },
        ];
        
        const mockPending = [
          { 
            id: 3, 
            title: '英语写作', 
            date: '2025-03-25', 
            time: '19:00-20:30',
            student: '张小军',
            status: 'pending',
            isOnline: true
          },
          { 
            id: 4, 
            title: '微积分', 
            date: '2025-03-26', 
            time: '14:00-16:00',
            student: '刘小华',
            status: 'pending',
            isOnline: false
          },
        ];
        
        const mockStudents = [
          {
            id: 1,
            name: '王小明',
            avatar: null,
            completedCourses: 8,
            nextCourse: '2025-03-20 19:00'
          },
          {
            id: 2,
            name: '李小红',
            avatar: null,
            completedCourses: 12,
            nextCourse: '2025-03-22 14:00'
          },
          {
            id: 3,
            name: '张小军',
            avatar: null,
            completedCourses: 5,
            nextCourse: '2025-03-25 19:00'
          },
          {
            id: 4,
            name: '刘小华',
            avatar: null,
            completedCourses: 3,
            nextCourse: '2025-03-26 14:00'
          },
          {
            id: 5,
            name: '陈小玲',
            avatar: null,
            completedCourses: 6,
            nextCourse: '暂无安排'
          },
        ];
        
        const mockStats = {
          totalStudents: 5,
          totalCourses: 28,
          completedCourses: 34,
          rating: 4.8,
        };
        
        setUpcomingCourses(mockUpcoming);
        setPendingCourses(mockPending);
        setStudentsList(mockStudents);
        setStats(mockStats);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-6">教师仪表盘</h1>
      
      {/* 统计卡片 */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic 
              title="学生总数" 
              value={stats.totalStudents} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="待确认课程" 
              value={pendingCourses.length} 
              prefix={<ClockCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已完成课程" 
              value={stats.completedCourses} 
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="教师评分" 
              value={stats.rating} 
              prefix={<StarOutlined />} 
              precision={1}
              suffix={`/5`}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        {/* 左侧列表 */}
        <Col span={8}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="待确认课程" key="1">
              <List
                itemLayout="horizontal"
                dataSource={pendingCourses}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="primary" size="small">
                        确认
                      </Button>,
                      <Button size="small">
                        调整
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.title}
                      description={
                        <div>
                          <div><CalendarOutlined /> {item.date} {item.time}</div>
                          <div><UserOutlined /> 学生: {item.student}</div>
                          <div>{item.isOnline ? '线上课程' : '线下课程'}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="即将开始的课程" key="2">
              <List
                itemLayout="horizontal"
                dataSource={upcomingCourses}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">
                        详情
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <div className="flex items-center">
                          {item.title}
                          <Tag 
                            color="green" 
                            className="ml-2"
                          >
                            已确认
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div><CalendarOutlined /> {item.date} {item.time}</div>
                          <div><UserOutlined /> 学生: {item.student}</div>
                          <div>{item.isOnline ? '线上课程' : '线下课程'}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="我的学生" key="3">
              <List
                itemLayout="horizontal"
                dataSource={studentsList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">
                        查看
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={item.name}
                      description={
                        <div>
                          <div>已完成课程: {item.completedCourses} 节</div>
                          <div>下次课程: {item.nextCourse}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Col>
        
        {/* 日历 */}
        <Col span={16}>
          <CourseCalendar userRole="teacher" userId={1} />
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;