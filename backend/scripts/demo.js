// Demonstrate the backend directly through HTTP. No frontend is required.
const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:5000';
async function call(method, route, expected, body) {
  console.log(`\n${method} ${route}`);
  if (body) console.log('Request:', JSON.stringify(body, null, 2));
  const response = await fetch(baseUrl + route, {
    method, headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json();
  console.log(`HTTP ${response.status}`);
  console.log(JSON.stringify(data, null, 2));
  if (response.status !== expected) throw new Error(`Expected HTTP ${expected}`);
  return data;
}

async function main() {
  console.log('Phase 2 Backend Demonstration');
  console.log('Actual HTTP requests to ' + baseUrl);
  console.log('Run time: ' + new Date().toISOString());
  await call('GET', '/api/health', 200);
  const user = await call('POST', '/api/users', 201, {
    name: 'Demo User', email: `demo.${Date.now()}@example.test`, password: 'LabPass123!', role: 'user'
  });
  await call('GET', `/api/users/${user._id}`, 200);
  await call('PUT', `/api/users/${user._id}`, 200, { name: 'Updated Demo User' });
  await call('DELETE', `/api/users/${user._id}`, 200);
  await call('GET', `/api/users/${user._id}`, 404);
  const product = await call('POST', '/api/products', 201, { name: 'Demo Notebook', price: 45.5, stock: 10 });
  await call('GET', `/api/products/${product._id}`, 200);
  await call('PUT', `/api/products/${product._id}`, 200, { price: 50, stock: 8 });
  await call('DELETE', `/api/products/${product._id}`, 200);
  await call('GET', `/api/products/${product._id}`, 404);
  console.log('\nDemonstration complete. Both sample records were deleted.');
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
