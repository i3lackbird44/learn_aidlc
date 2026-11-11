'use strict';

const path = require('node:path');
const express = require('express');
const { createService, ValidationError, NotFoundError } = require('./service');

function createApp({ store }) {
  if (!store) throw new Error('createApp ต้องการ store');
  const service = createService(store);
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  const api = express.Router();

  api.post('/incidents', (req, res) => {
    res.status(201).json(service.createIncident(req.body));
  });
  api.get('/incidents', (req, res) => {
    res.json(service.listIncidents(req.query));
  });
  api.patch('/incidents/:id', (req, res) => {
    res.json(service.updateDetails(req.params.id, req.body));
  });
  api.patch('/incidents/:id/status', (req, res) => {
    res.json(service.updateStatus(req.params.id, req.body));
  });
  api.patch('/incidents/:id/owner', (req, res) => {
    res.json(service.updateOwner(req.params.id, req.body));
  });
  api.delete('/incidents/:id', (req, res) => {
    service.deleteIncident(req.params.id);
    res.status(204).end();
  });
  api.get('/incidents/:id/history', (req, res) => {
    res.json(service.getHistory(req.params.id));
  });
  api.get('/alerts', (req, res) => {
    res.json(service.getAlerts());
  });
  api.use((req, res) => {
    res.status(404).json({ error: 'ไม่พบ endpoint ที่ระบุ', fields: {} });
  });

  app.use('/api', api);
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, fields: err.fields });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: err.message, fields: {} });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'JSON ที่ส่งมาอ่านไม่ได้', fields: {} });
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'ข้อมูลที่ส่งมามีขนาดใหญ่เกินไป', fields: {} });
    }
    console.error('ข้อผิดพลาดที่ไม่คาดคิด:', err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในระบบ', fields: {} });
  });

  return app;
}

module.exports = { createApp };
