import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const connectTo = async () => {
    try {
        // Enhanced connection options for production (no deprecated options)
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000, // Increased timeout for production
            socketTimeoutMS: 45000,
            maxPoolSize: 50, // Increased pool size for production
            minPoolSize: 10, // Maintain minimum connections
            retryWrites: true,
            w: 'majority', // Write concern for better reliability
            family: 4,
            heartbeatFrequencyMS: 10000, // More frequent heartbeat checks
            connectTimeoutMS: 10000 // Connection timeout
        };

        // Get MongoDB URI from environment variable, with a fallback 
        const uri = process.env.MONGODB_URI || process.env.URI || "mongodb://localhost:27017/nawa_db";
        
        await mongoose.connect(uri, connectionOptions);
        console.log(`MongoDB Connected: ${uri.includes('@') ? uri.split('@')[1] : 'localhost'}`);
        
        // Enhanced event listeners for better monitoring
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
            // Attempt to reconnect on error
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                connectTo();
            }, 5000);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected, attempting to reconnect...');
            // Attempt to reconnect
            setTimeout(() => {
                console.log('Attempting to reconnect to MongoDB...');
                connectTo();
            }, 5000);
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

        // Monitor connection state
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection established');
        });

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB connecting...');
        });
        
        // Graceful shutdown with timeout
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed due to app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error during MongoDB shutdown:', err);
                process.exit(1);
            }
        });
        
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Attempt to reconnect after a delay
        setTimeout(() => {
            console.log('Attempting to reconnect to MongoDB...');
            connectTo();
        }, 5000);
        throw error;
    }
};

export default connectTo;