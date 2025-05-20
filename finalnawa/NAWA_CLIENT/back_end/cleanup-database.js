import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

configDotenv();

// Function to get user confirmation
const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
};

const cleanupDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.URI || 'mongodb://localhost:27017/nava_tara');
    console.log('Connected to database');
    
    // Get database information
    const db = mongoose.connection.db;
    
    // Collections to be removed (based on code analysis)
    // studenthistories - Used in yearEndManagementController.js but can be safely removed if you don't need history
    // classfees - Empty and not actually used (classstructurefees is used instead)
    // leaverequests - Empty; LeaveRequest model uses 'LeaveRequest' as collection name, not 'leaverequests'
    // teacherspayroll vs teacherpayrolls - One may be redundant
    
    // Get collection information
    const collections = await db.listCollections().toArray();
    const collectionStats = [];
    
    for (const collection of collections) {
      const collName = collection.name;
      const stats = await db.command({ collStats: collName });
      const count = await db.collection(collName).countDocuments();
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      collectionStats.push({
        name: collName,
        count,
        sizeInMB
      });
      
      console.log(`Collection: ${collName} - ${count} documents - ${sizeInMB} MB`);
    }
    
    // Collections that are potentially unused or redundant
    const unusedCollections = [
      {
        name: 'studenthistories',
        reason: 'Historical data that may not be needed anymore'
      },
      {
        name: 'classfees',
        reason: 'Empty collection, while classstructurefees is used for fee structure'
      },
      {
        name: 'leaverequests',
        reason: 'Empty collection - Leave requests use "LeaveRequest" as collection name'
      },
      {
        name: 'teacherspayroll',
        reason: 'Potentially redundant with teacherpayrolls'
      }
    ];
    
    console.log('\nCollections that can be safely removed:');
    unusedCollections.forEach((col, index) => {
      const stats = collectionStats.find(s => s.name === col.name);
      if (stats) {
        console.log(`${index + 1}. ${col.name} - ${stats.count} documents, ${stats.sizeInMB} MB`);
        console.log(`   Reason: ${col.reason}`);
      } else {
        console.log(`${index + 1}. ${col.name} - (Not found in database)`);
        console.log(`   Reason: ${col.reason}`);
      }
    });
    
    // Get user confirmation for each collection
    for (const collection of unusedCollections) {
      const stats = collectionStats.find(s => s.name === collection.name);
      if (!stats) {
        console.log(`\nSkipping ${collection.name} as it was not found in the database`);
        continue;
      }
      
      const answer = await askQuestion(`\nDo you want to remove the ${collection.name} collection? (yes/no): `);
      
      if (answer.toLowerCase() === 'yes') {
        try {
          await db.dropCollection(collection.name);
          console.log(`✓ Successfully removed ${collection.name} collection`);
        } catch (error) {
          console.error(`Error removing ${collection.name} collection:`, error.message);
        }
      } else {
        console.log(`Skipping removal of ${collection.name} collection`);
      }
    }
    
    // Save a backup of which collections were removed
    const logFilePath = path.join(process.cwd(), 'database-cleanup-log.txt');
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    fs.appendFileSync(
      logFilePath, 
      `\n--- Database Cleanup ${timestamp} ---\n` +
      unusedCollections.map(c => `${c.name}: ${c.reason}`).join('\n') +
      '\n------------------------\n'
    );
    
    console.log(`\nCleanup log saved to ${logFilePath}`);
    
    return {
      success: true,
      message: 'Database cleanup completed'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
};

// Run the function
cleanupDatabase(); 