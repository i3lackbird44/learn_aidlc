# Requirements Analysis — คำถามเพื่อความชัดเจน

งาน: Prototype แอป IT Incident Management (express, ความละเอียดแบบ Minimal, เวลา 70 นาที)

ฟีเจอร์ขั้นต่ำและ AC-01 ถึง AC-05 ชัดเจนแล้วจาก `mission.md` และ `success-criteria.md` คำถามด้านล่างจึงเหลือเฉพาะเรื่องที่โจทย์ให้ทีมตัดสินใจเอง คำตอบแต่ละข้อจะถูกบันทึกเป็น Human Decision

## Q1. [Product] จะมีช่อง Owner (ผู้รับผิดชอบ) ใน Incident หรือไม่

โจทย์ระบุว่าปัญหาคือมองไม่เห็นผู้รับผิดชอบ แต่ Owner ไม่อยู่ในฟีเจอร์ขั้นต่ำ ถ้าเพิ่มจะใช้เวลาเพิ่มเล็กน้อย

A. ไม่มี Owner ทำเฉพาะฟีเจอร์ขั้นต่ำให้เสร็จก่อน (แนะนำ เพราะเวลาจำกัด 70 นาที)
B. มี Owner เป็นช่องข้อความอิสระ (ไม่บังคับกรอก) ตอนสร้าง Incident
C. มี Owner และแก้ไข Owner ภายหลังได้
X. Other (please specify)

[Answer]: C

## Q2. [Product] กฎตรวจสอบข้อมูลเมื่อสร้าง Incident ควรเข้มแค่ไหน

ใช้กำหนดว่า "ข้อมูลไม่ครบหรือไม่ถูกต้อง" (AC-05) หมายถึงอะไร และต้องแจ้งผู้ใช้อย่างไร

A. Title และ Priority บังคับกรอก, Description ไม่บังคับ, Priority ต้องเป็น Low/Medium/High เท่านั้น และแสดงข้อความแจ้งข้อผิดพลาดใต้ช่องที่ผิด
B. Title, Description และ Priority บังคับกรอกทั้งหมด, ตัดช่องว่างหัวท้ายก่อนตรวจ, จำกัด Title ไม่เกิน 100 ตัวอักษร, แสดงข้อความแจ้งข้อผิดพลาดและไม่บันทึก (แนะนำ ตรงกับ AC-01 ที่ระบุทั้งสามช่อง)
C. บังคับครบทั้งสามช่องเท่านั้น ไม่มีกฎความยาว
X. Other (please specify)

[Answer]: A

## Q3. [Developer] รูปแบบแอปและเทคโนโลยี

ต้องทำงานบนเครื่องได้เลย ไม่ใช้ cloud และต้องเขียน test อัตโนมัติได้ทันในเวลา

A. Web app: Node.js + Express (REST API) กับหน้าเว็บ HTML/JS ธรรมดา, test ด้วย Node test runner + supertest (แนะนำ ติดตั้งน้อย เดโมผ่านเบราว์เซอร์ได้)
B. Web app: Python + Flask กับหน้าเว็บ HTML template, test ด้วย pytest
C. แอปบรรทัดคำสั่ง (CLI) ด้วย Python, test ด้วย pytest
D. Single-page app ฝั่งเบราว์เซอร์อย่างเดียว (ไม่มี server) เก็บใน localStorage
X. Other (please specify)

[Answer]: A

## Q4. [Developer] เก็บข้อมูล Incident ไว้ที่ไหน

โจทย์ให้เลือกระหว่าง Memory, Local File หรือ Lightweight Database

A. In-memory: เร็วที่สุด แต่ข้อมูลหายเมื่อรีสตาร์ทแอป
B. Local JSON file: ข้อมูลอยู่รอดหลังรีสตาร์ท ไม่ต้องติดตั้งอะไรเพิ่ม (แนะนำ สมดุลระหว่างเวลาและความน่าเชื่อถือในการเดโม)
C. SQLite: เป็นฐานข้อมูลจริง แต่ต้องติดตั้ง library และใช้เวลาตั้งค่าเพิ่ม
X. Other (please specify)

[Answer]: A

## Q5. [Quality] ทีมจะยืนยัน Acceptance Criteria อย่างไร

ใช้กำหนดหลักฐาน "รัน Test จริงและแสดงผล Passed/Failed/Not Run"

A. Automated test อย่างน้อย 1 ข้อต่อ AC (AC-01 ถึง AC-05) ที่ระดับ API/logic และรายงานผล Passed/Failed/Not Run ต่อ AC (แนะนำ)
B. Automated test ตามข้อ A บวกกับทีมทดสอบด้วยมือผ่านหน้าเว็บตาม checklist ของ AC แล้วบันทึกผล
C. ทดสอบด้วยมือตาม checklist อย่างเดียว
X. Other (please specify)

[Answer]: B

## Q6. [Product] ต้องกรอก Owner ตอนสร้าง Incident หรือไม่

คำถามต่อจาก Q1: คุณเลือกให้มี Owner และแก้ไขภายหลังได้ แต่ยังไม่ได้ระบุว่าบังคับกรอกหรือไม่ ซึ่งมีผลต่อกฎตรวจสอบข้อมูล (AC-05)

A. ไม่บังคับ เว้นว่างได้ (แสดงเป็น "ยังไม่มอบหมาย") และกำหนด/เปลี่ยน Owner ภายหลังได้ (แนะนำ สอดคล้องกับการแจ้งปัญหาที่มักยังไม่มีผู้รับผิดชอบ)
B. บังคับกรอกตอนสร้าง และเปลี่ยนภายหลังได้แต่ห้ามเว้นว่าง
X. Other (please specify)

[Answer]: B
