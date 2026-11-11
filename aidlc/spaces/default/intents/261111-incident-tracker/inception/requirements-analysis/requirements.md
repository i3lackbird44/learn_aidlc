# Requirements — IT Incident Tracker (Prototype)

## Intent Analysis

องค์กรรับแจ้งปัญหา IT ผ่าน Chat และ Email จนมองไม่เห็นภาพรวมของ Incident, Priority, Status และผู้รับผิดชอบ เป้าหมายคือ Prototype ที่รันบนเครื่องได้ ใช้บันทึกและติดตาม Incident เป็นระบบ เดโม MVP ได้ภายใน 70 นาที และมีผล Test จริงเป็นหลักฐาน (`mission.md`, `success-criteria.md`)

- **ประเภทงาน:** ระบบใหม่ (greenfield), component เดียว (web app ขนาดเล็ก)
- **ความซับซ้อน:** ต่ำ, ความละเอียดเอกสาร Minimal

## Human Decisions (จากคำถาม Q1–Q6)

| # | เรื่อง | การตัดสินใจ | แหล่ง |
|---|-------|-------------|-------|
| D1 | Owner | มีช่อง Owner และแก้ไขภายหลังได้ | Q1 = C |
| D2 | Owner บังคับหรือไม่ | บังคับกรอกตอนสร้าง และห้ามเปลี่ยนเป็นค่าว่าง | Q6 = B |
| D3 | กฎตรวจสอบข้อมูล | Title และ Priority บังคับ, Description ไม่บังคับ, Priority ต้องเป็น Low/Medium/High, แจ้งข้อผิดพลาดใต้ช่องที่ผิด | Q2 = A |
| D4 | เทคโนโลยี | Node.js + Express (REST API) + หน้าเว็บ HTML/JS, test ด้วย Node test runner + supertest | Q3 = A |
| D5 | การเก็บข้อมูล | In-memory (ข้อมูลหายเมื่อรีสตาร์ท) | Q4 = A |
| D6 | การยืนยัน AC | Automated test ต่อ AC บวกทดสอบด้วยมือผ่านหน้าเว็บตาม checklist | Q5 = B |
| D7 | ฟีเจอร์เพิ่มจากขั้นต่ำ | เพิ่ม ลบ Incident, ค้นหา/กรอง, แบ่งหน้า, แก้ไข Title/Description/Priority หลังสร้าง, ประวัติการเปลี่ยนแปลง (audit log), การแจ้งเตือน | คำขอแก้ไขที่จุดอนุมัติครั้งที่ 1 |

## ลำดับความสำคัญ

- **Must (ฟีเจอร์ขั้นต่ำ ทำก่อน):** FR1, FR2, FR3
- **Should (ทำต่อตามลำดับ ถ้าเวลาเหลือ):** FR4 แก้ Owner → FR8 แก้ไขรายละเอียด → FR5 ลบ → FR6 ค้นหา/กรอง → FR7 แบ่งหน้า → FR9 ประวัติ → FR10 การแจ้งเตือน

## Functional Requirements

### FR1 — สร้าง Incident (AC-01, AC-05)

- **FR1.1** ระบบต้องให้ผู้ใช้สร้าง Incident โดยกรอก Title, Description, Priority และ Owner ได้
- **FR1.2** Title ต้องไม่ว่างหลังตัดช่องว่างหัวท้าย ถ้าว่างระบบต้องไม่บันทึกและแสดงข้อความแจ้งใต้ช่อง Title
- **FR1.3** Priority ต้องเป็น `Low`, `Medium` หรือ `High` เท่านั้น ถ้าไม่ได้เลือกหรือเป็นค่าอื่น ระบบต้องไม่บันทึกและแสดงข้อความแจ้งใต้ช่อง Priority
- **FR1.4** Owner ต้องไม่ว่างหลังตัดช่องว่างหัวท้าย ถ้าว่างระบบต้องไม่บันทึกและแสดงข้อความแจ้งใต้ช่อง Owner
- **FR1.5** Description ไม่บังคับ บันทึกเป็นค่าว่างได้
- **FR1.6** Incident ที่สร้างใหม่ต้องมีรหัสไม่ซ้ำ, Status เริ่มต้นเป็น `Open` และเวลาที่สร้าง
- **FR1.7** API ต้องตอบ HTTP 201 พร้อม Incident ที่สร้างเมื่อสำเร็จ และ HTTP 400 พร้อมรายการข้อผิดพลาดแยกตามช่องเมื่อข้อมูลไม่ถูกต้อง

