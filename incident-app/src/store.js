'use strict';

const crypto = require('node:crypto');

// ที่เก็บข้อมูลใน memory คืนสำเนาเสมอ เพื่อกันการแก้ข้อมูลจากภายนอก
function createStore() {
  const incidents = new Map();
  const histories = new Map();

  const copy = (obj) => ({ ...obj });

  return {
    insert(data) {
      const incident = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      incidents.set(incident.id, incident);
      histories.set(incident.id, []);
      return copy(incident);
    },

    get(id) {
      const found = incidents.get(id);
      return found ? copy(found) : null;
    },

    // เรียงใหม่ไปเก่า: Map คงลำดับการเพิ่ม จึงกลับลำดับ (เวลา ISO ซ้ำกันได้ในมิลลิวินาทีเดียวกัน)
    list() {
      return Array.from(incidents.values()).reverse().map(copy);
    },

    update(id, patch) {
      const found = incidents.get(id);
      if (!found) return null;
      Object.assign(found, patch);
      return copy(found);
    },

    remove(id) {
      histories.delete(id);
      return incidents.delete(id);
    },

    addHistory(id, entry) {
      const log = histories.get(id);
      if (!log) return null;
      const record = { ...entry, at: new Date().toISOString() };
      log.push(record);
      return copy(record);
    },

    getHistory(id) {
      const log = histories.get(id);
      return log ? log.map(copy) : null;
    },
  };
}

module.exports = { createStore };
