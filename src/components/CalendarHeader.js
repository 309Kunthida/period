import React, { useState, useEffect } from 'react'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths } from 'date-fns';

const CalendarHeader = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today); // กำหนดวันที่ปัจจุบัน

  // ฟังก์ชันเปลี่ยนวันที่จาก Date Picker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // ใช้ useEffect เพื่อตรวจสอบและอัปเดตวันที่ทุกวัน
  useEffect(() => {
    const interval = setInterval(() => {
      const newToday = new Date();
      setSelectedDate(newToday);
    }, 1000 * 60 * 60 * 24); // อัปเดตทุกๆ 24 ชั่วโมง
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar-container">
      {/* ส่วนหัวแสดงเดือนและปี */}
      <div className="calendar-header">
        <img
          src="https://i.pinimg.com/564x/19/de/c4/19dec471d5a17fc3c001a95737f428d0.jpg"
          alt="User Icon"
          className="user-icon"
        />
        <div className="calendar-date">
          {selectedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          maxDate={addMonths(today, 12)}
          dateFormat="dd/MM/yyyy"
          popperPlacement="bottom-end"
          popperModifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: 'viewport',
            },
          }}
          customInput={
            <button className="calendar-button">
              <span className="calendar-icon">📅</span>
            </button>
          }
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
