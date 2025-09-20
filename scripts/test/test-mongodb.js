// MongoDB Connection Test for YEGA
// Run with: node test-mongodb.js

const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yega';

console.log('🔍 Testing MongoDB connection...');
console.log('URI:', MONGODB_URI);

async function testConnection() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        
        console.log('✅ MongoDB connected successfully!');
        
        // Test database operations
        console.log('📊 Testing database operations...');
        
        // Get database stats
        const db = mongoose.connection.db;
        const stats = await db.stats();
        
        console.log('📈 Database Statistics:');
        console.log('   Database:', stats.db);
        console.log('   Collections:', stats.collections);
        console.log('   Data Size:', Math.round(stats.dataSize / 1024) + ' KB');
        console.log('   Storage Size:', Math.round(stats.storageSize / 1024) + ' KB');
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections found:');
        collections.forEach(collection => {
            console.log('   -', collection.name);
        });
        
        // Test a simple query
        const Usuario = mongoose.model('Usuario', new mongoose.Schema({
            nombre: String,
            email: String,
            rol: String
        }));
        
        const userCount = await Usuario.countDocuments();
        console.log('👥 Users in database:', userCount);
        
        if (userCount > 0) {
            const sampleUser = await Usuario.findOne();
            console.log('👤 Sample user:');
            console.log('   Name:', sampleUser.nombre);
            console.log('   Email:', sampleUser.email);
            console.log('   Role:', sampleUser.rol);
        }
        
        console.log('');
        console.log('🎉 All tests passed! MongoDB is ready for YEGA app.');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('');
            console.log('💡 Troubleshooting tips:');
            console.log('1. Make sure MongoDB is running: sudo systemctl status mongod');
            console.log('2. Start MongoDB if needed: sudo systemctl start mongod');
            console.log('3. Check MongoDB logs: sudo journalctl -u mongod');
        }
        
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

testConnection();