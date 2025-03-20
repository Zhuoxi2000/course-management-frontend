// src/pages/teacher/Feedback.js
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  message,
  Typography,
  Tabs,
  Spin,
  Badge,
  Empty,
  Divider,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  CheckCircleOutlined, 
  FileTextOutlined, 
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TeacherFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟获取数据
  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      // 模拟已完成课程数据
      const mockData = [
        {
          id: 1,
          title: '英语口语训练',
          student_name: 'student1',
          start_time: '2025-03-18T14:00:00',
          end_time: '2025-03-18T16:00:00',
          course_type: 'online',
          has_feedback: true,
          feedback: {
            id: 1,
            teacher_notes: '今天的课程表现不错，在语法方面有了明显进步，但发音还需要继续加强练习。',
            homework: '完成课本第35页的练习，并朗读课文3遍。',
            homework_due_date: '2025-03-20T23:59:59',
            recording_url: 'https://example.com/recordings/123',
          },
          student_homework: {
            id: 1,
            content: '我已完成所有作业，课文朗读录音链接：https://example.com/student/recordings/456',
            submitted_at: '2025-03-19T15:30:00',
          }
        },
        {
          id: 2,
          title: '高级英语写作',
          student_name: 'student2',
          start_time: '2025-03-17T10:00:00',
          end_time: '2025-03-17T12:00:00',
          course_type: 'offline',
          has_feedback: true,
          feedback: {
            id: 2,
            teacher_notes: '作文结构清晰，用词准确，但论点论证仍需加强。',
            homework: '修改今天的作文，并完成一篇新的议论文。',
            homework_due_date: '2025-03-22T23:59:59',
            recording_url: null,
          },
          student_homework: null
        },
        {
          id: 3,
          title: '商务英语会话',
          student_name: 'student3',
          start_time: '2025-03-15T19:00:00',
          end_time: '2025-03-15T21:00:00',
          course_type: 'online',
          has_feedback: false,
          feedback: null,
          student_homework: null
        },
      ];
      
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);
  
  // 处理添加反馈
  const handleAddFeedback = (record) => {
    setSelectedCourse(record);
    
    // 如果已有反馈，则填充表单
    if (record.has_feedback && record.feedback) {
      const feedback = record.feedback;
      form.setFieldsValue({
        teacher_notes: feedback.teacher_notes,
        homework: feedback.homework,
        homework_due_date: feedback.homework_due_date ? dayjs(feedback.homework_due_date) : null,
        recording_url: feedback.recording_url || '',
      });
    } else {
      form.resetFields();
    }
    
    setModalVisible(true);
  };
  
  // 处理查看反馈详情
  const handleViewFeedback = (record) => {
    setSelectedCourse(record);
    setModalVisible(true);
    
    if (record.has_feedback && record.feedback) {
      const feedback = record.feedback;
      form.setFieldsValue({
        teacher_notes: feedback.teacher_notes,
        homework: feedback.homework,
        homework_due_date: feedback.homework_due_date ? dayjs(feedback.homework_due_date) : null,
        recording_url: feedback.recording_url || '',
      });
    }
  };
  
  // 处理提交反馈
  const handleSubmitFeedback = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      // 模拟API请求
      setTimeout(() => {
        // 更新本地数据
        const newData = data.map(item => {
          if (item.id === selectedCourse.id) {
            return {
              ...item,
              has_feedback: true,
              feedback: {
                id: item.feedback?.id || Date.now(),
                teacher_notes: values.teacher_notes,
                homework: values.homework,
                homework_due_date: values.homework_due_date ? values.homework_due_date.format('YYYY-MM-DDTHH:mm:ss') : null,
                recording_url: values.recording_url || null,
              }
            };
          }
          return item;
        });
        
        setData(newData);
        setLoading(false);
        setModalVisible(false);
        message.success(selectedCourse.has_feedback ? '反馈已更新' : '反馈已添加');
      }, 600);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  // 过滤已完成但未提供反馈的课程
  const getPendingFeedbackCourses = () => {
    return data.filter(course => !course.has_feedback);
  };
  
  // 格式化日期时间
  const formatDateTime = (dateString) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm');
  };
  
  // 表格列定义
  const columns = [
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
      title: '上课时间',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text) => formatDateTime(text),
    },
    {
      title: '课程类型',
      dataIndex: 'course_type',
      key: 'course_type',
      render: (text) => text === 'online' ? '线上' : '线下',
    },
    {
      title: '反馈状态',
      dataIndex: 'has_feedback',
      key: 'has_feedback',
      render: (has_feedback, record) => (
        has_feedback ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            已提交反馈
          </Tag>
        ) : (
          <Tag color="orange" icon={<ClockCircleOutlined />}>
            待提交反馈
          </Tag>
        )
      ),
    },
    {
      title: '作业状态',
      key: 'homework_status',
      render: (_, record) => (
        record.has_feedback && record.student_homework ? (
          <Tag color="blue" icon={<FileTextOutlined />}>
            已提交作业
          </Tag>
        ) : record.has_feedback ? (
          <Tag color="default" icon={<ClockCircleOutlined />}>
            未提交作业
          </Tag>
        ) : (
          <Tag color="default">未分配作业</Tag>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.has_feedback ? (
            <>
              <Button 
                type="link" 
                icon={<EyeOutlined />} 
                onClick={() => handleViewFeedback(record)}
              >
                查看
              </Button>
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => handleAddFeedback(record)}
              >
                编辑
              </Button>
            </>
          ) : (
            <Button 
              type="link" 
              icon={<FileAddOutlined />} 
              onClick={() => handleAddFeedback(record)}
            >
              添加反馈
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="teacher-feedback-container">
      <Title level={2}>课程反馈管理</Title>
      <Paragraph>
        在这里您可以为已完成的课程添加反馈和作业，并查看学生提交的作业。
      </Paragraph>
      <Divider />
      
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={
            <span>
              待处理反馈
              <Badge 
                count={getPendingFeedbackCourses().length} 
                style={{ marginLeft: 8 }}
              />
            </span>
          } 
          key="1"
        >
          <Spin spinning={loading}>
            {getPendingFeedbackCourses().length > 0 ? (
              <Table 
                columns={columns} 
                dataSource={getPendingFeedbackCourses()} 
                rowKey="id" 
                pagination={false}
              />
            ) : (
              <Empty 
                description="暂无待处理的反馈" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </Spin>
        </TabPane>
        
        <TabPane tab="全部课程" key="2">
          <Spin spinning={loading}>
            <Table 
              columns={columns} 
              dataSource={data} 
              rowKey="id" 
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </TabPane>
      </Tabs>
      
      {/* 反馈表单模态框 */}
      <Modal
        title={
          <div>
            <div>{selectedCourse?.title || '课程'} - 反馈</div>
            <div style={{ fontSize: 14, fontWeight: 'normal', marginTop: 4 }}>
              学生：{selectedCourse?.student_name || ''}
            </div>
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmitFeedback}
            disabled={selectedCourse?.student_homework && !selectedCourse.has_feedback}
          >
            {selectedCourse?.has_feedback ? '更新反馈' : '提交反馈'}
          </Button>
        ]}
        width={700}
      >
        {selectedCourse?.student_homework && (
          <Card 
            title="学生作业" 
            style={{ marginBottom: 16 }}
            type="inner"
          >
            <p><strong>提交时间：</strong> {formatDateTime(selectedCourse.student_homework.submitted_at)}</p>
            <Paragraph>
              {selectedCourse.student_homework.content}
            </Paragraph>
          </Card>
        )}
        
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="teacher_notes"
            label="教师反馈"
            rules={[{ required: true, message: '请输入课程反馈' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="输入对本节课程的反馈和评价"
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="homework"
                label="作业安排"
                rules={[{ required: true, message: '请输入作业内容' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="输入本节课的作业要求"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="homework_due_date"
                label="截止日期"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  placeholder="选择截止日期和时间"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="recording_url"
            label="课程录音/视频链接"
            tooltip="如有课程录音或视频，请添加链接"
          >
            <Input placeholder="输入录音或视频链接（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherFeedback;