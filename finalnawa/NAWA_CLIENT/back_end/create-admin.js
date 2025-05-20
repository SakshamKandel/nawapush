import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import adminSchema_model from './database/mongoose_schema/admin_schema.js';

configDotenv();

const connectTo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nawa_db');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await adminSchema_model.findOne({ email: 'admin@nawa.edu' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin);
      return;
    }

    // Create new admin
    const admin = await adminSchema_model.create({
      name: 'Admin User',
      email: 'admin@nawa.edu',
      password: 'Admin@123' // This will be hashed by the schema pre-save hook
    });

    console.log('Created admin account:', {
      id: admin._id,
      name: admin.name,
      email: admin.email
    });

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
connectTo().then(() => {
  createAdmin().then(() => {
    console.log('Script completed');
    process.exit(0);
  });
}); 