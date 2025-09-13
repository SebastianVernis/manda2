# YEGA Application Deployment Instructions

This document outlines the steps to deploy the YEGA application, including backend, frontend, and Caddy for HTTPS.

## 1. Prerequisites

Ensure the following are installed on your server:
*   Node.js (v20.x or later recommended)
*   npm (Node Package Manager)
*   pm2 (Process Manager)
*   Caddy (Web Server with automatic HTTPS)

You can install Node.js and npm, then pm2 globally:
```bash
# Example for Node.js (adjust version as needed)
sudo yum install -y nodejs # For Amazon Linux / CentOS
sudo npm install -g pm2
```

## 2. Application Setup

### 2.1 Copy Application Files

Ensure your backend and frontend code are in the following directories:
*   Backend: `/var/www/yega/backend`
*   Frontend: `/var/www/yega/frontend`

If you need to copy them, use `sudo cp -r /path/to/your/backend /var/www/yega/backend` and `sudo cp -r /path/to/your/frontend /var/www/yega/frontend`.

### 2.2 Backend Configuration and Deployment

1.  **Navigate to the backend directory:**
    ```bash
    cd /var/www/yega/backend
    ```

2.  **Install backend dependencies:**
    ```bash
    sudo rm -rf node_modules # Clean slate
    sudo npm install
    ```

3.  **Create or update `.env` file in `/var/www/yega/backend/.env`**:
    This file should contain your MongoDB URI and other backend environment variables.
    ```
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret"
    TWILIO_ACCOUNT_SID="your_twilio_account_sid"
    TWILIO_AUTH_TOKEN="your_twilio_auth_token"
    TWILIO_PHONE_NUMBER="your_twilio_phone_number"
    DEFAULT_OTP_METHOD="sms" # or "email" or "both"
    PORT=5000
    NODE_ENV=production
    ENABLE_HSTS=true
    RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
    RATE_LIMIT_MAX_REQUESTS=500
    FRONTEND_URL="https://yega.YOUR_PUBLIC_IP.nip.io" # Or your actual domain
    ```
    **Important**: Replace placeholders with your actual values.

4.  **Create or update `ecosystem.config.js` in `/home/ec2-user/ecosystem.config.js`**:
    This configures `pm2` to run your backend correctly.
    ```javascript
    module.exports = {
      apps : [{
        name: 'yega',
        script: '/var/www/yega/backend/server.js',
        cwd: '/var/www/yega/backend',
        env_production: {
          NODE_ENV: 'production',
          NODE_PATH: '/var/www/yega/backend/node_modules'
        }
      }]
    };
    ```
    To create/update this file:
    ```bash
    cat <<EOF | tee /home/ec2-user/ecosystem.config.js
    module.exports = {
      apps : [{
        name: 'yega',
        script: '/var/www/yega/backend/server.js',
        cwd: '/var/www/yega/backend',
        env_production: {
          NODE_ENV: 'production',
          NODE_PATH: '/var/www/yega/backend/node_modules'
        }
      }]
    };
    EOF
    ```

5.  **Start the backend application with pm2:**
    ```bash
    pm2 stop all # Stop any existing pm2 processes
    pm2 delete all # Delete any existing pm2 process definitions
    pm2 start /home/ec2-user/ecosystem.config.js --env production
    pm2 save # Save the pm2 configuration to persist across reboots
    ```

6.  **MongoDB Atlas IP Whitelist:**
    Ensure your server's public IP address is added to your MongoDB Atlas IP Whitelist.
    Your public IP is: `YOUR_PUBLIC_IP` (You can get this by running `curl ifconfig.me`)

### 2.3 Frontend Configuration and Build

1.  **Navigate to the frontend directory:**
    ```bash
    cd /var/www/yega/frontend
    ```

2.  **Install frontend dependencies:**
    ```bash
    sudo npm install
    ```

3.  **Create or update `.env.production` in `/var/www/yega/frontend/.env.production`**:
    This file tells the frontend where to find your API.
    ```
    VITE_API_URL="https://yega.YOUR_PUBLIC_IP.nip.io/api" # Or your actual domain
    ```
    To create/update this file:
    ```bash
    PUBLIC_IP=$(curl -s ifconfig.me) # Get your public IP
    cat <<EOF | sudo tee /var/www/yega/frontend/.env.production
    VITE_API_URL="https://yega.
    ```
    **Important**: Replace `YOUR_PUBLIC_IP` with your actual public IP address.

4.  **Build the frontend application:**
    ```bash
    sudo npm run build
    ```

### 2.4 Caddy Web Server Setup (for HTTPS)

1.  **Install Caddy:**
    ```bash
    curl -L "https://github.com/caddyserver/caddy/releases/download/v2.8.4/caddy_2.8.4_linux_amd64.tar.gz" -o caddy.tar.gz && \
    tar -xzf caddy.tar.gz && \
    sudo mv caddy /usr/local/bin/ && \
    rm caddy.tar.gz LICENSE README.md && \
    caddy version
    ```

2.  **Stop Nginx (if running):**
    If Nginx or any other web server is using ports 80 or 443, Caddy won't be able to start.
    ```bash
    sudo systemctl stop nginx
    sudo systemctl disable nginx
    ```

3.  **Create `Caddyfile` in `/home/ec2-user/Caddyfile`**:
    This configures Caddy to serve your frontend and proxy API requests to your backend.
    ```
    yega.YOUR_PUBLIC_IP.nip.io { # Replace YOUR_PUBLIC_IP
        root * /var/www/yega/frontend/dist
        file_server
        
        # Proxy API requests to the backend
        handle /api/* {
            reverse_proxy localhost:5000
        }

        # Fallback for SPA routing
        handle {
            try_files {path} /index.html
        }
    }
    ```
    To create/update this file:
    ```bash
    PUBLIC_IP=$(curl -s ifconfig.me) # Get your public IP
    cat <<EOF | tee /home/ec2-user/Caddyfile
    yega.
    ```
    **Important**: Replace `YOUR_PUBLIC_IP` with your actual public IP address.

4.  **Start Caddy:**
    ```bash
    sudo caddy start --config /home/ec2-user/Caddyfile
    ```

## 3. Verification

1.  **Check PM2 status:**
    ```bash
    pm2 show yega
    pm2 logs yega --lines 50
    ```
    Ensure `status` is `online` and there are no errors in the logs.

2.  **Access the application in your browser:**
    Clear your browser cache and navigate to: `https://yega.YOUR_PUBLIC_IP.nip.io` (replace `YOUR_PUBLIC_IP`).
    The frontend should load, and API calls should work.

## 4. Troubleshooting / Full Reset

If you encounter persistent issues, you can perform a full reset and re-deploy.

1.  **Stop and delete all PM2 processes:**
    ```bash
    pm2 stop all
    pm2 delete all
    ```

2.  **Stop Caddy:**
    ```bash
    sudo caddy stop
    ```

3.  **Remove application directories (CAUTION: This deletes all code and data):**
    ```bash
    sudo rm -rf /var/www/yega
    ```

4.  **Remove PM2 configuration files:**
    ```bash
    rm -rf /home/ec2-user/.pm2
    ```

5.  **Remove Caddy configuration files:**
    ```bash
    rm -f /home/ec2-user/Caddyfile
    sudo rm -rf /root/.config/caddy # Caddy's internal data
    ```

6.  **Start from Section 2.1 (Copy Application Files) and follow all steps again.**

---
**Current Public IP:** `$(curl -s ifconfig.me)`
---
