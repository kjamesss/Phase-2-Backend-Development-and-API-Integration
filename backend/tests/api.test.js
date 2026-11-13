const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const Product = require('../models/Product');
let database;

before(async () => {
  database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri('phase2_tests'));
  await User.init();
});
after(async () => {
  await mongoose.disconnect();
  if (database) await database.stop();
});

test('health confirms an active MongoDB connection', async () => {
  const res = await request(app).get('/api/health').expect(200);
  assert.deepEqual(res.body, { status: 'ok', database: 'connected' });
});

test('frontend and assets are served while API routes keep JSON responses', async () => {
  const page = await request(app).get('/').expect(200).expect('Content-Type', /html/);
  assert.match(page.text, /User and Product Management/);
  assert.match(page.text, /src="\/app.js"/);
  await request(app).get('/app.js').expect(200).expect('Content-Type', /javascript/);
  await request(app).get('/styles.css').expect(200).expect('Content-Type', /css/);
  await request(app).get('/api/users').expect(200).expect('Content-Type', /json/);
  await request(app).get('/api/not-a-route').expect(404).expect('Content-Type', /json/);
});

test('users complete CRUD with persisted updates and password protection', async () => {
  const payload = { name: 'API Test User', email: 'crud@example.test', password: 'LabPass123!', role: 'user' };
  const created = await request(app).post('/api/users').send(payload).expect(201);
  const id = created.body._id;
  assert.equal(created.body.password, undefined);
  const stored = await User.findById(id).select('+password');
  assert.match(stored.password, /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/);
  assert.notEqual(stored.password, payload.password);
  const list = await request(app).get('/api/users').expect(200);
  assert.ok(list.body.some(user => user._id === id));
  assert.equal(list.body.find(user => user._id === id).password, undefined);
  await request(app).get(`/api/users/${id}`).expect(200);
  const update = await request(app).put(`/api/users/${id}`).send({ name: 'Updated Test User', password: 'NewLabPass123!' }).expect(200);
  assert.equal(update.body.name, 'Updated Test User');
  assert.equal(update.body.password, undefined);
  assert.equal((await User.findById(id)).name, 'Updated Test User');
  assert.notEqual((await User.findById(id).select('+password')).password, stored.password);
  await request(app).delete(`/api/users/${id}`).expect(200);
  assert.equal(await User.findById(id), null);
  await request(app).get(`/api/users/${id}`).expect(404);
});

test('product CRUD persists changes and deletion', async () => {
  const res = await request(app).post('/api/products').send({ name: 'Notebook', price: 45.5, stock: 10 }).expect(201);
  const id = res.body._id;
  assert.equal((await Product.findById(id)).price, 45.5);
  const list = await request(app).get('/api/products').expect(200);
  assert.ok(list.body.some(item => item._id === id));
  await request(app).get(`/api/products/${id}`).expect(200);
  await request(app).put(`/api/products/${id}`).send({ price: 50, stock: 8 }).expect(200);
  assert.equal((await Product.findById(id)).stock, 8);
  await request(app).delete(`/api/products/${id}`).expect(200);
  assert.equal(await Product.findById(id), null);
  await request(app).get(`/api/products/${id}`).expect(404);
});

const invalidUsers = [
  ['missing fields', { name: 'Only Name' }],
  ['invalid email', { name: 'Test User', email: 'bad', password: 'LabPass123!' }],
  ['short password', { name: 'Test User', email: 'short@example.test', password: 'short' }],
  ['empty password', { name: 'Test User', email: 'empty@example.test', password: '' }],
  ['invalid role', { name: 'Test User', email: 'role@example.test', password: 'LabPass123!', role: 'root' }],
  ['null field', { name: null, email: 'null@example.test', password: 'LabPass123!' }],
  ['object injection', { name: { $ne: '' }, email: 'inject@example.test', password: 'LabPass123!' }],
  ['unknown field', { name: 'Test User', email: 'unknown@example.test', password: 'LabPass123!', extra: true }],
  ['array body', []], ['empty object', {}]
];
for (const [name, body] of invalidUsers) test(`users reject ${name}`, async () => {
  await request(app).post('/api/users').send(body).expect(400);
});

test('email is normalized and unique on create and update', async () => {
  const first = await request(app).post('/api/users').send({ name: 'First User', email: 'FIRST@EXAMPLE.TEST', password: 'LabPass123!' }).expect(201);
  assert.equal(first.body.email, 'first@example.test');
  await request(app).post('/api/users').send({ name: 'Duplicate', email: 'first@example.test', password: 'LabPass123!' }).expect(409);
  const second = await request(app).post('/api/users').send({ name: 'Second User', email: 'second@example.test', password: 'LabPass123!' }).expect(201);
  await request(app).put(`/api/users/${second.body._id}`).send({ email: 'first@example.test' }).expect(409);
  await User.deleteMany({});
});

const invalidProducts = [
  ['negative price', { name: 'Test Product', price: -1 }],
  ['negative stock', { name: 'Test Product', price: 5, stock: -1 }],
  ['fractional stock', { name: 'Test Product', price: 5, stock: 1.5 }],
  ['string price', { name: 'Test Product', price: '5' }],
  ['null price', { name: 'Test Product', price: null }]
];
for (const [name, body] of invalidProducts) test(`products reject ${name}`, async () => {
  await request(app).post('/api/products').send(body).expect(400);
});

for (const resource of ['users', 'products']) {
  for (const method of ['get', 'put', 'delete']) {
    test(`${resource} ${method} rejects malformed ID`, async () => {
      await request(app)[method](`/api/${resource}/not-an-id`).send({ name: 'Valid Name' }).expect(400);
    });
    test(`${resource} ${method} returns 404 for missing ID`, async () => {
      await request(app)[method](`/api/${resource}/000000000000000000000000`).send({ name: 'Valid Name' }).expect(404);
    });
  }
}
test('invalid update does not overwrite a stored product', async () => {
  const created = await Product.create({ name: 'Valid Product', price: 12, stock: 3 });
  await request(app).put(`/api/products/${created.id}`).send({ stock: -5 }).expect(400);
  assert.equal((await Product.findById(created.id)).stock, 3);
});
test('list endpoints enforce pagination bounds', async () => {
  for (const query of ['page=0', 'page=x', 'limit=101', 'limit=-1', 'limit=1.5']) {
    await request(app).get(`/api/products?${query}`).expect(400);
  }
  const page = await request(app).get('/api/products?page=1&limit=1').expect(200);
  assert.ok(page.body.length <= 1);
});
test('invalid JSON and oversized JSON have useful status codes', async () => {
  await request(app).post('/api/users').set('Content-Type', 'application/json').send('{bad').expect(400);
  await request(app).post('/api/users').send({ name: 'x'.repeat(40000) }).expect(413);
});
test('unknown route returns a JSON 404', async () => {
  const res = await request(app).get('/unknown').expect(404);
  assert.equal(res.body.message, 'Route not found');
});
test('frontend origin receives CORS headers', async () => {
  const res = await request(app).get('/api/health').set('Origin', 'http://localhost:3000').expect(200);
  assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:3000');
});
test('health returns 503 when MongoDB is disconnected', async () => {
  await mongoose.disconnect();
  await request(app).get('/api/health').expect(503);
  await mongoose.connect(database.getUri('phase2_tests'));
});
