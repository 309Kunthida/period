import React, { useState } from 'react';
import SaveButton from './SaveButton';
import './calendar.css';


const HomePage = () => {
  const [nextPeriod, setNextPeriod] = useState();
  const [cycleDates, setCycleDates] = useState([]);  // วันที่บันทึก
  const [predictedDates, setPredictedDates] = useState([]);  // วันที่คาดการณ์
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySymptoms, setDailySymptoms] = useState({});  // เก็บอาการตามวันที่
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState({
    flow: '',
    mood: '',
    symptoms: [],
  });
  
  const handleLogSymptoms = () => {
  setShowSymptomForm(true);  // ทำให้ฟอร์มแสดงผลเมื่อผู้ใช้คลิกปุ่มบันทึกอาการ
};

   // ฟังก์ชันบันทึกรอบเดือน
  const handleLogCycle = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

  
    // บันทึกวันที่ปัจจุบันเป็นรอบเดือน
    const newCycleDates = [...cycleDates, todayString];
    setCycleDates(newCycleDates);

    // คำนวณวันที่คาดการณ์ล่วงหน้า 5 วัน
    const newPredictedDates = [];
    for (let i = 1; i <= 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      newPredictedDates.push(nextDate.toISOString().split('T')[0]);
    }
    setPredictedDates(newPredictedDates);
  };

  // เปลี่ยนวันที่ที่เลือก
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    // ถ้ามีข้อมูลอาการในวันนั้น ให้แสดงอาการที่เคยบันทึกไว้
    if (dailySymptoms[newDate]) {
      setSelectedSymptoms(dailySymptoms[newDate]);
    } else {
      setSelectedSymptoms({
        flow: '',
        mood: '',
        symptoms: [],
      });
    }
  };

  // การจัดการฟอร์มอาการ
  const handleSymptomChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'symptoms') {
      if (checked) {
        setSelectedSymptoms({
          ...selectedSymptoms,
          symptoms: [...selectedSymptoms.symptoms, value],
        });
      } else {
        setSelectedSymptoms({
          ...selectedSymptoms,
          symptoms: selectedSymptoms.symptoms.filter((symptom) => symptom !== value),
        });
      }
    } else {
      setSelectedSymptoms({
        ...selectedSymptoms,
        [name]: value,
      });
    }
  };

  // การบันทึกอาการ
  const handleSaveSymptoms = () => {
    const updatedSymptoms = {
      ...dailySymptoms,
      [selectedDate]: selectedSymptoms,
    };
    setDailySymptoms(updatedSymptoms);
    setShowSymptomForm(false);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };
  // ตรวจสอบว่าช่วงวันที่บันทึกหรือไม่
  const isCycleDate = (date) => cycleDates.includes(date);

  // ตรวจสอบว่าช่วงวันที่คาดการณ์หรือไม่
  const isPredictedDate = (date) => predictedDates.includes(date);

  // แสดงวันที่บนปฏิทิน
  const renderCalendar = () => {
    const currentDay = new Date().getDate(); // วันที่ปัจจุบัน
  
    return (
      <div className="calendar-grid">
        {Array.from({ length: 31 }, (_, index) => {
          const day = index + 1; // นับวันตั้งแต่ 1 ถึง 31
          return (
            <div
              key={day}
              className={`calendar-day ${day === currentDay ? 'bg-gray-300' : ''}`} // หากตรงกับวันที่ปัจจุบันให้ใช้ bg-gray-300
            >
              {day}
            </div>
          );
        })}
      </div>
    );
  };


    return (
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-xl"></div>
          <div className="text-xl">ไอคอนเมนู/ปุ่มอื่น ๆ</div>
        </div>


      <div className="mt-5">
        <div className="text-center text-lg font-bold">ประจำเดือนจะมาใน</div>
        <div className="text-center text-6xl font-bold text-pink-500">{nextPeriod} วัน</div>
        <div className="text-center text-sm mt-2">โอกาสตั้งครรภ์น้อย</div>
      </div>

      <h3 className="text-lg font-bold mt-5">ปฏิทินรอบเดือน</h3>
      <div className="mt-5">{renderCalendar()}</div>
 

      {/* เลือกวันที่ */}
      <div className="mt-5">
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </div>

      <div className="mt-5 flex justify-center">
        <SaveButton onCycleDatesChange={handleLogCycle} />
      </div>

      {/* แสดงวันที่รอบเดือน */}
      <div className="mt-10">
        <h3 className="text-lg font-bold">วันที่บันทึกรอบเดือน</h3>
        <ul>
          {cycleDates.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>


      <div className="mt-10">
        <div className="text-lg font-bold">ข้อมูลเชิงลึกประจำวันของฉัน - {selectedDate}</div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>บันทึกอาการของคุณ</div>
              <div
                className="bg-pink-500 text-white rounded-full p-2 cursor-pointer"
                onClick={handleLogSymptoms}
              >
                +
              </div>
            </div>
          </div>

          {/* ข้อมูลเชิงลึก */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div>ข้อมูลเชิงลึกเฉพาะบุคคลสำหรับวันนี้</div>
          </div>
        </div>
      </div>

           {/* Show symptom selection form */}
      {showSymptomForm && (
        <div className="mt-5">
          <h3 className="text-lg font-bold">เลือกอาการที่คุณรู้สึก</h3>

          {/* หมวดหมู่ 1: ปริมาณประจำเดือน */}
          <div className="mt-4">
            <h4 className="font-bold">ปริมาณประจำเดือน</h4>
            <label className="block mt-2">
              <input
                type="radio"
                name="flow"
                value="มามาก"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.flow === 'มามาก'}
                className="mr-2"
              />
              มามาก
            </label>
            <label className="block mt-2">
              <input
                type="radio"
                name="flow"
                value="มาปานกลาง"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.flow === 'มาปานกลาง'}
                className="mr-2"
              />
              มาปานกลาง
            </label>
            <label className="block mt-2">
              <input
                type="radio"
                name="flow"
                value="มาน้อย"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.flow === 'มาน้อย'}
                className="mr-2"
              />
              มาน้อย
            </label>
          </div>

          {/* หมวดหมู่ 2: อารมณ์ */}
          <div className="mt-4">
            <h4 className="font-bold">อารมณ์</h4>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="เงียบสงบ"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('เงียบสงบ')}
                className="mr-2"
              />
              เงียบสงบ
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="มีความสุข"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('มีความสุข')}
                className="mr-2"
              />
              มีความสุข
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="กระปรี้กระเปร่า"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('กระปรี้กระเปร่า')}
                className="mr-2"
              />
              กระปรี้กระเปร่า
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value=" หงุดหงิด"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('หงุดหงิด')}
                className="mr-2"
              />
              หงุดหงิด
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="เศร้า"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('เศร้า')}
                className="mr-2"
              />
              เศร้า
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="กระวนกระวาย"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('กระวนกระวาย')}
                className="mr-2"
              />
              กระวนกระวาย
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="หดหู่"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('หดหู่')}
                className="mr-2"
              />
              หดหู่
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="รู้สึกผิด"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('รู้สึกผิด')}
                className="mr-2"
              />
              รู้สึกผิด
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="ไม่กระตือรือร้น"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('ไม่กระตือรือร้น')}
                className="mr-2"
              />
              ไม่กระตือรือร้น
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="สับสน"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('สับสน')}
                className="mr-2"
              />
              สับสน
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="วิจารณ์ตัวเอง"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('วิจารณ์ตัวเอง')}
                className="mr-2"
              />
              วิจารณ์ตัวเอง
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="mood"
                value="อารมณ์แปรปรวน"
                onChange={handleSymptomChange}
                checked={selectedSymptoms.mood.includes('อารมณ์แปรปรวน')}
                className="mr-2"
              />
              อารมณ์แปรปรวน
            </label>
          </div>

          {/* หมวดหมู่ 3: อาการ */}
          <div className="mt-4">
            <h4 className="font-bold">อาการ</h4>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="ปวดประจำเดือน"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              ปกติทุกอย่าง
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="เจ็บเต้านม"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              ปวดท้องประจำเดือน
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="เจ็บเต้านม"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              เจ็บเต้านม
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="ปวดศีรษะ"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              ปวดศีรษะ
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="อ่อนเพลีย"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              เป็นสิว
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="อ่อนเพลีย"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              ปวดหลัง
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="อ่อนเพลีย"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              อ่อนเพลีย
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="อ่อนเพลีย"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              มีความอยากอาหารสูง
            </label>
            <label className="block mt-2">
              <input
                type="checkbox"
                name="symptoms"
                value="อ่อนเพลีย"
                onChange={handleSymptomChange}
                className="mr-2"
              />
              นอนไม่หลับ
            </label>
          </div>

          <button className="bg-pink-500 text-white py-2 px-4 rounded-full" onClick={handleSaveSymptoms}>
            บันทึกอาการ
          </button>
        </div>
      )}

      {/* สรุปอาการของวันที่ที่เลือก */}
      {dailySymptoms[selectedDate] && (
        <div className="mt-10 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold">สรุปอาการของคุณ</h3>
          <p className="mt-2">ปริมาณประจำเดือน: {dailySymptoms[selectedDate].flow || 'ไม่ได้ระบุ'}</p>
          <p className="mt-2">อารมณ์: {Array.isArray(dailySymptoms[selectedDate].mood) ? dailySymptoms[selectedDate].mood.join(', ') : dailySymptoms[selectedDate].mood || 'ไม่ได้ระบุ'}</p>
          <p className="mt-2">
            อาการ: {dailySymptoms[selectedDate].symptoms.length > 0 ? dailySymptoms[selectedDate].symptoms.join(', ') : 'ไม่ได้ระบุ'}
          </p>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold">บันทึกอาการของคุณแล้ว</h3>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 w-full bg-white p-4 flex justify-between items-center shadow-md">
        <div className="flex flex-col items-center">
          <div>📅</div>
          <div>วันนี้</div>
        </div>
        <div className="flex flex-col items-center">
          <div>📊</div>
          <div>ข้อมูลเชิงลึก</div>
        </div>
        <div className="flex flex-col items-center">
          <div>💬</div>
          <div>ข้อความ</div>
        </div>
        <div className="flex flex-col items-center">
          <div>👫</div>
          <div>คู่รัก</div>
        </div>
      </div>
    </div>
  );
};


export default HomePage;
