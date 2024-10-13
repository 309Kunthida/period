import React, { useState } from 'react';
import SaveButton from './SaveButton';
import Calendar from './Calendar';
import SymptomForm from './SymptomForm';
import './homePage.css';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleDates, setCycleDates] = useState([]);
  const [predictedDates, setPredictedDates] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });
  const [currentDayOfPeriod, setCurrentDayOfPeriod] = useState(1); // สำหรับเก็บวันที่ในรอบประจำเดือน
  const [isSaved, setIsSaved] = useState(false);
  const [isFirstDay, setIsFirstDay] = useState(true); // ตรวจสอบว่าเป็นวันแรกหรือไม่
  const [nextPeriodDate, setNextPeriodDate] = useState(null); // บันทึกวันที่ประจำเดือนครั้งถัดไป

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsSaved(false); // รีเซ็ตสถานะเมื่อเปลี่ยนวันที่
  };

  // ฟังก์ชันสำหรับบันทึกวันที่ที่เลือก
  const handleLogCycle = (date) => {
    setCycleDates([...cycleDates, date]);
    setIsSaved(true);
    setCurrentDayOfPeriod(cycleDates.length + 1); // เพิ่มลำดับวันในรอบประจำเดือน
    setIsFirstDay(false); // หลังจากบันทึกวันแรกแล้ว จะไม่ใช่วันแรกอีกต่อไป

    // คำนวณวันประจำเดือนถัดไปเฉพาะเมื่อเป็นวันแรก
    if (isFirstDay) {
      const calculatedNextPeriod = calculateNextPeriod(date);
      setNextPeriodDate(calculatedNextPeriod); // เก็บวันที่คำนวณได้
      calculatePredictedDates(date); // คำนวณวันคาดการณ์ที่เหลืออีก 4 วัน
    }
  };

  // ฟังก์ชันคำนวณวันที่ประจำเดือนจะมาอีก
  const calculateNextPeriod = (startDate) => {
    const cycleLength = 34; // รอบประจำเดือนเฉลี่ย 28วัน
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + cycleLength); // เพิ่ม 28 วัน
    return nextPeriodDate;
  };

  // ฟังก์ชันคำนวณวันคาดการณ์ 5 วันหลังจากวันแรก
  const calculatePredictedDates = (startDate) => {
    const predicted = [];
    for (let i = 1; i <= 5; i++) {
      const predictedDate = new Date(startDate);
      predictedDate.setDate(startDate.getDate() + i);
      predicted.push(predictedDate);
    }
    setPredictedDates(predicted); // บันทึกวันคาดการณ์ทั้ง 5 วัน
  };

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleSymptomChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedSymptoms((prev) => ({
      ...prev,
      [name]: name === 'flow' ? value : checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  const handleSaveSymptoms = () => {
    setDailySymptoms({ ...dailySymptoms, [selectedDate]: selectedSymptoms });
    setShowSymptomForm(false);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  // ฟังก์ชันแปลงวันที่เป็นรูปแบบภาษาไทย
  const formatThaiDate = (date) => {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };
  const calculateDaysUntilNextPeriod = () => {
    if (!nextPeriodDate) return null;
    const today = new Date(selectedDate);
    const timeDiff = Math.abs(nextPeriodDate - today);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };
  
  return (
    <div className="home-page-container">
      <div className="period-info-container">
        {isSaved && (
          <>
            <div className="period-info-title period-info-title-small">
              ประจำเดือน:
            </div>
            <div className="period-info-title period-info-title-large">
              วันที่ {currentDayOfPeriod}
            </div>
          </>
        )}

        {isSaved && nextPeriodDate && (
          <div className="period-info-days">
            ประจำเดือนจะมาอีกครั้งวันที่ {formatThaiDate(nextPeriodDate)}
            <br></br>
            ครั้งถัดไปจะมาอีกใน: {calculateDaysUntilNextPeriod()} วัน
          </div>
        )}
      </div>
  
      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={cycleDates} 
          predictedDates={predictedDates} 
        />
      </div>

      <div className="save-button-container">
        <SaveButton 
          selectedDate={selectedDate}
          onCycleDatesChange={handleLogCycle} 
          onPredictedDatesChange={setPredictedDates} 
        />
      </div>  

      <div className="daily-insights-container">
        <div className="daily-insights-title">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate.toLocaleDateString('th-TH')}</div>
        <div className="insights-grid">
          <div className="insight-card">
            <div>บันทึกอาการของคุณ</div>
            <div className="add-symptom-button" onClick={handleLogSymptoms}>+</div>
          </div>
        </div>
      </div>

      {showSymptomForm && (
        <SymptomForm
          selectedSymptoms={selectedSymptoms}
          handleSymptomChange={handleSymptomChange}
          handleSaveSymptoms={handleSaveSymptoms}
        />
      )}

      {dailySymptoms[selectedDate] && (
        <div className="symptom-summary-container">
          <h3 className="symptom-summary-title">สรุปอาการของคุณ</h3>
          <p className="symptom-summary-item">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อารมณ์: {dailySymptoms[selectedDate].mood.join(', ') || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อาการ: {dailySymptoms[selectedDate].symptoms.join(', ') || 'ไม่ได้ระบุ'}</p>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-title">บันทึกอาการของคุณแล้ว</h3>
          </div>
        </div>
      )}

    

    </div>
  );
};

export default HomePage;