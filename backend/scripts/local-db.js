const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('node:path');
const fs = require('node:fs');

async function main() {
  const dbPath = path.join(__dirname, '..', '.local-db');
  fs.mkdirSync(dbPath, { recursive: true });
  const database = await MongoMemoryServer.create({
    instance: { ip: '127.0.0.1', port: 27017, dbPath, storageEngine: 'wiredTiger' }
  });
  console.log('Local MongoDB ready at mongodb://127.0.0.1:27017/phase2_backend');
  console.log('Data is stored in backend/.local-db. Press Ctrl+C to stop.');
  const shutdown = async () => { await database.stop(); process.exit(0); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
