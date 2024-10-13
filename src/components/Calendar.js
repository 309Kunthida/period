import React from 'react';

const Calendar = ({ selectedDate, handleDateChange, loggedDates, predictedDates }) => {
  const selectedDay = selectedDate.getDate();

  // ฟังก์ชันสำหรับคำนวณจำนวนวันในเดือนที่เลือก
  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // หาจำนวนวันในเดือนปัจจุบันของ selectedDate
  const totalDays = daysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());

  const onDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    handleDateChange(newDate); // อัปเดตวันที่ที่เลือกให้ตรงกับ state หลัก
  };

  return (
    <div className="calendar-grid">
      {Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1;
        const isLogged = loggedDates.includes(day);
        const isPredicted = predictedDates.includes(day);

        return (
          <div
            key={day}
            className={`calendar-day ${day === selectedDay ? 'bg-gray-300' : ''} 
            ${isLogged ? 'bg-pink-500 text-white' : ''} 
            ${isPredicted ? 'border-pink-500 border-2' : ''}`}
            onClick={() => onDateClick(day)}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;