// src/pages/student/BookCourse.js
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Steps, 
  Button, 
  message, 
  Calendar, 
  Badge, 
  Select, 
  Radio, 
  Form, 
  Input, 
  Result, 
  Spin, 
  Row, 
  Col, 
  Divider,
  Typography 
} from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const BookCourse = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [courseType, setCourseType] = useState('online');
  const [form] = Form.useForm();
  
  // 模拟数据 - 可预约的日期和时间段
  const [availableDates, setAvailableDates] = useState([]);
  
  // 模拟获取数据
  useEffect(() => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 生成未来14天的模拟数据
      const mockData = [];
      const today = dayjs();
      
      for (let i = 1; i < 14; i++) {
        // 只添加工作日 (1-5是周一到周五)
        const date = today.add(i, 'day');
        const weekday = date.day();
        
        if (weekday >= 1 && weekday <= 5) {
          // 生成随机时间段数量 (1-3个)
          const slots = [];
          const slotsCount = Math.floor(Math.random() * 3) + 1;
          
          // 上午时间段
          if (Math.random() > 0.3) {
            slots.push({
              start: '09:00',
              end: '10:30'
            });
          }
          
          // 下午时间段
          if (Math.random() > 0.4) {
            slots.push({
              start: '14:00',
              end: '15:30'
            });
          }
          
          // 傍晚时间段
          if (Math.random() > 0.5) {
            slots.push({
              start: '19:00',
              end: '20:30'
            });
          }
          
          if (slots.length > 0) {
            mockData.push({
              date: date.format('YYYY-MM-DD'),
              slots: slots
            });
          }
        }
      }
      
      setAvailableDates(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // 日历单元格渲染
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const matchDate = availableDates.find(item => item.date === date);
    
    if (matchDate) {
      return (
        <Badge 
          status="success" 
          text={`${matchDate.slots.length}个可用时段`}
          style={{ fontSize: '12px' }}
        />
      );
    }
    
    return null;
  };
  
  // 处理日期选择
  const handleDateSelect = (value) => {
    const date = value.format('YYYY-MM-DD');
    const matchDate = availableDates.find(item => item.date === date);
    
    if (matchDate) {
      setSelectedDate(date);
      setSelectedTimeSlot(null); // 重置时间段选择
    } else {
      message.info('该日期没有可用时间段');
    }
  };
  
  // 获取选定日期的可用时间段
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const matchDate = availableDates.find(item => item.date === selectedDate);
    return matchDate ? matchDate.slots : [];
  };
  
  // 模拟预约课程
  const handleBookCourse = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      message.error('请选择日期和时间段');
      return;
    }
    
    setLoading(true);
    
    try {
      const formValues = await form.validateFields();
      
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('课程预约成功，等待教师确认');
      setCurrent(current + 1);
    } catch (error) {
      message.error('表单验证失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };
  
  // 步骤内容
  const steps = [
    {
      title: '选择日期',
      content: (
        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col span={16}>
              <Card title="选择日期" className="calendar-card">
                <Calendar 
                  dateCellRender={dateCellRender} 
                  onSelect={handleDateSelect}
                  disabledDate={(current) => {
                    // 禁用今天之前的日期和没有可用时段的日期
                    return current < dayjs().startOf('day') || 
                           !availableDates.some(item => item.date === current.format('YYYY-MM-DD'));
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                title="已选日期" 
                style={{ marginBottom: 16 }}
              >
                {selectedDate ? (
                  <div>
                    <p><strong>日期:</strong> {selectedDate}</p>
                    <p><strong>可用时段:</strong> {getAvailableTimeSlots().length} 个</p>
                  </div>
                ) : (
                  <div>请在日历中选择一个有可用时段的日期</div>
                )}
              </Card>
              
              <Card title="可用时间段">
                {selectedDate ? (
                  getAvailableTimeSlots().length > 0 ? (
                    <Radio.Group 
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      value={selectedTimeSlot}
                    >
                      {getAvailableTimeSlots().map((slot, index) => (
                        <Radio 
                          key={index} 
                          value={`${slot.start}-${slot.end}`}
                          style={{ display: 'block', marginBottom: 12 }}
                        >
                          <ClockCircleOutlined style={{ marginRight: 8 }} /> 
                          <span style={{ fontSize: '14px', fontWeight: selectedTimeSlot === `${slot.start}-${slot.end}` ? 'bold' : 'normal' }}>
                            {slot.start} - {slot.end}
                          </span>
                        </Radio>
                      ))}
                    </Radio.Group>
                  ) : (
                    <div>该日期没有可用时间段</div>
                  )
                ) : (
                  <div>请先选择日期</div>
                )}
              </Card>
            </Col>
          </Row>
        </Spin>
      )
    },
    {
      title: '填写详情',
      content: (
        <Spin spinning={loading}>
          <Card title="课程详情">
            <Form 
              form={form} 
              layout="vertical"
              initialValues={{
                courseType: 'online',
              }}
            >
              <Form.Item label="已选日期和时间">
                <Input 
                  value={selectedDate && selectedTimeSlot ? `${selectedDate} ${selectedTimeSlot.replace('-', ' - ')}` : '未选择'} 
                  disabled 
                />
              </Form.Item>
              
              <Form.Item 
                name="courseType" 
                label="上课方式"
                rules={[{ required: true, message: '请选择上课方式' }]}
              >
                <Radio.Group 
                  onChange={(e) => setCourseType(e.target.value)}
                  value={courseType}
                >
                  <Radio value="online">线上课程</Radio>
                  <Radio value="offline">线下课程</Radio>
                </Radio.Group>
              </Form.Item>
              
              {courseType === 'online' ? (
                <Form.Item 
                  name="meetingLink" 
                  label="会议平台" 
                  rules={[{ required: true, message: '请选择会议平台' }]}
                >
                  <Select placeholder="选择会议平台">
                    <Option value="腾讯会议">腾讯会议</Option>
                    <Option value="钉钉">钉钉</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item 
                  name="location" 
                  label="上课地点" 
                  rules={[{ required: true, message: '请输入上课地点' }]}
                >
                  <Input prefix={<EnvironmentOutlined />} placeholder="请输入上课地点" />
                </Form.Item>
              )}
              
              <Form.Item 
                name="notes" 
                label="备注信息"
              >
                <TextArea 
                  rows={4} 
                  placeholder="请输入备注信息，如特殊要求等" 
                />
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      )
    },
    {
      title: '完成预约',
      content: (
        <Result
          status="success"
          title="课程预约成功!"
          subTitle="您的预约已提交，等待教师确认，确认后将发送通知。"
          extra={[
            <Button type="primary" key="console" onClick={() => window.location.href = '/student/courses'}>
              查看我的课程
            </Button>,
            <Button key="buy" onClick={() => window.location.href = '/student/dashboard'}>
              返回首页
            </Button>,
          ]}
        />
      )
    }
  ];
  
  // 下一步按钮处理
  const handleNext = () => {
    if (current === 0) {
      if (!selectedDate || !selectedTimeSlot) {
        message.error('请选择日期和时间段');
        return;
      }
      setCurrent(current + 1);
    } else if (current === 1) {
      handleBookCourse();
    }
  };
  
  // 上一步按钮处理
  const handlePrev = () => {
    setCurrent(current - 1);
  };
  
  return (
    <div className="book-course-container">
      <Title level={2}>预约课程</Title>
      <Divider />
      
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      
      <div className="steps-content">
        {steps[current].content}
      </div>
      
      <div className="steps-action" style={{ marginTop: 24, textAlign: 'center' }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={handleNext}>
            {current === 1 ? '提交预约' : '下一步'}
          </Button>
        )}
        
        {current > 0 && current < steps.length - 1 && (
          <Button style={{ margin: '0 8px' }} onClick={handlePrev}>
            上一步
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookCourse;