const http = require('http');

function testOTPVerify(email, otp) {
  const postData = JSON.stringify({
    email: email,
    otp: otp
  });

  const options = {
    hostname: 'localhost',
    port: 80,
    path: '/api/auth/verify-otp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': 'http://3.85.74.100'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
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

console.log('Probando verificación OTP...');
// Usar los datos de la última prueba exitosa
testOTPVerify('sebastianvernis3@gmail.com', '764396');