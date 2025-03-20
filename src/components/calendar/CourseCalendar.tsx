import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Form, Select, TimePicker, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const CourseCalendar = ({ userRole, userId }) => {
  const [events, setEvents] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据 - 实际应用中应从API获取
  useEffect(() => {
    // 获取课程数据
    const fetchCourses = async () => {
      try {
        // 实际应用中替换为API调用
        const mockCourses = [
          {
            id: 1,
            title: '数学课',
            start: dayjs().add(1, 'day').hour(14).minute(0),
            end: dayjs().add(1, 'day').hour(16).minute(0),
            status: 'confirmed',
            teacher: '张老师',
            location: '线上',
          },
          {
            id: 2,
            title: '英语课',
            start: dayjs().add(2, 'day').hour(10).minute(0),
            end: dayjs().add(2, 'day').hour(12).minute(0),
            status: 'pending',
            teacher: '李老师',
            location: '线下',
          },
        ];
        setEvents(mockCourses);
      } catch (error) {
        message.error('获取课程数据失败');
      }
    };

    // 获取可用时间
    const fetchAvailability = async () => {
      try {
        // 实际应用中替换为API调用
        const mockAvailability = [
          {
            date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
            slots: [
              { start: '09:00', end: '11:00' },
              { start: '14:00', end: '16:00' },
            ],
          },
          {
            date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
            slots: [
              { start: '10:00', end: '12:00' },
              { start: '15:00', end: '17:00' },
            ],
          },
        ];
        setAvailableTimes(mockAvailability);
      } catch (error) {
        message.error('获取可用时间失败');
      }
    };

    fetchCourses();
    fetchAvailability();
  }, [userId]);

  // 日期单元格渲染
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const dateEvents = events.filter(
      (event) => event.start.format('YYYY-MM-DD') === date
    );

    return (
      <ul className="events p-0 m-0 list-none">
        {dateEvents.map((event) => (
          <li key={event.id} className="mb-1">
            <Badge
              status={
                event.status === 'confirmed'
                  ? 'success'
                  : event.status === 'pending'
                  ? 'processing'
                  : 'error'
              }
              text={
                <span className="text-xs">
                  {event.start.format('HH:mm')} - {event.title}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 处理日期选择
  const handleDateSelect = (value) => {
    const date = value.format('YYYY-MM-DD');
    // 检查是否有可用时间
    const availableDate = availableTimes.find((item) => item.date === date);
    
    if (availableDate && userRole === 'student') {
      setSelectedDate(date);
      setIsModalVisible(true);
      form.setFieldsValue({ date });
    } else if (userRole === 'teacher' || userRole === 'admin') {
      setSelectedDate(date);
      setIsModalVisible(true);
      form.setFieldsValue({ date });
    }
  };

  // 处理预约提交
  const handleBooking = async (values) => {
    try {
      // 实际应用中替换为API调用
      console.log('预约课程:', values);
      message.success('预约请求已发送，等待教师确认');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('预约失败');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-medium mb-6 text-gray-800">课程日历</h2>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        className="course-calendar"
      />

      {/* 预约课程模态框 */}
      <Modal
        title={userRole === 'student' ? "预约课程" : "添加课程安排"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleBooking}>
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <div>{selectedDate}</div>
          </Form.Item>

          <Form.Item name="timeSlot" label="时间段" rules={[{ required: true }]}>
            <Select placeholder="选择时间段">
              {availableTimes
                .find((item) => item.date === selectedDate)
                ?.slots.map((slot, index) => (
                  <Option key={index} value={`${slot.start}-${slot.end}`}>
                    {slot.start} - {slot.end}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {userRole === 'student' && (
            <Form.Item name="courseType" label="上课方式" rules={[{ required: true }]}>
              <Select placeholder="选择上课方式">
                <Option value="online">线上</Option>
                <Option value="offline">线下</Option>
              </Select>
            </Form.Item>
          )}

          {userRole === 'teacher' || userRole === 'admin' ? (
            <Form.Item name="students" label="学生" rules={[{ required: true }]}>
              <Select placeholder="选择学生">
                <Option value="1">张三</Option>
                <Option value="2">李四</Option>
              </Select>
            </Form.Item>
          ) : null}

          <Form.Item name="notes" label="备注">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="添加备注信息"
              rows={3}
            />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setIsModalVisible(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              {userRole === 'student' ? '提交预约' : '添加课程'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseCalendar;
