// Clear database collections script
// Run with: mongosh yega < clear-demo-data.js

use yega;

print("🗑️ Clearing demo data from database...");

// Clear collections
print("🗑️ Deleting all users...");
const userResult = db.usuarios.deleteMany({});
print(`   Deleted ${userResult.deletedCount} users`);

print("🗑️ Deleting all products...");
const productResult = db.productos.deleteMany({});
print(`   Deleted ${productResult.deletedCount} products`);

print("🗑️ Deleting all orders...");
const orderResult = db.pedidos.deleteMany({});
print(`   Deleted ${orderResult.deletedCount} orders`);

print("🗑️ Deleting all stores...");
const storeResult = db.tiendas.deleteMany({});
print(`   Deleted ${storeResult.deletedCount} stores`);

print("✅ Demo data cleared successfully!");
print("");
print("📊 Database statistics after clearing:");
print("   Users: " + db.usuarios.countDocuments());
print("   Products: " + db.productos.countDocuments());
print("   Orders: " + db.pedidos.countDocuments());
print("   Stores: " + db.tiendas.countDocuments());