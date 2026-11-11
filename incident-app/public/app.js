/* โค้ดหน้าเว็บ เรียก REST API ข้อความที่ผู้ใช้กรอกแสดงด้วย textContent เท่านั้น (NFR3) */
(function () {
  'use strict';

  var UI = window.IncidentUI;
  var STATUSES = ['Open', 'In Progress', 'Resolved'];
  var PRIORITIES = ['Low', 'Medium', 'High'];
  var TOAST_MS = 5000;

  var state = { page: 1, totalPages: 1 };
  var toastTimer = null;

  function $(id) { return document.getElementById(id); }

  function el(tag, opts) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.className) node.className = opts.className;
    if (opts.text !== undefined) UI.setText(node, opts.text);
    if (opts.testid) node.setAttribute('data-testid', opts.testid);
    if (opts.type) node.type = opts.type;
    return node;
  }

  // ---------- toast / alert ----------
  function showToast(message, isError) {
    var t = $('toast');
    UI.setText(t, message);
    t.className = 'toast' + (isError ? ' toast-error' : '');
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, TOAST_MS);
  }

  function updateAlertBar(count) {
    var bar = $('alert-bar');
    var msg = UI.alertMessage(count);
    UI.setText(bar, msg);
    bar.hidden = !msg;
  }

  // ---------- API ----------
  function api(method, url, body) {
    var opts = { method: method, headers: {} };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(function (res) {
      if (res.status === 204) return null;
      return res.json().catch(function () { return null; }).then(function (payload) {
        if (!res.ok) throw UI.parseApiError(res.status, payload);
        return payload;
      });
    }, function () {
      throw UI.parseApiError(0, { error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' });
    });
  }

  function reportError(err) {
    showToast(err && err.message ? err.message : 'เกิดข้อผิดพลาด', true);
  }

  // ---------- ข้อผิดพลาดใต้ช่อง ----------
  function setFieldErrors(container, fields) {
    var spans = container.querySelectorAll('[data-error-for]');
    for (var i = 0; i < spans.length; i++) {
      UI.setText(spans[i], fields[spans[i].getAttribute('data-error-for')] || '');
    }
  }

  // ---------- รายการ ----------
  function currentQuery() {
    var p = new URLSearchParams();
    var q = $('search').value.trim();
    if (q) p.set('q', q);
    if ($('filter-status').value) p.set('status', $('filter-status').value);
    if ($('filter-priority').value) p.set('priority', $('filter-priority').value);
    p.set('page', String(state.page));
    return p.toString();
  }

  function refresh() {
    return Promise.all([api('GET', '/api/incidents?' + currentQuery()), api('GET', '/api/alerts')])
      .then(function (r) {
        var data = r[0];
        // หน้าเกินจำนวนหน้า (เช่น ลบรายการสุดท้ายของหน้า) ให้ถอยกลับหน้าสุดท้าย
        if (data.items.length === 0 && data.total > 0 && state.page > 1) {
          state.page = data.totalPages;
          return refresh();
        }
        state.totalPages = data.totalPages;
        renderList(data);
        updateAlertBar(r[1].highUnresolved);
      })
      .catch(reportError);
  }

  function renderList(data) {
    var list = $('incident-list');
    list.textContent = '';
    var empty = $('empty-message');
    var filtering = $('search').value.trim() || $('filter-status').value || $('filter-priority').value;
    if (data.total === 0) {
      UI.setText(empty, filtering ? 'ไม่พบรายการที่ตรงเงื่อนไข' : 'ยังไม่มี Incident');
      empty.hidden = false;
    } else {
      empty.hidden = true;
    }
    data.items.forEach(function (incident) { list.appendChild(renderIncident(incident)); });
    UI.setText($('page-label'), UI.pageLabel(data.page, data.totalPages));
    $('btn-prev').disabled = data.page <= 1;
    $('btn-next').disabled = data.page >= data.totalPages;
  }

  function renderIncident(inc) {
    var li = el('li', { className: 'incident', testid: 'incident-' + inc.id });
    var head = el('div', { className: 'incident-head' });
    var badge = UI.priorityBadge(inc.priority);
    head.appendChild(el('span', { className: 'incident-title', text: inc.title, testid: 'incident-title' }));
    head.appendChild(el('span', { className: badge.className, text: badge.text, testid: 'incident-priority' }));
    head.appendChild(el('span', { text: 'Status: ' + inc.status, testid: 'incident-status' }));
    head.appendChild(el('span', { text: 'Owner: ' + inc.owner, testid: 'incident-owner' }));
    li.appendChild(head);
    li.appendChild(el('p', { className: 'incident-desc', text: inc.description, testid: 'incident-description' }));

    var actions = el('div', { className: 'incident-actions' });

    var statusSel = el('select', { testid: 'select-status' });
    STATUSES.forEach(function (s) {
      var o = el('option', { text: s });
      o.value = s;
      if (s === inc.status) o.selected = true;
      statusSel.appendChild(o);
    });
    statusSel.addEventListener('change', function () {
      api('PATCH', '/api/incidents/' + inc.id + '/status', { status: statusSel.value })
        .then(function () { showToast('เปลี่ยน Status แล้ว'); return refresh(); })
        .catch(function (e) { reportError(e); return refresh(); });
    });
    actions.appendChild(statusSel);

    var ownerInput = el('input', { type: 'text', testid: 'input-edit-owner' });
    ownerInput.value = inc.owner;
    ownerInput.maxLength = 100;
    var ownerBtn = el('button', { type: 'button', text: 'เปลี่ยน Owner', testid: 'btn-save-owner' });
    ownerBtn.addEventListener('click', function () {
      api('PATCH', '/api/incidents/' + inc.id + '/owner', { owner: ownerInput.value })
        .then(function () { showToast('เปลี่ยน Owner แล้ว'); return refresh(); })
        .catch(reportError);
    });
    actions.appendChild(ownerInput);
    actions.appendChild(ownerBtn);

    var editBtn = el('button', { type: 'button', text: 'แก้ไขรายละเอียด', testid: 'btn-edit' });
    var histBtn = el('button', { type: 'button', text: 'ดูประวัติ', testid: 'btn-history' });
    var delBtn = el('button', { type: 'button', text: 'ลบ', testid: 'btn-delete' });
    actions.appendChild(editBtn);
    actions.appendChild(histBtn);
    actions.appendChild(delBtn);
    li.appendChild(actions);

    editBtn.addEventListener('click', function () { toggleEditForm(li, inc); });
    histBtn.addEventListener('click', function () { showHistory(inc.id); });
    delBtn.addEventListener('click', function () {
      if (!window.confirm('ยืนยันการลบ Incident นี้?')) return;
      api('DELETE', '/api/incidents/' + inc.id)
        .then(function () { showToast('ลบ Incident แล้ว'); return refresh(); })
        .catch(function (e) { reportError(e); return refresh(); });
    });
    return li;
  }

  function labelled(text, control, errorField) {
    var label = el('label', { text: text + ' ' });
    label.appendChild(control);
    label.appendChild(el('span', { className: 'field-error', testid: 'error-edit-' + errorField }));
    label.lastChild.setAttribute('data-error-for', errorField);
    return label;
  }

  function toggleEditForm(li, inc) {
    var existing = li.querySelector('form');
    if (existing) { existing.remove(); return; }
    var form = el('form', { testid: 'edit-form' });
    form.noValidate = true;
    var title = el('input', { type: 'text', testid: 'input-edit-title' });
    title.value = inc.title;
    title.maxLength = 200;
    var desc = el('textarea', { testid: 'input-edit-description' });
    desc.value = inc.description;
    desc.rows = 2;
    desc.maxLength = 2000;
    var prio = el('select', { testid: 'input-edit-priority' });
    PRIORITIES.forEach(function (p) {
      var o = el('option', { text: p });
      o.value = p;
      if (p === inc.priority) o.selected = true;
      prio.appendChild(o);
    });
    form.appendChild(labelled('Title', title, 'title'));
    form.appendChild(labelled('Description', desc, 'description'));
    form.appendChild(labelled('Priority', prio, 'priority'));
    form.appendChild(el('button', { type: 'submit', text: 'บันทึกการแก้ไข', testid: 'btn-save-edit' }));
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      api('PATCH', '/api/incidents/' + inc.id, { title: title.value, description: desc.value, priority: prio.value })
        .then(function () { showToast('บันทึก Incident แล้ว'); return refresh(); })
        .catch(function (e) {
          setFieldErrors(form, e.fields || {});
          reportError(e);
        });
    });
    li.appendChild(form);
  }

  function showHistory(id) {
    api('GET', '/api/incidents/' + id + '/history')
      .then(function (entries) {
        var list = $('history-list');
        list.textContent = '';
        entries.forEach(function (e) { list.appendChild(el('li', { text: UI.historyLabel(e) })); });
        $('history-panel').hidden = false;
      })
      .catch(reportError);
  }

  // ---------- ฟอร์มสร้าง ----------
  $('create-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var payload = {
      title: form.elements.title.value,
      description: form.elements.description.value,
      priority: form.elements.priority.value,
      owner: form.elements.owner.value,
    };
    api('POST', '/api/incidents', payload)
      .then(function () {
        form.reset();
        setFieldErrors(form, {});
        showToast('บันทึก Incident แล้ว');
        state.page = 1;
        return refresh();
      })
      .catch(function (e) {
        setFieldErrors(form, e.fields || {});
        reportError(e);
      });
  });

  // ---------- ค้นหา กรอง แบ่งหน้า ----------
  function resetAndRefresh() { state.page = 1; refresh(); }
  var searchTimer = null;
  $('search').addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(resetAndRefresh, 250);
  });
  $('filter-status').addEventListener('change', resetAndRefresh);
  $('filter-priority').addEventListener('change', resetAndRefresh);
  $('btn-prev').addEventListener('click', function () {
    if (state.page > 1) { state.page -= 1; refresh(); }
  });
  $('btn-next').addEventListener('click', function () {
    if (state.page < state.totalPages) { state.page += 1; refresh(); }
  });
  $('btn-close-history').addEventListener('click', function () { $('history-panel').hidden = true; });

  refresh();
})();
