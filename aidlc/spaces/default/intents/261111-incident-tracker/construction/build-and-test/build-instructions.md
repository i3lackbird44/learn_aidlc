# Build Instructions — IT Incident Tracker

## ข้อกำหนดเบื้องต้น

- Node.js 18 ขึ้นไป (เครื่องนี้ใช้ v24.21.0) และ npm (v11.19.0)
- ไม่ต้องมีบริการภายนอก ไม่ต้องมี cloud ข้อมูลเก็บใน memory

## ติดตั้ง

```bash
cd incident-app
npm install
```

ติดตั้ง `express` (runtime) และ `supertest` (สำหรับ test)

## ตัวแปรสภาพแวดล้อม

- `PORT` (ไม่บังคับ) ค่าเริ่มต้น `3000`
- ไม่มี secret หรือ API key

## Build

ไม่มีขั้นตอน compile หรือ bundle เพราะเป็น JavaScript (CommonJS) รันตรง

## ตรวจว่า build ใช้ได้

```bash
npm test
```

ต้องได้ `pass 45` และ `fail 0` จากนั้นรัน `npm start` แล้วเปิด `http://localhost:3000` ต้องเห็นหน้า "IT Incident Tracker"

## แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| `node --test tests/` ล้มด้วย "Cannot find module" | Node v24 ตีความโฟลเดอร์เป็นโมดูล | ใช้ `npm test` ซึ่งระบุไฟล์ test ทั้งห้าตรงๆ |
| พอร์ต 3000 ถูกใช้อยู่ | มีโปรแกรมอื่นใช้พอร์ต | ตั้ง `PORT` เป็นค่าอื่น เช่น `PORT=3917 npm start` |
| ข้อมูลหายหลังรีสตาร์ท | เก็บใน memory ตามที่ตัดสินใจไว้ (D5) | เป็นพฤติกรรมที่ตั้งใจ |
