# Step 05 — Testing & Validation (55–65 min)

## Objective
ยืนยันผลการทำงานกับ Acceptance Criteria อย่างตรงไปตรงมา

## Instructions
1. ให้ AI เสนอ Test Scenarios จาก Requirements
2. ให้ QA/DevOps เลือกอย่างน้อย 3 กรณี
3. รัน Test จริงและบันทึก Passed/Failed/Not Run
4. ตรวจสอบความถูกต้องของ State และ User Input
5. แก้ Critical Defect ก่อน และบันทึก Known Limitations

## Suggested Tests
| Case | Action | Expected Result |
|---|---|---|
| T1 | สร้าง Incident ถูกต้อง | ปรากฏในรายการ |
| T2 | เปลี่ยนสถานะ Incident | สถานะปรับตามที่เลือก |
| T3 | ส่งข้อมูลไม่ครบ | แสดงข้อความแจ้งข้อผิดพลาด |
| T4 | เปลี่ยน Priority | แสดง Priority ที่เลือก |
| T5 | Restart App | ผลเป็นไปตาม Persistence ที่ทีมออกแบบ |

## Example Prompt
> ช่วยสร้าง Test Cases ตาม Acceptance Criteria และช่วยรันทดสอบใน Environment นี้ สรุปสิ่งที่ทดสอบจริงพร้อมผล Passed/Failed/Not Run และข้อจำกัด ห้ามสรุปว่าผ่านถ้าไม่ได้รัน

## Expected Output
Test Results + Known Limitations + Fixes (ถ้าทัน)

## Checkpoint
- [ ] มีผลทดสอบจริง
- [ ] ทีมแยกข้อผิดพลาดกับงานที่ยังไม่ทำได้
- [ ] ไม่อ้างผล Test ที่ยังไม่ได้รัน

**Next:** [Step 06](06-review-wrapup.md)
