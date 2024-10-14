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
  const [currentDayOfPeriod, setCurrentDayOfPeriod] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [nextPeriodDate, setNextPeriodDate] = useState(null);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  
    // รีเซ็ต selectedSymptoms เมื่อมีการเปลี่ยนวันที่
    setSelectedSymptoms({ flow: '', mood: [], symptoms: [] });
  
    const existingIndex = cycleDates.findIndex(
      (loggedDate) => loggedDate.getTime() === newDate.getTime()
    );
  
    if (existingIndex !== -1) {
      setCurrentDayOfPeriod(existingIndex + 1);
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  };
  

  // ฟังก์ชันตรวจสอบว่าวันที่ที่เลือกเป็นวันที่ประจำเดือนหรือไม่
  const isPeriodDay = predictedDates.some(predictedDate => predictedDate.toDateString() === selectedDate.toDateString());

  // ฟังก์ชันสำหรับบันทึกวันที่ที่เลือก
  const handleLogCycle = (date) => {
    const dateString = date.toDateString();
    
    if (!cycleDates.some(cycleDate => cycleDate.toDateString() === dateString)) {
      if (cycleDates.length > 0) {
        const lastLoggedDate = new Date(cycleDates[cycleDates.length - 1]);
        const diffDays = Math.ceil(Math.abs(date - lastLoggedDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          const updatedCycleDates = [...cycleDates, date];
          setCycleDates(updatedCycleDates);
          setCurrentDayOfPeriod(updatedCycleDates.length);
          const calculatedNextPeriod = calculateNextPeriod(date);
          setNextPeriodDate(calculatedNextPeriod);
        } else if (diffDays > 1) {
          setCycleDates([date]);
          setCurrentDayOfPeriod(1);
        }
      } else {
        const updatedCycleDates = [date];
        setCycleDates(updatedCycleDates);
        setCurrentDayOfPeriod(1);
        calculatePredictedDates(date);
      }
      setIsSaved(true);
    }
  };

  // ฟังก์ชันคำนวณวันประจำเดือนถัดไป
  const calculateNextPeriod = (startDate) => {
    const cycleLength = 28;
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + cycleLength);
    return nextPeriodDate;
  };

  // ฟังก์ชันคำนวณวันคาดการณ์
  const calculatePredictedDates = (startDate) => {
    const predicted = [];
    for (let i = 0; i < 5; i++) {
      const predictedDate = new Date(startDate);
      predictedDate.setDate(startDate.getDate() + i);
      predicted.push(predictedDate);
    }
    setPredictedDates(predicted);
  };

  // ฟังก์ชันคำนวณจำนวนวันที่เหลือจากวันที่เลือกไปถึงวันประจำเดือนรอบถัดไป
  const calculateDaysUntilNextPeriod = () => {
    if (!nextPeriodDate) return null;
    const today = selectedDate || new Date();
    const diffTime = Math.abs(nextPeriodDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // ฟังก์ชันรีเซ็ตข้อมูลรอบประจำเดือน
  const handleReset = () => {
    setCycleDates([]);
    setPredictedDates([]);
    setNextPeriodDate(null);
    setIsSaved(false);
    setCurrentDayOfPeriod(1);
  };

  // ฟังก์ชันลบวันที่บันทึก
  const handleDeleteCycle = () => {
    const updatedCycleDates = cycleDates.filter((loggedDate) => loggedDate.getTime() !== selectedDate.getTime());
    setCycleDates(updatedCycleDates);

    if (updatedCycleDates.length > 0) {
      const lastLoggedDate = updatedCycleDates[updatedCycleDates.length - 1];
      const updatedNextPeriodDate = calculateNextPeriod(lastLoggedDate);
      setNextPeriodDate(updatedNextPeriodDate);
    } else {
      setNextPeriodDate(null);
    }

    setIsSaved(false);
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

  return (
    <div className="home-page-container">
      <div className="period-info-container">
        {isSaved ? (
          <>
            <div className="period-info-title period-info-title-small">
              ประจำเดือน:
            </div>
            <div className="period-info-title period-info-title-large">
              วันที่ {currentDayOfPeriod}
            </div>
          </>
        ) : (
          <>
            {nextPeriodDate && !isPeriodDay && (
              <div className="period-info-days">
                ประจำเดือนจะมาอีกครั้งในวันที่ {formatThaiDate(nextPeriodDate)}
              </div>
            )}
            {nextPeriodDate && !isPeriodDay && (
              <div className="period-info-days">
                ครั้งถัดไปจะมาอีกใน {calculateDaysUntilNextPeriod()} วัน
              </div>
            )}
          </>
        )}
      </div>

      {/* ปฏิทินแสดงวันที่ */}
      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={cycleDates} 
          predictedDates={predictedDates} 
        />
      </div>

      {/* บันทึกวันที่รอบเดือน */}
      <div className="save-button-container">
        <SaveButton 
          selectedDate={selectedDate}
          onCycleDatesChange={handleLogCycle} 
          onPredictedDatesChange={setPredictedDates} 
        />
      </div>  

      {/* ปุ่มลบข้อมูล */}
      {isSaved && (
        <div className="save-button-container">
          <button onClick={handleDeleteCycle} className="bg-red-500 text-white py-1 px-3 rounded-full text-sm">
            ลบข้อมูล
          </button>
        </div>
      )}

      {/* ปุ่มรีเซ็ต */}
      <div className="reset-button-container">
        <button onClick={handleReset} className="bg-gray-500 text-white py-1 px-3 rounded-full text-sm ml-2">
          รีเซ็ตข้อมูล
        </button>
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