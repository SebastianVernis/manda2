const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Function to hash a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Demo passwords
const demoPassword = 'Demo123!';

// Demo users data
const demoUsers = [
  {
    nombre: 'Admin Demo',
    telefono: '+1111111111',
    email: 'admin@manda2.com',
    rol: 'administrador',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Cliente Demo',
    telefono: '+2222222222',
    email: 'cliente@manda2.com',
    rol: 'cliente',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Tienda Demo',
    telefono: '+3333333333',
    email: 'tienda@manda2.com',
    rol: 'tienda',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Repartidor Demo',
    telefono: '+4444444444',
    email: 'repartidor@manda2.com',
    rol: 'repartidor',
    estado_validacion: 'aprobado',
    activo: true
  }
];

// Hash passwords and create users
async function createDemoUsers() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const database = client.db('manda2');
    const users = database.collection('usuarios');
    
    // Clear existing demo users
    const emails = demoUsers.map(user => user.email);
    await users.deleteMany({ email: { $in: emails } });
    console.log("Cleared existing demo users");
    
    // Create new demo users
    for (const user of demoUsers) {
      const hashedPassword = await hashPassword(demoPassword);
      const userWithPassword = {
        ...user,
        password: hashedPassword,
        fechaRegistro: new Date(),
        configuracion: {
          notificaciones: true,
          privacidad: "publico"
        }
      };
      
      const result = await users.insertOne(userWithPassword);
      console.log(`Created user: ${user.nombre} (${user.email}) with ID: ${result.insertedId}`);
    }
    
    console.log("✅ Demo users created successfully!");
    console.log("\n🔑 Demo credentials:");
    console.log("   Admin Email: admin@manda2.com");
    console.log("   Cliente Email: cliente@manda2.com");
    console.log("   Tienda Email: tienda@manda2.com");
    console.log("   Repartidor Email: repartidor@manda2.com");
    console.log("   Password for all: Demo123!");
    
  } catch (error) {
    console.error("Error creating demo users:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

createDemoUsers();