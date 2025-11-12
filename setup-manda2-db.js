// Manda2 Database Setup Script
// Run with: mongosh < setup-manda2-db.js

use manda2;

print("🚀 Setting up Manda2 database...");

// Drop existing collections if they exist
db.usuarios.drop();
db.productos.drop();
db.pedidos.drop();
db.tiendas.drop();
db.otps.drop();

// Create collections
db.createCollection("usuarios");
db.createCollection("productos");
db.createCollection("pedidos");
db.createCollection("tiendas");
db.createCollection("otps");

print("📦 Collections created successfully");

// Create indexes for performance
print("🔍 Creating indexes...");

// Usuario indexes
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ telefono: 1 }, { unique: true });
db.usuarios.createIndex({ rol: 1 });
db.usuarios.createIndex({ activo: 1 });

// Producto indexes
db.productos.createIndex({ tienda: 1 });
db.productos.createIndex({ categoria: 1 });
db.productos.createIndex({ activo: 1 });
db.productos.createIndex({ nombre: "text", descripcion: "text" });

// Pedido indexes
db.pedidos.createIndex({ cliente: 1 });
db.pedidos.createIndex({ tienda: 1 });
db.pedidos.createIndex({ repartidor: 1 });
db.pedidos.createIndex({ estado: 1 });
db.pedidos.createIndex({ fecha: -1 });
db.pedidos.createIndex({ "direccionEntrega.coordenadas": "2dsphere" });

// Tienda indexes
db.tiendas.createIndex({ propietario: 1 });
db.tiendas.createIndex({ activa: 1 });
db.tiendas.createIndex({ "ubicacion.coordenadas": "2dsphere" });
db.tiendas.createIndex({ categoria: 1 });

// OTP indexes
db.otps.createIndex({ telefono: 1 });
db.otps.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 }); // 10 minutes TTL

print("✅ Indexes created successfully");

// Create default admin user
print("👤 Creating default admin user...");

const adminUser = {
    nombre: "Administrador",
    email: "admin@manda2.com",
    telefono: "+1234567890",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdxGzJwW3.tPxwe", // password: admin123
    rol: "administrador",
    activo: true,
    verificado: true,
    fechaRegistro: new Date(),
    configuracion: {
        notificaciones: true,
        privacidad: "publico"
    }
};

try {
    db.usuarios.insertOne(adminUser);
    print("✅ Default admin user created successfully");
    print("   Email: admin@manda2.com");
    print("   Password: admin123");
} catch (error) {
    print("⚠️ Admin user might already exist or error occurred:");
    print(error.message);
}

// Create sample categories
print("📂 Creating sample categories...");

const categorias = [
    { nombre: "Restaurantes", icono: "🍽️" },
    { nombre: "Supermercados", icono: "🛒" },
    { nombre: "Farmacias", icono: "💊" },
    { nombre: "Tecnología", icono: "📱" },
    { nombre: "Ropa", icono: "👕" },
    { nombre: "Hogar", icono: "🏠" }
];

db.categorias.drop();
db.createCollection("categorias");
db.categorias.insertMany(categorias);

print("✅ Sample categories created");

// Create sample store
print("🏪 Creating sample store...");

const sampleStore = {
    nombre: "Tienda Demo",
    descripcion: "Tienda de demostración para pruebas",
    propietario: null, // Will be set when a store owner registers
    categoria: "Restaurantes",
    ubicacion: {
        direccion: "Av. Principal 123, Ciudad",
        coordenadas: {
            type: "Point",
            coordinates: [-99.1332, 19.4326] // Mexico City coordinates
        }
    },
    horarios: {
        lunes: { abierto: true, inicio: "08:00", fin: "20:00" },
        martes: { abierto: true, inicio: "08:00", fin: "20:00" },
        miercoles: { abierto: true, inicio: "08:00", fin: "20:00" },
        jueves: { abierto: true, inicio: "08:00", fin: "20:00" },
        viernes: { abierto: true, inicio: "08:00", fin: "22:00" },
        sabado: { abierto: true, inicio: "09:00", fin: "22:00" },
        domingo: { abierto: true, inicio: "10:00", fin: "18:00" }
    },
    contacto: {
        telefono: "+1234567890",
        email: "demo@tienda.com"
    },
    configuracion: {
        entregaDomicilio: true,
        radioPorKm: 5,
        tiempoEstimado: 30,
        minimoDelivery: 100
    },
    activa: true,
    verificada: true,
    fechaRegistro: new Date()
};

try {
    const storeResult = db.tiendas.insertOne(sampleStore);
    print("✅ Sample store created successfully");
    
    // Create sample products for the store
    print("🛍️ Creating sample products...");
    
    const sampleProducts = [
        {
            nombre: "Pizza Margherita",
            descripcion: "Pizza clásica con tomate, mozzarella y albahaca",
            precio: 250,
            categoria: "Pizzas",
            tienda: storeResult.insertedId,
            imagen: "/api/placeholder/300/200?bg=ff6b6b&color=ffffff",
            activo: true,
            stock: 50,
            fechaCreacion: new Date()
        },
        {
            nombre: "Hamburguesa Clásica",
            descripcion: "Hamburguesa con carne, lechuga, tomate y queso",
            precio: 180,
            categoria: "Hamburguesas",
            tienda: storeResult.insertedId,
            imagen: "/api/placeholder/300/200?bg=4ecdc4&color=ffffff",
            activo: true,
            stock: 30,
            fechaCreacion: new Date()
        },
        {
            nombre: "Ensalada César",
            descripcion: "Ensalada fresca con pollo, crutones y aderezo césar",
            precio: 150,
            categoria: "Ensaladas",
            tienda: storeResult.insertedId,
            imagen: "/api/placeholder/300/200?bg=45b7d1&color=ffffff",
            activo: true,
            stock: 25,
            fechaCreacion: new Date()
        }
    ];
    
    db.productos.insertMany(sampleProducts);
    print("✅ Sample products created successfully");
    
} catch (error) {
    print("⚠️ Error creating sample store/products:");
    print(error.message);
}

print("");
print("🎉 Manda2 database setup completed!");
print("");
print("📊 Database statistics:");
print("   Collections: " + db.runCommand("listCollections").cursor.firstBatch.length);
print("   Users: " + db.usuarios.countDocuments());
print("   Stores: " + db.tiendas.countDocuments());
print("   Products: " + db.productos.countDocuments());
print("   Categories: " + db.categorias.countDocuments());
print("");
print("🔑 Default credentials:");
print("   Admin Email: admin@manda2.com");
print("   Admin Password: admin123");
print("");
print("✅ Ready to start the Manda2 application!");