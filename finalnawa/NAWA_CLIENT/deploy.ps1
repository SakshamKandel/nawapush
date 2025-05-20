# Deployment script for Nawa Tara School Management System
# This script automates the deployment process for Windows

Write-Host "===== Nawa Tara School Management System Deployment =====" -ForegroundColor Green

# 1. Backend deployment
Write-Host "===== Deploying Backend =====" -ForegroundColor Cyan
Set-Location -Path .\back_end
npm install --production
Copy-Item -Path .\config\env.example -Destination .\.env
# Note: You need to manually edit .env with actual production values
Write-Host "Don't forget to update the .env file with your production values!" -ForegroundColor Yellow

# 2. Frontend deployment
Write-Host "===== Deploying Frontend =====" -ForegroundColor Cyan
Set-Location -Path ..\front_end
npm install
npm run build:prod
Write-Host "Frontend built successfully!" -ForegroundColor Green

# 3. Return to root directory
Set-Location -Path ..

# 4. Reminder for environment configuration
Write-Host "===== DEPLOYMENT CHECKLIST =====" -ForegroundColor Green
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Write-Host "✓ Frontend built successfully" -ForegroundColor Green
Write-Host "✓ Environment files created" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Configure your backend .env file" -ForegroundColor White
Write-Host "2. Set up your database" -ForegroundColor White
Write-Host "3. Configure Nginx (recommended) or use Express to serve static files" -ForegroundColor White
Write-Host "4. Set up SSL certificate" -ForegroundColor White
Write-Host "5. Start the backend with production environment" -ForegroundColor White
Write-Host ""
Write-Host "For more details, refer to DEPLOYMENT.md" -ForegroundColor Cyan

pause
