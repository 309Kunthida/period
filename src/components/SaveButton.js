import React, { useState } from 'react';

const SaveButton = ({ onCycleDatesChange }) => {
  const [cycleDates, setCycleDates] = useState([]); // เก็บวันที่บันทึกรอบเดือน

  // ฟังก์ชันบันทึกรอบเดือน และบันทึกอัตโนมัติ 5 วัน
  const handleLogCycle = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // เปลี่ยนวันที่เป็น string

    // คำนวณวันถัดไป 5 วันหลังจากวันบันทึก
    const newCycleDates = [todayString]; // เริ่มต้นจากวันที่ปัจจุบัน
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      newCycleDates.push(nextDate.toISOString().split('T')[0]); // เพิ่มวันที่เข้าไป
    }

    setCycleDates(newCycleDates); // เก็บวันที่ทั้งหมดที่บันทึกใน state
    onCycleDatesChange(newCycleDates); // ส่งวันที่ไปยัง HomePage.js
  };

  return (
    <button
      className="bg-pink-500 text-white py-2 px-4 rounded-full"
      onClick={handleLogCycle}  // เมื่อกดปุ่มจะเรียกฟังก์ชัน handleLogCycle
    >
      บันทึกรอบประจำเดือน
    </button>
  );
};

export default SaveButton;
