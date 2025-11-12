const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// User model (simplified)
const userSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  email: String,
  password: String,
  rol: String,
  estado_validacion: String,
  activo: Boolean,
  verificaciones: {
    type: Map,
    of: {
      file: String,
      status: String,
      uploadedAt: Date,
      notes: String
    }
  }
});

const User = mongoose.model('Usuario', userSchema);

// Admin credentials
const adminCredentials = {
  email: 'admin@manda2.com',
  password: 'Demo123!'
};

async function debugDocumentReview() {
  try {
    // Test the aggregation query directly
    console.log('Testing aggregation query directly...');
    const usuarios = await User.aggregate([
      {
        $match: {
          verificaciones: { $exists: true, $ne: {} }
        }
      },
      {
        $addFields: {
          documentosPendientes: {
            $filter: {
              input: {
                $objectToArray: "$verificaciones"
              },
              as: "doc",
              cond: {
                $eq: ["$$doc.v.status", "pendiente"]
              }
            }
          }
        }
      },
      {
        $match: {
          "documentosPendientes.0": { $exists: true } // Solo usuarios con documentos pendientes
        }
      },
      {
        $project: {
          password: 0 // Excluir contraseña
        }
      }
    ]);
    
    console.log('Usuarios con documentos pendientes (direct query):', usuarios.length);
    console.log(JSON.stringify(usuarios, null, 2));
    
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
    console.log('Fetching pending documents via API...');
    const pendingDocsResponse = await axios.get('http://localhost:5000/api/admin/documents/pending', config);
    console.log('Pending documents retrieved via API:', JSON.stringify(pendingDocsResponse.data, null, 2));
    
    console.log('Debug completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Debug failed:', error.response ? error.response.data : error.message);
    mongoose.connection.close();
  }
}

debugDocumentReview();