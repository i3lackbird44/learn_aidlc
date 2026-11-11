'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const v = require('../src/validation');

const valid = { title: ' Printer ชั้น 3 เสีย ', description: 'พิมพ์ไม่ออก', priority: 'High', owner: ' สมชาย ' };

test('validateCreate: ข้อมูลครบผ่านและตัดช่องว่างหัวท้าย (FR1)', () => {
  const r = v.validateCreate(valid);
  assert.deepEqual(r.errors, {});
  assert.equal(r.value.title, 'Printer ชั้น 3 เสีย');
  assert.equal(r.value.owner, 'สมชาย');
  assert.equal(r.value.priority, 'High');
});

test('validateCreate: Title ว่างหรือมีแต่ช่องว่างถูกปฏิเสธ (FR1.2)', () => {
  for (const title of ['', '   ', undefined, 42]) {
    const r = v.validateCreate({ ...valid, title });
    assert.equal(r.value, null);
    assert.ok(r.errors.title, `title=${String(title)}`);
  }
});

test('validateCreate: Priority ไม่ถูกต้องถูกปฏิเสธ (FR1.3)', () => {
  for (const priority of ['Urgent', '', undefined, 'high']) {
    const r = v.validateCreate({ ...valid, priority });
    assert.ok(r.errors.priority, `priority=${String(priority)}`);
  }
});

test('validateCreate: Owner ว่างถูกปฏิเสธ (FR1.4, FR4.2)', () => {
  const r = v.validateCreate({ ...valid, owner: '  ' });
  assert.ok(r.errors.owner);
  assert.equal(r.value, null);
});

test('validateCreate: Description ว่างหรือไม่ส่งมาได้ (FR1.5)', () => {
  assert.equal(v.validateCreate({ ...valid, description: '' }).value.description, '');
  const { description, ...noDesc } = valid;
  assert.equal(v.validateCreate(noDesc).value.description, '');
});

test('validateCreate: body ที่ไม่ใช่ object ถูกปฏิเสธ และรวมข้อผิดพลาดหลายช่อง', () => {
  assert.ok(v.validateCreate(null).errors.body);
  assert.ok(v.validateCreate([]).errors.body);
  const r = v.validateCreate({});
  assert.ok(r.errors.title && r.errors.priority && r.errors.owner);
});

test('validateCreate: Title ยาวเกินกำหนดถูกปฏิเสธ', () => {
  assert.ok(v.validateCreate({ ...valid, title: 'x'.repeat(201) }).errors.title);
});

test('validateDetails: ใช้กฎเดียวกับตอนสร้าง (FR8.2)', () => {
  assert.deepEqual(v.validateDetails({ title: 'A', description: '', priority: 'Low' }).errors, {});
  assert.ok(v.validateDetails({ title: '', description: '', priority: 'Low' }).errors.title);
  assert.ok(v.validateDetails({ title: 'A', priority: 'Urgent' }).errors.priority);
});

test('validateStatus: รับสามค่า ปฏิเสธค่าอื่น (FR3.2)', () => {
  for (const status of ['Open', 'In Progress', 'Resolved']) {
    assert.equal(v.validateStatus({ status }).value.status, status);
  }
  assert.ok(v.validateStatus({ status: 'Closed' }).errors.status);
  assert.ok(v.validateStatus({}).errors.status);
});

test('validateOwner: ตัดช่องว่าง ปฏิเสธค่าว่าง (FR4.2)', () => {
  assert.equal(v.validateOwner({ owner: ' สมหญิง ' }).value.owner, 'สมหญิง');
  assert.ok(v.validateOwner({ owner: '   ' }).errors.owner);
});

test('validateListQuery: ค่าเริ่มต้นและค่าที่ถูกต้อง (FR6, FR7)', () => {
  assert.deepEqual(v.validateListQuery({}).value, { q: '', status: null, priority: null, page: 1 });
  const r = v.validateListQuery({ q: ' printer ', status: 'Open', priority: 'High', page: '2' });
  assert.deepEqual(r.value, { q: 'printer', status: 'Open', priority: 'High', page: 2 });
});

test('validateListQuery: ตัวกรองและหน้าไม่ถูกต้องถูกปฏิเสธ (FR6.3, FR7.3)', () => {
  assert.ok(v.validateListQuery({ status: 'Closed' }).errors.status);
  assert.ok(v.validateListQuery({ priority: 'Urgent' }).errors.priority);
  for (const page of ['0', 'abc', '-1', '1.5', ['1', '2']]) {
    assert.ok(v.validateListQuery({ page }).errors.page, `page=${String(page)}`);
  }
  assert.ok(v.validateListQuery({ q: ['a', 'b'] }).errors.q);
});