**Acceptance criteria**
- Given ฟอร์มสร้าง Incident, When กรอก Title "Printer ชั้น 3 เสีย", Priority `High`, Owner "สมชาย" แล้วกดบันทึก, Then Incident ปรากฏในรายการด้วย Status `Open`
- Given ฟอร์มสร้าง Incident, When เว้น Title ว่าง (หรือมีแต่ช่องว่าง) แล้วกดบันทึก, Then ไม่มี Incident ใหม่ และมีข้อความแจ้งใต้ช่อง Title
- Given คำขอ API ที่ Priority เป็น `Urgent`, When ส่งคำขอสร้าง, Then ได้ HTTP 400 พร้อมข้อผิดพลาดของช่อง Priority
- Given ฟอร์มสร้าง Incident, When เว้น Owner ว่างแล้วกดบันทึก, Then ไม่มี Incident ใหม่ และมีข้อความแจ้งใต้ช่อง Owner

### FR2 — ดูรายการ Incident (AC-02, AC-04)

- **FR2.1** ระบบต้องแสดงรายการ Incident ทั้งหมดที่สร้างไว้ในการรันครั้งนี้ แต่ละรายการแสดง Title, Description, Priority, Status และ Owner
- **FR2.2** Priority ที่แสดงต้องตรงกับค่าที่บันทึกไว้ทุกรายการ และแยกด้วยสีหรือป้ายกำกับให้เห็นชัด
- **FR2.3** รายการเรียงจาก Incident ใหม่ไปเก่า
- **FR2.4** เมื่อยังไม่มี Incident ระบบต้องแสดงข้อความว่ายังไม่มีรายการ

**Acceptance criteria**
- Given มี Incident 3 รายการที่ Priority ต่างกัน, When เปิดหน้ารายการ, Then เห็นครบ 3 รายการ และ Priority ของแต่ละรายการตรงกับที่สร้าง
- Given ยังไม่มี Incident, When เปิดหน้ารายการ, Then เห็นข้อความว่ายังไม่มีรายการ

### FR3 — ปรับสถานะ Incident (AC-03, AC-05)

- **FR3.1** ผู้ใช้ต้องเปลี่ยน Status ของ Incident เป็น `Open`, `In Progress` หรือ `Resolved` ได้ทุกทิศทาง (ไม่จำกัดลำดับ)
- **FR3.2** ถ้า Status ที่ส่งมาไม่ใช่สามค่านี้ ระบบต้องไม่เปลี่ยนข้อมูลและตอบ HTTP 400 พร้อมข้อความแจ้ง
- **FR3.3** ถ้ารหัส Incident ไม่มีอยู่ ระบบต้องตอบ HTTP 404 พร้อมข้อความแจ้ง

**Acceptance criteria**
- Given Incident ที่ Status `Open`, When เปลี่ยนเป็น `In Progress`, Then รายการแสดง Status `In Progress`
- Given Incident ที่ Status `Resolved`, When เปลี่ยนกลับเป็น `Open`, Then รายการแสดง Status `Open`
- Given คำขอ API เปลี่ยน Status เป็น `Closed`, When ส่งคำขอ, Then ได้ HTTP 400 และ Status เดิมไม่เปลี่ยน

### FR4 — แก้ไข Owner (D1, D2)

- **FR4.1** ผู้ใช้ต้องเปลี่ยน Owner ของ Incident ที่มีอยู่ได้
- **FR4.2** ถ้า Owner ใหม่ว่างหลังตัดช่องว่างหัวท้าย ระบบต้องไม่เปลี่ยนข้อมูลและแสดงข้อความแจ้ง
- **FR4.3** ถ้ารหัส Incident ไม่มีอยู่ ระบบต้องตอบ HTTP 404

