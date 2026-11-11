# แผน Code Generation — IT Incident Tracker

## Summary

- Builds: เว็บแอป Node.js + Express สำหรับสร้าง ดู ค้นหา/กรอง แบ่งหน้า แก้ไข เปลี่ยนสถานะ/Owner ลบ Incident พร้อมประวัติและการแจ้งเตือนบนหน้าเว็บ เก็บข้อมูลใน memory
- Touches: โฟลเดอร์ใหม่ `incident-app/` (`src/`, `public/`, `tests/`, `package.json`, `README.md`)
- Tests: ประมาณ 25 unit/API test ด้วย Node test runner + supertest (1 ข้อขึ้นไปต่อ FR1–FR10 และ NFR3) บวก checklist ทดสอบด้วยมือสำหรับ AC-01 ถึง AC-05

## บริบท

- งานแบบ zero-Unit (express ไม่มี Units Generation) ใช้ `requirements.md` เป็นแหล่งเดียว
- Greenfield, Node.js v24 มีอยู่ในเครื่องแล้ว
- ลำดับทำงานตาม Testing Contract: test-after คือเขียนแต่ละชั้นให้เสร็จก่อน แล้วเขียนและรัน test ของชั้นนั้น
- ทำตามลำดับความสำคัญใน requirements: FR1–FR3 ก่อน แล้วจึง FR4 → FR8 → FR5 → FR6 → FR7 → FR9 → FR10 แต่ละขั้นด้านล่างครอบคลุมทุก FR ของชั้นนั้น

## โครงสร้างไฟล์

```
incident-app/
  package.json          scripts: start, test
  README.md             วิธีรัน, วิธีทดสอบ, ข้อจำกัด
  src/
    validation.js       กฎตรวจข้อมูล (FR1.2-1.5, FR3.2, FR4.2, FR6.3, FR7.3, FR8.2)
    store.js            ที่เก็บข้อมูลใน memory + ประวัติ (FR1.6, FR5, FR9)
    service.js          business logic (FR1-FR10)
    app.js              Express app + REST routes + error handler (FR1.7, FR3.3, ...)
    server.js           จุดเริ่มรัน, PORT จาก environment (ค่าเริ่มต้น 3000)
  public/
    index.html          หน้าเว็บเดียว มี data-testid ทุกปุ่ม/ช่อง
    ui.js               helper แสดงผล (ใช้ textContent เท่านั้น, NFR3) ใช้ได้ทั้งเบราว์เซอร์และ test
    app.js              โค้ดหน้าเว็บ เรียก API
    styles.css          สี Priority, toast, แถบเตือน
  tests/
    validation.test.js
    store.test.js
    service.test.js
    api.test.js
    ui.test.js
```

## REST API

| Method | Path | ใช้ทำ | Requirement |
|--------|------|-------|-------------|
| POST | `/api/incidents` | สร้าง (201 / 400) | FR1 |
| GET | `/api/incidents?q=&status=&priority=&page=` | รายการ ค้นหา กรอง แบ่งหน้า ตอบ `{ items, total, page, pageSize, totalPages }` | FR2, FR6, FR7 |
| PATCH | `/api/incidents/:id` | แก้ Title/Description/Priority (200 / 400 / 404) | FR8 |
| PATCH | `/api/incidents/:id/status` | เปลี่ยน Status (200 / 400 / 404) | FR3 |
| PATCH | `/api/incidents/:id/owner` | เปลี่ยน Owner (200 / 400 / 404) | FR4 |
| DELETE | `/api/incidents/:id` | ลบ (204 / 404) | FR5 |
| GET | `/api/incidents/:id/history` | ประวัติ (200 / 404) | FR9 |
| GET | `/api/alerts` | จำนวน High ที่ยังไม่ Resolved | FR10.3 |

ข้อผิดพลาดตอบรูปแบบเดียว: `{ "error": "<ข้อความ>", "fields": { "<ช่อง>": "<ข้อความ>" } }`

## ขั้นตอน

