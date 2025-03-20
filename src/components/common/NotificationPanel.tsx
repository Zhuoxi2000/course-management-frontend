// src/components/common/NotificationPanel.tsx
import React, { useEffect } from 'react';
import { Drawer, List, Avatar, Button, Badge, Empty, Spin } from 'antd';
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../../features/notification/slice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// 扩展dayjs以支持相对时间
dayjs.extend(relativeTime);

const NotificationPanel = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);
  
  useEffect(() => {
    if (visible) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, visible]);
  
  // 标记单个通知为已读
  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };
  
  // 标记所有通知为已读
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  
  // 格式化时间为相对时间
  const formatTime = (time) => {
    return dayjs(time).fromNow();
  };
  
  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>通知中心</span>
          <Button 
            type="text" 
            onClick={handleMarkAllAsRead}
            disabled={notifications.every(n => n.isRead) || notifications.length === 0}
          >
            全部标为已读
          </Button>
        </div>
      }
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Spin spinning={loading}>
        {notifications.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
              <List.Item
                actions={[
                  !item.isRead && (
                    <Button 
                      type="text" 
                      icon={<CheckCircleOutlined />} 
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      标为已读
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.isRead}>
                      <Avatar icon={<BellOutlined />} style={{ backgroundColor: item.isRead ? '#d9d9d9' : '#1890ff' }} />
                    </Badge>
                  }
                  title={
                    <div style={{ fontWeight: item.isRead ? 'normal' : 'bold' }}>
                      {item.title}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>{item.content}</div>
                      <div style={{ color: '#999', fontSize: 12 }}>
                        {formatTime(item.created_at)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="暂无通知" 
            style={{ marginTop: 80 }}
          />
        )}
      </Spin>
    </Drawer>
  );
};

export default NotificationPanel;