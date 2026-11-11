# ผลการทดสอบ — IT Incident Tracker

รันเมื่อ 2026-11-11 บนเครื่องนี้ (Windows 11, Node.js v24.21.0) ผลทั้งหมดมาจากการรันจริง

## Build

สำเร็จ: `npm install` เสร็จ ไม่มีขั้นตอน compile (ดู `build-instructions.md`)

## Automated test

คำสั่ง: `npm test` จาก `incident-app/` (ผู้ประสานงานรันซ้ำสองครั้ง ได้ผลเหมือนกัน)

| ไฟล์ | ทั้งหมด | ผ่าน | ล้ม | ข้าม |
|------|---------|------|-----|------|
| `tests/validation.test.js` | 12 | 12 | 0 | 0 |
| `tests/store.test.js` | 5 | 5 | 0 | 0 |
| `tests/service.test.js` | 10 | 10 | 0 | 0 |
| `tests/api.test.js` | 11 | 11 | 0 | 0 |
| `tests/ui.test.js` | 7 | 7 | 0 | 0 |
| **รวม** | **45** | **45** | **0** | **0** |

ไม่มี coverage report (ไม่มีเกณฑ์ coverage ขั้นต่ำสำหรับ express และไม่ได้ติดตั้งเครื่องมือวัด)

ไม่มีชุด test เดิมให้เทียบ (greenfield) จึงไม่มี regression

## ผลต่อ Acceptance Criteria

ผลแยกตามวิธีทดสอบ (D6: automated + ทดสอบด้วยมือ)

| AC | Automated (test จริง) | ทดสอบด้วยมือผ่านเบราว์เซอร์ | สรุป |
|----|----------------------|------------------------------|------|
| AC-01 สร้าง Incident (Title, Description, Priority) | Passed (`AC-01` ใน api.test.js) | Passed: สร้าง "Printer ชั้น 3 เสีย", High, Owner "สมชาย" แล้วเห็นในรายการพร้อม toast | **Passed** |
| AC-02 ดูรายการ | Passed (`AC-02/AC-04`) | Passed: เห็นรายการหลังสร้าง | **Passed** |
| AC-03 ปรับ Status | Passed (`AC-03`) | Passed: เปลี่ยนจาก Open เป็น In Progress แล้วรายการแสดง In Progress | **Passed** |
| AC-04 แสดง Priority ถูกต้อง | Passed (`AC-02/AC-04`) | Passed: แสดงป้าย High ตรงกับที่เลือก | **Passed** |
| AC-05 ข้อมูลไม่ครบได้ feedback | Passed (`AC-05` สองข้อ) | Passed: กดบันทึกโดยไม่กรอก ได้ข้อความใต้ช่อง Title, Priority, Owner | **Passed** |

หมายเหตุขอบเขตของการทดสอบด้วยมือ: ทดสอบเส้นทางหลักของแต่ละ AC หนึ่งรอบด้วยเบราว์เซอร์ในตัวของแอป (viewport 487x534) โดยผู้ประสานงานเอง ไม่ใช่ทีม ยังไม่ได้ลองใน Chrome/Edge เต็มหน้าจอ และยังไม่ได้ทดสอบด้วยมือสำหรับฟีเจอร์เพิ่ม FR4–FR10 (ลบ ค้นหา/กรอง แบ่งหน้า แก้ไข ประวัติ แถบเตือน) ฟีเจอร์เหล่านั้นมีเฉพาะ automated test ที่ผ่าน ส่วนโค้ดหน้าเว็บ `public/app.js` ไม่มี automated test

## เวลาตอบสนอง (NFR4)

วัดด้วย API จริงในโปรเซสเดียวกับเซิร์ฟเวอร์ หลังสร้าง Incident 100 รายการ:

| การเรียก | HTTP | เวลา |
|----------|------|------|
| POST สร้าง | 201 | 0.9 ms |
| GET รายการ (หน้า 1) | 200 | 4.9 ms |
| PATCH เปลี่ยน Status | 200 | 2.5 ms |
| GET ค้นหา+กรอง | 200 | 1.1 ms |

เกณฑ์คือไม่เกิน 500 ms บนเครื่อง local: ผ่าน ข้อจำกัด: วัดการเรียกละหนึ่งครั้ง ไม่ได้วัดภายใต้โหลดหรือผ่านเบราว์เซอร์

## สิ่งที่ไม่ได้ทำ

- Integration, performance (load), security test แยกต่างหาก: ไม่ได้สร้างตามกลยุทธ์ Minimal และงานนี้ไม่มี NFR ระดับ load หรือ security ที่วัดได้นอกจาก NFR3 ซึ่งมี test ครอบคลุมแล้ว
- ไม่มี Loop-Back Log เพราะไม่มีความล้มเหลวที่ต้องวนกลับ
