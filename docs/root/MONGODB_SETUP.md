# MongoDB Setup Guide for YEGA

## 🚀 Quick Installation

### Step 1: Install MongoDB
```bash
# Make the script executable and run as root
chmod +x scripts/shell/install-mongodb.sh
sudo ./scripts/shell/install-mongodb.sh
```

### Step 2: Verify Installation
```bash
# Check MongoDB service status
sudo systemctl status mongod

# Test connection
mongosh

# Exit MongoDB shell
exit
```

### Step 3: Setup YEGA Database
```bash
# Setup database with sample data
mongosh < scripts/setup-yega-db.js

# Or connect and run manually
mongosh
use yega
# Then copy-paste the contents of scripts/setup-yega-db.js
```

### Step 4: Test Connection from App
```bash
# Test MongoDB connection with YEGA app
cd /home/ec2-user/yega-app
node scripts/test/test-mongodb.js
```

## 📋 Manual Installation (if script fails)

### Amazon Linux 2023 Manual Steps
```bash
# 1. Create MongoDB repository
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo << 'EOF'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

# 2. Install MongoDB
sudo dnf install -y mongodb-org

# 3. Start and enable service
sudo systemctl start mongod
sudo systemctl enable mongod

# 4. Verify installation
sudo systemctl status mongod
mongosh --eval "db.adminCommand('hello')"
```

## ⚙️ Configuration

### Default MongoDB Configuration
- **Port**: 27017
- **Data Directory**: /var/lib/mongo
- **Log File**: /var/log/mongodb/mongod.log
- **Config File**: /etc/mongod.conf

### YEGA App Configuration
The backend `.env` file is already configured with:
```env
MONGODB_URI=mongodb://localhost:27017/yega
```

## 🔧 Database Structure

### Collections Created
- `usuarios` - User accounts (all roles)
- `productos` - Product catalog
- `pedidos` - Orders and transactions
- `tiendas` - Store information
- `otps` - One-time passwords
- `categorias` - Product/store categories

### Indexes Created for Performance
- User email and phone (unique)
- Product search and filtering
- Order tracking by user/store/driver
- Geospatial indexes for location-based queries
- TTL index for OTP expiration

## 👤 Default Admin Account
After running the setup script:
- **Email**: admin@yega.com
- **Password**: admin123
- **Role**: administrador

## 🛠️ Management Commands

### Service Management
```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# Enable auto-start on boot
sudo systemctl enable mongod
```

### Database Operations
```bash
# Connect to MongoDB shell
mongosh

# Connect to YEGA database
mongosh yega

# Show databases
show dbs

# Show collections
show collections

# Basic queries
db.usuarios.find().pretty()
db.productos.find().limit(5)
db.pedidos.countDocuments()
```

### Backup and Restore
```bash
# Create backup
mongodump --db yega --out /backup/mongodb/

# Restore backup
mongorestore --db yega /backup/mongodb/yega/

# Export collection to JSON
mongoexport --db yega --collection usuarios --out usuarios.json

# Import from JSON
mongoimport --db yega --collection usuarios --file usuarios.json
```

## 📊 Monitoring

### Check Database Status
```bash
# Database statistics
mongosh --eval "db.stats()"

# Check connection
mongosh --eval "db.adminCommand('ping')"

# List all databases
mongosh --eval "show dbs"
```

### View Logs
```bash
# MongoDB service logs
sudo journalctl -u mongod -f

# MongoDB application logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Performance Monitoring
```bash
# Current operations
mongosh --eval "db.currentOp()"

# Database profiler (slow queries)
mongosh --eval "db.setProfilingLevel(2, {slowms: 100})"
mongosh --eval "db.system.profile.find().pretty()"
```

## 🔒 Security (Optional)

### Enable Authentication (Production)
```bash
# 1. Create admin user
mongosh --eval '
use admin;
db.createUser({
  user: "admin",
  pwd: "securepassword123",
  roles: [{role: "userAdminAnyDatabase", db: "admin"}]
});'

# 2. Create YEGA app user
mongosh --eval '
use yega;
db.createUser({
  user: "yegaapp",
  pwd: "yegapassword123",
  roles: [{role: "readWrite", db: "yega"}]
});'

# 3. Enable authentication in config
sudo sed -i 's/authorization: disabled/authorization: enabled/' /etc/mongod.conf

# 4. Restart MongoDB
sudo systemctl restart mongod

# 5. Update YEGA app connection string
# MONGODB_URI=mongodb://yegaapp:yegapassword123@localhost:27017/yega
```

## 🚨 Troubleshooting

### Common Issues

#### MongoDB won't start
```bash
# Check logs
sudo journalctl -u mongod --no-pager

# Check disk space
df -h

# Check permissions
sudo chown -R mongod:mongod /var/lib/mongo
sudo chown -R mongod:mongod /var/log/mongodb
```

#### Connection refused
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Check if port is open
sudo netstat -tlnp | grep :27017

# Test local connection
mongosh --host localhost --port 27017
```

#### Performance issues
```bash
# Check current connections
mongosh --eval "db.serverStatus().connections"

# Enable slow query logging
mongosh --eval "db.setProfilingLevel(1, {slowms: 100})"

# Check indexes
mongosh yega --eval "db.usuarios.getIndexes()"
```

### Log Files
- **Service logs**: `sudo journalctl -u mongod`
- **Application logs**: `/var/log/mongodb/mongod.log`
- **Configuration**: `/etc/mongod.conf`

## ✅ Verification Checklist

After installation, verify:
- [ ] MongoDB service is running: `sudo systemctl status mongod`
- [ ] Port 27017 is listening: `sudo netstat -tlnp | grep 27017`
- [ ] Can connect with shell: `mongosh`
- [ ] YEGA database exists: `mongosh --eval "show dbs"`
- [ ] Collections are created: `mongosh yega --eval "show collections"`
- [ ] Admin user exists: `mongosh yega --eval "db.usuarios.findOne({rol: 'administrador'})"`
- [ ] App can connect: `node scripts/test/test-mongodb.js`

## 🎉 Next Steps

After MongoDB is installed and configured:
1. Run the YEGA application: `./scripts/shell/deploy.sh --caddy`
2. Test the admin login at: http://172.31.39.53
3. Create test users for different roles
4. Test the complete application workflow

MongoDB is now ready for the YEGA delivery platform! 🚀