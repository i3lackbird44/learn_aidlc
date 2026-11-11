# AI-DLC Team Collaboration — BA → Developer Handover

**เป้าหมาย:** ทำให้ทีม BA/PO ส่งงานที่ผ่าน Requirement Review ไปยัง SA/Developer ได้ โดยไม่ต้องเริ่ม AI-DLC ใหม่จากศูนย์

คู่มือนี้อธิบาย **Sequential Handover** เป็นแนวทางหลัก และมี Parallel Unit Collaboration เป็นหัวข้อเสริมสำหรับทีมที่พร้อม

## อ่านตามลำดับ
1. [Repository & Folder Structure](folder-structure.md) — อะไรต้องแชร์ผ่าน Git และอะไรเป็น Local Only
2. [BA → Developer Handover](ba-to-developer.md) — Park → Push/PR → Review/Merge → Pull/Resume
3. [Command Cheat Sheet](commands.md) — คำสั่ง Git/AI-DLC สำหรับ Kiro, Claude Code และ Codex
4. [Team Safety & Troubleshooting](safety-and-conflicts.md) — State Conflicts, secrets, missing artifacts, versions

## One Intent, One Handover

```text
BA / PO workspace
  Requirements & decisions
          |
    /aidlc park
          |
   commit / push / PR
          v
    Shared Git Repo
          |
    review + merge
          |
     clone / pull
          v
SA / Developer workspace
 select intent -> resume -> design / build / test
```

### Principles
- Git shares **files**, not an AI chat session or the developer's local credentials.
- Both sides need the compatible AI-DLC runtime/workflow integration; changing Harness does not automatically migrate local config or chat history.
- Commit the relevant **aidlc/** intent state, audit, artifacts, decisions and source files. Do not commit secrets.
- Require human review at the PR boundary, especially for Requirements and Design changes.
- Do **not** modify the *same active Intent state* concurrently on unrelated branches; assign one workflow owner or use supported Unit Ownership mode.
- The active-intent selector is local/ignored. The receiver must select the correct Intent before resuming.

**During the 70-minute workshop:** this is a concept/demo-worthy optional handover exercise, **not** another mandatory challenge or a new approval gate.
