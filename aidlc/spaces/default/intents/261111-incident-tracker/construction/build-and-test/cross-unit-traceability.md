# Cross-Unit Traceability — IT Incident Tracker

งานนี้เป็น zero-Unit (express) จึงมีหนึ่งขอบเขตคือ `code-generation` ระดับ stage

## ผลจาก `aidlc engine sensor-traceability --stage build-and-test`

**Verdict: FAIL** (เครื่องมือรายงาน `pass: false`) เหลือ 2 ID ที่ไม่ครอบคลุม: `NFR4`, `NFR5`

- 39 จาก 41 ID ครอบคลุม: FR1.1–FR10.3 (37 ID) และ NFR1–NFR3 ชี้ไปยังไฟล์โค้ดหรือ test ตาม `construction/code-generation/traceability.json`
- `NFR4` และ `NFR5` ถูกทำเครื่องหมาย `Deferred` ในขั้น Code Generation เพราะเป็นเรื่องที่ต้องวัดหรือรายงานในขั้นนี้ ผลคือ ตัวตรวจจึงนับเป็น uncovered

## สถานะจริงของ 2 ID ที่ค้าง (พบในขั้น Build and Test)

| ID | ข้อกำหนด | หลักฐานที่ได้ในขั้นนี้ | ตำแหน่งหลักฐาน |
|----|----------|------------------------|----------------|
| NFR4 | ตอบภายใน 500 ms เมื่อมี Incident ไม่เกิน 100 รายการ | วัดได้ 0.9–4.9 ms: Met | `test-results.md` หัวข้อ "เวลาตอบสนอง (NFR4)" |
| NFR5 | รายงาน Passed/Failed/Not Run ต่อ AC | รายงานครบ AC-01..AC-05 | `test-results.md` หัวข้อ "ผลต่อ Acceptance Criteria" |

หลักฐานทั้งสองเป็นเอกสารและผลวัด ไม่ใช่ไฟล์โค้ด ตัวตรวจที่อ่าน `traceability.json` ของ Code Generation จึงยังไม่เห็น และผมไม่ได้แก้ไฟล์นั้นย้อนหลัง เรื่องนี้ต้องแสดงที่ gate อนุมัติเป็นข้อค้นพบ

## ข้อค้นพบสำหรับผู้อนุมัติ

1. ตัวตรวจรายงาน FAIL ต่อ NFR4 และ NFR5 แม้หลักฐานจริงมีแล้ว (เหตุผลข้างต้น)
2. ไม่มี requirement ใดที่ไม่มีโค้ดหรือ test รองรับ ยกเว้นสอง NFR ที่เป็นการวัดและการรายงาน
