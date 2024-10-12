import React, { useState } from 'react';

const SaveButton = ({ selectedDate, onCycleDatesChange, onPredictedDatesChange }) => {
  const handleLogCycle = () => {
    const today = new Date(selectedDate);
    const todayString = today.getDate(); // บันทึกวันที่ปัจจุบัน

    // คำนวณวันถัดไป 5 วันหลังจากวันบันทึก
    const predictedDates = [];
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      predictedDates.push(nextDate.getDate()); // เพิ่มวันที่คาดการณ์เข้าไป
    }

    onCycleDatesChange(todayString); // ส่งวันที่บันทึกกลับไปที่ HomePage
    onPredictedDatesChange(predictedDates); // ส่งวันที่คาดการณ์กลับไปที่ HomePage
  };

  return (
    <button
      className="bg-pink-500 text-white py-2 px-4 rounded-full"
      onClick={handleLogCycle}
    >
      บันทึกรอบประจำเดือน
    </button>
  );
};

export default SaveButton;
