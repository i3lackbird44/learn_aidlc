# สรุป Code Generation — IT Incident Tracker

## ไฟล์ที่สร้าง

ทั้งหมดอยู่ใน `incident-app/` (ยังไม่ได้ commit)

| กลุ่ม | ไฟล์ |
|-------|------|
| ตั้งค่า | `package.json`, `package-lock.json`, `.gitignore`, `README.md` |
| ฝั่ง server | `src/validation.js`, `src/store.js`, `src/service.js`, `src/app.js`, `src/server.js` |
| หน้าเว็บ | `public/index.html`, `public/ui.js`, `public/app.js`, `public/styles.css` |
| test | `tests/validation.test.js`, `tests/store.test.js`, `tests/service.test.js`, `tests/api.test.js`, `tests/ui.test.js` |

## การตัดสินใจสำคัญ

- ตัวตรวจข้อมูลคืน `{ value, errors }` ส่วน service โยน `ValidationError` หรือ `NotFoundError` และ API แปลงเป็น 400 หรือ 404 ในรูป `{ error, fields }` JSON ที่อ่านไม่ได้ได้ 400, body เกิน 10kb ได้ 413, ข้อผิดพลาดอื่นได้ 500 และถูก log
- การแก้ Title/Description/Priority บันทึกประวัติหนึ่งรายการต่อช่องที่เปลี่ยนจริง และบันทึกเฉพาะเมื่อสำเร็จ
- ที่เก็บข้อมูลคืนสำเนา ลบ Incident แล้วประวัติหายด้วย รายการเรียงใหม่ไปเก่าจากลำดับการเพิ่ม เพราะเวลาอาจซ้ำภายในมิลลิวินาทีเดียวกัน
- หน้าเว็บไม่ใช้ `innerHTML`, `eval`, `document.write` และมี test ตรวจซอร์สไฟล์ (NFR3)
- เพิ่มจากแผน: หน้าถอยกลับเมื่อลบรายการสุดท้ายของหน้า, หน่วงการค้นหา 250 ms, จำกัดความยาว Title 200 / Description 2000 / Owner 100

## สรุปผลทดสอบ

รันซ้ำโดยผู้ประสานงานด้วย `npm test` จาก `incident-app/`: 45 test ผ่านทั้งหมด ไม่ล้มเหลว ไม่ข้าม

| ไฟล์ test | จำนวน | ผ่าน |
|-----------|-------|------|
| `tests/validation.test.js` | 12 | 12 |
| `tests/store.test.js` | 5 | 5 |
| `tests/service.test.js` | 10 | 10 |
| `tests/api.test.js` | 11 | 11 |
| `tests/ui.test.js` | 7 | 7 |

มีเส้นทางหลัก (GET `/`, GET `/ui.js`, POST `/api/incidents`) ที่ทดสอบเปิดเซิร์ฟเวอร์จริงบนพอร์ตชั่วคราวหนึ่งครั้ง ได้ 200, 200 และ 201

## เขียนแล้วแต่ยังไม่ได้รัน

- checklist ทดสอบด้วยมือ AC-01 ถึง AC-05 ใน `README.md` ยังไม่มีใครรันในเบราว์เซอร์ จึงเป็น Not Run
- การวัดเวลาตอบสนอง NFR4 (500 ms) ยังไม่ได้วัด
- `public/app.js` ไม่มี automated test นอกจากตัวช่วยใน `public/ui.js`

## ส่วนที่ต่างจากแผน

สคริปต์ `test` ในแผนคือ `node --test tests/` แต่ใน Node v24 คำสั่งนี้ล้มด้วย "Cannot find module" จึงเปลี่ยนเป็นระบุไฟล์ test ทั้งห้าตรงๆ ใน `package.json` และบันทึกเหตุผลไว้ใน `README.md`
