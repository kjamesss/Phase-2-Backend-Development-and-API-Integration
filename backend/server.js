require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');

async function start() {
  await connectDB();
  const port = Number(process.env.PORT || 5000);
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Server running on port ${port}`);
  });
  server.on('error', async (error) => {
    console.error(`Server error: ${error.code || 'unknown'}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  const shutdown = () => server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error(error.message.startsWith('MONGO_URI')
    ? error.message : 'Startup failed. Check MongoDB availability and backend/.env.');
  process.exitCode = 1;
});
