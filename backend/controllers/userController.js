const { randomBytes, scrypt } = require('node:crypto');
const { promisify } = require('node:util');
const User = require('../models/User');
const crudController = require('./crudController');
const deriveKey = promisify(scrypt);

module.exports = crudController(User, 'User', async body => {
  const data = { ...body };
  if (data.password !== undefined) {
    const salt = randomBytes(16).toString('hex');
    const key = await deriveKey(data.password, salt, 64);
    data.password = `scrypt:${salt}:${key.toString('hex')}`;
  }
  return data;
});
