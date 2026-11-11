# สรุป Build and Test — IT Incident Tracker

## สถานะ Build และข้อกำหนดเบื้องต้น

- Build: สำเร็จ (`npm install`, ไม่มีขั้นตอน compile)
- ต้องมี Node.js 18 ขึ้นไป รายละเอียดใน `build-instructions.md`

## ประเภท test ที่มี

กลยุทธ์ Minimal: unit และ API test ที่สร้างไว้ในขั้น Code Generation (45 test) ไม่สร้างไฟล์คำสั่ง integration, performance, security เพิ่ม ตามกลยุทธ์

## Coverage ที่คาดหวัง

ไม่มีเกณฑ์ coverage ขั้นต่ำสำหรับ scope express (Testing Contract: อย่างน้อยหนึ่ง test ต่อ requirement และหนึ่ง happy-path ต่อ component) ไม่ได้วัดเปอร์เซ็นต์ coverage

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|-----------|--------|----------|--------|----------|--------------|---------|
| TC-1 | Testing Contract: strategy_volume | อย่างน้อยหนึ่ง test ต่อ requirement | มี test ครอบคลุม FR1–FR10 และ NFR3 (ชื่อ test อ้าง FR/AC) | `npm test`: 45 test, รายชื่อใน `tests/` | build-and-test | Met |
| TC-2 | Testing Contract: strategy_volume | อย่างน้อยหนึ่ง happy-path ต่อ component | validation, store, service, app (API), ui helper มี happy-path ครบ | `tests/*.test.js` | build-and-test | Met |
| TC-3 | Testing Contract: scope_floor | ชุด test เดิมต้องผ่าน | ไม่มีชุด test เดิม (greenfield), ชุดใหม่ผ่านทั้งหมด | `npm test`: pass 45, fail 0 | build-and-test | Met |
| TC-4 | Testing Contract: CI obligation | รัน test ใน CI ก่อน merge | ไม่ใช้ | แผน express ไม่มี CI Pipeline | build-and-test | N/A |
| NFR1 | requirements.md | `npm install` + `npm start` เปิดที่ localhost:3000 | เปิดและใช้งานได้ที่ `http://localhost:3000` | เซิร์ฟเวอร์รันและเบราว์เซอร์เปิดหน้าได้ | build-and-test | Met |
| NFR2 | requirements.md | `npm test` รันได้ มี test อย่างน้อยหนึ่งข้อต่อ AC-01–AC-05 | รันได้ มี test ชื่อ AC-01..AC-05 | `npm test` | build-and-test | Met |
| NFR3 | requirements.md | แสดงข้อความด้วย textContent และตรวจที่ server | มี test ยืนยัน `<script>` เป็นข้อความธรรมดา และไม่พบ innerHTML ในหน้าเว็บ | `tests/ui.test.js`, `tests/api.test.js` | build-and-test | Met |
| NFR4 | requirements.md | ตอบภายใน 500 ms เมื่อมี Incident ไม่เกิน 100 รายการ | 0.9–4.9 ms | ตารางเวลาใน `test-results.md` | build-and-test | Met |
| NFR5 | requirements.md | รายงาน Passed/Failed/Not Run ต่อ AC | รายงานครบ AC-01..AC-05 | ตารางผลต่อ AC ใน `test-results.md` | build-and-test | Met |

## ความพร้อม

- Build-ready: ใช่
- Test-ready: ใช่ (45 จาก 45 ผ่าน)
- Deployment-ready: ไม่ได้ประเมินและไม่ใช่เป้าหมายของ lab นี้ (ไม่มี production deployment)

## ข้อจำกัดและรายการค้าง

- ทดสอบด้วยมือแล้วเฉพาะเส้นทางหลักของ AC-01 ถึง AC-05 โดยผู้ประสานงานด้วยเบราว์เซอร์ในตัวหนึ่งรอบ ทีมยังไม่ได้ตรวจเอง
- ฟีเจอร์เพิ่ม FR4–FR10 มีเฉพาะ automated test ยังไม่ได้ทดสอบด้วยมือ และ `public/app.js` ไม่มี automated test
- เวลาตอบสนองวัดการเรียกละหนึ่งครั้ง ไม่ได้วัดภายใต้โหลด
- ข้อมูลอยู่ใน memory หายเมื่อรีสตาร์ท และไม่มีระบบล็อกอิน (ตามขอบเขต)
- ตัวตรวจ traceability ของ Code Generation ระบุ NFR4 และ NFR5 เป็น Deferred จึงรายงาน `pass: false` ในขั้นนี้ ดู `cross-unit-traceability.md`
