import React, { useState } from 'react';
import Header from './components/Header';  // นำเข้า Header ที่เราสร้างขึ้นมา
import PeriodTracker from './components/PeriodTracker';
import HomePage from './components/HomePage';
import './App.css';
import CalendarHeader from './components/CalendarHeader';

function App() {
  // state เพื่อควบคุมการแสดงหน้า HomePage หรือ PeriodTracker
  const [showPeriodTracker, setShowPeriodTracker] = useState(false);

  // ฟังก์ชันสำหรับเปลี่ยนไปหน้า PeriodTracker เมื่อผู้ใช้กดปุ่ม "บันทึกรอบประจำเดือน"
  const handleLogPeriod = () => {
    setShowPeriodTracker(true);
  };

  return (
    <div className="container mx-auto">
      {/* แสดงส่วน Header ที่มีการเลือกวัน */}
      <Header />
      <CalendarHeader />

      <h1 className="text-3xl font-bold text-center mt-5">Period Tracker</h1>

      {/* แสดง HomePage ถ้ายังไม่ได้เปิดหน้า PeriodTracker */}
      {!showPeriodTracker && <HomePage />}

      {/* แสดง PeriodTracker เมื่อกดปุ่มบันทึกรอบประจำเดือน */}
      {showPeriodTracker && <PeriodTracker />}

      {/* ปุ่มสำหรับเปลี่ยนไปยัง PeriodTracker */}
      {!showPeriodTracker && (
        <div className="mt-5 flex justify-center">
          <button
            className="bg-pink-500 text-white py-2 px-4 rounded-full"
            onClick={handleLogPeriod}
          >
            บันทึกรอบประจำเดือน
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
