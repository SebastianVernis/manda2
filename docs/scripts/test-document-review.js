const axios = require('axios');

// Demo credentials
const adminCredentials = {
  email: 'admin@yega.com',
  password: 'Demo123!'
};

async function testDocumentReview() {
  try {
    // Login as admin
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', adminCredentials);
    const token = loginResponse.data.token;
    console.log('Login successful. Token received.');
    
    // Set up authorization header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Test getPendingDocuments endpoint
    console.log('Fetching pending documents...');
    const pendingDocsResponse = await axios.get('http://localhost:5000/api/admin/documents/pending', config);
    console.log('Pending documents retrieved:', JSON.stringify(pendingDocsResponse.data, null, 2));
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testDocumentReview();