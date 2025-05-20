import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const connectTo = async () => {
    try {
        // Added connection options for better stability
        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            family: 4 // Use IPv4, skip trying IPv6
        };

        // Get MongoDB URI from environment variable, with a fallback 
        const uri = process.env.MONGODB_URI || process.env.URI || "mongodb://localhost:27017/nawa_db";
        
        await mongoose.connect(uri, connectionOptions);
        console.log(`MongoDB Connected: ${uri.includes('@') ? uri.split('@')[1] : 'localhost'}`);
        
        // Add event listeners for connection issues
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected, attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Don't exit here, let the calling code decide what to do
        throw error;
    }
};

export default connectTo;