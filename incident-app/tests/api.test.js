'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');
const { createStore } = require('../src/store');

const body = { title: 'Printer ชั้น 3 เสีย', description: 'พิมพ์ไม่ออก', priority: 'High', owner: 'สมชาย' };

function setup() {
  return request(createApp({ store: createStore() }));
}

test('AC-01: POST สำเร็จได้ 201 พร้อม Status Open และ id', async () => {
  const api = setup();
  const res = await api.post('/api/incidents').send(body);
  assert.equal(res.status, 201);
  assert.equal(res.body.status, 'Open');
  assert.ok(res.body.id);
  assert.equal((await api.get('/api/incidents')).body.total, 1);
});

test('AC-05: POST ขาด Title ได้ 400 พร้อม fields.title และไม่สร้างข้อมูล', async () => {
  const api = setup();
  const res = await api.post('/api/incidents').send({ ...body, title: '   ' });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.title);
  assert.equal((await api.get('/api/incidents')).body.total, 0);
});

test('AC-05: POST Priority Urgent ได้ 400 พร้อม fields.priority', async () => {
  const res = await setup().post('/api/incidents').send({ ...body, priority: 'Urgent' });
  assert.equal(res.status, 400);
  assert.ok(res.body.fields.priority);
});

test('AC-02/AC-04: GET รายการเห็น Priority ตรงกับที่สร้าง', async () => {
  const api = setup();
  for (const priority of ['Low', 'Medium', 'High']) await api.post('/api/incidents').send({ ...body, priority });
  const res = await api.get('/api/incidents');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body.items.map((i) => i.priority), ['High', 'Medium', 'Low']);
  assert.equal(res.body.pageSize, 10);
});

test('AC-03: PATCH status สำเร็จ, Closed ได้ 400 และ Status เดิมไม่เปลี่ยน, id ไม่มีได้ 404', async () => {
  const api = setup();
  const { id } = (await api.post('/api/incidents').send(body)).body;
  const ok = await api.patch(`/api/incidents/${id}/status`).send({ status: 'In Progress' });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.status, 'In Progress');
  const bad = await api.patch(`/api/incidents/${id}/status`).send({ status: 'Closed' });
  assert.equal(bad.status, 400);
  assert.equal((await api.get('/api/incidents')).body.items[0].status, 'In Progress');
  assert.equal((await api.patch('/api/incidents/nope/status').send({ status: 'Open' })).status, 404);
});

test('PATCH owner และรายละเอียด: สำเร็จ 200, ค่าว่าง 400, id ไม่มี 404 (FR4, FR8)', async () => {
  const api = setup();
  const { id } = (await api.post('/api/incidents').send(body)).body;
  assert.equal((await api.patch(`/api/incidents/${id}/owner`).send({ owner: 'สมหญิง' })).body.owner, 'สมหญิง');
  assert.equal((await api.patch(`/api/incidents/${id}/owner`).send({ owner: '' })).status, 400);
  const d = await api.patch(`/api/incidents/${id}`).send({ title: 'ใหม่', description: '', priority: 'Low' });
  assert.equal(d.status, 200);
  assert.equal(d.body.priority, 'Low');
  assert.equal((await api.patch(`/api/incidents/${id}`).send({ title: '', priority: 'Low' })).status, 400);
  assert.equal((await api.patch('/api/incidents/nope').send(body)).status, 404);
});

test('DELETE: 204 แล้วลบซ้ำได้ 404 (FR5)', async () => {
  const api = setup();
  const { id } = (await api.post('/api/incidents').send(body)).body;
  assert.equal((await api.delete(`/api/incidents/${id}`)).status, 204);
  assert.equal((await api.delete(`/api/incidents/${id}`)).status, 404);
  assert.equal((await api.get('/api/incidents')).body.total, 0);
});

test('GET: filter status=Closed และ page=0/abc ได้ 400 (FR6.3, FR7.3)', async () => {
  const api = setup();
  assert.equal((await api.get('/api/incidents?status=Closed')).status, 400);
  assert.equal((await api.get('/api/incidents?page=0')).status, 400);
  assert.equal((await api.get('/api/incidents?page=abc')).status, 400);
  assert.equal((await api.get('/api/incidents?q=a&q=b')).status, 400);
});

test('JSON เสียได้ 400 และ body ใหญ่เกินได้ 413 (NFR3)', async () => {
  const api = setup();
  const bad = await api.post('/api/incidents').set('Content-Type', 'application/json').send('{not json');
  assert.equal(bad.status, 400);
  assert.ok(bad.body.error);
  const big = await api.post('/api/incidents').send({ ...body, description: 'x'.repeat(20000) });
  assert.equal(big.status, 413);
});

test('history และ alerts ตอบถูกต้อง (FR9, FR10.3)', async () => {
  const api = setup();
  const { id } = (await api.post('/api/incidents').send(body)).body;
  await api.patch(`/api/incidents/${id}/status`).send({ status: 'In Progress' });
  const h = await api.get(`/api/incidents/${id}/history`);
  assert.equal(h.status, 200);
  assert.equal(h.body.length, 2);
  assert.equal((await api.get('/api/incidents/nope/history')).status, 404);
  assert.deepEqual((await api.get('/api/alerts')).body, { highUnresolved: 1 });
  await api.patch(`/api/incidents/${id}/status`).send({ status: 'Resolved' });
  assert.deepEqual((await api.get('/api/alerts')).body, { highUnresolved: 0 });
});

test('NFR3: ข้อความที่มี <script> ถูกเก็บเป็นข้อความธรรมดาและ endpoint ที่ไม่มีได้ 404 JSON', async () => {
  const api = setup();
  const res = await api.post('/api/incidents').send({ ...body, title: '<script>alert(1)</script>' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, '<script>alert(1)</script>');
  assert.match(res.headers['content-type'], /json/);
  const nf = await api.get('/api/nothing');
  assert.equal(nf.status, 404);
  assert.ok(nf.body.error);
});
