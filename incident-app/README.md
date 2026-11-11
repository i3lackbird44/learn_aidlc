# IT Incident Tracker (Prototype)

เว็บแอปสำหรับบันทึกและติดตาม Incident ของทีม IT: สร้าง ดู ค้นหา/กรอง แบ่งหน้า แก้ไข เปลี่ยน Status/Owner ลบ ดูประวัติ และเห็นแถบเตือนเมื่อมี Incident Priority High ที่ยังไม่ Resolved

## สิ่งที่ต้องมี

- Node.js 18 ขึ้นไป (ทดสอบกับ v24)

## ติดตั้งและรัน

```bash
cd incident-app
npm install
npm start
```

เปิดเบราว์เซอร์ที่ http://localhost:3000 (เปลี่ยนพอร์ตด้วยตัวแปร environment `PORT` เช่น `PORT=4000 npm start`)

## รัน automated test

```bash
npm test
```

หรือรันทีละไฟล์:

```bash
node --test tests/validation.test.js
node --test tests/store.test.js
node --test tests/service.test.js
node --test tests/api.test.js
node --test tests/ui.test.js
```

หมายเหตุ: `npm test` ระบุไฟล์ทั้งห้าตรงตัว เพราะ Node v24 ไม่รับชื่อโฟลเดอร์ (`node --test tests/`) แบบเวอร์ชันเก่า

## REST API

| Method | Path | ความหมาย |
|--------|------|----------|
| POST | `/api/incidents` | สร้าง (201 / 400) |
| GET | `/api/incidents?q=&status=&priority=&page=` | รายการ ค้นหา กรอง แบ่งหน้าละ 10 |
| PATCH | `/api/incidents/:id` | แก้ Title/Description/Priority |
| PATCH | `/api/incidents/:id/status` | เปลี่ยน Status |
| PATCH | `/api/incidents/:id/owner` | เปลี่ยน Owner |
| DELETE | `/api/incidents/:id` | ลบ (204 / 404) |
| GET | `/api/incidents/:id/history` | ประวัติการเปลี่ยนแปลง |
| GET | `/api/alerts` | จำนวน High ที่ยังไม่ Resolved |

ข้อผิดพลาดตอบรูปแบบ `{ "error": "...", "fields": { "<ช่อง>": "..." } }`

## Checklist ทดสอบด้วยมือ (D6)

ทำหลัง `npm test` ผ่าน แล้วบันทึกผลเป็น Passed / Failed / Not Run ต่อข้อ

- [ ] **AC-01 สร้าง Incident:** กรอก Title "Printer ชั้น 3 เสีย", Priority High, Owner "สมชาย" แล้วกดบันทึก — Incident ปรากฏในรายการด้วย Status Open และมีข้อความแจ้งผลสำเร็จที่หายเองใน 5 วินาที
- [ ] **AC-02 ดูรายการ:** สร้าง Incident 3 รายการที่ Priority ต่างกัน — เห็นครบ 3 รายการ เรียงใหม่ไปเก่า
- [ ] **AC-03 ปรับสถานะ:** เปลี่ยน Status จาก Open เป็น In Progress แล้วเป็น Resolved และกลับเป็น Open — รายการแสดง Status ตามที่เลือกทุกครั้ง และแถบเตือน High ลดลงเมื่อ Resolved
- [ ] **AC-04 Priority ตรงกับที่สร้าง:** ตรวจป้ายสี Priority (Low เขียว, Medium เหลือง, High แดง) ของทุกรายการตรงกับที่กรอก
- [ ] **AC-05 ตรวจข้อมูล:** กดบันทึกโดยเว้น Title (หรือใส่แต่ช่องว่าง) เว้น Owner หรือไม่เลือก Priority — ไม่มี Incident ใหม่ และมีข้อความแจ้งใต้ช่องที่ผิด

ตรวจเพิ่มเติม (ฟีเจอร์ FR4-FR10): แก้ Owner/รายละเอียด, ลบ (ทั้งยืนยันและยกเลิก), ค้นหา/กรอง, สร้าง 12 รายการแล้วดูหน้า 1-2, ปุ่มดูประวัติ

## ข้อจำกัด

- ข้อมูลเก็บใน memory เท่านั้น หายเมื่อรีสตาร์ทแอป (A2)
- ไม่มีระบบล็อกอิน และประวัติไม่บันทึกว่าใครเป็นผู้แก้ (A1, A8)
- การแจ้งเตือนมีเฉพาะบนหน้าเว็บ ไม่ส่ง Email หรือ Chat (A6)
- รองรับผู้ใช้คนเดียวพร้อมกัน ไม่จัดการการแก้ไขชนกัน (A4)
