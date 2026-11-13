'use strict';

const $ = id => document.getElementById(id);
const state = { resource: 'users', records: [], page: 1, limit: 10, editId: null, deleteRecord: null, busy: false };

function showNotice(message, error = false) {
  $('notice').textContent = message;
  $('notice').classList.toggle('error', error);
  $('notice').hidden = !message;
}

// All records come from the Express API. No browser-only data store is used.
async function api(path, options = {}, capture = true) {
  const response = await fetch(path, {
    ...options, headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await response.json();
  if (capture) {
    $('request-line').textContent = `${options.method || 'GET'} ${path}`;
    $('http-status').textContent = `HTTP ${response.status}`;
    $('http-status').classList.toggle('error', !response.ok);
    $('response-json').textContent = JSON.stringify(data, null, 2);
  }
  if (!response.ok) throw new Error(data.message || 'The request failed. Please try again.');
  return data;
}

function setBusy(value) {
  state.busy = value;
  document.querySelectorAll('button').forEach(button => { button.disabled = value; });
  if (!value) {
    $('previous').disabled = state.page <= 1;
    $('next').disabled = state.records.length < state.limit;
  }
}

function resetForm() {
  state.editId = null;
  $('record-form').reset();
  const user = state.resource === 'users';
  $('form-title').textContent = user ? 'Add user' : 'Add product';
  $('form-help').textContent = `Enter the details below to create a ${user ? 'user' : 'product'}.`;
  $('save-button').textContent = user ? 'Create user' : 'Create product';
  $('cancel-edit').hidden = true;
  $('password').required = user;
  $('password-note').textContent = '8 to 128 characters';
  $('name').maxLength = user ? 80 : 120;
}

function cell(row, value) {
  const element = document.createElement('td');
  element.textContent = String(value);
  row.append(element);
}

function renderRecords() {
  const user = state.resource === 'users';
  $('table-head').replaceChildren();
  const header = document.createElement('tr');
  for (const title of user ? ['Name', 'Email', 'Role', 'Actions'] : ['Name', 'Price', 'Stock', 'Actions']) {
    const th = document.createElement('th');
    th.scope = 'col'; th.textContent = title; header.append(th);
  }
  $('table-head').append(header);
  $('table-body').replaceChildren();
  const query = $('search').value.trim().toLowerCase();
  const filtered = state.records.filter(record =>
    [record.name, user ? record.email : record.description].join(' ').toLowerCase().includes(query));
  for (const record of filtered) {
    const row = document.createElement('tr');
    cell(row, record.name);
    cell(row, user ? record.email : Number(record.price).toFixed(2));
    cell(row, user ? record.role : record.stock);
    const actions = document.createElement('td');
    const group = document.createElement('div'); group.className = 'row-actions';
    for (const action of ['Edit', 'Delete']) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = action;
      button.setAttribute('aria-label', `${action} ${record.name}`);
      button.classList.toggle('delete', action === 'Delete');
      button.addEventListener('click', () => action === 'Edit' ? editRecord(record) : requestDelete(record));
      group.append(button);
    }
    actions.append(group); row.append(actions); $('table-body').append(row);
  }
  $('empty-state').hidden = filtered.length > 0;
  $('empty-state').textContent = query ? 'No matching records on this page.'
    : `No ${state.resource} yet. Add your first ${user ? 'user' : 'product'} using the form.`;
  const label = state.records.length === 1 ? (user ? 'user' : 'product') : state.resource;
  $('record-count').textContent = `${state.records.length} ${label} on this page`;
  $('page-label').textContent = `Page ${state.page}`;
  $('previous').disabled = state.busy || state.page <= 1;
  $('next').disabled = state.busy || state.records.length < state.limit;
}

async function loadRecords(capture = true) {
  state.records = await api(`/api/${state.resource}?page=${state.page}&limit=${state.limit}`, {}, capture);
  renderRecords();
}

function editRecord(record) {
  if (state.busy) return;
  resetForm(); state.editId = record._id;
  const user = state.resource === 'users';
  $('form-title').textContent = user ? 'Edit user' : 'Edit product';
  $('form-help').textContent = 'Update the details and save your changes.';
  $('save-button').textContent = 'Save changes'; $('cancel-edit').hidden = false;
  $('name').value = record.name;
  if (user) {
    $('email').value = record.email; $('role').value = record.role;
    $('password').required = false;
    $('password-note').textContent = 'leave blank to keep the current password';
  } else {
    $('description').value = record.description;
    $('price').value = record.price; $('stock').value = record.stock;
  }
  $('name').focus(); showNotice('');
}

function requestDelete(record) {
  if (state.busy) return;
  state.deleteRecord = record;
  $('delete-description').textContent = `Delete ${record.name}? This will remove the record from the database.`;
  $('delete-dialog').showModal();
}

async function saveRecord(event) {
  event.preventDefault();
  if (state.busy) return;
  setBusy(true); showNotice('');
  try {
    const editing = Boolean(state.editId);
    const user = state.resource === 'users';
    const body = { name: $('name').value.trim() };
    if (user) {
      body.email = $('email').value.trim(); body.role = $('role').value;
      if ($('password').value) body.password = $('password').value;
    } else {
      body.description = $('description').value.trim();
      body.price = Number($('price').value); body.stock = Number($('stock').value);
    }
    const path = `/api/${state.resource}${editing ? '/' + state.editId : ''}`;
    await api(path, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(body) });
    resetForm();
    if (!editing) state.page = 1;
    await loadRecords(false);
    showNotice(`${user ? 'User' : 'Product'} ${editing ? 'updated' : 'created'} successfully.`);
  } catch (error) { showNotice(error.message, true); }
  finally { setBusy(false); }
}

