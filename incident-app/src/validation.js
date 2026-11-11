'use strict';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

const MAX_TITLE = 200;
const MAX_DESCRIPTION = 2000;
const MAX_OWNER = 100;

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// คืนสตริงที่ตัดช่องว่างแล้ว หรือ null ถ้าไม่ใช่สตริง
function trimmed(v) {
  return typeof v === 'string' ? v.trim() : null;
}

function checkTitle(raw, errors) {
  const v = trimmed(raw);
  if (v === null || v === '') {
    errors.title = 'กรุณากรอก Title';
    return undefined;
  }
  if (v.length > MAX_TITLE) {
    errors.title = `Title ต้องไม่เกิน ${MAX_TITLE} ตัวอักษร`;
    return undefined;
  }
  return v;
}

function checkDescription(raw, errors) {
  if (raw === undefined || raw === null) return '';
  if (typeof raw !== 'string') {
    errors.description = 'Description ต้องเป็นข้อความ';
    return undefined;
  }
  const v = raw.trim();
  if (v.length > MAX_DESCRIPTION) {
    errors.description = `Description ต้องไม่เกิน ${MAX_DESCRIPTION} ตัวอักษร`;
    return undefined;
  }
  return v;
}

function checkPriority(raw, errors) {
  if (typeof raw !== 'string' || !PRIORITIES.includes(raw)) {
    errors.priority = `Priority ต้องเป็น ${PRIORITIES.join(', ')} เท่านั้น`;
    return undefined;
  }
  return raw;
}

function checkOwner(raw, errors) {
  const v = trimmed(raw);
  if (v === null || v === '') {
    errors.owner = 'กรุณากรอก Owner';
    return undefined;
  }
  if (v.length > MAX_OWNER) {
    errors.owner = `Owner ต้องไม่เกิน ${MAX_OWNER} ตัวอักษร`;
    return undefined;
  }
  return v;
}

function checkStatus(raw, errors) {
  if (typeof raw !== 'string' || !STATUSES.includes(raw)) {
    errors.status = `Status ต้องเป็น ${STATUSES.join(', ')} เท่านั้น`;
    return undefined;
  }
  return raw;
}

function bodyCheck(body) {
  if (!isPlainObject(body)) return { body: {}, errors: { body: 'ข้อมูลที่ส่งมาต้องเป็น JSON object' } };
  return { body, errors: {} };
}

function validateCreate(input) {
  const { body, errors } = bodyCheck(input);
  if (errors.body) return { value: null, errors };
  const value = {
    title: checkTitle(body.title, errors),
    description: checkDescription(body.description, errors),
    priority: checkPriority(body.priority, errors),
    owner: checkOwner(body.owner, errors),
  };
  return { value: Object.keys(errors).length ? null : value, errors };
}

// แก้ Title/Description/Priority ใช้กฎเดียวกับตอนสร้าง (FR8.2)
function validateDetails(input) {
  const { body, errors } = bodyCheck(input);
  if (errors.body) return { value: null, errors };
  const value = {
    title: checkTitle(body.title, errors),
    description: checkDescription(body.description, errors),
    priority: checkPriority(body.priority, errors),
  };
  return { value: Object.keys(errors).length ? null : value, errors };
}

function validateStatus(input) {
  const { body, errors } = bodyCheck(input);
  if (errors.body) return { value: null, errors };
  const status = checkStatus(body.status, errors);
  return { value: Object.keys(errors).length ? null : { status }, errors };
}

function validateOwner(input) {
  const { body, errors } = bodyCheck(input);
  if (errors.body) return { value: null, errors };
  const owner = checkOwner(body.owner, errors);
  return { value: Object.keys(errors).length ? null : { owner }, errors };
}

function validateListQuery(query) {
  const errors = {};
  const q = isPlainObject(query) ? query : {};
  const value = { q: '', status: null, priority: null, page: 1 };

  if (q.q !== undefined) {
    if (typeof q.q !== 'string') errors.q = 'คำค้นหาต้องเป็นข้อความ';
    else value.q = q.q.trim();
  }
  if (q.status !== undefined && q.status !== '') {
    if (typeof q.status !== 'string' || !STATUSES.includes(q.status)) {
      errors.status = `ตัวกรอง Status ต้องเป็น ${STATUSES.join(', ')} เท่านั้น`;
    } else value.status = q.status;
  }
  if (q.priority !== undefined && q.priority !== '') {
    if (typeof q.priority !== 'string' || !PRIORITIES.includes(q.priority)) {
      errors.priority = `ตัวกรอง Priority ต้องเป็น ${PRIORITIES.join(', ')} เท่านั้น`;
    } else value.priority = q.priority;
  }
  if (q.page !== undefined) {
    if (typeof q.page !== 'string' || !/^[1-9][0-9]{0,8}$/.test(q.page)) {
      errors.page = 'หมายเลขหน้าต้องเป็นจำนวนเต็มบวก';
    } else value.page = Number(q.page);
  }
  return { value: Object.keys(errors).length ? null : value, errors };
}

module.exports = {
  PRIORITIES,
  STATUSES,
  validateCreate,
  validateDetails,
  validateStatus,
  validateOwner,
  validateListQuery,
};
