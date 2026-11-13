const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required in backend/.env');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await Promise.all([
    require('../models/User').init(),
    require('../models/Product').init()
  ]);
  console.log('MongoDB Connected');
}

module.exports = connectDB;
