# Mission — Build an IT Incident Management Application

## Business Scenario
องค์กรรับแจ้งปัญหาด้าน IT ผ่าน Chat และ Email จนไม่สามารถเห็นภาพรวม Incident, Priority, Status และผู้รับผิดชอบได้ชัดเจน สมาชิกทีมต้องร่วมกันพัฒนา Prototype ที่ช่วยติดตาม Incident อย่างเป็นระบบ

## Your Challenge
ใช้ AI-DLC ทำความเข้าใจปัญหา รวบรวม Requirements เลือก Architecture พัฒนาและทดสอบ Application ภายใน 70 นาที

## Minimum Expected Features
1. **Create Incident:** ระบุ Title, Description, Priority
2. **View Incident List:** เห็น Incident ที่บันทึกไว้
3. **Update Status:** Open / In Progress / Resolved
4. **View Priority:** Low / Medium / High

## Team Decision Areas
- ข้อมูลควรเก็บใน Memory, Local File หรือ Lightweight Database?
- จะป้องกันการกรอกข้อมูลไม่ครบอย่างไร?
- ต้องแสดง Owner หรือไม่? หากเลือกเพิ่ม จะไม่ทำให้ MVP ช้าหรือไม่?
- ทีมจะยืนยัน Acceptance Criteria อย่างไร?

## Out of Scope (for this lab)
Production deployment, enterprise authentication, cloud infrastructure, external AI API, complex integrations และ advanced analytics ไม่ใช่ข้อบังคับ

## Expected Outcomes
Working Prototype หรือความคืบหน้าที่อธิบายได้ พร้อมหลักฐาน AI-DLC Workflow, Test Results และ Human Decisions

**เริ่มที่:** [Step 01](steps/01-environment-setup.md)
