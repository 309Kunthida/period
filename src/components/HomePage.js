import React, { useState, useEffect } from 'react';
import SaveButton from './SaveButton';
import Calendar from './Calendar';
import './calendar.css';
import './homePage.css';

const HomePage = ({ selectedDate, handleDateChange }) => {
  const [nextPeriod, setNextPeriod] = useState();
  const [cycleDates, setCycleDates] = useState([]);
  const [dailySymptoms, setDailySymptoms] = useState({});
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({ flow: '', mood: [], symptoms: [] });
  
  const [loggedDates, setLoggedDates] = useState([]); // เก็บวันที่บันทึก
  const [predictedDates, setPredictedDates] = useState([]); // เก็บวันที่คาดการณ์

  useEffect(() => {
    // ดึงข้อมูลอาการของวันที่ที่เลือก หากมีข้อมูลอยู่ใน dailySymptoms
    if (dailySymptoms[selectedDate]) {
      setSelectedSymptoms(dailySymptoms[selectedDate]);
    } else {
      // ถ้าไม่มีข้อมูลอาการ ให้รีเซ็ตเป็นค่าว่าง
      setSelectedSymptoms({ flow: '', mood: [], symptoms: [] });
    }
  }, [selectedDate, dailySymptoms]);

  const handleLogSymptoms = () => setShowSymptomForm(true);

  const handleLogCycle = (date) => {
    // ลบวันที่ทั้งหมดที่เคยบันทึกไว้ก่อน
    setCycleDates([date]);
    setLoggedDates([date]); // บันทึกวันที่ที่เลือกล่าสุดเท่านั้น
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

  return (
    <div className="home-page-container">
      {/* Header */}
      <div className="header-container">
        <div className="header-title"></div>
      </div>

      <div className="period-info-container">
        <div className="period-info-title">ประจำเดือนจะมาใน</div>
        <div className="period-info-days">{nextPeriod} วัน</div>
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

      {/* สรุปอาการของวันที่ที่เลือก */}
      {dailySymptoms[selectedDate] && (
        <div className="symptom-summary-container">
          <h3 className="symptom-summary-title">สรุปอาการของคุณ</h3>
          <p className="symptom-summary-item">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อารมณ์: {dailySymptoms[selectedDate].mood.join(', ') || 'ไม่ได้ระบุ'}</p>
          <p className="symptom-summary-item">อาการ: {dailySymptoms[selectedDate].symptoms.join(', ') || 'ไม่ได้ระบุ'}</p>
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
