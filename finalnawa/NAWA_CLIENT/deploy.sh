#!/bin/bash

# Deployment script for Nawa Tara School Management System
# This script automates the deployment process

# Stop on errors
set -e

echo "===== Nawa Tara School Management System Deployment ====="

# 1. Backend deployment
echo "===== Deploying Backend ====="
cd back_end
npm install --production
cp config/env.example .env
# Note: You need to manually edit .env with actual production values
echo "Don't forget to update the .env file with your production values!"

# 2. Frontend deployment
echo "===== Deploying Frontend ====="
cd ../front_end
npm install
npm run build:prod
echo "Frontend built successfully!"

# 3. Reminder for environment configuration
echo "===== DEPLOYMENT CHECKLIST ====="
echo "✓ Backend dependencies installed"
echo "✓ Frontend built successfully"
echo "✓ Environment files created"
echo ""
echo "NEXT STEPS:"
echo "1. Configure your backend .env file"
echo "2. Set up your database"
echo "3. Configure Nginx (recommended) or use Express to serve static files"
echo "4. Set up SSL certificate"
echo "5. Start the backend with: NODE_ENV=production pm2 start index.js --name \"nawa-backend\""
echo ""
echo "For more details, refer to DEPLOYMENT.md"
