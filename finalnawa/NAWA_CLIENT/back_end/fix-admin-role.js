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

const fixAdminRoles = async () => {
  try {
    // Get all admins
    const admins = await adminSchema_model.find({});
    console.log('Found admins:', admins);

    // Check if any admins exist
    if (admins.length === 0) {
      console.log('No admins found in the database');
      return;
    }

    // Log admin details
    admins.forEach(admin => {
      console.log('Admin:', {
        id: admin._id,
        name: admin.name,
        email: admin.email
      });
    });

    // Create a test admin if none exists
    if (admins.length === 0) {
      const testAdmin = await adminSchema_model.create({
        name: 'Admin User',
        email: 'admin@nawa.edu',
        password: 'Admin@123' // This will be hashed by the schema pre-save hook
      });
      console.log('Created test admin:', testAdmin);
    }

  } catch (error) {
    console.error('Error fixing admin roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
connectTo().then(() => {
  fixAdminRoles().then(() => {
    console.log('Script completed');
    process.exit(0);
  });
}); 