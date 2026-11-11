# BA → Developer Handover — Step by Step

## Scenario
BA/PO เก็บ Requirement ของ IT Incident Management แล้ว Developer อีกคนจะรับไป Design/Build ต่อในวันถัดไป โดยใช้ AI-DLC Intent เดียวกัน

### Phase A — BA / PO
1. เปิด AI-DLC ใน Application Repository ที่มี Workflow Integration อยู่แล้ว
2. ทำ Requirements Analysis; ให้ PO ตรวจ Acceptance Criteria และบันทึกข้อสรุป
3. ตรวจว่าการดำเนินงานอยู่ที่ **Stage Boundary** ที่ Park ได้; ไม่ประกาศว่า Stage ที่ยังไม่จบเสร็จแล้ว
4. สั่ง `/aidlc park` (Codex CLI ใช้ `$aidlc park`)
5. ตรวจ `aidlc-state.md`, generated artifacts, `docs/handover.md` และผล `git status`
6. Commit & Push แล้วเปิด PR ระบุ Intent, Stage ที่เสร็จ, Approved Scope และ Next Action
7. ให้ผู้เกี่ยวข้อง Review/Merge PR โดยไม่ทำงานต่อบน State ชุดเดิมระหว่างรอส่งมอบ

### Phase B — SA / Developer
1. Clone หรือ Pull Branch ที่ Merge แล้ว และเตรียม **compatible AI-DLC runtime/harness configuration** ในเครื่อง
2. ตรวจ `docs/handover.md`, Requirements, Decisions และ Stage Record
3. เปิด Harness และเลือก Intent ที่ถูกต้อง (เนื่องจาก active-intent cursor ไม่ถูกแชร์)
4. สั่ง `/aidlc intent` เพื่อดูรายการ → `/aidlc intent <intent-name>` → `/aidlc --resume`
5. ให้ AI ทวน Scope/Requirements ก่อนเริ่ม Design/Construction
6. ตรวจ Design Decision, พัฒนา Units/Bolts ที่เกี่ยวข้อง และรัน Test
7. Commit/PR กลับเข้าทีม พร้อมผลการทดสอบจริงและ Known Limitations

## Suggested PR Description
```markdown
## AI-DLC Handover
- Intent: incident-management-mvp
- Outgoing owner: BA / PO
- Incoming owner: SA / Developer
- Last reviewed stage: Requirements Analysis
- Workflow state: Parked at a stage boundary
- Approved scope: Create Incident / View List / Update Status / Priority
- Key decisions: [link to docs/decisions.md]
- Artifacts: [path/link to intent]
- Next action: Resume and inspect design plan
- Open questions: None / list
- Verified files: [paths]
```

## Optional Workshop Mini Exercise
หลัง Requirement Review ให้ BA รัน Park และอธิบาย Handover Summary แล้ว Developer ใช้ Session ของทีม Resume ต่อบนเครื่องเดียว เพื่อลดปัญหา Setup ระหว่าง Lab

**Source:** https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/12-cli-commands.md
