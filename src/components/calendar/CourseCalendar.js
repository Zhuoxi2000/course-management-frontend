import React from 'react';

const CourseCalendar = ({ events }) => {
  return (
    <div className="course-calendar">
      <h3>课程日历</h3>
      {/* 这里可以使用第三方日历组件，如 FullCalendar 或 react-big-calendar */}
      <div className="calendar-container">
        {/* 临时显示事件列表 */}
        {events?.map((event, index) => (
          <div key={index} className="calendar-event">
            <span>{event.title}</span>
            <span>{new Date(event.start).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCalendar; 