# Git + AI-DLC Commands — Quick Reference

คำสั่งด้านล่างอ้างอิง AI-DLC Workflows docs ในปัจจุบัน **ต้องติดตั้ง integration และตรวจเวอร์ชันให้ตรงก่อนใช้งาน** อย่ารันคำสั่ง AI-DLC ใน Terminal ทั่วไปหากเป็น slash command ของ Harness

## 1. Git Preparation
```bash
git clone https://github.com/<org>/<team-app-repo>.git
cd <team-app-repo>
git status
git switch -c feat/incident-requirements
```

## 2. BA: Park at a Stage Boundary
**Kiro / Claude Code (inside Harness chat):**
```text
/aidlc park
```

**Codex CLI (inside Codex):**
```text
$aidlc park
```

## 3. BA: Commit and Push
```bash
git status
git add aidlc/ docs/ README.md
git commit -m "docs: hand over approved incident requirements"
git push -u origin feat/incident-requirements
```
เปิด Pull Request แล้วให้ทีม Review/Merge ก่อน Developer รับช่วง

> `git add` เป็นตัวอย่าง ตรวจ `git status` และอย่า Commit secret/Local Cache; หากมี Source Changes ให้เพิ่มไฟล์ที่เกี่ยวข้องอย่างตั้งใจ

## 4. Developer: Receive the Approved Work
```bash
git switch main
git pull --ff-only origin main
git status
```
ตรวจ `docs/handover.md`, Intent Artifacts และ Runtime Integration

**Kiro / Claude Code:**
```text
/aidlc intent
/aidlc intent incident-management-mvp
/aidlc --resume
```

**Codex CLI:**
```text
$aidlc intent
$aidlc intent incident-management-mvp
$aidlc --resume
```

> `incident-management-mvp` เป็นชื่อสมมติ ใช้ชื่อ Intent ที่มีอยู่จริงใน `/aidlc intent` และตรวจว่าปัจจุบัน State อยู่ในสถานะ Parked

## 5. Developer: Implementation PR
```bash
git switch -c feat/incident-mvp
# Develop & run tests with AI-DLC, then:
git status
git add src/ tests/ aidlc/ docs/
git commit -m "feat: implement incident management MVP"
git push -u origin feat/incident-mvp
```

## 6. Optional Advanced Team Construction
**เฉพาะเมื่อกำหนด Unit Ownership = team และพร้อมใช้งาน Multi-checkout:**
```text
/aidlc team-board
/aidlc --claim incident-api --team "Developer A"
```
Unit Claims ต้องดู Dependency, shared ref และ Merge Readiness ไม่ใช่ใช้เพื่อแบ่ง BA/Dev Handover แบบธรรมดา

## References
- https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/12-cli-commands.md
- https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/10-state-and-audit.md
