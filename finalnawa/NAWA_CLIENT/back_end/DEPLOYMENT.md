# Deployment Guide for NAWA Backend

## Environment Variables Required

Set these environment variables in your Render dashboard:

```bash
# Server Configuration
NODE_ENV=production
PORT=10000

# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Security
JWT_SECRET=your_secure_secret_key_here
COOKIE_SECRET=your_cookie_secret_here
```

## Render Configuration

1. Create a new Web Service
2. Connect your repository
3. Configure the following settings:

### Build Command
```bash
cd NAWA_CLIENT/back_end && chmod +x render-build.sh && ./render-build.sh
```

### Start Command
```bash
cd NAWA_CLIENT/back_end && npm start
```

### Environment Variables
Add all the environment variables listed above in the Render dashboard.

### Health Check
The application includes a health check endpoint at `/health`. Configure Render to use this endpoint for health checks.

## Database Setup

1. Create a MongoDB Atlas account if you haven't already
2. Create a new cluster
3. Set up database access (create a user)
4. Set up network access (allow access from anywhere for Render)
5. Get your connection string and set it as MONGODB_URI

## Security Checklist

- [ ] Use strong, unique passwords for all services
- [ ] Enable MongoDB Atlas security features
- [ ] Set up proper CORS configuration
- [ ] Use HTTPS for all connections
- [ ] Regularly rotate JWT secrets
- [ ] Set up proper backup strategy

## Monitoring

The application includes:
- Request logging
- Health check endpoint
- Error tracking
- Performance monitoring

## Backup Strategy

1. Set up MongoDB Atlas automated backups
2. Configure backup frequency (recommended: daily)
3. Set up backup retention period
4. Test backup restoration process

## Troubleshooting

If you encounter issues:

1. Check the Render logs
2. Verify environment variables
3. Test the health check endpoint
4. Check MongoDB connection
5. Verify CORS configuration

## Support

For any deployment issues, contact the development team. 