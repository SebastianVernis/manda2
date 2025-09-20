const http = require('http');

// Test through Caddy proxy
function testProxy() {
  const postData = JSON.stringify({
    nombre: "Test Proxy",
    email: "proxy@example.com", 
    password: "test123",
    telefono: "1234567890",
    direccion: "Test Address",
    rol: "cliente"
  });

  const options = {
    hostname: 'localhost',
    port: 80,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': 'https://yega.3.85.74.100.nip.io',
      'Host': '3.85.74.100'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Proxy Status: ${res.statusCode}`);
    console.log(`Proxy Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Proxy Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Proxy request failed: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

console.log('Testing Caddy proxy...');
testProxy();