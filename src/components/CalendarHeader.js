import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths } from 'date-fns';

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate(); // หาจำนวนวันในแต่ละเดือน
};

const CalendarHeader = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today); // กำหนดวันที่ปัจจุบัน
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [days, setDays] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // ฟังก์ชันคำนวณวันในเดือนปัจจุบัน
  const updateDays = (month, year) => {
    const numDays = daysInMonth(month, year);
    const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
    setDays(daysArray);
  };

  useEffect(() => {
    updateDays(currentMonth, currentYear);
    // เลื่อน startIndex ไปที่วันที่ปัจจุบัน
    const newStartIndex = Math.max(selectedDate.getDate() - 4, 0); // แสดงให้วันที่ปัจจุบันอยู่ตรงกลาง (ถ้าทำได้)
    setStartIndex(newStartIndex);
  }, [currentMonth, currentYear, selectedDate]);

  // ฟังก์ชันเลื่อนการแสดงวันที่ทางซ้าย
  const handlePrevWeek = () => {
    if (startIndex - 7 >= 0) {
      setStartIndex(startIndex - 7);
    } else if (currentMonth > 1) {
      setCurrentMonth(currentMonth - 1);
      setStartIndex(daysInMonth(currentMonth - 1, currentYear) - 7);
    } else {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
      setStartIndex(daysInMonth(12, currentYear - 1) - 7);
    }
  };

  // ฟังก์ชันเลื่อนการแสดงวันที่ทางขวา
  const handleNextWeek = () => {
    if (startIndex + 7 < days.length) {
      setStartIndex(startIndex + 7);
    } else if (currentMonth < 12) {
      setCurrentMonth(currentMonth + 1);
      setStartIndex(0);
    } else {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
      setStartIndex(0);
    }
  };

  // ฟังก์ชันเลือกวันที่
  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, day));
  };

  // ฟังก์ชันเปลี่ยนวันที่จาก Date Picker
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentMonth(date.getMonth() + 1);
    setCurrentYear(date.getFullYear());
  };

  // ใช้ useEffect เพื่อตรวจสอบและอัปเดตวันที่ทุกวัน
  useEffect(() => {
    const interval = setInterval(() => {
      const newToday = new Date();
      setSelectedDate(newToday);
      setCurrentMonth(newToday.getMonth() + 1);
      setCurrentYear(newToday.getFullYear());
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

      {/* แสดงวันในสัปดาห์และวันที่ */}
      <div className="calendar-days flex items-center justify-between mt-8">
        <button onClick={handlePrevWeek} className="week-nav-button">{"<"}</button>
        <div className="calendar-days-list flex items-center justify-center space-x-4">
          {days.slice(startIndex, startIndex + 7).map((day) => (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`calendar-day ${day === selectedDate.getDate() ? 'bg-gray-300 text-black rounded-full' : ''}`} // เพิ่มวงกลมสีเทาอ่อน
            >
              <div className={`${day === selectedDate.getDate() ? 'font-bold' : ''}`}>
                {day}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleNextWeek} className="week-nav-button">{">"}</button>
      </div>
    </div>
  );
};

export default CalendarHeader;
