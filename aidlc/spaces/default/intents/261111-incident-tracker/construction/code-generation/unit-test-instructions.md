# วิธีรัน Unit Test — IT Incident Tracker

## การตั้งค่า test framework

- ใช้ Node test runner ในตัว (`node:test`, `node:assert/strict`) กับ Node.js 18 ขึ้นไป ไม่ต้องมีไฟล์ config
- API test ใช้ `supertest` (devDependency) ยิงคำขอเข้า `createApp()` โดยตรง ไม่ต้องเปิด port
- ติดตั้งครั้งแรก (จากโฟลเดอร์ `incident-app/`):

```bash
cd incident-app && npm install
```

## คำสั่งรัน test ของงานนี้ (รายไฟล์)

รันจากโฟลเดอร์ `incident-app/` ทุกคำสั่งระบุไฟล์ test ตรงตัว:

```bash
node --test tests/validation.test.js
node --test tests/store.test.js
node --test tests/service.test.js
node --test tests/api.test.js
node --test tests/ui.test.js
```

รันทั้งห้าไฟล์ของงานนี้พร้อมกัน:

```bash
node --test tests/validation.test.js tests/store.test.js tests/service.test.js tests/api.test.js tests/ui.test.js
```

คำสั่งแรกที่ต้องรันได้ก่อนเขียน test ชั้นแรก (Step 2 ของแผน): `node --test tests/validation.test.js`

## ขอบเขต test (Minimal strategy)

- อย่างน้อย 1 test ต่อ requirement (FR1–FR10, NFR3) และอย่างน้อย 1 happy-path ต่อ component (validation, store, service, app, ui)
- แต่ละไฟล์ต้องมี happy path และกรณีผิดพลาด/ขอบอย่างน้อย 2 กรณี
- รวมประมาณ 25 test
- ไม่มีเกณฑ์ coverage ขั้นต่ำสำหรับ express ไม่ลดหรือปิดเกณฑ์ใดๆ เพื่อให้ test ผ่าน

## การ mock และ stub

- ไม่ต้อง mock: ที่เก็บข้อมูลอยู่ใน memory สร้างใหม่ด้วย `createStore()` ทุก test เพื่อไม่ให้ข้อมูลข้าม test
- API test สร้าง app ใหม่ต่อ test ด้วย `createApp({ store: createStore() })`
- `public/ui.js` export ฟังก์ชันผ่าน `module.exports` เมื่อรันใน Node จึง test ได้โดยไม่ต้องใช้เบราว์เซอร์

## ข้อมูลทดสอบ

- สร้างข้อมูลในแต่ละ test เอง เช่น `{ title: 'Printer ชั้น 3 เสีย', description: 'พิมพ์ไม่ออก', priority: 'High', owner: 'สมชาย' }`
- test แบ่งหน้าสร้าง 12 รายการในลูป
- ไม่มีไฟล์ข้อมูลภายนอก ไม่มี secret

## การทดสอบด้วยมือ (D6)

checklist AC-01 ถึง AC-05 อยู่ใน `incident-app/README.md` ทำหลัง automated test ผ่าน และบันทึกผลเป็น Passed / Failed / Not Run ในขั้น Build and Test