async function deleteRecord() {
  if (state.busy || !state.deleteRecord) return;
  setBusy(true);
  const record = state.deleteRecord;
  try {
    await api(`/api/${state.resource}/${record._id}`, { method: 'DELETE' });
    $('delete-dialog').close(); state.deleteRecord = null;
    if (state.editId === record._id) resetForm();
    if (state.records.length === 1 && state.page > 1) state.page -= 1;
    await loadRecords(false);
    showNotice(`${state.resource === 'users' ? 'User' : 'Product'} deleted successfully.`);
  } catch (error) { $('delete-dialog').close(); showNotice(error.message, true); }
  finally { setBusy(false); }
}

async function refresh(capture = true) {
  setBusy(true);
  try { await loadRecords(capture); }
  catch (error) { showNotice(error.message, true); }
  finally { setBusy(false); }
}

for (const button of document.querySelectorAll('[data-resource]')) {
  button.addEventListener('click', async () => {
    if (state.busy || state.resource === button.dataset.resource) return;
    state.resource = button.dataset.resource; state.page = 1; state.records = [];
    const user = state.resource === 'users';
    $('user-fields').hidden = !user; $('user-fields').disabled = !user;
    $('product-fields').hidden = user; $('product-fields').disabled = user;
    $('records-title').textContent = user ? 'Users' : 'Products';
    $('search').value = ''; $('search').placeholder = user ? 'Search by name or email' : 'Search by name or description';
    document.querySelectorAll('[data-resource]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    resetForm(); showNotice(''); renderRecords(); await refresh();
  });
}
$('record-form').addEventListener('submit', saveRecord);
$('cancel-edit').addEventListener('click', resetForm);
$('search').addEventListener('input', renderRecords);
$('refresh').addEventListener('click', () => { showNotice(''); refresh(); checkConnection(); });
$('previous').addEventListener('click', () => { state.page -= 1; refresh(); });
$('next').addEventListener('click', () => { state.page += 1; refresh(); });
$('cancel-delete').addEventListener('click', () => { $('delete-dialog').close(); state.deleteRecord = null; });
$('delete-dialog').addEventListener('cancel', () => { state.deleteRecord = null; });
$('confirm-delete').addEventListener('click', deleteRecord);

async function checkConnection() {
  try {
    const health = await api('/api/health', {}, false);
    $('connection').textContent = health.database === 'connected' ? 'Database connected' : 'Database unavailable';
    $('connection').classList.toggle('connected', health.database === 'connected');
  } catch { $('connection').textContent = 'Connection unavailable'; $('connection').classList.remove('connected'); }
}

renderRecords(); checkConnection(); refresh();
