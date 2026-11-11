# Safety & State Conflict Checklist

## Before Handover
- [ ] BA/PO ยืนยัน Requirement / Acceptance Criteria
- [ ] AI-DLC workflow Parked ที่ Stage Boundary
- [ ] `aidlc-state.md`, audit and relevant artifacts are in the PR
- [ ] สรุป Handover พร้อม Open Questions/Next Action
- [ ] ไม่มี Secrets ใน Commit
- [ ] PR ผ่าน Review แล้ว

## Common Problems
| Problem | Recommendation |
|---|---|
| Developer มองไม่เห็น Intent | ตรวจว่า Pull ครบ, ใช้ space ที่ถูกต้อง และรัน `/aidlc intent` |
| Session ใหม่เริ่ม Workflow ใหม่ | เลือก Existing Intent ก่อน Resume อย่าสร้าง Intent ซ้ำ |
| Stage Status ขัดกันสอง Branch | หยุด Merge State อัตโนมัติ ตรวจเจ้าของ Workflow และ reconcile หลัง Review |
| BA ใช้ Kiro, Dev ใช้ Codex | ตรวจ Harness Integration & Runtime compatibility, ไม่คาดหวัง Chat History Sync |
| PR มี Secrets | หยุด Merge, revoke/rotate credential ตามนโยบายองค์กร |
| เกิด Conflict ใน audit/state | อย่า overwrite แบบ blind; ทบทวนทั้งสอง Branch และตัดสินใจ owner/next state ก่อนให้ Engine ทำงาน |

## Organizational Practices
- Assign one Intent owner for sequential handover.
- Protect main and require PR review.
- Keep Requirements/Acceptance Criteria with the implementation history.
- Use team Unit Ownership mode for real parallel Construction; avoid manually editing engine state.
- Handover decisions and approved source code should be reviewable in the same PR history.

**This is a learning and collaboration guide, not a guarantee that all harnesses share identical local runtime state.**