**Acceptance criteria**
- Given Incident ที่ Owner "สมชาย", When เปลี่ยน Owner เป็น "สมหญิง", Then รายการแสดง Owner "สมหญิง"
- Given Incident ที่มี Owner, When เปลี่ยน Owner เป็นค่าว่าง, Then Owner เดิมไม่เปลี่ยนและมีข้อความแจ้ง

### FR5 — ลบ Incident (D7)

- **FR5.1** ผู้ใช้ต้องลบ Incident ได้ โดยหน้าเว็บต้องถามยืนยันก่อนลบ
- **FR5.2** เมื่อลบแล้ว Incident ต้องไม่ปรากฏในรายการ ผลการค้นหา หรือการกรองอีก
- **FR5.3** ถ้ารหัส Incident ไม่มีอยู่ ระบบต้องตอบ HTTP 404

**Acceptance criteria**
- Given Incident ในรายการ, When กดลบและยืนยัน, Then Incident หายจากรายการ
- Given Incident ในรายการ, When กดลบแล้วยกเลิกการยืนยัน, Then Incident ยังอยู่
- Given รหัส Incident ที่ไม่มีอยู่, When ส่งคำขอลบ, Then ได้ HTTP 404

### FR6 — ค้นหาและกรอง (D7)

- **FR6.1** ผู้ใช้ต้องค้นหาด้วยคำที่อยู่ใน Title หรือ Description ได้ โดยไม่สนตัวพิมพ์เล็ก/ใหญ่
- **FR6.2** ผู้ใช้ต้องกรองตาม Status และตาม Priority ได้ และใช้ร่วมกับคำค้นหาได้ (ทุกเงื่อนไขต้องตรงพร้อมกัน)
- **FR6.3** ค่ากรอง Status หรือ Priority ที่ไม่ใช่ค่าที่กำหนด ต้องได้ HTTP 400 พร้อมข้อความแจ้ง
- **FR6.4** เมื่อไม่มีรายการตรงเงื่อนไข ต้องแสดงข้อความว่าไม่พบรายการ

**Acceptance criteria**
- Given มี Incident "Printer เสีย" และ "VPN ใช้ไม่ได้", When ค้นหาคำว่า "printer", Then เห็นเฉพาะ "Printer เสีย"
- Given มี Incident Priority `High` 2 รายการและ `Low` 1 รายการ, When กรอง Priority `High`, Then เห็น 2 รายการ
- Given คำขอ API กรอง Status เป็น `Closed`, When ส่งคำขอ, Then ได้ HTTP 400

### FR7 — แบ่งหน้า (D7)

- **FR7.1** รายการแสดงหน้าละ 10 รายการ พร้อมปุ่มหน้าก่อน/ถัดไป และบอกหน้าปัจจุบันกับจำนวนหน้าทั้งหมด
- **FR7.2** การแบ่งหน้าทำหลังค้นหาและกรอง
- **FR7.3** API รับหมายเลขหน้า (เริ่มที่ 1) ถ้าไม่ใช่จำนวนเต็มบวกต้องได้ HTTP 400 ถ้าเกินจำนวนหน้าที่มี ต้องได้รายการว่างพร้อมจำนวนทั้งหมด
- **FR7.4** API ตอบจำนวนรายการทั้งหมดที่ตรงเงื่อนไขมาด้วย

**Acceptance criteria**
- Given มี Incident 12 รายการ, When เปิดหน้า 1, Then เห็น 10 รายการ และหน้า 2 เห็น 2 รายการ
- Given คำขอ API หน้า `0` หรือ `abc`, When ส่งคำขอ, Then ได้ HTTP 400

### FR8 — แก้ไข Title, Description, Priority หลังสร้าง (D7)

