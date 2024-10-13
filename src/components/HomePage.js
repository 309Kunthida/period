import React, { useState, useEffect } from 'react';
import SaveButton from './SaveButton';
import Calendar from './Calendar';
import './calendar.css';
import './homePage.css';

const HomePage = ({ selectedDate, handleDateChange }) => {
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date(2024, 8, 20)); // วันที่เริ่มต้นประจำเดือนล่าสุด (20 กันยายน 2567)
  const [cycleLength, setCycleLength] = useState(28); // รอบเดือนโดยเฉลี่ยคือ 28 วัน
  const [nextPeriodDate, setNextPeriodDate] = useState(null); // วันที่คาดการณ์ว่าจะเป็นประจำเดือนถัดไป
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(0);
  const [cycleDates, setCycleDates] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });
  const [loggedDates, setLoggedDates] = useState([]); // เก็บวันที่บันทึก
  const [predictedDates, setPredictedDates] = useState([]); // เก็บวันที่คาดการณ์

  // ฟังก์ชันคำนวณวันที่ประจำเดือนถัดไป
  useEffect(() => {
    // ฟังก์ชันคำนวณจำนวนวันที่เหลือจนถึงประจำเดือนครั้งถัดไป
    const calculateDaysUntilNextPeriod = () => {
      if (lastPeriodDate instanceof Date && !isNaN(lastPeriodDate)) { // ตรวจสอบว่าเป็น Date หรือไม่
        const today = new Date();
        const nextDate = new Date(lastPeriodDate); // ใช้ lastPeriodDate ที่เป็น Date
        nextDate.setDate(lastPeriodDate.getDate() + cycleLength); // เพิ่มจำนวนวันตามรอบเดือนที่ตั้งไว้

        // ตรวจสอบว่าคำนวณวันที่ถูกต้อง
        console.log("Last Period Date:", lastPeriodDate.toLocaleDateString());
        console.log("Next Period Date:", nextDate.toLocaleDateString());

        const daysUntilNext = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวันที่เหลือ

        if (daysUntilNext >= 0) {
          setDaysUntilNextPeriod(daysUntilNext);
        } else {
          setDaysUntilNextPeriod(0); // ถ้าเลยวันแล้วให้แสดง 0 วัน
        }

        setNextPeriodDate(nextDate); // อัปเดต nextPeriodDate ที่คำนวณได้
      } else {
        console.error("lastPeriodDate is not a valid Date");
      }
    };

    // เรียกใช้ฟังก์ชันคำนวณครั้งแรกและทุกครั้งที่ `lastPeriodDate` หรือ `cycleLength` เปลี่ยนแปลง
    calculateDaysUntilNextPeriod();

  }, [lastPeriodDate, cycleLength]); // ตรวจสอบการเปลี่ยนแปลงของ lastPeriodDate และ cycleLength

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleLogCycle = (date) => {
    // อัปเดต lastPeriodDate เมื่อมีการบันทึกวันที่ประจำเดือนใหม่
    const selectedDate = new Date(date);
    if (!isNaN(selectedDate.getTime())) {
      setLastPeriodDate(selectedDate); // อัปเดตวันที่ที่เลือกล่าสุด
      setCycleDates([selectedDate]);
      setLoggedDates([selectedDate]); // บันทึกวันที่ที่เลือกล่าสุดเท่านั้น
    } else {
      console.error("Invalid date selected");
    }
  };

  const handlePredictedDates = (dates) => {
    setPredictedDates(dates); // บันทึกวันที่คาดการณ์
  };

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

  // ฟังก์ชันสำหรับเปลี่ยนรอบเดือน
  const handleCycleLengthChange = (e) => {
    setCycleLength(parseInt(e.target.value));
  };

  return (
    <div className="home-page-container">
      {/* Header */}
      <div className="header-container">
        <div className="header-title"></div>
      </div>

      <div className="period-info-container">
        <div className="period-info-title">ประจำเดือนจะมาใน</div>
        <div className="period-info-days" style={{ color: '#ec4899' }}>
          {daysUntilNextPeriod} วัน
        </div>
        <div className="pregnancy-chance">โอกาสตั้งครรภ์น้อย</div>
      </div>

      <h3 className="calendar-title">ปฏิทินรอบเดือน</h3>
      <div className="calendar-container">
        <Calendar 
          selectedDate={selectedDate} 
          handleDateChange={handleDateChange} 
          loggedDates={loggedDates} 
          predictedDates={predictedDates} 
        />
      </div>

      {/* แสดงวันที่ที่เลือก */}
      {selectedDate && (
        <div className="selected-date-container">
          <p>คุณเลือกวันที่: {selectedDate.toLocaleDateString('th-TH')}</p>
        </div>
      )}

      <div className="save-button-container">
        <SaveButton 
          selectedDate={selectedDate} 
          onCycleDatesChange={handleLogCycle} 
          onPredictedDatesChange={handlePredictedDates} 
        />
      </div>

      <div className="daily-insights-container">
        <div className="daily-insights-title">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate.toLocaleDateString('th-TH')}</div>
        <div className="insights-grid">
          <div className="insight-card">
            <div>บันทึกอาการของคุณ</div>
            <div className="add-symptom-button" onClick={handleLogSymptoms}>+</div>
          </div>
          <div className="insight-card">
            <div>ข้อมูลเชิงลึกเฉพาะบุคคลสำหรับวันนี้</div>
          </div>
        </div>
      </div>

      {/* แสดงจำนวนวันที่เหลือจนถึงประจำเดือนครั้งถัดไป */}
      <div>
        <p>ประจำเดือนจะมาในอีก {daysUntilNextPeriod} วัน</p>
        <p>คาดการณ์วันประจำเดือนครั้งถัดไป: {nextPeriodDate && nextPeriodDate.toLocaleDateString('th-TH')}</p>
        <label>
          เลือกรอบเดือน (วัน):
          <input type="number" value={cycleLength} onChange={handleCycleLengthChange} />
        </label>
      </div>

      {/* Show symptom selection form */}
      {showSymptomForm && (
        <div className="symptom-form-container">
          <h3 className="symptom-form-title">เลือกอาการที่คุณรู้สึก</h3>
          {['มามาก', 'มาปานกลาง', 'มาน้อย'].map((flow) => (
            <label className="symptom-option" key={flow}>
              <input
                type="radio"
                name="flow"
                value={flow}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.flow === flow}
                className="symptom-input"
              />
              {flow}
            </label>
          ))}

          <h4 className="symptom-category-title">อารมณ์</h4>
          {['เงียบสงบ', 'มีความสุข', 'กระปรี้กระเปร่า', 'หงุดหงิด', 'เศร้า', 'กระวนกระวาย', 'หดหู่', 'รู้สึกผิด', 'ไม่กระตือรือร้น', 'สับสน', 'วิจารณ์ตัวเอง', 'อารมณ์แปรปรวน'].map((mood) => (
            <label className="symptom-option" key={mood}>
              <input
                type="checkbox"
                name="mood"
                value={mood}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes(mood)}
                className="symptom-input"
              />
              {mood}
            </label>
          ))}

          <h4 className="symptom-category-title">อาการ</h4>
          {['ปวดประจำเดือน', 'เจ็บเต้านม', 'ปวดศีรษะ', 'อ่อนเพลีย', 'เป็นสิว', 'ปวดหลัง', 'มีความอยากอาหารสูง', 'นอนไม่หลับ'].map((symptom) => (
            <label className="symptom-option" key={symptom}>
              <input
                type="checkbox"
                name="symptoms"
                value={symptom}
                onChange={handleSymptomChange}
                checked={selectedSymptoms.symptoms.includes(symptom)}
                className="symptom-input"
              />
              {symptom}
            </label>
          ))}

          <button className="save-symptom-button" onClick={handleSaveSymptoms}>
            บันทึกอาการ
          </button>
        </div>
      )}

      {/* Popup */}
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
