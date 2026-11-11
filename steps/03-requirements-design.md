# Step 03 — Requirements & Design (20–35 min)

## Objective
แปลง MVP เป็น Acceptance Criteria, Solution Design และ Implementation Plan

## Instructions
1. ให้ AI-DLC สรุป Functional Requirements จากคำตอบใน Step 02
2. ตรวจสอบกับ [Success Criteria](../success-criteria.md)
3. ให้ AI เสนอ Technology Stack ที่ง่ายที่สุดสำหรับ Prototype
4. ให้ SA ถามเรื่อง Data Persistence, API/UI, Trade-offs และ Dependencies
5. ให้ทีมยืนยัน Design และ Plan ก่อนให้ AI สร้าง Code

## Example Prompt
> จาก Requirements ที่ทีมยืนยัน ช่วยเสนอ Architecture และ Implementation Plan สำหรับ Prototype ที่เสร็จได้ภายในเวลา Workshop อธิบาย Trade-offs และขอการยืนยันจากทีมก่อนเขียน Code

## Questions for the Team
- Web UI จำเป็นหรือ CLI เพียงพอ? (Mission ต้อง Demo ได้)
- จะเก็บข้อมูลที่ไหน และข้อจำกัดคืออะไร?
- อะไรอาจทำให้ Dependency/Setup ใช้เวลานาน?
- จะทดสอบแต่ละ Acceptance Criteria อย่างไร?

## Expected Output
Reviewed Requirements, Acceptance Criteria, Design Decision และ Implementation Plan

## Checkpoint
- [ ] ทีมเห็นชอบ Requirements
- [ ] ทีมเลือก Stack และ Data Strategy
- [ ] มี Plan ที่จัดลำดับ MVP ก่อน Feature เพิ่ม
- [ ] บันทึกการตัดสินใจใน Decision Log

**Next:** [Step 04](04-implementation.md)