- **FR8.1** ผู้ใช้ต้องแก้ไข Title, Description และ Priority ของ Incident ที่มีอยู่ได้
- **FR8.2** ใช้กฎตรวจข้อมูลเดียวกับตอนสร้าง (FR1.2, FR1.3, FR1.5) ถ้าไม่ผ่านต้องไม่เปลี่ยนข้อมูลใดๆ และแสดงข้อความแจ้งใต้ช่องที่ผิด
- **FR8.3** ถ้ารหัส Incident ไม่มีอยู่ ระบบต้องตอบ HTTP 404

**Acceptance criteria**
- Given Incident ที่ Priority `Low`, When แก้เป็น `High`, Then รายการแสดง `High`
- Given Incident ที่มี Title, When แก้ Title เป็นค่าว่าง, Then ข้อมูลเดิมไม่เปลี่ยนและมีข้อความแจ้งใต้ช่อง Title

### FR9 — ประวัติการเปลี่ยนแปลง (audit log) (D7)

- **FR9.1** ทุกครั้งที่สร้าง Incident, เปลี่ยน Status, เปลี่ยน Owner หรือแก้ Title/Description/Priority ระบบต้องบันทึกประวัติ 1 รายการ ประกอบด้วยเวลา, ประเภทการกระทำ, ชื่อช่อง, ค่าเดิม และค่าใหม่
- **FR9.2** ผู้ใช้ต้องเปิดดูประวัติของ Incident แต่ละรายการได้ เรียงจากเก่าไปใหม่
- **FR9.3** การแก้ไขที่ไม่ผ่านการตรวจข้อมูลต้องไม่สร้างประวัติ
- **FR9.4** ผู้ใช้แก้ไขหรือลบประวัติไม่ได้

**Acceptance criteria**
- Given Incident ที่สร้างแล้ว, When เปลี่ยน Status จาก `Open` เป็น `In Progress`, Then ประวัติมี 2 รายการ (สร้าง และเปลี่ยน Status จาก `Open` เป็น `In Progress`)
- Given Incident, When แก้ Priority เป็นค่า `Urgent` แล้วถูกปฏิเสธ, Then จำนวนประวัติไม่เพิ่ม

### FR10 — การแจ้งเตือนในแอป (D7)

- **FR10.1** หลังสร้าง แก้ไข เปลี่ยน Status เปลี่ยน Owner หรือลบสำเร็จ หน้าเว็บต้องแสดงข้อความแจ้งผลชั่วคราว (เช่น "บันทึก Incident แล้ว") และหายไปเองภายใน 5 วินาที
- **FR10.2** เมื่อการกระทำล้มเหลว (ข้อมูลไม่ถูกต้อง หรือ server ตอบผิดพลาด) หน้าเว็บต้องแสดงข้อความแจ้งข้อผิดพลาด
- **FR10.3** เมื่อมี Incident Priority `High` ที่ยังไม่ `Resolved` หน้าเว็บต้องแสดงแถบเตือนพร้อมจำนวนรายการนั้น

**Acceptance criteria**
- Given ฟอร์มสร้าง Incident, When บันทึกสำเร็จ, Then เห็นข้อความแจ้งผลสำเร็จ
- Given มี Incident `High` ที่ `Open` 2 รายการ, When เปิดหน้ารายการ, Then แถบเตือนแสดงจำนวน 2
- Given Incident `High` 1 รายการ, When เปลี่ยนเป็น `Resolved`, Then แถบเตือนหายไป

## Non-Functional Requirements

- **NFR1 — รันบนเครื่อง:** รันด้วยคำสั่ง `npm install` และ `npm start` บนเครื่องที่มี Node.js แล้วเปิดหน้าเว็บที่ `http://localhost:3000` ได้ ไม่ต้องใช้ cloud หรือบริการภายนอก
- **NFR2 — ทดสอบได้:** `npm test` รัน automated test ทั้งหมดได้โดยไม่ต้องตั้งค่าเพิ่ม และมี test อย่างน้อย 1 ข้อต่อ AC-01 ถึง AC-05
- **NFR3 — ความปลอดภัยของข้อมูลที่แสดง:** ข้อความที่ผู้ใช้กรอกต้องแสดงเป็นข้อความธรรมดา ไม่ถูกตีความเป็น HTML (กัน script injection) และตรวจข้อมูลทุกคำขอที่ฝั่ง server ไม่พึ่งการตรวจในเบราว์เซอร์อย่างเดียว
- **NFR4 — การตอบสนอง:** สร้าง ดูรายการ และเปลี่ยนสถานะ ตอบกลับภายใน 500 ms บนเครื่อง local เมื่อมี Incident ไม่เกิน 100 รายการ
- **NFR5 — หลักฐานผลทดสอบ:** ผล automated test และผลทดสอบด้วยมือรายงานเป็น Passed / Failed / Not Run ต่อ AC

