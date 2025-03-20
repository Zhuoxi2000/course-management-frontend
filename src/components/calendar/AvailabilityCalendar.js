import React, { useState, useEffect } from 'react';
import { Calendar, Select, Button, Typography, Modal, TimePicker, Checkbox, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const { Option } = Select;
const { Title, Text } = Typography;

const AvailabilityCalendar = ({ userRole = 'student', onSave }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: 0,
    startTime: null,
    endTime: null,
    isRecurring: true
  });

  // 模拟从API获取的数据
  useEffect(() => {
    // 这里将来改为API调用
    const mockData = [
      { day: 1, startTime: '09:00', endTime: '12:00', isRecurring: true },
      { day: 3, startTime: '14:00', endTime: '18:00', isRecurring: true },
      { day: 5, startTime: '19:00', endTime: '21:00', isRecurring: true },
    ];
    setAvailabilityData(mockData);
  }, []);

  // 日历单元格渲染
  const dateCellRender = (value) => {
    const day = value.day();
    const matchingSlots = availabilityData.filter(slot => slot.day === day);
    
    if (matchingSlots.length === 0) return null;
    
    return (
      <ul className="events p-0 m-0 list-none">
        {matchingSlots.map((slot, index) => (
          <li key={index} className="text-xs mb-1 bg-blue-100 p-1 rounded">
            {slot.startTime} - {slot.endTime}
          </li>
        ))}
      </ul>
    );
  };
  
  // 处理日期选择
  const handleDateSelect = (value) => {
    const day = value.day();
    setSelectedDate(value);
    setNewTimeSlot({
      ...newTimeSlot,
      day: day
    });
    setIsModalVisible(true);
  };
  
  // 保存时间段
  const handleSaveTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) {
      message.error('请选择开始和结束时间');
      return;
    }
    
    if (dayjs(newTimeSlot.startTime).isAfter(dayjs(newTimeSlot.endTime))) {
      message.error('结束时间必须晚于开始时间');
      return;
    }
    
    const formattedSlot = {
      day: newTimeSlot.day,
      startTime: dayjs(newTimeSlot.startTime).format('HH:mm'),
      endTime: dayjs(newTimeSlot.endTime).format('HH:mm'),
      isRecurring: newTimeSlot.isRecurring
    };
    
    setAvailabilityData([...availabilityData, formattedSlot]);
    setIsModalVisible(false);
    
    // 清空新时间段
    setNewTimeSlot({
      day: 0,
      startTime: null,
      endTime: null,
      isRecurring: true
    });
    
    message.success('时间段已添加');
  };
  
  // 删除时间段
  const handleDeleteSlot = (index) => {
    const newData = [...availabilityData];
    newData.splice(index, 1);
    setAvailabilityData(newData);
  };
  
  // 保存所有设置
  const handleSaveAll = () => {
    if (onSave) {
      onSave(availabilityData);
    }
    message.success('已保存可用时间设置');
  };
  
  // 获取星期几文本
  const getDayText = (day) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[day];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="m-0">我的可用时间</Title>
        <Button type="primary" onClick={handleSaveAll}>保存设置</Button>
      </div>
      
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/3 pr-0 lg:pr-6">
          <Calendar 
            dateCellRender={dateCellRender} 
            onSelect={handleDateSelect}
            fullscreen={true}
          />
        </div>
        
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <Title level={5} className="m-0">已设置的时间段</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                添加
              </Button>
            </div>
            
            {availabilityData.length > 0 ? (
              <ul className="list-none p-0">
                {availabilityData.map((slot, index) => (
                  <li key={index} className="bg-white p-3 rounded mb-2 flex justify-between items-center">
                    <div>
                      <Text strong>{getDayText(slot.day)}</Text>
                      <br />
                      <Text>{slot.startTime} - {slot.endTime}</Text>
                      <br />
                      <Text type="secondary">{slot.isRecurring ? '每周重复' : '仅一次'}</Text>
                    </div>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteSlot(index)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <Text type="secondary">尚未设置任何可用时间</Text>
            )}
          </div>
        </div>
      </div>
      
      {/* 添加时间段模态框 */}
      <Modal
        title="添加可用时间段"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveTimeSlot}
        okText="保存"
        cancelText="取消"
      >
        <div className="mb-4">
          <label className="block mb-2">星期几</label>
          <Select 
            value={newTimeSlot.day} 
            onChange={(value) => setNewTimeSlot({...newTimeSlot, day: value})}
            style={{ width: '100%' }}
          >
            <Option value={0}>周日</Option>
            <Option value={1}>周一</Option>
            <Option value={2}>周二</Option>
            <Option value={3}>周三</Option>
            <Option value={4}>周四</Option>
            <Option value={5}>周五</Option>
            <Option value={6}>周六</Option>
          </Select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">开始时间</label>
          <TimePicker 
            value={newTimeSlot.startTime ? dayjs(newTimeSlot.startTime, 'HH:mm') : null}
            onChange={(time) => setNewTimeSlot({...newTimeSlot, startTime: time})}
            format="HH:mm"
            minuteStep={30}
            style={{ width: '100%' }}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">结束时间</label>
          <TimePicker 
            value={newTimeSlot.endTime ? dayjs(newTimeSlot.endTime, 'HH:mm') : null}
            onChange={(time) => setNewTimeSlot({...newTimeSlot, endTime: time})}
            format="HH:mm"
            minuteStep={30}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <Checkbox 
            checked={newTimeSlot.isRecurring}
            onChange={(e) => setNewTimeSlot({...newTimeSlot, isRecurring: e.target.checked})}
          >
            每周重复此时间段
          </Checkbox>
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilityCalendar;