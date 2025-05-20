# Deployment Guide: Nawa Tara School Management System

This guide provides step-by-step instructions for deploying your Nawa Tara School Management System to a production environment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Web Server Configuration](#web-server-configuration)
7. [SSL Setup](#ssl-setup)
8. [Final Steps](#final-steps)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have the following:
- A web hosting server (VPS, shared hosting, or dedicated server)
- Node.js (v16 or higher) installed
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- Domain name (e.g., navatara.edu.np)
- SSL certificate (Let's Encrypt recommended for free SSL)
- Basic knowledge of Linux command line (for VPS/dedicated server)

## Backend Deployment

### Option 1: Deploy using PM2 (Recommended for VPS/Dedicated Server)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Copy the backend files to your server**
   ```bash
   # Using SCP or SFTP to upload files
   scp -r ./NAWA_CLIENT/back_end user@your-server:/path/to/app
   ```

3. **Install dependencies**
   ```bash
   cd /path/to/app
   npm install --production
   ```

4. **Setup environment variables**
   ```bash
   # Copy the example env file
   cp config/env.example .env
   
   # Edit the .env file with your production settings
   nano .env
   ```

5. **Start the application with PM2**
   ```bash
   # Start the application
   NODE_ENV=production pm2 start index.js --name "nawa-backend"
   
   # Save the PM2 configuration
   pm2 save
   
   # Setup PM2 to start on server reboot
   pm2 startup
   ```

### Option 2: Deploy using Docker

1. **Create a Dockerfile in the backend directory**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 8000
   CMD ["node", "index.js"]
   ```

2. **Build and run the Docker image**
   ```bash
   docker build -t nawa-backend .
   docker run -d -p 8000:8000 --env-file .env --name nawa-backend nawa-backend
   ```

## Frontend Deployment

1. **Build the frontend for production**
   ```bash
   cd NAWA_CLIENT/front_end
   npm install
   npm run build:prod
   ```

2. **Deploy the build directory**
   - The production build will be in the `dist` directory.
   - Upload this directory to your web server.

### Option 1: Serve from the same server as backend

If you're using the same server for both frontend and backend, you can serve static files directly from Express:

```javascript
// This is already configured in your updated index.js
app.use(express.static(path.join(__dirname, '../front_end/dist')));
```

### Option 2: Serve using Nginx (Recommended)

```nginx
server {
    listen 80;
    server_name navatara.edu.np www.navatara.edu.np;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name navatara.edu.np www.navatara.edu.np;
    
    ssl_certificate /path/to/ssl/certificate.pem;
    ssl_certificate_key /path/to/ssl/private_key.pem;
    
    # Frontend files
    root /path/to/front_end/dist;
    index index.html;
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API forwarding
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Setup

### Option 1: MongoDB Atlas (Recommended for production)

1. Create a MongoDB Atlas account if you don't have one
2. Set up a new cluster
3. Create a database user with appropriate permissions
4. Whitelist your server IP address in the Network Access settings
5. Get your connection string and add it to your backend .env file as `MONGODB_URI`

### Option 2: Self-hosted MongoDB

```bash
# Install MongoDB server
sudo apt update
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create a database and user
mongo
> use nawa_db
> db.createUser({
    user: "nawauser",
    pwd: "secure_password",
    roles: [{ role: "readWrite", db: "nawa_db" }]
  })
```

## Environment Configuration

### Backend (.env file)

Update the following values in your `.env` file:

```
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nawa_db?retryWrites=true&w=majority
FRONTEND_URL=https://navatara.edu.np
JWT_SECRET=your_secure_random_string
ADMIN_JWT_SECRET=another_secure_random_string
TEACHER_JWT_SECRET=yet_another_secure_random_string
COOKIE_DOMAIN=navatara.edu.np
COOKIE_SECURE=true
```

### Frontend Environment

Create a `.env.production` file in the frontend directory with:

```
VITE_API_URL=https://navatara.edu.np/api
VITE_APP_ENV=production
VITE_APP_NAME="Nawa Tara English School"
```

## Web Server Configuration

### Nginx Setup (Recommended)

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   - Create a new site configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/navatara
   ```
   - Add the configuration from the Frontend Deployment section
   - Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/navatara /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## SSL Setup

### Option 1: Let's Encrypt with Certbot (Free)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**
   ```bash
   sudo certbot --nginx -d navatara.edu.np -d www.navatara.edu.np
   ```

3. **Set up auto-renewal**
   ```bash
   sudo systemctl status certbot.timer
   ```

### Option 2: Using Commercial SSL Certificate

1. Purchase an SSL certificate from a provider
2. Follow the provider's instructions to generate a CSR
3. Upload the certificate files to your server
4. Update your Nginx configuration with the correct paths

## Final Steps

1. **Testing**
   - Test the application thoroughly
   - Check all API endpoints are working
   - Verify user authentication works correctly

2. **Monitoring**
   - Set up application monitoring:
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

3. **Backup Strategy**
   - Set up regular database backups:
   ```bash
   # Example script for MongoDB backup
   mongodump --uri="your_mongodb_uri" --out=/backup/mongodb/$(date +"%Y-%m-%d")
   ```

## Troubleshooting

### Common Issues

1. **Connection refused errors**
   - Check if your server is running: `pm2 status`
   - Verify firewall settings: `sudo ufw status`
   - Check if the correct ports are open

2. **MongoDB connection issues**
   - Verify your connection string is correct
   - Check if MongoDB service is running
   - Verify network access settings in MongoDB Atlas

3. **CORS errors**
   - Ensure CORS is properly configured in your backend
   - Check that `FRONTEND_URL` is correctly set in your environment variables

4. **File upload problems**
   - Check permissions on your upload directories
   - Verify the max file size settings

For additional support, please refer to the project's official documentation or raise an issue in the GitHub repository.

---

This guide is for deploying the Nawa Tara School Management System. Customize it according to your specific requirements and server infrastructure. 