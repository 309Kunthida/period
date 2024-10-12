import React from 'react';

const Calendar = ({ selectedDate, handleDateChange, loggedDates, predictedDates }) => {
  const selectedDay = selectedDate.getDate();

  const onDateClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    handleDateChange(newDate);
  };

  return (
    <div className="calendar-grid">
      {Array.from({ length: 31 }, (_, index) => {
        const day = index + 1;
        const isLogged = loggedDates.includes(day); // เช็คว่าวันที่บันทึกแล้วหรือไม่
        const isPredicted = predictedDates.includes(day); // เช็คว่าวันที่คาดการณ์หรือไม่

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