- [ ] **Step 1 — โครงโปรเจกต์:** สร้าง `incident-app/package.json` (dependency `express`, devDependency `supertest`, script `start` = `node src/server.js`, `test` = `node --test tests/`), `src/server.js` อ่าน `PORT` จาก environment, ติดตั้ง dependency ด้วย `npm install` (NFR1)
- [ ] **Step 2 — เตรียม test runner:** ใช้ Node test runner ในตัว (`node:test`) ไม่ต้องมีไฟล์ config เพิ่ม บันทึกคำสั่งรายไฟล์ใน `unit-test-instructions.md` และยืนยันว่า `node --test tests/validation.test.js` รันได้ (NFR2)
- [ ] **Step 3 — ชั้นตรวจข้อมูล (data model) — implement:** `src/validation.js` ค่าคงที่ `PRIORITIES`, `STATUSES`, ฟังก์ชัน `validateCreate`, `validateDetails`, `validateStatus`, `validateOwner`, `validateListQuery` ตัดช่องว่างหัวท้าย คืน `{ value, errors }` (FR1.2–FR1.5, FR3.2, FR4.2, FR6.3, FR7.3, FR8.2)
- [ ] **Step 4 — ชั้นตรวจข้อมูล — เขียนและรัน test:** `tests/validation.test.js` ครอบคลุม ข้อมูลครบผ่าน, Title ว่าง/มีแต่ช่องว่าง, Priority ไม่ถูกต้อง, Owner ว่าง, Description ว่างได้, Status ไม่ถูกต้อง, ค่ากรองและหน้าไม่ถูกต้อง
- [ ] **Step 5 — ที่เก็บข้อมูล (repository) — implement:** `src/store.js` สร้างด้วย `createStore()` เก็บ Incident ใน `Map` สร้าง id ด้วย `crypto.randomUUID()` เวลาสร้าง ISO, เพิ่ม/อ่าน/แก้/ลบ และเก็บประวัติแยกต่อ Incident (ลบ Incident แล้วประวัติหายด้วย ตาม A7) คืนสำเนาข้อมูลเพื่อกันการแก้จากภายนอก (FR1.6, FR5.2, FR9.1, FR9.4)
- [ ] **Step 6 — ที่เก็บข้อมูล — เขียนและรัน test:** `tests/store.test.js` ครอบคลุม เพิ่มแล้วอ่านได้, ลบแล้วอ่านไม่ได้ (และประวัติหาย), แก้ข้อมูลที่ได้คืนมาไม่กระทบข้อมูลในที่เก็บ
- [ ] **Step 7 — business logic — implement:** `src/service.js` `createIncident` (Status เริ่ม `Open`), `listIncidents` (เรียงใหม่ไปเก่า, ค้น Title/Description แบบไม่สนตัวพิมพ์, กรอง Status/Priority, แบ่งหน้าละ 10 หลังกรอง), `updateDetails`, `updateStatus`, `updateOwner`, `deleteIncident`, `getHistory`, `getAlerts` บันทึกประวัติเฉพาะเมื่อสำเร็จและค่าเปลี่ยนจริง ข้อผิดพลาดใช้ `ValidationError` (มี `fields`) และ `NotFoundError` (FR1–FR10)
- [ ] **Step 8 — business logic — เขียนและรัน test:** `tests/service.test.js` อย่างน้อย 1 test ต่อ FR: สร้างได้ Status `Open` (FR1), รายการแสดง Priority ถูกต้องและเรียงใหม่ไปเก่า (FR2), เปลี่ยน Status ไปมาได้และปฏิเสธค่าผิด (FR3), เปลี่ยน Owner และปฏิเสธค่าว่าง (FR4), ลบแล้วหายและ id ไม่มีอยู่ได้ NotFound (FR5), ค้นหา+กรองร่วมกัน (FR6), 12 รายการแบ่งเป็น 10+2 (FR7), แก้รายละเอียดและข้อมูลไม่เปลี่ยนเมื่อไม่ผ่าน (FR8), ประวัติ 2 รายการหลังเปลี่ยน Status และไม่เพิ่มเมื่อถูกปฏิเสธ (FR9), จำนวนแถบเตือนลดเมื่อ Resolved (FR10.3)
- [ ] **Step 9 — API — implement:** `src/app.js` ฟังก์ชัน `createApp({ store })` ใช้ `express.json()` จำกัดขนาด body 10kb, routes ตามตาราง REST API, แปลง `ValidationError` เป็น 400 และ `NotFoundError` เป็น 404, JSON ที่อ่านไม่ได้เป็น 400, ข้อผิดพลาดอื่นเป็น 500 พร้อม log ลง console, เสิร์ฟ `public/` แบบ static (FR1.7, FR3.3, FR4.3, FR5.3, FR8.3, NFR3)
- [ ] **Step 10 — API — เขียนและรัน test:** `tests/api.test.js` ด้วย supertest: POST สำเร็จ 201 (AC-01), POST ขาด Title 400 พร้อม `fields.title` (AC-05), POST Priority `Urgent` 400 (AC-05), GET รายการเห็น Priority ถูกต้อง (AC-02, AC-04), PATCH status สำเร็จ และ `Closed` ได้ 400 (AC-03, AC-05), PATCH status id ไม่มีอยู่ 404, DELETE 204 แล้ว 404, GET filter `status=Closed` 400, GET `page=0` 400, JSON เสีย 400, history และ alerts ตอบถูกต้อง
- [ ] **Step 11 — หน้าเว็บ — implement:** `public/index.html`, `public/ui.js`, `public/app.js`, `public/styles.css` ฟอร์มสร้าง (ข้อความผิดพลาดใต้ช่อง), ช่องค้นหา + ตัวกรอง Status/Priority, ตารางรายการพร้อมป้าย Priority สี, ตัวเลือก Status, ช่องแก้ Owner, ปุ่มแก้ไขรายละเอียด, ปุ่มลบพร้อม `confirm()`, ปุ่มดูประวัติ, ปุ่มหน้าก่อน/ถัดไป, toast หายเองใน 5 วินาที, แถบเตือน High ที่ยังไม่ Resolved, ข้อความเมื่อไม่มีรายการ ทุกข้อความผู้ใช้แสดงด้วย `textContent` และทุกช่อง/ปุ่มมี `data-testid` (FR1–FR10, NFR3)
- [ ] **Step 12 — หน้าเว็บ — เขียนและรัน test:** `tests/ui.test.js` ทดสอบ helper ใน `public/ui.js` แบบไม่ต้องใช้เบราว์เซอร์: แปลงข้อผิดพลาด API เป็นข้อความรายช่อง, ข้อความแถบเตือนตามจำนวน, ป้าย Priority ถูกต้อง, ข้อความที่มี `<script>` ไม่ถูกตีความเป็น HTML (NFR3)
- [ ] **Step 13 — การตั้งค่า:** `PORT` ผ่าน environment (ไม่มี secret ในโค้ด), ไฟล์ `.gitignore` ใน `incident-app/` สำหรับ `node_modules/`
- [ ] **Step 14 — เอกสารและ traceability:** `incident-app/README.md` วิธีติดตั้ง รัน ทดสอบ checklist ทดสอบด้วยมือ AC-01 ถึง AC-05 (D6) และข้อจำกัด (ข้อมูลหายเมื่อรีสตาร์ท, ไม่มีล็อกอิน)

