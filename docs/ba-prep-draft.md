# BA Prep — Draft Answers for AI-DLC Step 02–03

> **ร่างสำหรับเตรียมตัวเท่านั้น** ยังไม่ใช่ Human Decision จนกว่าทีมตรวจและยืนยัน
> ใช้เป็นแนวตอบคำถามของ AI ใน `/aidlc` อย่าคัดลอกไปบันทึกใน Decision Log จนกว่าจะตัดสินใจจริง

## 1. Problem Statement (ร่าง)
องค์กรรับแจ้งปัญหา IT ผ่าน Chat และ Email ทำให้มองไม่เห็นภาพรวมของ Incident, Priority, Status และผู้รับผิดชอบ
ต้องการ Prototype ที่รวมศูนย์การบันทึกและติดตาม Incident

## 2. ผู้ใช้ (ร่าง)
- **IT Support / Helpdesk:** บันทึก Incident และปรับสถานะ
- **หัวหน้าทีม IT:** ดูภาพรวมรายการและ Priority

## 3. Incident Fields (ร่าง)
| Field | Required | หมายเหตุ |
|---|---|---|
| Title | ใช่ | ข้อความสั้น กำหนดความยาวสูงสุด |
| Description | ใช่ | รายละเอียดปัญหา |
| Priority | ใช่ | Low / Medium / High |
| Status | อัตโนมัติ | Open / In Progress / Resolved (เริ่มที่ Open) |
| Created At | อัตโนมัติ | ระบบใส่ให้ |
| Owner | **ไม่บังคับ / นอก MVP** | เป็นหัวข้อให้ทีมตัดสินใจ |

## 4. MVP vs Later
- **MVP:** Create, View List, Update Status, แสดง Priority
- **Later:** Owner, Filter/Search, Edit/Delete, Dashboard, Login

## 5. คำถามที่ BA ควรเตรียมให้ทีมตัดสิน (Decision Areas จาก Mission)
1. **เก็บข้อมูลที่ไหน?** Memory (ง่ายสุด แต่หายเมื่อ Restart) / Local File (JSON) / SQLite
   - ข้อเสนอเริ่มต้น: Local File หรือ SQLite หากต้องการให้ข้อมูลอยู่หลัง Restart
2. **ป้องกันข้อมูลไม่ครบอย่างไร?** Validate ฝั่ง UI และฝั่ง Logic ให้ข้อความ Error ชัดเจน
3. **ต้องมี Owner ไหม?** เสี่ยงทำให้ MVP ช้า แนะนำเลื่อนไปหลัง MVP
4. **ยืนยัน Acceptance Criteria อย่างไร?** ให้ทุกข้อมี Test อย่างน้อย 1 รายการ และรันจริง

## 6. Acceptance Criteria (อ้างอิง [success-criteria.md](../success-criteria.md))
| ID | เกณฑ์ | วิธีตรวจ (ร่าง) |
|---|---|---|
| AC-01 | สร้าง Incident ได้ด้วย Title, Description, Priority | กรอกครบแล้วบันทึก ต้องปรากฏในรายการ |
| AC-02 | เปิดดูรายการ Incident ได้ | หลังสร้าง เปิดรายการแล้วเห็นข้อมูล |
| AC-03 | ปรับสถานะ Open / In Progress / Resolved ได้ | เปลี่ยนสถานะแล้วรายการแสดงค่าใหม่ |
| AC-04 | รายการแสดง Priority ถูกต้อง | Priority ที่แสดงตรงกับที่กรอก |
| AC-05 | Input ไม่ครบ/ไม่ถูกต้องมี Feedback | เว้น Title/Description หรือเลือก Priority ไม่ถูกต้อง ต้องไม่บันทึกและมีข้อความแจ้ง |

## 7. Decision Log — ตัวอย่างหัวข้อที่น่าบันทึก (ยังไม่ตัดสิน)
- Data storage: Memory vs File vs SQLite
- Owner: ใส่ใน MVP หรือเลื่อน
- (ทางเลือก) UI: Web vs CLI

## 8. ก่อน Park เพื่อส่งต่อ Developer
- [ ] จบ Stage Requirements Analysis และ PO ตรวจ AC แล้ว
- [ ] บันทึก Human Decisions อย่างน้อย 2 ข้อ
- [ ] สั่ง `/aidlc park`
- [ ] กรอก [handover.md](../templates/handover.md) แล้ว commit + PR
