'use strict';

const validation = require('./validation');

const PAGE_SIZE = 10;

class ValidationError extends Error {
  constructor(fields) {
    super('ข้อมูลไม่ถูกต้อง');
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

class NotFoundError extends Error {
  constructor(id) {
    super('ไม่พบ Incident ที่ระบุ');
    this.name = 'NotFoundError';
    this.id = id;
  }
}

function createService(store) {
  function requireValid({ value, errors }) {
    if (!value) throw new ValidationError(errors);
    return value;
  }

  function requireExisting(id) {
    const found = typeof id === 'string' ? store.get(id) : null;
    if (!found) throw new NotFoundError(id);
    return found;
  }

  // บันทึกประวัติเฉพาะช่องที่ค่าเปลี่ยนจริง
  function recordChanges(id, action, before, after, fields) {
    for (const field of fields) {
      if (before[field] !== after[field]) {
        store.addHistory(id, { action, field, from: before[field], to: after[field] });
      }
    }
  }

  return {
    createIncident(input) {
      const v = requireValid(validation.validateCreate(input));
      const incident = store.insert({ ...v, status: 'Open' });
      store.addHistory(incident.id, { action: 'create', field: null, from: null, to: null });
      return incident;
    },

    listIncidents(query) {
      const f = requireValid(validation.validateListQuery(query));
      const needle = f.q.toLowerCase();
      const matched = store.list().filter((i) => {
        if (f.status && i.status !== f.status) return false;
        if (f.priority && i.priority !== f.priority) return false;
        if (needle) {
          const hay = `${i.title}\n${i.description}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        return true;
      });
      const total = matched.length;
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const start = (f.page - 1) * PAGE_SIZE;
      return {
        items: matched.slice(start, start + PAGE_SIZE),
        total,
        page: f.page,
        pageSize: PAGE_SIZE,
        totalPages,
      };
    },

    updateDetails(id, input) {
      const before = requireExisting(id);
      const v = requireValid(validation.validateDetails(input));
      const after = store.update(id, v);
      recordChanges(id, 'update', before, after, ['title', 'description', 'priority']);
      return after;
    },

    updateStatus(id, input) {
      const before = requireExisting(id);
      const v = requireValid(validation.validateStatus(input));
      const after = store.update(id, v);
      recordChanges(id, 'status', before, after, ['status']);
      return after;
    },

    updateOwner(id, input) {
      const before = requireExisting(id);
      const v = requireValid(validation.validateOwner(input));
      const after = store.update(id, v);
      recordChanges(id, 'owner', before, after, ['owner']);
      return after;
    },

    deleteIncident(id) {
      requireExisting(id);
      store.remove(id);
    },

    getHistory(id) {
      requireExisting(id);
      return store.getHistory(id);
    },

    getAlerts() {
      const count = store.list().filter((i) => i.priority === 'High' && i.status !== 'Resolved').length;
      return { highUnresolved: count };
    },
  };
}

module.exports = { createService, ValidationError, NotFoundError, PAGE_SIZE };