## Requirement → ขั้นตอน

| Requirement | Step ที่ implement | Step ที่ test |
|-------------|-------------------|--------------|
| FR1 สร้าง | 3, 5, 7, 9, 11 | 4, 8, 10, 12 |
| FR2 รายการ | 7, 9, 11 | 8, 10 |
| FR3 Status | 3, 7, 9, 11 | 4, 8, 10 |
| FR4 Owner | 3, 7, 9, 11 | 4, 8 |
| FR5 ลบ | 5, 7, 9, 11 | 6, 8, 10 |
| FR6 ค้นหา/กรอง | 3, 7, 9, 11 | 4, 8, 10 |
| FR7 แบ่งหน้า | 3, 7, 9, 11 | 4, 8, 10 |
| FR8 แก้ไขรายละเอียด | 3, 7, 9, 11 | 4, 8 |
| FR9 ประวัติ | 5, 7, 9, 11 | 6, 8, 10 |
| FR10 แจ้งเตือน | 7, 9, 11 | 8, 10, 12 |
| NFR1 รันบนเครื่อง | 1, 13 | ทดสอบด้วยมือ |
| NFR2 ทดสอบได้ | 2 | ทุก test |
| NFR3 ความปลอดภัย | 3, 9, 11 | 4, 10, 12 |
| NFR4 การตอบสนอง | 5, 7 (Map ในหน่วยความจำ) | ทดสอบด้วยมือ |
| NFR5 หลักฐานผลทดสอบ | 14 | Build and Test |

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "express",
  "test_strategy": "minimal",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:6cb23162168334768ff8f29699669845616670119c9eb58bf9bb05af6fefd3de",
  "contract_sha256": "sha256:283a836cf0757ed2efa4b5dd3135f3986eb59880b3017f4ba87a685cfebedfdb"
}
```