## Constraints

- เวลาทั้งหมด 70 นาที
- ใช้ Node.js + Express และ Node test runner + supertest (D4)
- เก็บข้อมูลใน memory เท่านั้น (D5)
- ไม่มี production deployment, enterprise authentication, cloud, external AI API, complex integrations, advanced analytics

## Assumptions

- **A1** ผู้ใช้คือทีม IT ในเครือข่ายเดียวกัน ไม่ต้องมีระบบล็อกอินสำหรับ Prototype นี้ (ตามขอบเขตที่ตัด enterprise auth ออก)
- **A2** ข้อมูลหายเมื่อรีสตาร์ทแอปเป็นที่ยอมรับได้สำหรับการเดโม (D5)
- **A3** Owner เป็นชื่อข้อความอิสระ ไม่ต้องเลือกจากรายชื่อผู้ใช้
- **A4** ใช้ผู้ใช้คนเดียวพร้อมกัน ไม่ต้องจัดการการแก้ไขชนกัน
- **A5** เครื่องที่เดโมติดตั้ง Node.js เวอร์ชัน 18 ขึ้นไปไว้แล้ว
- **A6** "การแจ้งเตือน" หมายถึงการแจ้งเตือนบนหน้าเว็บเท่านั้น ไม่ส่ง Email หรือ Chat เพราะ complex integrations อยู่นอกขอบเขตของ lab (FR10)
- **A7** การลบเป็นการลบจริงจาก memory และประวัติของ Incident นั้นหายไปด้วย (FR5, FR9)
- **A8** ประวัติไม่บันทึกว่าใครเป็นผู้แก้ไข เพราะไม่มีระบบล็อกอิน (FR9, A1)

## Out of Scope

- การเก็บข้อมูลถาวร, ระบบล็อกอิน, การ deploy
- การแจ้งเตือนผ่าน Email, Chat หรือช่องทางภายนอก
- การกู้คืน Incident ที่ลบแล้ว

## Open Questions

- **OQ1** ความเสี่ยงด้านเวลาสูง: ฟีเจอร์เพิ่ม (FR4–FR10) และการทดสอบด้วยมือ (D6) มากกว่าฟีเจอร์ขั้นต่ำหลายเท่าในเวลา 70 นาที แผนคือทำ FR1–FR3 พร้อม automated test ให้เสร็จก่อน แล้วทำ Should ตามลำดับในหัวข้อ "ลำดับความสำคัญ" ฟีเจอร์ที่ทำไม่ทันจะรายงานเป็น Not Run ตามจริง

## Traceability

| Requirement | ที่มา |
|-------------|-------|
| FR1 | AC-01, AC-05, Minimum Feature 1, D2, D3 |
| FR2 | AC-02, AC-04, Minimum Features 2 และ 4 |
| FR3 | AC-03, AC-05, Minimum Feature 3 |
| FR4 | Team Decision Area "Owner", D1, D2 |
| FR5–FR10 | คำขอเพิ่มฟีเจอร์ของทีมที่จุดอนุมัติ (D7) |
| NFR1 | Out of Scope ของ lab (ไม่ใช้ cloud), D4 |
| NFR2, NFR5 | AI-DLC Learning Criteria "รัน Test จริง", D6 |
| NFR3 | Construction guardrail เรื่องตรวจ input ที่ขอบระบบ |
| NFR4 | Definition of Done (เดโม MVP ได้) |
