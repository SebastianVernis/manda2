const http = require('http');

// Test direct backend connection
function testBackend() {
  const postData = JSON.stringify({
    nombre: "Test User",
    email: "test@example.com", 
    password: "test123",
    telefono: "1234567890",
    direccion: "Test Address",
    rol: "cliente"
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Request failed: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

// Test health endpoint first
function testHealth() {
  http.get('http://localhost:5000/api/health', (res) => {
    console.log(`Health check - Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Health Response:', data);
      console.log('\nTesting registration...');
      testBackend();
    });
  }).on('error', (e) => {
    console.error(`Health check failed: ${e.message}`);
  });
}

console.log('Testing backend connectivity...');
testHealth();