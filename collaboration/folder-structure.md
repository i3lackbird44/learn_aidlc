# Folder Structure — Shared Work vs Local Setup

ตัวอย่าง **Application Repository ของทีม** (แยกจาก Repository คู่มือ `AI-DLC_Workshop`)

```text
incident-management-team/
├── README.md                   # วิธีรัน App และข้อมูล Team
├── src/                        # Source Code
├── tests/                      # Executed/automated tests
├── docs/
│   ├── decisions.md            # Human Decisions (ทีมจัดทำ)
│   ├── handover.md             # Handover summary (ทีมจัดทำ)
│   └── acceptance-criteria.md  # Optional human-friendly reference
├── aidlc/
│   └── spaces/
│       └── default/
│           ├── memory/        # AI-DLC shared memory
│           └── intents/
│               └── <YYMMDD>-<intent-label>/
│                   ├── aidlc-state.md
│                   ├── audit/
│                   └── ...     # Generated phase artifacts/verification
├── .gitignore
└── <harness-config>/           # ตาม Harness/installation ที่ใช้จริง
```

> โครงสร้างภายใน `aidlc/` แสดง **ตัวอย่างอ้างอิงจาก AWS Labs AI-DLC Workflows ปัจจุบัน** ไฟล์บางส่วนสร้างตาม Scope/Version ไม่ควรสร้าง `aidlc-state.md` หรือ Audit ด้วยตัวเอง ให้ Engine จัดการ

## Shared via Git (commit after review)
| ส่วน | เหตุผล |
|---|---|
| `src/`, `tests/`, project files | Code และ verification |
| `aidlc/spaces/.../intents/.../aidlc-state.md` | Workflow status / resume point |
| Intent `audit/` and generated artifacts | Decisions, stage trail, requirements/design evidence |
| `docs/decisions.md`, `docs/handover.md` | Human-readable acceptance and receiving instructions |
| Workflow integration config if documented as version-controlled | ให้คนอื่นเริ่ม Workflow ได้ (ตรวจคู่มือ Harness ก่อน) |

## Must stay local / secure
- API keys, tokens, secrets, passwords, `.env` with credentials
- Local login sessions, private machine settings, caches/worktrees marked as ignored
- `active-intent` selector: **Git-ignored per-user cursor**, receiver selects Intent again

## One Repo or Two?
- **Workshop Guide Repo:** `github.com/searilf/AI-DLC_Workshop` — only learning instructions
- **Team Application Repo:** a separate repository for code + AI-DLC record + PRs

สำหรับองค์กรจริงควรใช้ Repository ของ Application ที่แต่ละทีมร่วมกันพัฒนา แทนการเอา Artifacts ไปเก็บแยกขาดจาก Code

**Source:** https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/10-state-and-audit.md
