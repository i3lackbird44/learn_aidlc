/* helper แสดงผล ใช้ได้ทั้งในเบราว์เซอร์ (window.IncidentUI) และใน Node (module.exports)
 * ข้อความจากผู้ใช้ต้องแสดงผ่าน textContent เท่านั้น ห้ามแทรกเป็น HTML (NFR3) */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.IncidentUI = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var PRIORITY_CLASS = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };

  // ตั้งข้อความให้ element แบบไม่ตีความ HTML
  function setText(el, text) {
    el.textContent = text === null || text === undefined ? '' : String(text);
    return el;
  }

  // แปลงคำตอบข้อผิดพลาดจาก API เป็น { fields: {ช่อง: ข้อความ}, message: ข้อความรวม }
  function parseApiError(status, payload) {
    var fields = {};
    var message = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
    if (payload && typeof payload === 'object') {
      if (payload.fields && typeof payload.fields === 'object') {
        Object.keys(payload.fields).forEach(function (k) {
          if (typeof payload.fields[k] === 'string') fields[k] = payload.fields[k];
        });
      }
      if (typeof payload.error === 'string' && payload.error) message = payload.error;
    }
    if (status >= 500) message = 'เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่ภายหลัง';
    return { fields: fields, message: message, status: status };
  }

  function alertMessage(count) {
    if (!count || count < 1) return '';
    return 'มี Incident Priority High ที่ยังไม่ Resolved จำนวน ' + count + ' รายการ';
  }

  function priorityBadge(priority) {
    return { text: String(priority), className: 'badge ' + (PRIORITY_CLASS[priority] || 'badge-unknown') };
  }

  function pageLabel(page, totalPages) {
    return 'หน้า ' + page + ' / ' + totalPages;
  }

  function historyLabel(entry) {
    var when = entry.at || '';
    if (entry.action === 'create') return when + ' สร้าง Incident';
    return when + ' แก้ ' + entry.field + ': "' + entry.from + '" -> "' + entry.to + '"';
  }

  return {
    setText: setText,
    parseApiError: parseApiError,
    alertMessage: alertMessage,
    priorityBadge: priorityBadge,
    pageLabel: pageLabel,
    historyLabel: historyLabel,
  };
});
