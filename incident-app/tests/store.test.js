'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../src/store');

const sample = { title: 'Printer เสีย', description: '', priority: 'High', owner: 'สมชาย', status: 'Open' };

test('insert แล้ว get ได้ พร้อม id ไม่ซ้ำและเวลาสร้าง (FR1.6)', () => {
  const store = createStore();
  const a = store.insert(sample);
  const b = store.insert(sample);
  assert.notEqual(a.id, b.id);
  assert.match(a.createdAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(store.get(a.id), a);
});

test('remove แล้วอ่านไม่ได้ และประวัติหายด้วย (FR5.2, A7)', () => {
  const store = createStore();
  const a = store.insert(sample);
  store.addHistory(a.id, { action: 'create' });
  assert.equal(store.remove(a.id), true);
  assert.equal(store.get(a.id), null);
  assert.equal(store.getHistory(a.id), null);
  assert.equal(store.remove(a.id), false);
});

test('แก้ข้อมูลที่ได้คืนมาไม่กระทบข้อมูลในที่เก็บ', () => {
  const store = createStore();
  const a = store.insert(sample);
  a.title = 'แก้นอกที่เก็บ';
  store.list()[0].owner = 'คนอื่น';
  const h = store.addHistory(a.id, { action: 'create' });
  h.action = 'tampered';
  assert.equal(store.get(a.id).title, 'Printer เสีย');
  assert.equal(store.get(a.id).owner, 'สมชาย');
  assert.equal(store.getHistory(a.id)[0].action, 'create');
});

test('list เรียงใหม่ไปเก่า และ update คืน null เมื่อไม่มี id (FR2.3)', () => {
  const store = createStore();
  const first = store.insert({ ...sample, title: 'เก่า' });
  const second = store.insert({ ...sample, title: 'ใหม่' });
  assert.deepEqual(store.list().map((i) => i.id), [second.id, first.id]);
  assert.equal(store.update('nope', { title: 'x' }), null);
  assert.equal(store.update(first.id, { status: 'Resolved' }).status, 'Resolved');
});

test('history: เพิ่มได้เฉพาะ Incident ที่มีอยู่ และเรียงเก่าไปใหม่ (FR9.2)', () => {
  const store = createStore();
  const a = store.insert(sample);
  assert.equal(store.addHistory('nope', { action: 'x' }), null);
  store.addHistory(a.id, { action: 'create' });
  store.addHistory(a.id, { action: 'status' });
  assert.deepEqual(store.getHistory(a.id).map((h) => h.action), ['create', 'status']);
});
