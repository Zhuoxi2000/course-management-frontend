// src/features/notification/slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commonAPI } from '../../services/api';

// 初始状态
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// 异步操作 - 获取通知
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await commonAPI.getNotifications();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 异步操作 - 标记通知为已读
export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await commonAPI.markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 创建Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // 标记所有通知为已读
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
    },
  },
  extraReducers: (builder) => {
    // 获取通知
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取通知失败';
    });
    
    // 标记通知为已读
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
    });
  },
});

export const { markAllAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;