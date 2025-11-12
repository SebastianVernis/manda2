const bcrypt = require('bcryptjs');
const axios = require('axios');

// Demo passwords
const demoPassword = 'Demo123!';

// Demo users data
const demoUsers = [
  {
    nombre: 'Tienda Demo',
    telefono: '+3333333333',
    email: 'tienda@manda2.com',
    rol: 'tienda'
  }
];

async function createTestDocument() {
  try {
    // Login as store user
    console.log('Logging in as store user...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'tienda@manda2.com',
      password: 'Demo123!'
    });
    const token = loginResponse.data.token;
    console.log('Login successful. Token received.');
    
    // Create a test document
    console.log('Creating test document...');
    const documentData = {
      tipo_documento: 'id_doc',
      notas: 'Documento de prueba para revisión'
    };
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    // Note: We're not actually uploading a file here, just creating the document entry
    // In a real test, we would upload an actual file
    // The route expects the document type as part of the URL path
    const docResponse = await axios.post('http://localhost:5000/api/documents/id_doc', 
      { notas: documentData.notas }, // Only send the notes in the body
      config
    );
    console.log('Document created:', JSON.stringify(docResponse.data, null, 2));
    
    console.log('Test document creation completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

createTestDocument();