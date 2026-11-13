const fs = require('node:fs');
const path = require('node:path');
const newman = require('newman');
const output = path.join(__dirname, '../../docs/evidence');
fs.mkdirSync(output, { recursive: true });

newman.run({
  collection: require('../../docs/postman/Phase2.postman_collection.json'),
  environment: require('../../docs/postman/Local.postman_environment.json'),
  reporters: ['cli', 'json', 'htmlextra'],
  reporter: {
    json: { export: path.join(output, 'newman-results.json') },
    htmlextra: { export: path.join(output, 'postman-test-report.html'), browserTitle: 'Phase 2 API Test Results', title: 'Phase 2 Backend API Tests' }
  }
}, (error, summary) => {
  if (error || summary.run.failures.length) {
    console.error(error ? error.message : 'Postman assertions failed');
    process.exitCode = 1;
  }
});
