'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../src/store');
const { createService, ValidationError, NotFoundError } = require('../src/service');

const base = { title: 'Printer ชั้น 3 เสีย', description: 'พิมพ์ไม่ออก', priority: 'High', owner: 'สมชาย' };

function setup() {
  const service = createService(createStore());
  return service;
}

test('FR1: สร้างได้ Status Open และข้อมูลไม่ผ่านโยน ValidationError พร้อม fields', () => {
  const s = setup();
  const i = s.createIncident(base);
  assert.equal(i.status, 'Open');
  assert.ok(i.id && i.createdAt);
  assert.throws(() => s.createIncident({ ...base, title: '  ' }), (e) => e instanceof ValidationError && typeof e.fields.title === 'string');
  assert.equal(s.listIncidents({}).total, 1);
});

test('FR2: รายการแสดง Priority ถูกต้องและเรียงใหม่ไปเก่า', () => {
  const s = setup();
  s.createIncident({ ...base, title: 'A', priority: 'Low' });
  s.createIncident({ ...base, title: 'B', priority: 'Medium' });
  s.createIncident({ ...base, title: 'C', priority: 'High' });
  const { items } = s.listIncidents({});
  assert.deepEqual(items.map((i) => [i.title, i.priority]), [['C', 'High'], ['B', 'Medium'], ['A', 'Low']]);
  assert.equal(setup().listIncidents({}).items.length, 0);
});

test('FR3: เปลี่ยน Status ไปมาได้ ปฏิเสธค่าผิดโดยข้อมูลไม่เปลี่ยน และ id ไม่มีได้ NotFound', () => {
  const s = setup();
  const i = s.createIncident(base);
  assert.equal(s.updateStatus(i.id, { status: 'In Progress' }).status, 'In Progress');
  assert.equal(s.updateStatus(i.id, { status: 'Resolved' }).status, 'Resolved');
  assert.equal(s.updateStatus(i.id, { status: 'Open' }).status, 'Open');
  assert.throws(() => s.updateStatus(i.id, { status: 'Closed' }), ValidationError);
  assert.equal(s.listIncidents({}).items[0].status, 'Open');
  assert.throws(() => s.updateStatus('nope', { status: 'Open' }), NotFoundError);
});

test('FR4: เปลี่ยน Owner ได้ และปฏิเสธค่าว่างโดย Owner เดิมไม่เปลี่ยน', () => {
  const s = setup();
  const i = s.createIncident(base);
  assert.equal(s.updateOwner(i.id, { owner: 'สมหญิง' }).owner, 'สมหญิง');
  assert.throws(() => s.updateOwner(i.id, { owner: '  ' }), ValidationError);
  assert.equal(s.listIncidents({}).items[0].owner, 'สมหญิง');
  assert.throws(() => s.updateOwner('nope', { owner: 'x' }), NotFoundError);
});

test('FR5: ลบแล้วหายจากรายการ และ id ไม่มีอยู่ได้ NotFound', () => {
  const s = setup();
  const i = s.createIncident(base);
  s.deleteIncident(i.id);
  assert.equal(s.listIncidents({}).total, 0);
  assert.throws(() => s.deleteIncident(i.id), NotFoundError);
  assert.throws(() => s.getHistory(i.id), NotFoundError);
});

test('FR6: ค้นหา (ไม่สนตัวพิมพ์) ร่วมกับกรอง Priority/Status', () => {
  const s = setup();
  s.createIncident({ ...base, title: 'Printer เสีย', priority: 'High' });
  s.createIncident({ ...base, title: 'VPN ใช้ไม่ได้', description: 'ต่อ printer ไม่ได้', priority: 'Low' });
  const vpn = s.createIncident({ ...base, title: 'Wifi', priority: 'High' });
  assert.equal(s.listIncidents({ q: 'PRINTER' }).total, 2);
  assert.equal(s.listIncidents({ q: 'printer', priority: 'High' }).total, 1);
  assert.equal(s.listIncidents({ priority: 'High' }).total, 2);
  s.updateStatus(vpn.id, { status: 'Resolved' });
  assert.equal(s.listIncidents({ priority: 'High', status: 'Resolved' }).items[0].title, 'Wifi');
  assert.equal(s.listIncidents({ q: 'zzz' }).total, 0);
  assert.throws(() => s.listIncidents({ status: 'Closed' }), ValidationError);
});

test('FR7: 12 รายการแบ่งเป็น 10+2 และหน้าเกินได้รายการว่างพร้อมจำนวนทั้งหมด', () => {
  const s = setup();
  for (let n = 0; n < 12; n += 1) s.createIncident({ ...base, title: `Incident ${n}` });
  const p1 = s.listIncidents({ page: '1' });
  const p2 = s.listIncidents({ page: '2' });
  const p3 = s.listIncidents({ page: '3' });
  assert.equal(p1.items.length, 10);
  assert.equal(p2.items.length, 2);
  assert.equal(p1.totalPages, 2);
  assert.equal(p3.items.length, 0);
  assert.equal(p3.total, 12);
  assert.throws(() => s.listIncidents({ page: '0' }), ValidationError);
});

test('FR8: แก้รายละเอียดได้ และข้อมูลไม่เปลี่ยนเมื่อไม่ผ่าน', () => {
  const s = setup();
  const i = s.createIncident({ ...base, priority: 'Low' });
  const updated = s.updateDetails(i.id, { title: 'ใหม่', description: '', priority: 'High' });
  assert.equal(updated.priority, 'High');
  assert.equal(updated.title, 'ใหม่');
  assert.throws(() => s.updateDetails(i.id, { title: '', description: 'x', priority: 'Low' }), ValidationError);
  const after = s.listIncidents({}).items[0];
  assert.equal(after.title, 'ใหม่');
  assert.equal(after.priority, 'High');
  assert.throws(() => s.updateDetails('nope', base), NotFoundError);
});

test('FR9: ประวัติ 2 รายการหลังเปลี่ยน Status และไม่เพิ่มเมื่อถูกปฏิเสธหรือค่าไม่เปลี่ยน', () => {
  const s = setup();
  const i = s.createIncident(base);
  s.updateStatus(i.id, { status: 'In Progress' });
  const h = s.getHistory(i.id);
  assert.equal(h.length, 2);
  assert.equal(h[0].action, 'create');
  assert.deepEqual([h[1].action, h[1].field, h[1].from, h[1].to], ['status', 'status', 'Open', 'In Progress']);
  assert.ok(h[1].at);
  assert.throws(() => s.updateDetails(i.id, { title: 'x', priority: 'Urgent' }), ValidationError);
  s.updateStatus(i.id, { status: 'In Progress' });
  assert.equal(s.getHistory(i.id).length, 2);
});

test('FR10.3: จำนวนแถบเตือนลดเมื่อ High ถูก Resolved และไม่นับ Priority อื่น', () => {
  const s = setup();
  const a = s.createIncident(base);
  s.createIncident(base);
  s.createIncident({ ...base, priority: 'Low' });
  assert.deepEqual(s.getAlerts(), { highUnresolved: 2 });
  s.updateStatus(a.id, { status: 'Resolved' });
  assert.deepEqual(s.getAlerts(), { highUnresolved: 1 });
});
