'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const UI = require('../public/ui');

test('parseApiError: แปลงข้อผิดพลาด API เป็นข้อความรายช่อง (FR1.2, FR10.2)', () => {
  const r = UI.parseApiError(400, { error: 'ข้อมูลไม่ถูกต้อง', fields: { title: 'กรุณากรอก Title', bad: 5 } });
  assert.deepEqual(r.fields, { title: 'กรุณากรอก Title' });
  assert.equal(r.message, 'ข้อมูลไม่ถูกต้อง');
  assert.equal(r.status, 400);
});

test('parseApiError: payload เสียหรือ 500 ได้ข้อความทั่วไปและไม่ล้ม', () => {
  assert.ok(UI.parseApiError(400, null).message);
  assert.deepEqual(UI.parseApiError(400, 'x').fields, {});
  assert.match(UI.parseApiError(500, { error: 'stack trace ภายใน' }).message, /ขัดข้อง/);
});

test('alertMessage: แสดงจำนวน และว่างเมื่อเป็นศูนย์ (FR10.3)', () => {
  assert.match(UI.alertMessage(2), /2/);
  assert.equal(UI.alertMessage(0), '');
  assert.equal(UI.alertMessage(undefined), '');
});

test('priorityBadge: ป้ายและ class ตรงกับ Priority (FR2.2)', () => {
  assert.deepEqual(UI.priorityBadge('High'), { text: 'High', className: 'badge badge-high' });
  assert.equal(UI.priorityBadge('Low').className, 'badge badge-low');
  assert.equal(UI.priorityBadge('Medium').className, 'badge badge-medium');
  assert.match(UI.priorityBadge('???').className, /badge-unknown/);
});

test('NFR3: setText ใช้ textContent ข้อความ <script> ไม่ถูกตีความเป็น HTML', () => {
  const node = { textContent: '', innerHTML: 'ต้องไม่ถูกแตะ' };
  UI.setText(node, '<script>alert(1)</script>');
  assert.equal(node.textContent, '<script>alert(1)</script>');
  assert.equal(node.innerHTML, 'ต้องไม่ถูกแตะ');
  UI.setText(node, null);
  assert.equal(node.textContent, '');
});

test('NFR3: ไฟล์หน้าเว็บไม่ใช้ innerHTML/outerHTML/insertAdjacentHTML/document.write/eval', () => {
  for (const file of ['ui.js', 'app.js', 'index.html']) {
    const src = fs.readFileSync(path.join(__dirname, '..', 'public', file), 'utf8');
    assert.doesNotMatch(src, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(/, file);
  }
});

test('pageLabel และ historyLabel สร้างข้อความถูกต้อง (FR7.1, FR9)', () => {
  assert.equal(UI.pageLabel(1, 2), 'หน้า 1 / 2');
  assert.match(UI.historyLabel({ action: 'create', at: 'T' }), /สร้าง/);
  assert.match(UI.historyLabel({ action: 'status', field: 'status', from: 'Open', to: 'Resolved', at: 'T' }), /Open.*Resolved/);
});
