import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  Radio, 
  Button, 
  Card, 
  Typography,
  Row,
  Col,
  message
} from 'antd';
import { EnvironmentOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const CourseForm = ({ 
  initialValues = {}, 
  teachers = [], 
  students = [], 
  isEdit = false, 
  userRole = 'admin', 
  onFinish, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [courseType, setCourseType] = useState(initialValues.course_type || 'online');
  
  // 当initialValues变化时更新表单
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      const values = {
        ...initialValues,
        course_date: initialValues.start_time ? dayjs(initialValues.start_time) : null,
        start_time: initialValues.start_time ? dayjs(initialValues.start_time) : null,
        end_time: initialValues.end_time ? dayjs(initialValues.end_time) : null,
      };
      form.setFieldsValue(values);
      setCourseType(initialValues.course_type || 'online');
    }
  }, [form, initialValues]);
  
  // 课程类型变更处理
  const handleCourseTypeChange = (e) => {
    setCourseType(e.target.value);
  };
  
  // 表单提交处理
  const handleSubmit = (values) => {
    // 提取并格式化日期时间
    const startTime = values.start_time.format('YYYY-MM-DD HH:mm:ss');
    const endTime = values.end_time.format('YYYY-MM-DD HH:mm:ss');
    
    // 构建提交的数据对象
    const formattedValues = {
      ...values,
      start_time: startTime,
      end_time: endTime,
      course_type: courseType,
    };
    
    // 根据课程类型，只保留相关字段
    if (courseType === 'online') {
      delete formattedValues.location;
    } else {
      delete formattedValues.meeting_link;
    }
    
    if (onFinish) {
      onFinish(formattedValues);
    }
  };

  return (
    <Card 
      bordered={false} 
      className="form-card"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
    >
      <Title level={4}>
        {isEdit ? '编辑课程' : '添加新课程'}
      </Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          course_type: 'online',
          ...initialValues
        }}
      >
        <Row gutter={16}>
          {/* 学生或教师选择 */}
          {userRole === 'admin' && (
            <>
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
            </>
          )}
          
          {userRole === 'teacher' && (
            <Col span={24}>
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
          )}
          
          {userRole === 'student' && (
            <Col span={24}>
              <Form.Item
                name="teacher_id"
                label="教师"
                rules={[{ required: true, message: '请选择教师' }]}
              >
                <Select placeholder="选择教师" disabled={isEdit}>
                  {teachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          
          {/* 日期和时间选择 */}
          <Col span={12}>
            <Form.Item
              name="course_date"
              label="课程日期"
              rules={[{ required: true, message: '请选择日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="start_time"
                  label="开始时间"
                  rules={[{ required: true, message: '请选择开始时间' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="end_time"
                  label="结束时间"
                  rules={[{ required: true, message: '请选择结束时间' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          
          {/* 课程类型选择 */}
          <Col span={24}>
            <Form.Item
              name="course_type"
              label="课程类型"
            >
              <Radio.Group 
                onChange={handleCourseTypeChange} 
                value={courseType}
              >
                <Radio value="online">
                  <VideoCameraOutlined /> 线上课程
                </Radio>
                <Radio value="offline">
                  <EnvironmentOutlined /> 线下课程
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          
          {/* 根据课程类型显示不同的表单项 */}
          {courseType === 'online' ? (
            <Col span={24}>
              <Form.Item
                name="meeting_link"
                label="会议链接"
                rules={[{ required: true, message: '请输入会议链接或平台' }]}
              >
                <Input 
                  placeholder="填写会议链接或平台名称"
                  prefix={<VideoCameraOutlined />}
                />
              </Form.Item>
            </Col>
          ) : (
            <Col span={24}>
              <Form.Item
                name="location"
                label="上课地点"
                rules={[{ required: true, message: '请输入上课地点' }]}
              >
                <Input 
                  placeholder="填写具体上课地点"
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>
            </Col>
          )}
          
          {/* 备注 */}
          <Col span={24}>
            <Form.Item
              name="notes"
              label="备注"
            >
              <TextArea 
                rows={4} 
                placeholder="添加备注信息（可选）"
              />
            </Form.Item>
          </Col>
        </Row>
        
        {/* 提交按钮 */}
        <Form.Item className="mt-4">
          <div className="flex justify-end space-x-3">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              {isEdit ? '更新课程' : '创建课程'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseForm;