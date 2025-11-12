const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config({ path: './.env' });

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

async function createTestDocument() {
  try {
    // Find the store user
    const storeUser = await User.findOne({ email: 'tienda@manda2.com' });
    if (!storeUser) {
      console.log('Store user not found');
      return;
    }
    
    // Add a test document to the user's verificaciones
    if (!storeUser.verificaciones) {
      storeUser.verificaciones = new Map();
    }
    
    storeUser.verificaciones.set('id_doc', {
      file: '/uploads/test-document.pdf',
      status: 'pendiente',
      uploadedAt: new Date(),
      notes: 'Documento de prueba para revisión'
    });
    
    await storeUser.save();
    console.log('Test document created successfully for store user');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test document:', error);
    mongoose.connection.close();
  }
}

createTestDocument();